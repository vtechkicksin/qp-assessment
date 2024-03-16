import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "../config/dbConfig";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as any,
  operatorsAliases: false as any,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected...");
  })
  .catch((err: Error) => {
    console.error("Error: ", err.message);
  });

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import and initialize models
import UserModel from "./users";
import GroceryItemModel from "./groceryItem";
import OrderModel from "./order";
import OrderItemModel from "./orderItem";

// Define models and associations
db.User = UserModel(sequelize, DataTypes);
db.GroceryItems = GroceryItemModel(sequelize, DataTypes);
db.Orders = OrderModel(sequelize, DataTypes);
db.OrderItems = OrderItemModel(sequelize, DataTypes);

// Define associations

// db.User.hasMany(db.Orders, { foreignKey: "user_id" });
// db.Orders.belongsTo(db.User, { foreignKey: "user_id" });

// db.Orders.hasMany(db.OrderItems, { foreignKey: "order_id" });
// db.OrderItems.belongsTo(db.Orders, { foreignKey: "order_id" });

// db.GroceryItems.hasMany(db.OrderItems, { foreignKey: "item_id" });
// db.OrderItems.belongsTo(db.GroceryItems, { foreignKey: "item_id" });

db.User.hasMany(db.Orders, {
  foreignKey: { name: "FK_User_Orders", field: "user_id" },
});
db.Orders.belongsTo(db.User, {
  foreignKey: { name: "FK_User_Orders", field: "user_id" },
});



db.Orders.hasMany(db.OrderItems, {
  foreignKey: { name: "FK_OrderItems_Order", field: "order_id" },
});
db.OrderItems.belongsTo(db.Orders, {
  foreignKey: { name: "FK_OrderItems_Order", field: "order_id" },
});



db.GroceryItems.hasMany(db.OrderItems, {
  foreignKey: { name: "FK_OrderItems_GroceryItem", field: "item_id" },
});
db.OrderItems.belongsTo(db.GroceryItems, {
  foreignKey: { name: "FK_OrderItems_GroceryItem", field: "item_id" },
});

// Sync models with the database
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized.");
});

export default db;
