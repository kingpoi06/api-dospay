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

router.get("/tunjangankehormatan", getTunjanganprofesi);
router.get("/tunjangankehormatan/:nip", getTunjanganprofesiByNip);
router.post("/tunjangankehormatan", adminOnly, createTunjanganprofesi);
router.patch("/tunjangankehormatan/:nip", adminOnly,  updateTunjanganprofesi);
router.delete("/tunjangankehormatan/:nip", adminOnly,  deleteTunjanganprofesi);

export default router;
