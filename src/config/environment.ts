import dotenv from 'dotenv';
import { Ambiente, ConfiguracionAplicacion } from '../types/sri.types';

dotenv.config();

const AMBIENTE_SRI: Record<Ambiente, string> = {
  pruebas: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/ConsultaComprobante?wsdl',
  produccion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/ConsultaComprobante?wsdl'
};

export const configuracionAplicacion: ConfiguracionAplicacion = {
  port: parseInt(process.env.PORT || '3000', 10),
  batchSize: parseInt(process.env.BATCH_SIZE || '50', 10),
  maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '5', 10),
  delayBetweenBatches: parseInt(process.env.DELAY_BETWEEN_BATCHES || '1000', 10),
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
};

export const obtenerUrlWsdl = (ambiente: Ambiente): string => {
  return AMBIENTE_SRI[ambiente];
};

export const AMBIENTE_DEFAULT: Ambiente = 'produccion';
export const MAX_CLAVES_POR_SOLICITUD = 1000;
