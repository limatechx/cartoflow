import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import servicesRoutes from './routes/services.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/services', servicesRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Cartoflow API running' });
});

export default app;
