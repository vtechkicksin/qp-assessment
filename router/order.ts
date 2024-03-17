import express, { Request, Response } from "express";
import * as middleware from "../middleware/index";
import * as grocery from "../controller/index";

const router = express.Router();

router.post(
  "/order",
  middleware.default.userAuth,
  (req: Request, res: Response) => {
    grocery.default.order(req, res);
  }
);

export default router;
