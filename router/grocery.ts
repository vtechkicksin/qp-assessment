import express, { Request, Response } from "express";
import * as middleware from "../middleware/index";
import * as grocery from "../controller/index";

const router = express.Router();

router.post(
  "/",
  middleware.default.adminAuth,
  (req: Request, res: Response) => {
    grocery.default.addNewGrocery(req, res);
  }
);

//   router.post(
//     "/removeGrocery",
//     middleware.default.adminAuth,
//     (req: Request, res: Response) => {
//       grocery.default.removeGroceryItem(req, res);
//     }
//   );

//   router.get("/veiwGrocery", (req: Request, res: Response) => {
//     grocery.default.veiwGrocery(req, res);
//   });

export default router;
