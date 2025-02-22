import Satkeruniv from "../../../models/satkeruniv/SatkerUnivModel.js";
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
    res.status(200).json(response);
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
    res.status(200).json(response);
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
    const cabang = await Cabangsatker.findOne({
      where: {
        kdanak: req.params.kdanak,
      },
    });
    if (!cabang) return res.status(404).json({ msg: "Data not found!" });
    const { kdanak, nmanak, kdsubanak, modul } = req.body;
    if (req.role === "cabang" || req.role === "admin" ) {
      await Cabangsatker.update(
        { kdanak, nmanak, kdsubanak, modul },
        {
          where: {
            kdanak: cabang.kdanak,
          },
        }
      );
    } else {
      if (req.kdsatker !== cabang.kdsatker)
        return res.status(403).json({ msg: "Access X" });
      await Cabangsatker.update(
        { kdanak, nmanak, kdsubanak, modul },
        {
          where: {
            [Op.and]: [{ kdanak: cabang.kdanak }, { kdsatker: req.kdsatker }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Satuan Kerja Cabang Universitas berhasil di perbaharui!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCabangSatker = async (req, res) => {
  try {
    const cabang = await Cabangsatker.findOne({
      where: {
        kdanak: req.params.kdanak,
      },
    });
    if (!cabang) return res.status(404).json({ msg: "Data not found!" });
    const { kdanak, nmanak, kdsubanak, modul } = req.body;
    if (req.role === "cabang" || req.role === "admin" ) {
      await Cabangsatker.destroy({
        where: {
          kdanak: cabang.kdanak,
        },
      });
    } else {
      if (req.kdsatker !== cabang.kdsatker)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Cabangsatker.destroy({
        where: {
          [Op.and]: [{ kdanak: cabang.kdanak }, { kdsatker: req.kdsatker }],
        },
      });
    }
    res.status(200).json({ msg: "Data Satuan Kerja Cabang Universitas berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
