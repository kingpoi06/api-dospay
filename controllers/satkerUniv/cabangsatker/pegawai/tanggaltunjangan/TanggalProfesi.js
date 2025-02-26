import Cabangsatker from "../../../../../models/satkerUniv/cabang/CabangSatkerModel.js";
import Tanggalprofesi from "../../../../../models/satkerUniv/cabang/pegawai/tanggaltunjangan/TanggalprofesiModel.js";
import Satkeruniv from "../../../../../models/satkerUniv/SatkerUnivModel.js"
import { Op } from "sequelize";


export const getTanggalprofesi = async (req, res) => {
  try {
    let response;
    if (req.role === "cabang" || req.role === "admin" ) {
      response = await Tanggalprofesi.findAll({
        include: [
            {
              model: Cabangsatker,
              attributes: ["kdanak", "nmanak"],
              include:[
                  {
                      model: Satkeruniv,
                      attributes: ["kdsatker", "nmsatker"],
                  }
              ],
            },
          ],
      });
    } else {
      response = await Tanggalprofesi.findAll({
        where: {
            kdanak: req.kdanak,
        },
        include: [
            {
              model: Cabangsatker,
              attributes: ["kdanak", "nmanak"],
              include:[
                  {
                      model: Satkeruniv,
                      attributes: ["kdsatker", "nmsatker"],
                  }
              ],
            },
          ],
      });
    }
    res.status(200).json({
      message: `Data Tanggal Tunjangan Profesi Pegawai`,
      Data: [response], 
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTanggalprofesiByKDtunjangan = async (req, res) => {
  try {
    const profesi = await Tanggalprofesi.findOne({
      where: {
        kdtunjangan: req.params.kdtunjangan,
      },
    });
    if (!profesi) return res.status(404).json({ msg: "Data not found!" });
    let response;
    if (req.role === "cabang" || req.role === "admin" ) {
      response = await Tanggalprofesi.findOne({
        where: {
          kdtunjangan: profesi.kdtunjangan,
        },
        include: [
            {
              model: Cabangsatker,
              attributes: ["kdanak", "nmanak"],
              include:[
                  {
                      model: Satkeruniv,
                      attributes: ["kdsatker", "nmsatker"],
                  }
              ],
            },
          ],
      });
    } else {
      response = await Tanggalprofesi.findOne({
        where: {
          [Op.and]: [{ kdtunjangan: profesi.kdtunjangan }, { kdanak: req.kdanak }],
        },
        include: [
            {
              model: Cabangsatker,
              attributes: ["kdanak", "nmanak"],
              include:[
                  {
                      model: Satkeruniv,
                      attributes: ["kdsatker", "nmsatker"],
                  }
              ],
            },
          ],
      });
    }
    res.status(200).json({
      message: `Data Tanggal Tunjangan Profesi Pegawai dengan Kode Tunjangan ${req.params.kdtunjangan}`,
      Data: [response], 
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTanggalprofesi = async (req, res) => {
  const { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak } = req.body;
  const role = "cabang";

  try {
    await Tanggalprofesi.create({
      kdtunjangan: kdtunjangan,
      bulan: bulan,
      tahun: tahun,
      tanggal: tanggal,
      keterangan: keterangan,
      kdanak: kdanak,
      cabangsatkerKdanak: kdanak,
    });
    res.status(201).json({ msg: "Data Tanggal Tunjangan Profesi Berhasil Ditambahkan!" });
  } catch (error) {
    console.error("Error creating Tanggal Profesi:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateTanggalprofesi = async (req, res) => {
  try {
    const profesi = await Tanggalprofesi.findOne({
      where: {
        kdtunjangan: req.params.kdtunjangan,
      },
    });
    if (!profesi) return res.status(404).json({ msg: "Data not found!" });
    const { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak } = req.body;
    if (req.role === "cabang" || req.role === "admin" ) {
      await Tanggalprofesi.update(
        { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak, cabangsatkerKdanak: kdanak, },
        {
          where: {
            kdtunjangan: profesi.kdtunjangan,
          },
        }
      );
    } else {
      if (req.kdtunjangan !== profesi.kdtunjangan)
        return res.status(403).json({ msg: "Access Failed!" });
      await Tanggalprofesi.update(
        { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak, cabangsatkerKdanak: kdanak, },
        {
          where: {
            [Op.and]: [{ kdtunjangan: profesi.kdtunjangan }, { kdanak: req.kdanak }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Tanggal Tunjangan Profesi berhasil di perbaharui!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTanggalprofesi = async (req, res) => {
  try {
    const profesi = await Tanggalprofesi.findOne({
      where: {
        kdtunjangan: req.params.kdtunjangan,
      },
    });
    if (!profesi) return res.status(404).json({ msg: "Data not found!" });
    const { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak } = req.body;
    if (req.role === "cabang" || req.role === "admin" ) {
      await Tanggalprofesi.destroy({
        where: {
          kdtunjangan: profesi.kdtunjangan,
        },
      });
    } else {
      if (req.kdtunjangan !== profesi.kdtunjangan)
        return res.status(403).json({ msg: "Akses Failed!" });
      await Tanggalprofesi.destroy({
        where: {
          [Op.and]: [{ kdtunjangan: profesi.kdtunjangan }, { kdanak: req.kdanak }],
        },
      });
    }
    res.status(200).json({ msg: "Data Tanggal Tunjangan Profesi berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
