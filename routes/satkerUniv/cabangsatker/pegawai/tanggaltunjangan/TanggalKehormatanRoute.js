import express from "express";
import {
  getTanggalkehormatan,
  getTanggalkehormatanByKDtunjangan,
  createTanggalkehormatan,
  updateTanggalkehormatan,
  deleteTanggalkehormatan
  
} from "../../../../../controllers/satkerUniv/cabangsatker/pegawai/tanggaltunjangan/TanggalKehormatan.js";
import { adminOnly } from "../../../../../middleware/userOnly.js";

const router = express.Router();

router.get("/tanggalkehormatan", getTanggalkehormatan);
router.get("/tanggalkehormatan/:kdtunjangan", getTanggalkehormatanByKDtunjangan);
router.post("/tanggalkehormatan", adminOnly, createTanggalkehormatan);
router.patch("/tanggalkehormatan/:kdtunjangan", adminOnly,  updateTanggalkehormatan);
router.delete("/tanggalkehormatan/:kdtunjangan", adminOnly,  deleteTanggalkehormatan);

export default router;
