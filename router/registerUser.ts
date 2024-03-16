// registerUser.ts
import express, { Request, Response } from "express";
import * as grocery from "../controller/index";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  grocery.default.registerApi(req, res);
});



export default router;
