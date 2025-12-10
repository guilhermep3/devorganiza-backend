import express from 'express';
import cors from "cors"
import helmet from 'helmet';
import mainRouter from './routes/main.js';

export const server = express();

server.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
server.use(helmet({ contentSecurityPolicy: false }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/', mainRouter);

server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});