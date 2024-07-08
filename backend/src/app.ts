import express, { Response, NextFunction } from "express";
import { Request } from "./types/express.types";
import bodyParser from "body-parser";

import productsRoutes from "./routes/v1/products";
import authRoutes from "./routes/v1/auth";
import productsNewRoutes from "./routes/v2/products";
import authNewRoutes from "./routes/v2/auth";

import { GenericError } from "./util/errors";
import colorfulText from "./util/colorfulText";


const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  // add some color to console.log
  const method = colorfulText(req.method, "cyan");
  const path = colorfulText(req.path, "yellow");
  const body = colorfulText(JSON.stringify(req.body), "green");
  console.log(`Request [${method}] ${path} ${body}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  // console.log('RES HEADER ', res.header)
  next();
});

const version = "v1";
const apiPath = `/api/${version}`;

const authPath = `${apiPath}/auth`;
const productsPath = `${apiPath}/products`;
const authNewPath = `/api/v2/auth`;
const productsNewPath = `/api/v2/products`;

app.use(authPath, authRoutes);
app.use(productsPath, productsRoutes);
app.use(authNewPath, authNewRoutes);
app.use(productsNewPath, productsNewRoutes);

app.use(
  (error: GenericError, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong.";
    res.status(status).json({ message: message });
  }
);

app.listen(8080);

console.log(`${colorfulText("[OK]", "green")} Server started at ${colorfulText("http://localhost:8080", "magenta")}`);
