import { 
  ResultadoConsultaIndividual, 
  Ambiente 
} from '../types/sri.types';
import { sriService } from '../services/sriConsultasService';
import { configuracionAplicacion } from '../config/environment';

export class BatchProcessor {
  private ambiente: Ambiente;

  constructor(ambiente: Ambiente = 'produccion') {
    this.ambiente = ambiente;
  }

  private async consultarConPromesa(
    claveAcceso: string
  ): Promise<ResultadoConsultaIndividual> {
    return sriService.consultarComprobante(claveAcceso, this.ambiente);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async procesarMasivo(
    clavesAcceso: string[],
    onProgress?: (procesados: number, total: number) => void
  ): Promise<ResultadoConsultaIndividual[]> {
    const resultados: ResultadoConsultaIndividual[] = [];
    const batchSize = configuracionAplicacion.batchSize;
    const maxConcurrent = configuracionAplicacion.maxConcurrentRequests;
    const delayBetweenBatches = configuracionAplicacion.delayBetweenBatches;

    for (let i = 0; i < clavesAcceso.length; i += batchSize) {
      const batch = clavesAcceso.slice(i, i + batchSize);
      
      const batchResults = await this.procesarBatch(batch, maxConcurrent);
      resultados.push(...batchResults);

      if (onProgress) {
        onProgress(resultados.length, clavesAcceso.length);
      }

      if (i + batchSize < clavesAcceso.length) {
        await this.sleep(delayBetweenBatches);
      }
    }

    return resultados;
  }

  private async procesarBatch(
    claves: string[], 
    maxConcurrent: number
  ): Promise<ResultadoConsultaIndividual[]> {
    const resultados: ResultadoConsultaIndividual[] = [];
    
    for (let i = 0; i < claves.length; i += maxConcurrent) {
      const chunk = claves.slice(i, i + maxConcurrent);
      const promises = chunk.map(clave => this.consultarConPromesa(clave));
      const batchResults = await Promise.all(promises);
      resultados.push(...batchResults);
    }

    return resultados;
  }

  public setAmbiente(ambiente: Ambiente): void {
    this.ambiente = ambiente;
  }
}

export const crearBatchProcessor = (ambiente?: Ambiente): BatchProcessor => {
  return new BatchProcessor(ambiente);
};
