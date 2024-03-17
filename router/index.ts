import express, { Request, Response } from "express";
import * as grocery from "../controller/index";
import * as middleware from "../middleware/index";
import login from "./login";
import register from "./registerUser";
import groceryoperation from "./grocery";
import changeRole from "./changeRole";
import order from "./order";
const router = express.Router();

router.use("/", login);

router.use("/", register);
router.use("/", groceryoperation);
router.use("/", changeRole);
router.use("/", order);

// router.use("/registerUser", (req: Request, res: Response) => {
//   grocery.default.registerApi(req, res);
// });

// router.use('/login', (req: Request, res: Response) => {
//     grocery.default.login(req, res);
// });
// router.use("/registerUser", register);

// router.use("/login", login);

// router.post(
//   "/addNewGrocery",
//   middleware.default.adminAuth,
//   (req: Request, res: Response) => {
//     grocery.default.addNewGrocery(req, res);
//   }
// );

// router.post(
//   "/addNewGrocery",

// );

// router.post(
//   "/removeGrocery",
//   middleware.default.adminAuth,
//   (req: Request, res: Response) => {
//     grocery.default.removeGroceryItem(req, res);
//   }
// );

// router.get("/veiwGrocery", (req: Request, res: Response) => {
//   grocery.default.veiwGrocery(req, res);
// });

// router.post(
//   "/updateGrocery",
//   middleware.default.adminAuth,
//   (req: Request, res: Response) => {
//     grocery.default.updateGrocery(req, res);
//   }
// );

// router.post("/updateRole", (req: Request, res: Response) => {
//   grocery.default.changeRoles(req, res);
// });

// router.post(
//   "/order",
//   middleware.default.userAuth,
//   (req: Request, res: Response) => {
//     grocery.default.order(req, res);
//   }
// );

export default router;
