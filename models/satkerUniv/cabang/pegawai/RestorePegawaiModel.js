import { Sequelize } from "sequelize";
import db from "../../../../config/Database.js";
import Cabangsatker from "../CabangSatkerModel.js";

const { DataTypes } = Sequelize;

const Restorepegawai = db.define(
  "restorepegawai",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
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
    filerestore: {
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

Cabangsatker.hasMany(Restorepegawai);
Restorepegawai.belongsTo(Cabangsatker, { foreignKey: "kdanak" });

export default Restorepegawai;
