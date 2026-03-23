import { Request, Response } from 'express';
import { 
  SolicitudConsultaMasiva, 
  RespuestaConsultaMasiva,
  ResultadoConsultaIndividual,
  Ambiente
} from '../types/sri.types';
import { 
  configuracionAplicacion, 
  AMBIENTE_DEFAULT,
  MAX_CLAVES_POR_SOLICITUD 
} from '../config/environment';
import { BatchProcessor } from '../utils/batchProcessor';

const validarClaveAcceso = (clave: string): boolean => {
  const patron = /^\d{49}$/;
  return patron.test(clave);
};

const formatearRespuesta = (
  claves: string[],
  resultados: ResultadoConsultaIndividual[],
  tiempoInicio: number
): RespuestaConsultaMasiva => {
  const errores = resultados.filter(r => r.error).length;

  return {
    total: claves.length,
    procesados: resultados.length,
    errores,
    resultados,
    tiempoEjecucion: `${Date.now() - tiempoInicio}ms`
  };
};

export const consultarMasivo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tiempoInicio = Date.now();
  
  try {
    const body: SolicitudConsultaMasiva = req.body;
    
    if (!body.clavesAcceso || !Array.isArray(body.clavesAcceso)) {
      res.status(400).json({
        error: 'El campo "clavesAcceso" es requerido y debe ser un array',
        ejemplo: {
          clavesAcceso: ['0211202401050306179800120010020000000677300995216'],
          ambiente: 'produccion'
        }
      });
      return;
    }

    if (body.clavesAcceso.length === 0) {
      res.status(400).json({
        error: 'El array "clavesAcceso" no puede estar vacío'
      });
      return;
    }

    if (body.clavesAcceso.length > MAX_CLAVES_POR_SOLICITUD) {
      res.status(400).json({
        error: `Máximo ${MAX_CLAVES_POR_SOLICITUD} claves por solicitud`,
        recibido: body.clavesAcceso.length
      });
      return;
    }

    const clavesInvalidas = body.clavesAcceso.filter(c => !validarClaveAcceso(c));
    if (clavesInvalidas.length > 0) {
      res.status(400).json({
        error: 'Algunas claves de acceso son inválidas (deben ser 49 dígitos numéricos)',
        clavesInvalidas: clavesInvalidas.slice(0, 5),
        totalInvalidas: clavesInvalidas.length
      });
      return;
    }

    const ambiente = body.ambiente || AMBIENTE_DEFAULT;
    const processor = new BatchProcessor(ambiente);

    const resultados = await processor.procesarMasivo(body.clavesAcceso);
    const respuesta = formatearRespuesta(body.clavesAcceso, resultados, tiempoInicio);

    res.json(respuesta);

  } catch (error) {
    console.error('Error en consulta masiva:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: (error as Error).message
    });
  }
};

export const consultarIndividual = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { claveAcceso } = req.params;
    const ambiente: Ambiente = (req.query.ambiente as Ambiente) || AMBIENTE_DEFAULT;

    if (!validarClaveAcceso(claveAcceso)) {
      res.status(400).json({
        error: 'Clave de acceso inválida (debe ser 49 dígitos numéricos)'
      });
      return;
    }

    const sriService = require('../services/sriConsultasService').sriService;
    const resultado = await sriService.consultarComprobante(claveAcceso, ambiente);

    res.json(resultado);

  } catch (error) {
    console.error('Error en consulta individual:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: (error as Error).message
    });
  }
};

export const healthCheck = (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    configuracion: {
      batchSize: configuracionAplicacion.batchSize,
      maxConcurrentRequests: configuracionAplicacion.maxConcurrentRequests,
      requestTimeout: configuracionAplicacion.requestTimeout
    }
  });
};
