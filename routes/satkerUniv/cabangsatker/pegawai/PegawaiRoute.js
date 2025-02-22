import express from "express";
import {
  getPegawai,
  getPegawaiByNip,
  createPegawai,
  updatePegawai,
  deletePegawai,
  
} from "../../../../controllers/satkerUniv/cabangsatker/pegawai/Pegawai.js";
import { adminOnly } from "../../../../middleware/userOnly.js";

const router = express.Router();

router.get("/pegawai", getPegawai);
router.get("/pegawai/:nip", getPegawaiByNip);
router.post("/pegawai", adminOnly, createPegawai);
router.patch("/pegawai/:nip", adminOnly,  updatePegawai);
router.delete("/pegawai/:nip", adminOnly,  deletePegawai);

export default router;
