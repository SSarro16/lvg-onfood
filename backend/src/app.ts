import express, { Response, NextFunction } from "express";
import { Request } from "./types/express.types";
import bodyParser from "body-parser";

import eventRoutes from './routes/products';
import authRoutes from './routes/auth';
import { GenericError } from "./util/errors";

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Request [${req.method}] ${req.path} ${JSON.stringify(req.body)}`);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/auth', authRoutes);

app.use('/products', eventRoutes);

app.use((error: GenericError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

app.listen(8080);
