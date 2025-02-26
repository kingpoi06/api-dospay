import express from "express";
import {
  getTunjanganprofesi,
  getTunjanganprofesiByNip,
  createTunjanganprofesi,
  updateTunjanganprofesi,
  deleteTunjanganprofesi,
  
} from "../../../../../controllers/satkerUniv/cabangsatker/pegawai/tunjangan/Profesi.js";
import { adminOnly } from "../../../../../middleware/userOnly.js";

const router = express.Router();

router.get("/tunjanganprofesi", getTunjanganprofesi);
router.get("/tunjanganprofesi/:nip", getTunjanganprofesiByNip);
router.post("/tunjanganprofesi", adminOnly, createTunjanganprofesi);
router.patch("/tunjanganprofesi/:nip", adminOnly,  updateTunjanganprofesi);
router.delete("/tunjanganprofesi/:nip", adminOnly,  deleteTunjanganprofesi);

export default router;
