import db from "../models";
import dbConfig from "../config/dbConfig";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sign } from "jsonwebtoken";
import { Request, Response, response } from "express";

class Grocery {
  static async registerApi(req: Request, res: Response): Promise<any> {
    try {
      const { name, email, password, passwordConfirm } = req.body;

      if (password != passwordConfirm) {
        return res.json({
          message: "Password do not matched",
        });
      }
      let userId = crypto.randomUUID();
      const data = await db.User.findOne({
        where: {
          email: email,
        },
        attributes: ["email"],
      });

      if (data != null) {
        return res.json({
          message: "Already existing email",
        });
      }
      let hashPassword = await bcrypt.hash(password, 8);
      await db.User.create({
        user_id: userId,
        username: name,
        email: email,
        password: hashPassword,
        roles: "user",
      });
      console.log("user is registered");
      return res.send({
        message: "User Register",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      console.log("req.body", req.body);

      const data = await db.User.findOne({
        where: {
          email: email,
        },
      });

      console.log("data>>>>", data?.dataValues);
      if (data != null) {
        const result = bcrypt.compareSync(password, data.dataValues.password);
        if (result) {
          const jsontoken = sign(
            {
              userId: data.dataValues.user_id,
              email: email,
              roles: data.dataValues.roles,
            },
            process.env.SECRET_KEY!,
            {
              expiresIn: "1day",
            }
          );
          return res.json({
            success: 1,
            message: "login Successfully",
            token: jsontoken,
          });
        }
      }
      return res.send({
        message: "User Not Found you need to register before login",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }

  static async changeRoles(req: Request, res: Response): Promise<any> {
    try {
      const { superAdmin, emailToChange, rolesToChange } = req.body;
      const superId = dbConfig.superAdmin.email;
      if (superAdmin !== superId) {
        return res.json({
          message: "SuperAdmin email did not match",
        });
      }
      const data = await db.User.findOne({
        where: {
          email: emailToChange,
        },
      });
      if (data === null) {
        return res.json({
          message: "User Not Found Please Register your user",
        });
      }
      if (
        rolesToChange.toLowerCase() === data?.dataValues.roles.toLowerCase()
      ) {
        return res.json({
          message: "User Already have the requested role",
        });
      }
      await db.User.update(
        {
          roles: rolesToChange.toUpperCase(),
        },
        {
          where: {
            email: emailToChange,
          },
        }
      );

      return res.json({
        message: "Role changed to Admin successfully",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }

  static async addNewGrocery(req: Request, res: Response): Promise<any> {
    try {
      const arr = req.body;
      const jsonString = JSON.stringify(arr);
      const parsedArray = JSON.parse(jsonString);
      console.log("array from request", arr);
      for (let i = 0; i < parsedArray.length; i++) {
        let userId = crypto.randomUUID();
        parsedArray[i].item_id = userId;
      }
      console.log("parsedArray>>>>>>>", parsedArray);
      await db.GroceryItems.bulkCreate(parsedArray);
      return res.send({
        message: "Grocery is updated",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }

  static async removeGroceryItem(req: Request, res: Response): Promise<any> {
    try {
      const arr = req.body;
      console.log("arr>>>>>", arr);
      const data = await db.GroceryItems.findAll({
        where: {
          name: {
            [Op.in]: arr,
          },
        },
      });
      console.log("data>>>", data);
      if (data.length === 0) {
        res.send({
          message: "Data Not Found In Grocery Store",
        });
      }
      await db.GroceryItems.destroy({
        where: {
          name: {
            [Op.in]: arr,
          },
        },
      });
      return res.send({
        message: "Data Removed from Grocery Store",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }

  static async veiwGrocery(req: Request, res: Response): Promise<any> {
    try {
      const data = await db.GroceryItems.findAll({});
      if (data === null) {
        res.json({
          message: "Data Not Found In Grocery Store",
        });
      }
      return res.send({
        data,
      });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  static async updateGrocery(req: Request, res: Response): Promise<any> {
    try {
      const arr = req.body;
      const jsonString = JSON.stringify(arr);
      const inputData = JSON.parse(jsonString);
      // const inputData = parsedArray.map((item) => item.name);
      let itemNotInGrocery = [];

      let flag = false;
      for (const data of inputData) {
        const { item_id, name, price, quantityToAdd } = data;

        const existingItem = await db.GroceryItems.findByPk(item_id);
        if (existingItem) {
          // Update quantity_left by adding the incoming quantity
          const updatedQuantity =
            existingItem.dataValues.quantity_left + quantityToAdd;

          // Perform the update
          await db.GroceryItems.update(
            { name, price, quantity_left: updatedQuantity },
            { where: { item_id } }
          );
          flag = true;
        } else {
          // Handle the case where the item does not exist
          itemNotInGrocery.push(name);
          console.error(`Item with ID ${item_id} not found.`);
        }
      }
      let message = "Item Not Found For Update";
      if (flag) {
        message = "Item Updated Successfully";
      }
      return res.send({
        success: 1,
        message,
        itemNotInGrocery,
      });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  static async order(req: Request, res: Response): Promise<any> {
    try {
      const items = req.body;
      const reqUserId = (req as any).userId;
      let nonExistingItems = [];
      let ItemInsufficientGrocery = [];
      let currentDate = new Date();
      let orderId;
      let amount;
      let orderItemId;
      let flag = false;
      for (const item of items) {
        const { name, quantity } = item;
        // Check if the item exists in the GroceryItems table
        const existingItem = await db.GroceryItems.findOne({
          where: { name },
        });
        if (existingItem) {
          // If the item exists, update the quantity_left field
          const newQuantityLeft =
            existingItem.dataValues.quantity_left - quantity;
          console.log("newQuantityLeft>>>>", newQuantityLeft);
          if (newQuantityLeft < 0) {
            ItemInsufficientGrocery.push(name);
          } else {
            await db.GroceryItems.update(
              { quantity_left: newQuantityLeft },
              { where: { name } }
            );
            orderId = crypto.randomUUID();
            amount = quantity * existingItem.dataValues.price;
            await db.Orders.create({
              order_id: orderId,
              user_id: reqUserId, // Watch out for this userId i have added in middleware function
              order_date: currentDate,
              total_amount: amount,
            });
            orderItemId = crypto.randomUUID();
            await db.OrderItems.create({
              order_item_id: orderItemId,
              order_id: orderId,
              item_id: existingItem.dataValues.item_id,
              quantity: quantity,
            });
            flag = true;
          }
        } else {
          nonExistingItems.push(name);
          console.log(`Item '${name}' does not exist in the database.`);
          // Handle the case where the item does not exist
        }
      }
      let message = "Order does not get placed";
      if (flag) {
        message = "Order is placed successfully";
      }
      return res.json({
        message,
        nonExistingItems,
        ItemInsufficientGrocery,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      return res
        .status(500)
        .json({ success: 0, message: "Internal server error" });
    }
  }
}

export default Grocery;

// export { registerApi, login, addNewGrocery, removeGroceryItem, veiwGrocery, updateGrocery, changeRoles, order }
