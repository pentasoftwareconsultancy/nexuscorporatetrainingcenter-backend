import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

/* ============================================================
   PLACEMENT CATEGORY MODEL
============================================================ */
export const PlacementCategory = sequelize.define(
  "PlacementCategory",
  {
    placementCategoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "placement_categories",
    timestamps: true,
  }
);

/* ============================================================
   PLACEMENTS MODEL
============================================================ */
export const Placement = sequelize.define(
  "Placement",
  {
    placement_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    placementCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "placement_categories",
        key: "placementCategoryId",
      },
      onDelete: "CASCADE",
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    company_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    package: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "placements",
    timestamps: true,
  }
);

/* ============================================================
   PLACEMENT DETAILS MODEL
============================================================ */
export const PlacementDetails = sequelize.define(
  "PlacementDetails",
  {
    placementDetails_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    placement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "placements",
        key: "placement_id",
      },
      onDelete: "CASCADE",
    },

    success_story: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    facing_challenges: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    program_highlights: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    final_evaluation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    overall_experience: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    tableName: "placement_details",
    timestamps: true,
  }
);

/* ============================================================
   MODEL RELATIONSHIPS (IMPORTANT)
============================================================ */

// Category → Placements (1:N)
PlacementCategory.hasMany(Placement, {
  foreignKey: "placementCategoryId",
});

Placement.belongsTo(PlacementCategory, {
  foreignKey: "placementCategoryId",
});

// Placement → Details (1:1)
// Placement.hasOne(PlacementDetails, {
//   foreignKey: "placement_id",
// });

Placement.hasOne(PlacementDetails, {
  foreignKey: "placement_id",
  as: "details"   // 👈 alias should be "details"
});


// PlacementDetails.belongsTo(Placement, {
//   foreignKey: "placement_id",
// });

PlacementDetails.belongsTo(Placement, {
  foreignKey: "placement_id",
  as: "placement"   // 👈 alias should be "placement"
});

