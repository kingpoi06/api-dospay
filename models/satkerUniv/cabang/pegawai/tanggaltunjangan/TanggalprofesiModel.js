import { Sequelize } from "sequelize";
import db from "../../../../../config/Database.js";
import Cabangsatker from "../../CabangSatkerModel.js";

const { DataTypes } = Sequelize;

const Tanggalprofesi = db.define(
  "tanggalprofesi",
  {
    kdtunjangan: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bulan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true, 
        min: 1, 
        max: 12, 
      },
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true, 
        min: 1900, 
        max: new Date().getFullYear(), 
      },
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal: {
      type: DataTypes.DATE,
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

Cabangsatker.hasMany(Tanggalprofesi);
Tanggalprofesi.belongsTo(Cabangsatker, { foreignKey: "kdanak" });

export default Tanggalprofesi;
