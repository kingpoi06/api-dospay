import Restorepegawai from "../../../../models/satkerUniv/cabang/pegawai/RestorePegawaiModel.js";
import Pegawai from "../../../../models/satkerUniv/cabang/pegawai/PegawaiModel.js";
import Cabangsatker from "../../../../models/satkerUniv/cabang/CabangSatkerModel.js";
import Satkeruniv from "../../../../models/satkerUniv/SatkerUnivModel.js";
import { Readable } from 'stream';
import cloudinary from "../../../../middleware/cloudinary.js";
// import multer from "multer";
import * as XLSX from "xlsx";
import { Op } from "sequelize";
import { bucket } from "../../../../middleware/firebaseConfig.js";
import { format } from "date-fns";


export const getRestorePegawai = async (req, res) => {
    try {
        let response;
        if (req.role === "cabang" || req.role === "admin") {
          response = await Restorepegawai.findAll({
            attributes: [
              "uuid",
              "bulan",
              "tahun",
              "filerestore",
            ],
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
          response = await Restorepegawai.findAll({
            attributes: [
              "uuid",
              "bulan",
              "tahun",
              "filerestore",
            ],
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
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    };

export const getRestorepegawaiByUuid = async (req, res) => {
        try {
          const restore = await Restorepegawai.findOne({
            where: {
              uuid: req.params.uuid,
            },
          });
          if (!restore) return res.status(404).json({ msg: "Data not found!" });
          let response;
          if (req.role === "cabang" || req.role === "admin") {
            response = await Restorepegawai.findOne({
              attributes: [
              "uuid",
              "bulan",
              "tahun",
              "filerestore",
            ],
              where: {
                id: restore.id,
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
            response = await Restorepegawai.findOne({
              attributes: [
              "uuid",
              "bulan",
              "tahun",
              "filerestore",
              ],
              where: {
                [Op.and]: [{ id: restore.id }, { kdanak: req.kdanak }],
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
          res.status(200).json(response);
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      };


      export const createRestorepegawai = async (req, res) => {
        const { bulan, tahun, kdanak } = req.body;
      
        try {
          // Validasi apakah file ada
          if (!req.file) {
            return res.status(400).json({ msg: "File wajib diunggah!" });
          }
      
          // Cek apakah file yang diunggah adalah file .xlsx
          if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return res.status(400).json({ msg: "Hanya file .xlsx yang diperbolehkan!" });
          }
      
          // Membaca file Excel
          const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
          // Validasi apakah file kosong
          if (worksheet.length === 0) {
            return res.status(400).json({ msg: "File Excel kosong atau format salah" });
          }
      
          // Proses upload file ke Firebase Storage
          const file = req.file;
          const fileName = `xlsx/${format(new Date(), "yyyyMMdd_HHmmss")}_${file.originalname}`;
          const fileUpload = bucket.file(fileName);
      
          const stream = fileUpload.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });
      
          stream.on("error", (err) => {
            console.error("Upload Error:", err);
            return res.status(500).json({ msg: "Gagal mengunggah file ke Firebase" });
          });
      
          stream.on("finish", async () => {
            // Buat URL akses file
            await fileUpload.makePublic(); // Jika ingin file bisa diakses publik
            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
            // Simpan data Restorepegawai ke database dengan URL file
            await Restorepegawai.create({
              bulan: bulan,
              tahun: tahun,
              filerestore: fileUrl, // Simpan URL file di field filerestore
              kdanak: kdanak,
              cabangsatkerKdanak: kdanak,
            });
      
            // Memproses dan menyimpan data Pegawai dari Excel ke database
            const pegawaiData = worksheet.map((row) => ({
              nmpeg: row.nmpeg || "Unknown",
              nip: row.nip ? String(row.nip) : null, // Konversi ke string jika diperlukan
              kdjab: row.kdjab || "Tidak Diketahui",
              kdkawin: row.kdkawin || "Tidak Diketahui",
              gaji_bersih: row.bersih ? Number(row.bersih) : 0, // Konversi ke angka
              nogaji: row.nogaji || "Tidak Diketahui",
              bulan: row.bulan || "Tidak Diketahui",
              tahun: row.tahun || "Tidak Diketahui",
              kdgol: row.kdgol || "Tidak Diketahui",
              kdduduk: row.kdduduk || "Tidak Diketahui",
              npwp: row.npwp || "Tidak Diketahui",
              nmrek: row.nmrek || "Tidak Diketahui",
              nm_bank: row.nm_bank || "Tidak Diketahui",
              rekening: row.rekening || "Tidak Diketahui",
              kdbankspan: row.kdbankspan || "Tidak Diketahui",
              nmbankspan: row.nmbankspan || "Tidak Diketahui",
              kdnegara: row.kdnegara || "Tidak Diketahui",
              kdkppn: row.kdkppn || "Tidak Diketahui",
              kdpos: row.kdkppn || "Tidak Diketahui",
              gjpokok: row.gjpokok || "Tidak Diketahui",
              kdgapok: row.kdgapok || "Tidak Diketahui",
              bpjs: row.bpjs || "Tidak Diketahui",
            }));
      
            // Menggunakan Promise.all untuk mengoptimalkan upsert
            await Promise.all(
              pegawaiData.map((pegawai) =>
                Pegawai.upsert(pegawai, {
                  conflictFields: ["nip", "nmpeg"], // Jika `nip` dan `nmpeg` adalah kunci unik
                })
              )
            );
      
            res.status(200).json({
              msg: "Data Pegawai berhasil diekspor dan file berhasil diunggah!",
              url: fileUrl, // Mengirim URL file yang sudah diupload
            });
          });
      
          stream.end(file.buffer);
      
        } catch (error) {
          console.error("Error creating Restore Data Pegawai:", error);
          res.status(500).json({ msg: error.message });
        }
      };


export const updateRestorepegawai = async (req, res) => {
  try {
    const restore = await Restorepegawai.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!restore) return res.status(404).json({ msg: "Data not found!" });
    const { bulan, tahun } = req.body;
    let fileUrl = restore.filerestore;

    if(req.file) {
        if(fileUrl) {
            const publicId = fileUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "restore_data" },
            async (err, result) => {
              if (err) {
                console.error("Error uploading to Cloudinary:", err);
                return res.status(500).json({ msg: "Error uploading to Cloudinary" });
              }
    
              fileUrl = result.secure_url;
            }
          );
    
          const bufferStream = new Readable();
          bufferStream.push(req.file.buffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
        }
        const condition =
          req.role === "cabang" || req.role === "admin"
            ? { id: restore.id }
            : {
                [Op.and]: [
                  { id: restore.id },
                  { kdanak: req.kdanak },
                ],
              };
    
        // Perbarui data di database
        const updateResult = await Restorepegawai.update(
          { bulan, tahun, filerestore: fileUrl },
          { where: condition }
        );
    
        if (updateResult[0] === 0) {
          return res.status(403).json({ msg: "Anda tidak memiliki akses untuk memperbarui data ini!" });
        }
    
        res.status(200).json({msg: "Data Restore Data Pegawai berhasil diperbarui!",});
      } catch (error) {
        console.error("Error updating Restore Data Pegawai:", error);
        res.status(500).json({ msg: error.message });
      }
    };


export const deleteRestorepegawai = async (req, res) => {
  try {
    const restore = await Restorepegawai.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!restore) return res.status(404).json({ msg: "Data not found!" });
    const { bulan, tahun, filerestore: fileUrl } = req.body;
    if (req.role === "cabang" || req.role === "admin") {
      await Restorepegawai.destroy({
        where: {
          id: restore.id,
        },
      });
    } else {
      if (req.kdanak !== restore.kdanak)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Restorepegawai.destroy({
        where: {
          [Op.and]: [{ id: restore.id }, { kdanak: req.kdanak }],
        },
      });
    }
    res.status(200).json({ msg: "Data Restore Data Pegawai berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// export const createRestorepegawai = async (req, res) => {
//   const { bulan, tahun, kdanak } = req.body;

//   try {
//     if (!req.file) {
//       return res.status(400).json({ msg: 'File wajib diunggah' });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (worksheet.length === 0) {
//         return res.status(400).json({ msg: "File Excel kosong atau format salah" });
//       }
    
//      // Mengunggah file ke Cloudinary
//      const uploadStream = cloudinary.uploader.upload_stream(
//         { folder: "restore_pegawai" },
//         async (err, result) => {
//           if (err) {
//             console.error("Error uploading to Cloudinary:", err);
//             return res.status(500).json({ success: false, message: "Error uploading file" });
//           }
  
//           const fileUrl = result.secure_url;
  
//           // Simpan data Restorepegawai ke database
//           await Restorepegawai.create({
//             bulan,
//             tahun,
//             filerestore: fileUrl,
//             kdanak: kdanak,
//           });

//           // Memproses dan menyimpan data Pegawai dari Excel ke database
//           const pegawaiData = worksheet.map((row) => ({
//             nmpeg: row.nmpeg || "Unknown",
//             nip: row.nip ? String(row.nip) : null, // Konversi ke string jika diperlukan
//             kdjab: row.kdjab || "Tidak Diketahui",
//             kdkawin: row.kdkawin || "Tidak Diketahui",
//             gaji_bersih: row.bersih ? Number(row.bersih) : 0, // Konversi ke angka
//             nogaji: row.nogaji || `Tidak Diketahui`,
//             bulan: row.bulan || `Tidak Diketahui`,
//             tahun: row.tahun || `Tidak Diketahui`,
//             kdgol: row.kdgol || `Tidak Diketahui`,
//             kdduduk: row.kdduduk || `Tidak Diketahui`,
//             npwp: row.npwp || `Tidak Diketahui`,
//             nmrek: row.nmrek || `Tidak Diketahui`,
//             nm_bank: row.nm_bank || `Tidak Diketahui`,
//             rekening: row.rekening || `Tidak Diketahui`,
//             kdbankspan: row.kdbankspan || `Tidak Diketahui`,
//             nmbankspan: row.nmbankspan || `Tidak Diketahui`,
//             kdnegara: row.kdnegara || `Tidak Diketahui`,
//             kdkppn: row.kdkppn || `Tidak Diketahui`,
//             gjpokok: row.gjpokok || `Tidak Diketahui`,
//             kdgapok: row.kdgapok || "Tidak Diketahui",
//             bpjs: row.bpjs || "Tidak Diketahui",
//           }));
  
//           for (let pegawai of pegawaiData) {
//             await Pegawai.upsert(pegawai, {
//               // Menggunakan kombinasi `nip` dan `nmpeg` sebagai acuan untuk memastikan data yang sama akan ditimpa
//               conflictFields: ['nip', 'nmpeg'], // Jika `nip` dan `nmpeg` adalah kunci unik
//             });
//           }

//           res.status(201).json({
//             msg: "Data Pegawai berhasil diekspor dari file Excel!",
//             fileUrl: fileUrl,
//           });
//         }
//       );
  
//       const bufferStream = new Readable();
//       bufferStream.push(req.file.buffer);
//       bufferStream.push(null);
//       bufferStream.pipe(uploadStream);

//   } catch (error) {
//     console.error("Error creating Restore Data Pegawai:", error);
//     res.status(500).json({ msg: error.message });
//   }
// };