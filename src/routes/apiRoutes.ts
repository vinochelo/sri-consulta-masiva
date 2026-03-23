import { Router } from 'express';
import { 
  consultarMasivo, 
  consultarIndividual, 
  healthCheck 
} from '../controllers/consultaController';

const router = Router();

router.get('/health', healthCheck);

router.post('/consulta-masiva', consultarMasivo);

router.get('/consulta/:claveAcceso', consultarIndividual);

export default router;
