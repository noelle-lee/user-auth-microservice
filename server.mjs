import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.mjs';
import authRoutes from './routes/authRoutes.mjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
