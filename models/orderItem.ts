import { DataTypes, Model, Sequelize } from "sequelize";

interface OrderItemAttributes {
  order_item_id: string;
  order_id: string;
  item_id: string;
  quantity: number;
}

export default (sequelize: Sequelize, dataType: typeof DataTypes) => {
  class OrderItems extends Model<OrderItemAttributes>
    implements OrderItemAttributes {
    public order_item_id!: string;
    public order_id!: string;
    public item_id!: string;
    public quantity!: number;

  }

  OrderItems.init(
    {
      order_item_id: {
        type: dataType.STRING,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: dataType.STRING,
        allowNull: false,
      },
      item_id: {
        type: dataType.STRING,
        allowNull: false,
      },
      quantity: {
        type: dataType.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderItems",
      // tableName: "OrderItems", // Optional
      // timestamps: false, // Optional
    }
  );

  return OrderItems;
};
