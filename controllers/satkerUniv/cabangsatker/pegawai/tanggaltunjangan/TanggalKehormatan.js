import Cabangsatker from "../../../../../models/satkerUniv/cabang/CabangSatkerModel.js";
import Tanggalkehormatan from "../../../../../models/satkerUniv/cabang/pegawai/tanggaltunjangan/TanggalkehormatanModel.js";
import Satkeruniv from "../../../../../models/satkerUniv/SatkerUnivModel.js"
import { Op } from "sequelize";


export const getTanggalkehormatan = async (req, res) => {
  try {
    let response;
    if (req.role === "cabang" || req.role === "admin" ) {
      response = await Tanggalkehormatan.findAll({
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
      response = await Tanggalkehormatan.findAll({
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
      message: `Data Tanggal Tunjangan Kehormatan Pegawai`,
      Data: [response], 
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTanggalkehormatanByKDtunjangan = async (req, res) => {
  try {
    const kehormatan = await Tanggalkehormatan.findOne({
      where: {
        kdtunjangan: req.params.kdtunjangan,
      },
    });
    if (!kehormatan) return res.status(404).json({ msg: "Data not found!" });
    let response;
    if (req.role === "cabang" || req.role === "admin" ) {
      response = await Tanggalkehormatan.findOne({
        where: {
          kdtunjangan: kehormatan.kdtunjangan,
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
      response = await Tanggalkehormatan.findOne({
        where: {
          [Op.and]: [{ kdtunjangan: kehormatan.kdtunjangan }, { kdanak: req.kdanak }],
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
      message: `Data Tanggal Tunjangan Kehormatan Pegawai Kode Tunjangan ${req.params.kdtunjangan}`,
      Data: [response], 
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTanggalkehormatan = async (req, res) => {
  const { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak } = req.body;
  const role = "cabang";

  try {
    await Tanggalkehormatan.create({
      kdtunjangan: kdtunjangan,
      bulan: bulan,
      tahun: tahun,
      tanggal: tanggal,
      keterangan: keterangan,
      kdanak: kdanak,
      cabangsatkerKdanak: kdanak,
    });
    res.status(201).json({ msg: "Data Tanggal Tunjangan Kehormatan Berhasil Ditambahkan!" });
  } catch (error) {
    console.error("Error creating Tanggal Kehormatan:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateTanggalkehormatan = async (req, res) => {
  try {
    const kehormatan = await Tanggalkehormatan.findOne({
      where: {
        kdtunjangan: req.params.kdtunjangan,
      },
    });
    if (!kehormatan) return res.status(404).json({ msg: "Data not found!" });
    const { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak } = req.body;
    if (req.role === "cabang" || req.role === "admin" ) {
      await Tanggalkehormatan.update(
        { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak, cabangsatkerKdanak: kdanak, },
        {
          where: {
            kdtunjangan: kehormatan.kdtunjangan,
          },
        }
      );
    } else {
      if (req.kdtunjangan !== kehormatan.kdtunjangan)
        return res.status(403).json({ msg: "Access Failed!" });
      await Tanggalkehormatan.update(
        { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak, cabangsatkerKdanak: kdanak, },
        {
          where: {
            [Op.and]: [{ kdtunjangan: kehormatan.kdtunjangan }, { kdanak: req.kdanak }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Tanggal Tunjangan Kehormatan berhasil di perbaharui!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTanggalkehormatan = async (req, res) => {
  try {
    const kehormatan = await Tanggalkehormatan.findOne({
      where: {
        kdtunjangan: req.params.kdtunjangan,
      },
    });
    if (!kehormatan) return res.status(404).json({ msg: "Data not found!" });
    const { kdtunjangan, bulan, tahun, tanggal, keterangan, kdanak } = req.body;
    if (req.role === "cabang" || req.role === "admin" ) {
      await Tanggalkehormatan.destroy({
        where: {
          kdtunjangan: kehormatan.kdtunjangan,
        },
      });
    } else {
      if (req.kdtunjangan !== kehormatan.kdtunjangan)
        return res.status(403).json({ msg: "Akses Failed!" });
      await Tanggalkehormatan.destroy({
        where: {
          [Op.and]: [{ kdtunjangan: kehormatan.kdtunjangan }, { kdanak: req.kdanak }],
        },
      });
    }
    res.status(200).json({ msg: "Data Tanggal Tunjangan Kehormatan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
