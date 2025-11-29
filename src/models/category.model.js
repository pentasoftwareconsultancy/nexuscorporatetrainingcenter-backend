import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


const Category = sequelize.define("Category", {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'category',
    timestamps: false,
  });

  

   


export default Category;
