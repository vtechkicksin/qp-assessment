import express, { Request, Response } from "express";
import * as middleware from "../middleware/index";
import * as grocery from "../controller/index";

const router = express.Router();

router.post(
  "/updateRole",
  (req: Request, res: Response) => {
    grocery.default.changeRoles(req, res);
  }
);

export default router;
