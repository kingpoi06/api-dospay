import { Sequelize } from "sequelize";
import db from "../../../../../config/Database.js";
import Tanggalprofesi from "../tanggaltunjangan/TanggalprofesiModel.js";

const { DataTypes } = Sequelize;

const TunjanganProfesi = db.define(
  "tunjanganprofesi",
  {
    nmpeg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
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
    kdgol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 10],
        isAlphanumeric: true,
      },
    },
    gjpokok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pajakpph: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    totalpph: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jmlditerima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kdtunjangan: {
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

Tanggalprofesi.hasMany(TunjanganProfesi);
TunjanganProfesi.belongsTo(Tanggalprofesi, { foreignKey: "kdtunjangan" });

export default TunjanganProfesi;
