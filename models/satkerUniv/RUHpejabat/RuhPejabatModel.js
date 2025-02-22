import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";
import Satkeruniv from "../SatkerUnivModel.js";

const { DataTypes } = Sequelize;

const RUHPejabat = db.define(
  "ruhpejabat",
  {
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        len: [1, 18],
        isAlphanumeric: true,
      },
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 16],
        isAlphanumeric: true,
      },
    },
    nmpeg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kdjab: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nmjab: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kdduduk: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nmduduk: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jurubayar: {
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

Satkeruniv.hasMany(RUHPejabat);
RUHPejabat.belongsTo(Satkeruniv, { foreignKey: "kdsatker" });

export default RUHPejabat;
