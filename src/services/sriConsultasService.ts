import { createClient } from 'soap';
import { 
  Ambiente, 
  EstadoAutorizacionComprobante, 
  ResultadoConsultaIndividual,
  ConfiguracionSRI 
} from '../types/sri.types';
import { obtenerUrlWsdl, configuracionAplicacion } from '../config/environment';

export class SRIConsultasService {
  private cliente: any = null;
  private ultimoAmbiente: Ambiente | null = null;

  private async obtenerCliente(ambiente: Ambiente): Promise<any> {
    if (this.cliente && this.ultimoAmbiente === ambiente) {
      return this.cliente;
    }

    const wsdlUrl = obtenerUrlWsdl(ambiente);
    
    return new Promise((resolve, reject) => {
      createClient(wsdlUrl, (err: Error | null, client: any) => {
        if (err) {
          reject(new Error(`Error al crear cliente SOAP: ${err.message}`));
          return;
        }
        
        if (!client) {
          reject(new Error('No se pudo crear el cliente SOAP'));
          return;
        }

        this.cliente = client;
        this.ultimoAmbiente = ambiente;
        resolve(client);
      });
    });
  }

  private transformarRespuesta(respuesta: any, claveAcceso: string): ResultadoConsultaIndividual {
    const estado = (respuesta.estadoAutorizacion || respuesta.estadoConsulta) as any;
    const mensajes: string[] = [];

    if (respuesta.mensajes?.mensaje) {
      const listaMensajes = Array.isArray(respuesta.mensajes.mensaje) 
        ? respuesta.mensajes.mensaje 
        : [respuesta.mensajes.mensaje];
      
      listaMensajes.forEach((msg: any) => {
        let texto = msg.mensaje;
        if (msg.informacionAdicional) {
          texto += ` - ${msg.informacionAdicional}`;
        }
        mensajes.push(texto);
      });
    }

    return {
      claveAcceso,
      estado: estado || 'RECHAZADA',
      numeroAutorizacion: respuesta.numeroAutorizacion,
      fechaAutorizacion: respuesta.fechaAutorizacion,
      tipoComprobante: respuesta.tipoComprobante,
      rucEmisor: respuesta.rucEmisor,
      mensajes
    };
  }

  public async consultarComprobante(
    claveAcceso: string, 
    ambiente: Ambiente = 'produccion'
  ): Promise<ResultadoConsultaIndividual> {
    const config: ConfiguracionSRI = {
      ambiente,
      wsdlUrl: obtenerUrlWsdl(ambiente),
      timeout: configuracionAplicacion.requestTimeout,
      maxRetries: 2
    };

    let ultimoError: Error | null = null;

    for (let intento = 0; intento <= config.maxRetries; intento++) {
      try {
        const cliente = await this.obtenerCliente(ambiente);

        const respuesta: EstadoAutorizacionComprobante = await new Promise((resolve, reject) => {
          cliente.consultarEstadoAutorizacionComprobante(
            { claveAcceso },
            (err: any, result: any) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result?.EstadoAutorizacionComprobante || {});
            }
          );
        });

        return this.transformarRespuesta(respuesta, claveAcceso);

      } catch (error) {
        ultimoError = error as Error;
        
        if (intento < config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (intento + 1)));
          this.cliente = null;
        }
      }
    }

    return {
      claveAcceso,
      estado: 'RECHAZADA',
      mensajes: [],
      error: ultimoError?.message || 'Error desconocido al consultar SRI'
    };
  }

  public async consultarFacturaComercialNegociable(
    claveAcceso: string,
    ambiente: Ambiente = 'produccion'
  ): Promise<ResultadoConsultaIndividual> {
    let ultimoError: Error | null = null;

    for (let intento = 0; intento <= 2; intento++) {
      try {
        const cliente = await this.obtenerCliente(ambiente);

        const respuesta: any = await new Promise((resolve, reject) => {
          cliente.consultarEstadoConfirmacionFacturaComercialNegociable(
            { claveAcceso },
            (err: any, result: any) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result?.EstadoConfirmacionFacturaComercialNegociable || {});
            }
          );
        });

        return this.transformarRespuesta(respuesta, claveAcceso);

      } catch (error) {
        ultimoError = error as Error;
        
        if (intento < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (intento + 1)));
          this.cliente = null;
        }
      }
    }

    return {
      claveAcceso,
      estado: 'RECHAZADA',
      mensajes: [],
      error: ultimoError?.message || 'Error desconocido al consultar FCN'
    };
  }

  public limpiarCacheCliente(): void {
    this.cliente = null;
    this.ultimoAmbiente = null;
  }
}

export const sriService = new SRIConsultasService();
