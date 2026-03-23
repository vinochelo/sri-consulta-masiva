export type Ambiente = 'pruebas' | 'produccion';

export type EstadoAutorizacion = 
  | 'AUTORIZADO'
  | 'NO AUTORIZADO'
  | 'PENDIENTE DE ANULAR'
  | 'ANULADO'
  | 'RECHAZADA';

export type TipoMensaje = 'ERROR' | 'ADVERTENCIA' | 'INFORMACION';

export interface MensajeSRI {
  identificador: string;
  mensaje: string;
  informacionAdicional?: string;
  tipo: TipoMensaje;
}

export interface EstadoAutorizacionComprobante {
  estadoAutorizacion: EstadoAutorizacion;
  estadoConsulta?: EstadoAutorizacion;
  claveAcceso: string;
  numeroAutorizacion?: string;
  fechaAutorizacion?: string;
  tipoComprobante?: string;
  rucEmisor?: string;
  mensajes?: {
    mensaje: MensajeSRI[];
  };
}

export interface ResultadoConsultaIndividual {
  claveAcceso: string;
  estado: EstadoAutorizacion;
  numeroAutorizacion?: string;
  fechaAutorizacion?: string;
  tipoComprobante?: string;
  rucEmisor?: string;
  mensajes: string[];
  error?: string;
}

export interface SolicitudConsultaMasiva {
  clavesAcceso: string[];
  ambiente?: Ambiente;
}

export interface RespuestaConsultaMasiva {
  total: number;
  procesados: number;
  errores: number;
  resultados: ResultadoConsultaIndividual[];
  tiempoEjecucion: string;
}

export interface ConfiguracionSRI {
  ambiente: Ambiente;
  wsdlUrl: string;
  timeout: number;
  maxRetries: number;
}

export interface ConfiguracionAplicacion {
  port: number;
  batchSize: number;
  maxConcurrentRequests: number;
  delayBetweenBatches: number;
  requestTimeout: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}
