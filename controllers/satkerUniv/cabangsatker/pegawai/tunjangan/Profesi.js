import TunjanganProfesi from "../../../../../models/satkerUniv/cabang/pegawai/tunjangan/ProfesiModel.js";
import Cabangsatker from "../../../../../models/satkerUniv/cabang/CabangSatkerModel.js";
import Satkeruniv from "../../../../../models/satkerUniv/SatkerUnivModel.js";
import TanggalProfesi from "../../../../../models/satkerUniv/cabang/pegawai/tanggaltunjangan/TanggalprofesiModel.js";
import { Op } from "sequelize";


export const getTunjanganprofesi = async (req, res) => {
    try {
        let response;
        const includeOptions = [
            {
                model: TanggalProfesi,
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
            response = await TunjanganProfesi.findAll({
                include: includeOptions,
            });
        } else {
            if (!req.kdtunjangan) {
                return res.status(400).json({ msg: "Parameter kdtunjangan diperlukan!" });
            }
            response = await TunjanganProfesi.findAll({
                where: { kdtunjangan: req.kdtunjangan },
                include: includeOptions,
            });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching Tunjangan Profesi:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const getTunjanganprofesiByNip = async (req, res) => {
    try {
        const includeOptions = [
            {
                model: TanggalProfesi,
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

        const response = await TunjanganProfesi.findOne({
            where: whereCondition,
            include: includeOptions
        });

        if (!response) {
            return res.status(404).json({ msg: "Data not found!" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching Tunjangan Profesi by NIP:", error);
        res.status(500).json({ msg: error.message });
    }
};

      export const createTunjanganprofesi = async (req, res) => {
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
                const totalpph = gjpokok * pajakPersentase;
                const jmlditerima = gjpokok - totalpph;
    
                return {
                    nmpeg,
                    nip,
                    kdgol: kdgolNum,
                    gjpokok,
                    pajakpph: pajakPersentase * 100,
                    totalpph,
                    jmlditerima,
                    kdtunjangan,
                    tanggalprofesiKdtunjangan: kdtunjangan,
                };
            });
    
            await TunjanganProfesi.bulkCreate(dataToInsert);
    
            res.status(201).json({ msg: `Data Tunjangan Profesi berhasil ditambahkan untuk ${pegawai.length} pegawai!` });
        } catch (error) {
            console.error("Error creating Tunjangan Profesi:", error);
            res.status(500).json({ msg: error.message });
        }
    };
    
    export const updateTunjanganprofesi = async (req, res) => {
        try {
            const { kdtunjangan, pegawai } = req.body;
    
            if (!Array.isArray(pegawai) || pegawai.length === 0) {
                return res.status(400).json({ msg: "Data pegawai harus berupa array dan tidak boleh kosong!" });
            }
    
            const nips = pegawai.map(p => p.nip).filter(nip => nip); 
    
            // Ambil pegawai yang sudah ada dalam database
            const existingData = await TunjanganProfesi.findAll({
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
                const totalpph = gjpokok * pajakPersentase;
                const jmlditerima = gjpokok - totalpph;
    
                const data = {
                    nmpeg,
                    nip,
                    kdgol: kdgolNum,
                    gjpokok,
                    pajakpph: pajakPersentase * 100,
                    totalpph,
                    jmlditerima,
                    kdtunjangan,
                    tanggalprofesiKdtunjangan: kdtunjangan,
                };
    
                if (existingNIPs.includes(nip)) {
                    toUpdate.push({ nip, ...data });
                } else {
                    toInsert.push(data);
                }
            });
    
            // Update pegawai yang sudah ada
            await Promise.all(toUpdate.map(({ nip, ...data }) =>
                TunjanganProfesi.update(data, { where: { nip } })
            ));
    
            // Tambahkan pegawai baru
            if (toInsert.length > 0) {
                await TunjanganProfesi.bulkCreate(toInsert);
            }
    
            res.status(200).json({ 
                msg: `Data Tunjangan Profesi berhasil diperbarui untuk ${toUpdate.length} pegawai dan ditambahkan untuk ${toInsert.length} pegawai baru!` 
            });
    
        } catch (error) {
            console.error("Error updating/adding Tunjangan Profesi:", error);
            res.status(500).json({ msg: error.message });
        }
    };
    
      
      export const deleteTunjanganprofesi = async (req, res) => {
        try {
          const profesi = await TunjanganProfesi.findOne({
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
              pajakpph,
              totalpph,
              jmlditerima, 
              kdtunjangan,
              tanggalprofesiKdtunjangan,
           } = req.body;
          if (req.role === "cabang" || req.role === "admin" ) {
            await TunjanganProfesi.destroy({
              where: {
                nip: profesi.nip,
              },
            });
          } else {
            if (req.kdtunjangan !== profesi.kdtunjangan)
              return res.status(403).json({ msg: "Akses Ditolak!" });
            await TunjanganProfesi.destroy({
              where: {
                [Op.and]: [{ nip: profesi.nip }, { kdtunjangan: req.kdtunjangan }],
              },
            });
          }
          res.status(200).json({ msg: "Data Tunjangan Profesi berhasil dihapus!" });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      };
      