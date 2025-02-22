import Satkeruniv from "../../models/satkeruniv/SatkerUnivModel.js";
import Users from "../../models/UserModel.js";
import { Op } from "sequelize";

export const getSatkerUniv = async (req, res) => {
  try {
    let response;
    if (req.role === "satker" || req.role === "admin" ) {
      response = await Satkeruniv.findAll({
        attributes: [
          "kdsatker",
          "nmsatker",
          "kdkppn",
          "nmkppn",
          "email",
          "npwp",
          "nmppk",
          "kota",
          "provinsi",
          "kdpos",
          "alamat",
          "createdAt",
        ],
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    } else {
      response = await Satkeruniv.findAll({
        attributes: [
          "kdsatker",
          "nmsatker",
          "kdkppn",
          "nmkppn",
          "email",
          "npwp",
          "nmppk",
          "kota",
          "provinsi",
          "kdpos",
          "alamat",
          "createdAt",
        ],
        where: {
          userUuid: req.userUuid,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSatkerUnivByKDsatker = async (req, res) => {
  try {
    const satker = await Satkeruniv.findOne({
      where: {
        kdsatker: req.params.kdsatker,
      },
    });
    if (!satker) return res.status(404).json({ msg: "Data not found!" });
    let response;
    if (req.role === "satker" || req.role === "admin" ) {
      response = await Satkeruniv.findOne({
        attributes: [
          "kdsatker",
          "nmsatker",
          "kdkppn",
          "nmkppn",
          "email",
          "npwp",
          "nmppk",
          "kota",
          "provinsi",
          "kdpos",
          "alamat",
          "createdAt",
        ],
        where: {
          kdsatker: satker.kdsatker,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    } else {
      response = await Satkeruniv.findOne({
        attributes: [
          "kdsatker",
          "nmsatker",
          "kdkppn",
          "nmkppn",
          "email",
          "npwp",
          "nmppk",
          "kota",
          "provinsi",
          "kdpos",
          "alamat",
          "createdAt",
        ],
        where: {
          [Op.and]: [{ kdsatker: satker.kdsatker }, { userUuid: req.userUuid }],
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSatkerUniv = async (req, res) => {
  const { kdsatker, nmsatker, kdkppn, nmkppn, email, notelp, npwp, nmppk, kota, provinsi, kdpos, alamat } = req.body;
  const role = "satker";
  try {
    await Satkeruniv.create({
      kdsatker: kdsatker,
      nmsatker: nmsatker,
      kdkppn: kdkppn,
      nmkppn: nmkppn,
      email: email,
      notelp: notelp,
      npwp: npwp,
      nmppk: nmppk,
      kota: kota,
      provinsi: provinsi,
      kdpos: kdpos,
      alamat: alamat,
      role: role,
      userUuid: req.userUuid,
    });
    res.status(201).json({ msg: "Data Satuan Kerja Universitas Berhasil Ditambahkan!" });
  } catch (error) {
    console.error("Error creating Satker Univ:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateSatkerUniv = async (req, res) => {
  try {
    const satker = await Satkeruniv.findOne({
      where: {
        kdsatker: req.params.kdsatker,
      },
    });
    if (!satker) return res.status(404).json({ msg: "Data not found!" });
    const { kdsatker, nmsatker, kdkppn, nmkppn, email, notelp, npwp, nmppk, kota, provinsi, kdpos, alamat } = req.body;
    if (req.role === "satker" || req.role === "admin" ) {
      await Satkeruniv.update(
        { kdsatker, nmsatker, kdkppn, nmkppn, email, notelp, npwp, nmppk, kota, provinsi, kdpos, alamat },
        {
          where: {
            kdsatker: satker.kdsatker,
          },
        }
      );
    } else {
      if (req.userUuid !== satker.userUuid)
        return res.status(403).json({ msg: "Access X" });
      await Satkeruniv.update(
        { kdsatker, nmsatker, kdkppn, nmkppn, email, notelp, npwp, nmppk, kota, provinsi, kdpos, alamat },
        {
          where: {
            [Op.and]: [{ kdsatker: satker.kdsatker }, { userUuid: req.userUuid }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Satuan Kerja Universitas berhasil di perbaharui!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSatkerUniv = async (req, res) => {
  try {
    const satker = await Satkeruniv.findOne({
      where: {
        kdsatker: req.params.kdsatker,
      },
    });
    if (!satker) return res.status(404).json({ msg: "Data not found!" });
    const { kdsatker, nmsatker, kdkppn, nmkppn, email, notelp, npwp, nmppk, kota, provinsi, kdpos, alamat } = req.body;
    if (req.role === "satker" || req.role === "admin" ) {
      await Satkeruniv.destroy({
        where: {
          kdsatker: satker.kdsatker,
        },
      });
    } else {
      if (req.userUuid !== satker.userUuid)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Satkeruniv.destroy({
        where: {
          [Op.and]: [{ kdsatker: satker.kdsatker }, { userUuid: req.userUuid }],
        },
      });
    }
    res.status(200).json({ msg: "Data Satuan Kerja Universitas berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
