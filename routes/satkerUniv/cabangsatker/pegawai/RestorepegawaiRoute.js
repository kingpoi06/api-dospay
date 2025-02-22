import express from "express";
import {
  getRestorePegawai,
  getRestorepegawaiByUuid,
  createRestorepegawai,
  updateRestorepegawai,
  deleteRestorepegawai,
} from "../../../../controllers/satkerUniv/cabangsatker/pegawai/RestorePegawai.js";
import { adminOnly } from "../../../../middleware/userOnly.js";
// import multer from "multer";
import  upload  from "../../../../middleware/multerConfig.js";


const router = express.Router();

router.get("/upload-excel", getRestorePegawai);
router.get("/upload-excel/:uuid", getRestorepegawaiByUuid);
router.post("/upload-excel", adminOnly, upload, createRestorepegawai);
router.patch("/upload-excel/:uuid", adminOnly,  updateRestorepegawai);
router.delete("/upload-excel/:uuid", adminOnly,  deleteRestorepegawai);

export default router;
