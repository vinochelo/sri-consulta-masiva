import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const validarClaveAcceso = (clave: string): boolean => {
  const patron = /^\d{49}$/;
  return patron.test(clave);
};

export const crearVercelServer = (): Express => {
  const app = express();
  
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      platform: 'vercel'
    });
  });

  app.get('/api/consulta/:claveAcceso', async (req: Request, res: Response) => {
    try {
      const { claveAcceso } = req.params;
      const ambiente = (req.query.ambiente as string) || 'produccion';

      if (!validarClaveAcceso(claveAcceso)) {
        res.status(400).json({
          error: 'Clave de acceso inválida (debe ser 49 dígitos numéricos)'
        });
        return;
      }

      const { SRIConsultasService } = require('./services/sriConsultasService');
      const sriService = new SRIConsultasService();
      const resultado = await sriService.consultarComprobante(claveAcceso, ambiente as any);

      res.json(resultado);

    } catch (error) {
      console.error('Error en consulta individual:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      });
    }
  });

  app.post('/api/consulta-masiva', async (req: Request, res: Response) => {
    const tiempoInicio = Date.now();
    
    try {
      const { clavesAcceso, ambiente } = req.body;
      
      if (!clavesAcceso || !Array.isArray(clavesAcceso)) {
        res.status(400).json({
          error: 'El campo "clavesAcceso" es requerido y debe ser un array'
        });
        return;
      }

      if (clavesAcceso.length === 0) {
        res.status(400).json({
          error: 'El array "clavesAcceso" no puede estar vacío'
        });
        return;
      }

      const MAX_CLAVES = 100;
      if (clavesAcceso.length > MAX_CLAVES) {
        res.status(400).json({
          error: `Máximo ${MAX_CLAVES} claves por solicitud en Vercel`,
          recibido: clavesAcceso.length
        });
        return;
      }

      const clavesInvalidas = clavesAcceso.filter((c: string) => !validarClaveAcceso(c));
      if (clavesInvalidas.length > 0) {
        res.status(400).json({
          error: 'Algunas claves de acceso son inválidas (deben ser 49 dígitos numéricos)',
          clavesInvalidas: clavesInvalidas.slice(0, 5),
          totalInvalidas: clavesInvalidas.length
        });
        return;
      }

      const { BatchProcessor } = require('./utils/batchProcessor');
      const ambienteFinal = ambiente || 'produccion';
      const processor = new BatchProcessor(ambienteFinal as any);

      const resultados = await processor.procesarMasivo(clavesAcceso);
      const errores = resultados.filter((r: any) => r.error).length;

      res.json({
        total: clavesAcceso.length,
        procesados: resultados.length,
        errores,
        resultados,
        tiempoEjecucion: `${Date.now() - tiempoInicio}ms`
      });

    } catch (error) {
      console.error('Error en consulta masiva:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      });
    }
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      nombre: 'SRI Consulta Masiva API',
      version: '1.0.0',
      plataforma: 'Vercel Serverless',
      endpoints: {
        salud: 'GET /api/health',
        consultaIndividual: 'GET /api/consulta/:claveAcceso',
        consultaMasiva: 'POST /api/consulta-masiva'
      }
    });
  });

  app.use((err: Error, _req: Request, res: Response, _next: any) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: err.message
    });
  });

  return app;
};
