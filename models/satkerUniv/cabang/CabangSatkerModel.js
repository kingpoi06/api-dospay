import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";
import Satkeruniv from "../SatkerUnivModel.js";

const { DataTypes } = Sequelize;

const Cabangsatker = db.define(
  "cabangsatker",
  {
    kdanak: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    nmanak: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kdsubanak: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    modul: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kdsatker: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Satkeruniv.hasMany(Cabangsatker);
Cabangsatker.belongsTo(Satkeruniv, { foreignKey: "kdsatker" });

export default Cabangsatker;
