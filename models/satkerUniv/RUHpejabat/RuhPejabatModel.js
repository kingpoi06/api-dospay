import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";
import Cabangsatker from "../cabang/CabangSatkerModel.js";

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
    kdanak: {
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

Cabangsatker.hasMany(RUHPejabat);
RUHPejabat.belongsTo(Cabangsatker, { foreignKey: "kdanak" });

export default RUHPejabat;
