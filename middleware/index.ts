import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class Middleware {
  static async userAuth(req: Request, res: Response, next: NextFunction) {
    let token = req.get("authorization");
    console.log("Token:", token);
    if (token) {
      token = token.slice(7);
      try {
        const decoded: any = await verify(token, process.env.SECRET_KEY!);
        console.log("Decoded token:", decoded);
        // Extract user information from the decoded token
        const { userId, email, roles } = decoded;

        (req as any).userId = userId;
        (req as any).email = email;
        (req as any).roles = roles;
        next();
      } catch (err) {
        console.error("Error:", err);
        res.json({
          success: 0,
          message: "Invalid token",
        });
      }
    } else {
      res.json({
        success: 0,
        message:
          "Access denied! Unauthorized User You Need To Be User and Not Admin",
      });
    }
  }

  static async adminAuth(req: Request, res: Response, next: NextFunction) {
    let token = req.get("authorization");
    console.log("Token:", token);
    if (token) {
      token = token.slice(7);
      try {
        const decoded: any = await verify(token, process.env.SECRET_KEY!);
        console.log("Decoded token:", decoded);
        // Extract user information from the decoded token
        const { userId, email, roles } = decoded;
        if (roles.toUpperCase() !== "ADMIN") {
          res.status(403).json({
            success: 0,
            message: "You need to be Admin in order to access this API",
          });
        }
        (req as any).userId = userId;
        (req as any).email = email;
        (req as any).roles = roles;
        next();
      } catch (err) {
        console.error("Error:", err);
        res.json({
          success: 0,
          message: "Invalid token",
        });
      }
    } else {
      res.json({
        success: 0,
        message: "Access denied! Unauthorized user",
      });
    }
  }
}

export default Middleware;
