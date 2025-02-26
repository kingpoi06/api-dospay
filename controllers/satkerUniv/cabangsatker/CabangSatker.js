import Satkeruniv from "../../../models/satkerUniv/SatkerUnivModel.js";
import Cabangsatker from "../../../models/satkerUniv/cabang/CabangSatkerModel.js"
import { Op } from "sequelize";

export const getCabangSatker = async (req, res) => {
  try {
    let response;
    if (req.role === "cabang" || req.role === "admin" ) {
      response = await Cabangsatker.findAll({
        attributes: [
          "kdanak",
          "nmanak",
          "kdsubanak",
          "modul",
          "kdsatker",
        ],
        include: [
          {
            model: Satkeruniv,
            attributes: ["kdsatker", "nmsatker"],
          },
        ],
      });
    } else {
      response = await Cabangsatker.findAll({
        attributes: [
          "kdanak",
          "nmanak",
          "kdsubanak",
          "modul",
          "kdsatker",
        ],
        where: {
          kdsatker: req.kdsatker,
        },
        include: [
          {
            model: Satkeruniv,
            attributes: ["kdsatker", "nmsatker"],
          },
        ],
      });
    }
    res.status(200).json({
      message: "Data SATUAN KERJA FAKULTAS",
      Data: [response],
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCabangSatkerByKDanak = async (req, res) => {
  try {
    const cabang = await Cabangsatker.findOne({
      where: {
        kdanak: req.params.kdanak,
      },
    });
    if (!cabang) return res.status(404).json({ msg: "Data not found!" });
    let response;
    if (req.role === "cabang" || req.role === "admin" ) {
      response = await Cabangsatker.findOne({
        attributes: [
          "kdanak",
          "nmanak",
          "kdsubanak",
          "modul",
          "kdsatker",
        ],
        where: {
          kdanak: cabang.kdanak,
        },
        include: [
          {
            model: Satkeruniv,
            attributes: ["kdsatker", "nmsatker"],
          },
        ],
      });
    } else {
      response = await Cabangsatker.findOne({
        attributes: [
          "kdanak",
          "nmanak",
          "kdsubanak",
          "modul",
          "kdsatker",
        ],
        where: {
          [Op.and]: [{ kdanak: cabang.kdanak }, { kdsatker: req.kdsatker }],
        },
        include: [
          {
            model: Satkeruniv,
            attributes: ["kdsatker", "nmsatker"],
          },
        ],
      });
    }
    res.status(200).json({
      message: `Data SATUAN KERJA FAKULTAS dari ${req.params.kdanak}`,
      Data: [response],
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createCabangSatker = async (req, res) => {
  const { kdanak, nmanak, kdsubanak, modul, kdsatker } = req.body;
  const role = "cabang";

  try {
    await Cabangsatker.create({
      kdanak: kdanak,
      nmanak: nmanak,
      kdsubanak: kdsubanak,
      modul: modul,
      role: role,
      kdsatker: kdsatker,
      satkerunivKdsatker: kdsatker,
    });
    res.status(201).json({ msg: "Data Satuan Kerja Cabang Berhasil Ditambahkan!" });
  } catch (error) {
    console.error("Error creating Satker Univ:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateCabangSatker = async (req, res) => {
  try {
    const { kdanak } = req.params; // Ambil dari URL parameter
    if (!kdanak) return res.status(400).json({ msg: "Parameter kdanak tidak ditemukan!" });

    const cabang = await Cabangsatker.findOne({ where: { kdanak } });
    if (!cabang) return res.status(404).json({ msg: "Data tidak ditemukan!" });

    const { nmanak, kdsubanak, modul } = req.body; // Data yang diperbarui

    if (req.role === "cabang" || req.role === "admin") {
      await Cabangsatker.update(
        { nmanak, kdsubanak, modul },
        { where: { kdanak } }
      );
    } else {
      if (req.kdsatker !== cabang.kdsatker)
        return res.status(403).json({ msg: "Akses ditolak!" });

      await Cabangsatker.update(
        { nmanak, kdsubanak, modul },
        { where: { [Op.and]: [{ kdanak }, { kdsatker: req.kdsatker }] } }
      );
    }

    res.status(200).json({ msg: "Data Satuan Kerja Fakultas berhasil diperbarui!" });
  } catch (error) {
    console.error("Error saat update:", error);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};

export const deleteCabangSatker = async (req, res) => {
  try {
    const { kdanak } = req.params;
    if (!kdanak) return res.status(400).json({ msg: "Parameter kdanak tidak ditemukan!" });

    const cabang = await Cabangsatker.findOne({ where: { kdanak } });
    if (!cabang) return res.status(404).json({ msg: "Data tidak ditemukan!" });

    if (req.role === "cabang" || req.role === "admin") {
      await Cabangsatker.destroy({ where: { kdanak } });
    } else {
      if (req.kdsatker !== cabang.kdsatker)
        return res.status(403).json({ msg: "Akses ditolak!" });

      await Cabangsatker.destroy({ where: { [Op.and]: [{ kdanak }, { kdsatker: req.kdsatker }] } });
    }

    res.status(200).json({ msg: "Data Satuan Kerja Fakultas berhasil dihapus!" });
  } catch (error) {
    console.error("Error saat delete:", error);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};
