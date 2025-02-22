import express from "express";
import {
  getTanggalprofesi,
  getTanggalprofesiByKDtunjangan,
  createTanggalprofesi,
  updateTanggalprofesi,
  deleteTanggalprofesi
  
} from "../../../../../controllers/satkerUniv/cabangsatker/pegawai/tanggaltunjangan/TanggalProfesi.js";
import { adminOnly } from "../../../../../middleware/userOnly.js";

const router = express.Router();

router.get("/tanggalprofesi", getTanggalprofesi);
router.get("/tanggalprofesi/:kdtunjangan", getTanggalprofesiByKDtunjangan);
router.post("/tanggalprofesi", adminOnly, createTanggalprofesi);
router.patch("/tanggalprofesi/:kdtunjangan", adminOnly,  updateTanggalprofesi);
router.delete("/tanggalprofesi/:kdtunjangan", adminOnly,  deleteTanggalprofesi);

export default router;
