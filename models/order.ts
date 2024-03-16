import { DataTypes, Model, Sequelize } from "sequelize";

interface OrderAttributes {
  order_id: string;
  user_id: string;
  order_date: Date;
  total_amount: number;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Orders extends Model<OrderAttributes> implements OrderAttributes {
    public order_id!: string;
    public user_id!: string;
    public order_date!: Date;
    public total_amount!: number;

  }

  Orders.init(
    {
      order_id: {
        type: dataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      order_date: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      total_amount: {
        type: dataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Orders",
      // tableName: "orders", // Optional
      // timestamps: false, // Optional
    }
  );

  return Orders;
};
