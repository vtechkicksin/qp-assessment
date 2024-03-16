import { DataTypes, Model, Sequelize } from "sequelize";

interface UserAttributes {
  user_id: string;
  username: string;
  password: string;
  email: string;
  roles: "USER" | "ADMIN";
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public user_id!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public roles!: "USER" | "ADMIN";
  }

  User.init(
    {
      user_id: {
        type: dataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      roles: {
        type: dataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
