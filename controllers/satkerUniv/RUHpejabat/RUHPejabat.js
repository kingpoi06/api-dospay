import Satkeruniv from "../../../models/satkerUniv/SatkerUnivModel.js";
import RUHPejabat from "../../../models/satkerUniv/RUHpejabat/RuhPejabatModel.js";
import { Op } from "sequelize";


export const getPejabat = async (req, res) => {
  try {
    let response;
    if (req.role === "pusat" || req.role === "admin" ) {
      response = await RUHPejabat.findAll({
        attributes: [
          "nip",
          "nik",
          "nmpeg",
          "kdjab",
          "nmjab",
          "kdduduk",
          "nmduduk",
          "jurubayar",
          "createdAt",
        ],
        include: [
          {
            model: Satkeruniv,
            attributes: ["kdsatker", "nmsatker"],
          },
        ],
      });
    } else {
      response = await RUHPejabat.findAll({
        attributes: [
          "nip",
          "nik",
          "nmpeg",
          "kdjab",
          "nmjab",
          "kdduduk",
          "nmduduk",
          "jurubayar",
          "createdAt",
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

export const getPejabatByNip = async (req, res) => {
  try {
    const pejabat = await RUHPejabat.findOne({
      where: {
        nip: req.params.nip,
      },
    });
    if (!pejabat) return res.status(404).json({ msg: "Data not found!" });
    let response;
    if (req.role === "pusat" || req.role === "admin" ) {
      response = await RUHPejabat.findOne({
        attributes: [
          "nip",
          "nik",
          "nmpeg",
          "kdjab",
          "nmjab",
          "kdduduk",
          "nmduduk",
          "jurubayar",
          "createdAt",
        ],
        where: {
          nip: pejabat.nip,
        },
        include: [
          {
            model: Satkeruniv,
            attributes: ["kdsatker", "nmsatker"],
          },
        ],
      });
    } else {
      response = await RUHPejabat.findOne({
        attributes: [
          "nip",
          "nik",
          "nmpeg",
          "kdjab",
          "nmjab",
          "kdduduk",
          "nmduduk",
          "jurubayar",
          "createdAt",
        ],
        where: {
          [Op.and]: [{ nip: pejabat.nip }, { kdsatker: req.kdsatker }],
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

export const createPejabat = async (req, res) => {
  const { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar, kdsatker  } = req.body;
  try {
    await RUHPejabat.create({
      nip: nip,
      nik: nik,
      nmpeg: nmpeg,
      kdjab: kdjab,
      nmjab: nmjab,
      kdduduk: kdduduk,
      nmduduk: nmduduk,
      jurubayar: jurubayar,
      kdsatker: kdsatker,
      satkerunivKdsatker: kdsatker,
    });
    res.status(201).json({ msg: "Data RUH pejabat Berhasil Ditambahkan!" });
  } catch (error) {
    console.error("Error creating RUH PEJABAT:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updatePejabat = async (req, res) => {
  try {
    const pejabat = await RUHPejabat.findOne({
      where: {
        nip: req.params.nip,
      },
    });
    if (!pejabat) return res.status(404).json({ msg: "Data not found!" });
    const { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar } = req.body;
    if (req.role === "pusat" || req.role === "admin" ) {
      await RUHPejabat.update(
        { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar },
        {
          where: {
            nip: pejabat.nip,
          },
        }
      );
    } else {
      if (req.kdsatker !== pejabat.kdsatker)
        return res.status(403).json({ msg: "Access X" });
      await RUHPejabat.update(
        { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar },
        {
          where: {
            [Op.and]: [{ nip: pejabat.nip }, { kdsatker: req.kdsatker }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data RUH pejabat Universitas berhasil di perbaharui!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePejabat = async (req, res) => {
  try {
    const pejabat = await RUHPejabat.findOne({
      where: {
        nip: req.params.nip,
      },
    });
    if (!pejabat) return res.status(404).json({ msg: "Data not found!" });
    const { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar } = req.body;
    if (req.role === "pusat" || req.role === "admin" ) {
      await RUHPejabat.destroy({
        where: {
          nip: pejabat.nip,
        },
      });
    } else {
      if (req.kdsatker !== pejabat.kdsatker)
        return res.status(403).json({ msg: "Akses terlarang" });
      await RUHPejabat.destroy({
        where: {
          [Op.and]: [{ nip: pejabat.nip }, { kdsatker: req.kdsatker }],
        },
      });
    }
    res.status(200).json({ msg: "Data RUH pejabat Universitas berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
