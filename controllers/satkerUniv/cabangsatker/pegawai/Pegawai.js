import Pegawai from "../../../../models/satkerUniv/cabang/pegawai/PegawaiModel.js";
import Cabangsatker from "../../../../models/satkerUniv/cabang/CabangSatkerModel.js";
import Satkeruniv from "../../../../models/satkerUniv/SatkerUnivModel.js";
import { Op } from "sequelize";


export const getPegawai = async (req, res) => {
    try {
        let response;
        
        if (req.role === "cabang" || req.role === "admin") {
          response = await Pegawai.findAll({
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
          response = await Pegawai.findAll({
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
          message: `Data PEGAWAI!`,
          Data: [response],
        });
        
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    };

    export const getPegawaiByNip = async (req, res) => {
        try {
          const pegawai = await Pegawai.findOne({
            where: {
              nip: req.params.nip,
            },
          });
          if (!pegawai) return res.status(404).json({ msg: "Data not found!" });
          let response;
          if (req.role === "cabang" || req.role === "admin") {
            response = await Pegawai.findOne({
              where: {
                nip: pegawai.nip,
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
            response = await Pegawai.findOne({
              where: {
                [Op.and]: [{ nip: pegawai.nip }, { kdanak: req.kdanak }],
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
            message: `Data PEGAWAI dengan NIP ${req.params.nip}`,
            Data: [response],
          });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      };

      export const createPegawai = async (req, res) => {
        const { 
              nmpeg, 
              nip,
              kdjab, 
              kdkawin, 
              gaji_bersih, 
              nogaji, 
              bulan, 
              tahun, 
              kdgol, 
              kdduduk, 
              npwp, 
              nmrek, 
              nm_bank, 
              rekening, 
              kdbankspan, 
              nmbankspan, 
              kdnegara, 
              kdkppn,
              kdpos,
              gjpokok, 
              kdgapok, 
              bpjs, 
              kdanak,
        } = req.body;
      
        try {
          await Pegawai.create({
              nmpeg: nmpeg,
              nip: nip,
              kdjab: kdjab,
              kdkawin: kdkawin,
              gaji_bersih: gaji_bersih,
              nogaji: nogaji,
              bulan: bulan,
              tahun: tahun,
              kdgol: kdgol,
              kdduduk: kdduduk,
              npwp: npwp,
              nmrek: nmrek,
              nm_bank: nm_bank,
              rekening: rekening,
              kdbankspan: kdbankspan,
              nmbankspan: nmbankspan,
              kdnegara: kdnegara,
              kdkppn: kdkppn,
              kdpos: kdpos,
              gjpokok: gjpokok,
              kdgapok: kdgapok,
              bpjs: bpjs,
              kdanak: kdanak,
              cabangsatkerKdanak: kdanak,
          });
          res.status(201).json({ msg: "Data Pegawai Berhasil Ditambahkan!" });
        } catch (error) {
          console.error("Error creating Pegawai:", error);
          res.status(500).json({ msg: error.message });
        }
      };
      
      export const updatePegawai = async (req, res) => {
        try {
          const pegawai = await Pegawai.findOne({
            where: {
              nip: req.params.nip,
            },
          });
          if (!pegawai) return res.status(404).json({ msg: "Data not found!" });
          const { 
            nmpeg, 
              nip,
              kdjab, 
              kdkawin, 
              gaji_bersih, 
              nogaji, 
              bulan, 
              tahun, 
              kdgol, 
              kdduduk, 
              npwp, 
              nmrek, 
              nm_bank, 
              rekening, 
              kdbankspan, 
              nmbankspan, 
              kdnegara, 
              kdkppn,
              kdpos,
              gjpokok, 
              kdgapok, 
              bpjs, 
           } = req.body;
          if (req.role === "cabang" || req.role === "admin" ) {
            await Pegawai.update(
              { 
                nmpeg, 
                nip,
                kdjab, 
                kdkawin, 
                gaji_bersih, 
                nogaji, 
                bulan, 
                tahun, 
                kdgol, 
                kdduduk, 
                npwp, 
                nmrek, 
                nm_bank, 
                rekening, 
                kdbankspan, 
                nmbankspan, 
                kdnegara, 
                kdkppn,
                kdpos,
                gjpokok, 
                kdgapok, 
                bpjs, 
               },
              {
                where: {
                  nip: pegawai.nip,
                },
              }
            );
          } else {
            if (req.kdanak !== pegawai.kdanak)
              return res.status(403).json({ msg: "Access X" });
            await Pegawai.update(
              { 
                nmpeg, 
                nip,
                kdjab, 
                kdkawin, 
                gaji_bersih, 
                nogaji, 
                bulan, 
                tahun, 
                kdgol, 
                kdduduk, 
                npwp, 
                nmrek, 
                nm_bank, 
                rekening, 
                kdbankspan, 
                nmbankspan, 
                kdnegara, 
                kdkppn,
                kdpos,
                gjpokok, 
                kdgapok, 
                bpjs, 
               },
              {
                where: {
                  [Op.and]: [{ nip: pegawai.nip }, { kdanak: req.kdanak }],
                },
              }
            );
          }
          res.status(200).json({ msg: "Data Pegawai berhasil di perbaharui!" });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      };
      
      export const deletePegawai = async (req, res) => {
        try {
          const pegawai = await Pegawai.findOne({
            where: {
              nip: req.params.nip,
            },
          });
          if (!pegawai) return res.status(404).json({ msg: "Data not found!" });
          const { 
            nmpeg, 
                nip,
                kdjab, 
                kdkawin, 
                gaji_bersih, 
                nogaji, 
                bulan, 
                tahun, 
                kdgol, 
                kdduduk, 
                npwp, 
                nmrek, 
                nm_bank, 
                rekening, 
                kdbankspan, 
                nmbankspan, 
                kdnegara, 
                kdkppn,
                kdpos,
                gjpokok, 
                kdgapok, 
                bpjs, 
           } = req.body;
          if (req.role === "cabang" || req.role === "admin" ) {
            await Pegawai.destroy({
              where: {
                nip: pegawai.nip,
              },
            });
          } else {
            if (req.kdanak !== pegawai.kdanak)
              return res.status(403).json({ msg: "Akses terlarang" });
            await Pegawai.destroy({
              where: {
                [Op.and]: [{ nip: pegawai.nip }, { kdanak: req.kdanak }],
              },
            });
          }
          res.status(200).json({ msg: "Data Pegawai berhasil dihapus!" });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      };
      