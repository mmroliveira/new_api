import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { handleError } from "./helpers/handleError";

import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(handleError);
app.use(morgan("dev"));

app.use(router);

const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`Server is running on port ${port}`));
