import express from 'express';
import cors from "cors"
import helmet from 'helmet';
import mainRouter from './routes/main.js';
import { localStrategy } from './strategy/local.js';
import passport from 'passport';
import { googleStrategy } from './strategy/google.js';
import cookieParser from 'cookie-parser';

export const server = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://devorganiza.vercel.app',
  'https://devorganiza-frontend.vercel.app'
];

server.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

server.use(cookieParser());
server.use(helmet({ contentSecurityPolicy: false }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

passport.use('local', localStrategy);
passport.use('google', googleStrategy);
server.use(passport.initialize());

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