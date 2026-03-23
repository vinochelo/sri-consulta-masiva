import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/apiRoutes';
import { configuracionAplicacion } from './config/environment';

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: configuracionAplicacion.rateLimitWindowMs,
  max: configuracionAplicacion.rateLimitMaxRequests,
  message: {
    error: 'Demasiadas solicitudes, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.use('/api', apiRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    nombre: 'SRI Consulta Masiva API',
    version: '1.0.0',
    endpoints: {
      salud: 'GET /api/health',
      consultaIndividual: 'GET /api/consulta/:claveAcceso',
      consultaMasiva: 'POST /api/consulta-masiva'
    },
    ejemplo: {
      consultaMasiva: {
        method: 'POST',
        url: '/api/consulta-masiva',
        body: {
          clavesAcceso: ['0211202401050306179800120010020000000677300995216'],
          ambiente: 'produccion'
        }
      }
    }
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: err.message
  });
});

const PORT = configuracionAplicacion.port;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/consulta-masiva`);
  console.log(`   GET  /api/consulta/:claveAcceso`);
});

export default app;
