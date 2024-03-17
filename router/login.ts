// registerUser.ts
import express, { Request, Response } from "express";
import * as grocery from "../controller/index";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  grocery.default.login(req, res);
});

export default router;
