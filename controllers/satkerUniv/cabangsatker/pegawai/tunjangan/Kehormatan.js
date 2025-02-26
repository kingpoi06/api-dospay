import TunjanganKehormatan from "../../../../../models/satkerUniv/cabang/pegawai/tunjangan/KehormatanModel.js";
import Cabangsatker from "../../../../../models/satkerUniv/cabang/CabangSatkerModel.js";
import Satkeruniv from "../../../../../models/satkerUniv/SatkerUnivModel.js";
import Tanggalkehormatan from "../../../../../models/satkerUniv/cabang/pegawai/tanggaltunjangan/TanggalkehormatanModel.js";
import { Op } from "sequelize";


export const getTunjangankehormatan = async (req, res) => {
    try {
        let response;
        const includeOptions = [
            {
                model: Tanggalkehormatan,
                attributes: ["kdtunjangan"],
                include: [
                    {
                        model: Cabangsatker,
                        attributes: ["kdanak", "nmanak"],
                        include: [
                            {
                                model: Satkeruniv,
                                attributes: ["kdsatker", "nmsatker"]
                            }
                        ]
                    }
                ]
            }
        ];

        if (req.role === "cabang" || req.role === "admin") {
            response = await TunjanganKehormatan.findAll({
                include: includeOptions,
            });
        } else {
            if (!req.kdtunjangan) {
                return res.status(400).json({ msg: "Parameter kdtunjangan diperlukan!" });
            }
            response = await TunjanganKehormatan.findAll({
                where: { kdtunjangan: req.kdtunjangan },
                include: includeOptions,
            });
        }

        res.status(200).json({
            message: `Data Tunjangan Kehormatan Pegawai`,
            Data: [response], 
          });
    } catch (error) {
        console.error("Error fetching Tunjangan Kehormatan:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const getTunjangankehormatanByNip = async (req, res) => {
    try {
        const includeOptions = [
            {
                model: Tanggalkehormatan,
                attributes: ["kdtunjangan"],
                include: [
                    {
                        model: Cabangsatker,
                        attributes: ["kdanak", "nmanak"],
                        include: [
                            {
                                model: Satkeruniv,
                                attributes: ["kdsatker", "nmsatker"]
                            }
                        ]
                    }
                ]
            }
        ];

        let whereCondition = { nip: req.params.nip };

        if (req.role !== "cabang" && req.role !== "admin") {
            if (!req.kdtunjangan) {
                return res.status(400).json({ msg: "Parameter kdtunjangan diperlukan!" });
            }
            whereCondition = { 
                [Op.and]: [{ nip: req.params.nip }, { kdtunjangan: req.kdtunjangan }] 
            };
        }

        const response = await TunjanganKehormatan.findOne({
            where: whereCondition,
            include: includeOptions
        });

        if (!response) {
            return res.status(404).json({ msg: "Data not found!" });
        }

        res.status(200).json({
            message: `Data Tunjangan Kehormatan dengan NIP ${req.params.nip}`,
            Data: [response], 
          });
    } catch (error) {
        console.error("Error fetching Tunjangan Kehormatan by NIP:", error);
        res.status(500).json({ msg: error.message });
    }
};

      export const createTunjangankehormatan = async (req, res) => {
        const { kdtunjangan, pegawai } = req.body;
    
        try {
            if (!Array.isArray(pegawai) || pegawai.length === 0) {
                return res.status(400).json({ msg: "Data pegawai harus berupa array dan tidak boleh kosong!" });
            }
    
            // Proses setiap pegawai
            const dataToInsert = pegawai.map(({ nmpeg, nip, kdgol, gjpokok }) => {
                if (!gjpokok || isNaN(gjpokok)) {
                    throw new Error(`Gaji pokok untuk pegawai ${nmpeg} harus diisi dan berupa angka!`);
                }
    
                if (!kdgol || isNaN(kdgol)) {
                    throw new Error(`Kode golongan untuk pegawai ${nmpeg} harus diisi dan berupa angka!`);
                }
    
                const kdgolNum = parseInt(kdgol, 10);
                const pajakPersentase = kdgolNum < 4 ? 0.05 : 0.15;
                const besartunjangan = gjpokok * 2;
                const totalpph = gjpokok * pajakPersentase;
                const jmlditerima = (gjpokok - totalpph) + besartunjangan;
    
                return {
                    nmpeg,
                    nip,
                    kdgol: kdgolNum,
                    gjpokok,
                    besartunjangan,
                    pajakpph: pajakPersentase * 100,
                    totalpph,
                    jmlditerima,
                    kdtunjangan,
                    tanggalkehormatanKdtunjangan: kdtunjangan,
                };
            });
    
            // Simpan semua data sekaligus menggunakan bulkCreate
            await TunjanganKehormatan.bulkCreate(dataToInsert);
    
            res.status(201).json({ msg: `Data Tunjangan Kehormatan berhasil ditambahkan untuk ${pegawai.length} pegawai!` });
        } catch (error) {
            console.error("Error creating Tunjangan Kehormatan:", error);
            res.status(500).json({ msg: error.message });
        }
    };
    
    export const updateTunjangankehormatan = async (req, res) => {
        try {
            const { kdtunjangan, pegawai } = req.body;
    
            if (!Array.isArray(pegawai) || pegawai.length === 0) {
                return res.status(400).json({ msg: "Data pegawai harus berupa array dan tidak boleh kosong!" });
            }
    
            const nips = pegawai.map(p => p.nip).filter(nip => nip); 
    
            // Ambil pegawai yang sudah ada dalam database
            const existingData = await TunjanganKehormatan.findAll({
                where: { nip: nips },
            });
    
            // Pisahkan pegawai yang akan diupdate dan yang harus ditambahkan
            const existingNIPs = existingData.map(p => p.nip);
            const toUpdate = [];
            const toInsert = [];
    
            pegawai.forEach(({ nmpeg, nip, kdgol, gjpokok }) => {
                if (!gjpokok || isNaN(gjpokok)) {
                    throw new Error(`Gaji pokok untuk pegawai ${nmpeg} harus diisi dan berupa angka!`);
                }
    
                if (!kdgol || isNaN(kdgol)) {
                    throw new Error(`Kode golongan untuk pegawai ${nmpeg} harus diisi dan berupa angka!`);
                }
    
                const kdgolNum = parseInt(kdgol, 10);
                const pajakPersentase = kdgolNum < 4 ? 0.05 : 0.15;
                const besartunjangan = gjpokok * 2;
                const totalpph = gjpokok * pajakPersentase;
                const jmlditerima = (gjpokok - totalpph) + besartunjangan;
    
                const data = {
                    nmpeg,
                    nip,
                    kdgol: kdgolNum,
                    gjpokok,
                    besartunjangan,
                    pajakpph: pajakPersentase * 100,
                    totalpph,
                    jmlditerima,
                    kdtunjangan,
                    tanggalkehormatanKdtunjangan: kdtunjangan,
                };
    
                if (existingNIPs.includes(nip)) {
                    toUpdate.push({ nip, ...data });
                } else {
                    toInsert.push(data);
                }
            });
    
            // Update pegawai yang sudah ada
            await Promise.all(toUpdate.map(({ nip, ...data }) =>
                TunjanganKehormatan.update(data, { where: { nip } })
            ));
    
            // Tambahkan pegawai baru
            if (toInsert.length > 0) {
                await TunjanganKehormatan.bulkCreate(toInsert);
            }
    
            res.status(200).json({ 
                msg: `Data Tunjangan Kehormatan berhasil diperbarui untuk ${toUpdate.length} pegawai dan ditambahkan untuk ${toInsert.length} pegawai baru!` 
            });
    
        } catch (error) {
            console.error("Error updating/adding Tunjangan Kehormatan:", error);
            res.status(500).json({ msg: error.message });
        }
    };
    
      
      export const deleteTunjangankehormatan = async (req, res) => {
        try {
          const kehormatan = await TunjanganKehormatan.findOne({
            where: {
                nip: req.params.nip,
            },
          });
          if (!pegawai) return res.status(404).json({ msg: "Data not found!" });
          const { 
              nmpeg, 
              nip,
              kdgol, 
              gjpokok,
              besartunjangan,
              pajakpph,
              totalpph,
              jmlditerima, 
              kdtunjangan,
              tanggalkehormatanKdtunjangan,
           } = req.body;
          if (req.role === "cabang" || req.role === "admin" ) {
            await TunjanganKehormatan.destroy({
              where: {
                nip: kehormatan.nip,
              },
            });
          } else {
            if (req.kdtunjangan !== kehormatan.kdtunjangan)
              return res.status(403).json({ msg: "Akses Ditolak!" });
            await TunjanganKehormatan.destroy({
              where: {
                [Op.and]: [{ nip: kehormatan.nip }, { kdtunjangan: req.kdtunjangan }],
              },
            });
          }
          res.status(200).json({ msg: "Data Tunjangan Kehormatan berhasil dihapus!" });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      };
      