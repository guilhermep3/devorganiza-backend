import express from 'express';
import cors from "cors"
import helmet from 'helmet';
import mainRouter from './routes/main.js';

export const server = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://devorganiza.vercel.app'
];

server.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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