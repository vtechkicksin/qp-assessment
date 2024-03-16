import { DataTypes, Model, Sequelize } from "sequelize";

interface GroceryItemAttributes {
  item_id: string;
  name: string;
  price: number;
  quantity_left: number;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class GroceryItems
    extends Model<GroceryItemAttributes>
    implements GroceryItemAttributes
  {
    public item_id!: string;
    public name!: string;
    public price!: number;
    public quantity_left!: number;

  }

  GroceryItems.init(
    {
      item_id: {
        type: dataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      quantity_left: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GroceryItems",
      // tableName: "groceryItems", // Optional
      // timestamps: false, // Optional
    }
  );

  return GroceryItems;
};
