import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerRoutes } from './routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

registerRoutes(app);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
