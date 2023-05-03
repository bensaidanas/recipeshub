import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import { dbConnect } from './configs/database.config';
import recipeRouter from './routers/recipe.router';

dbConnect();

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin:["http://localhost:8100"]
}));

app.use('/api/recipes', recipeRouter);

const port = 6969;
app.listen(port, () => {
    console.log(`Website served on http://localhost:${port}`);
});
