import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Review = sequelize.define("Review", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    name: { type: DataTypes.STRING, allowNull: true, },
    position: { type: DataTypes.STRING, allowNull: true, },
    review: { type: DataTypes.TEXT, allowNull: true, },
    imageUrl: { type: DataTypes.STRING, allowNull: true, },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5, }, },
  }, { tableName: "google_reviews", timestamps: true, });

export default Review;
