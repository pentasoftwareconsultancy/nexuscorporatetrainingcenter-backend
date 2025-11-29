import Batch from "./batch.model.js";
import Category from "./category.model.js";
import Course from "./course.model.js";

// Define associations here
Category.hasMany(Course, {
    foreignKey: "category_id",
    as: "courses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Course.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

 Batch.belongsTo(Course, {
      foreignKey: 'course_id',
      as: 'course',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

export { Category, Course };
