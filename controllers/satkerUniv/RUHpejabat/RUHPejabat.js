import CabangSatker from "../../../models/satkerUniv/cabang/CabangSatkerModel.js";
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
          "kdanak",
        ],
        include: [
          {
            model: CabangSatker,
            attributes: ["kdanak", "nmanak"],
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
          "kdanak",
        ],
        where: {
            kdanak: req.kdanak,
        },
        include: [
          {
            model: CabangSatker,
            attributes: ["kdanak", "nmanak"],
          },
        ],
      });
    }
    res.status(200).json({
      message: `Data RUH PEJABAT`,
      Data: [response], 
    });
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
          "kdanak",
        ],
        where: {
          nip: pejabat.nip,
        },
        include: [
          {
            model: CabangSatker,
            attributes: ["kdanak", "kdanak"],
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
          "kdanak",
        ],
        where: {
          [Op.and]: [{ nip: pejabat.nip }, { kdanak: req.kdanak }],
        },
        include: [
          {
            model: CabangSatker,
            attributes: ["kdanak", "nmanak"],
          },
        ],
      });
    }
    res.status(200).json({
      message: `Data RUH PEJABAT dengan NIP ${req.params.nip}`,
      Data: [response], 
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPejabat = async (req, res) => {
  const { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar, kdanak  } = req.body;
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
      kdanak: kdanak,
      cabangsatkerKdanak: kdanak,
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
    const { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar, kdanak } = req.body;
    if (req.role === "pusat" || req.role === "admin" ) {
      await RUHPejabat.update(
        { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar, kdanak },
        {
          where: {
            nip: pejabat.nip,
          },
        }
      );
    } else {
      if (req.kdanak !== pejabat.kdanak)
        return res.status(403).json({ msg: "Access X" });
      await RUHPejabat.update(
        { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar, kdanak },
        {
          where: {
            [Op.and]: [{ nip: pejabat.nip }, { kdanak: req.kdanak }],
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
    const { nip, nik, nmpeg, kdjab, nmjab, kdduduk, nmduduk, jurubayar, kdanak } = req.body;
    if (req.role === "pusat" || req.role === "admin" ) {
      await RUHPejabat.destroy({
        where: {
          nip: pejabat.nip,
        },
      });
    } else {
      if (req.kdanak !== pejabat.kdanak)
        return res.status(403).json({ msg: "Akses terlarang" });
      await RUHPejabat.destroy({
        where: {
          [Op.and]: [{ nip: pejabat.nip }, { kdanak: req.kdanak }],
        },
      });
    }
    res.status(200).json({ msg: "Data RUH pejabat Universitas berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
