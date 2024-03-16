import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Checking if server is running");
});

app.use(router);

const port = process.env.PORT || 3000;

console.log(port);
app.listen(port, () => {
  console.log(`Server is flying on port ${port}`);
});
