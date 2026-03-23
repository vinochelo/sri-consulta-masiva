import type { VercelRequest, VercelResponse } from '@vercel/node';
import { crearVercelServer } from '../src/vercelHandler';

const app = crearVercelServer();

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
