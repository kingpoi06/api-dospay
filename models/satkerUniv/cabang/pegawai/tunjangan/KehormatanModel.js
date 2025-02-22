import { Sequelize } from "sequelize";
import db from "../../../../../config/Database.js";
import Tanggalkehormatan from "../tanggaltunjangan/TanggalkehormatanModel.js";

const { DataTypes } = Sequelize;

const TunjanganKehormatan = db.define(
  "tunjangankehormatan",
  {
    kdtunjangan: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
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
    besartunjangan: {
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

Tanggalkehormatan.hasMany(TunjanganKehormatan);
TunjanganKehormatan.belongsTo(Tanggalkehormatan, { foreignKey: "kdtunjangan" });

export default TunjanganKehormatan;
