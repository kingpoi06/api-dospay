import express from "express";
import {
  getTunjangankehormatan,
  getTunjangankehormatanByNip,
  createTunjangankehormatan,
  updateTunjangankehormatan,
  deleteTunjangankehormatan
  
} from "../../../../../controllers/satkerUniv/cabangsatker/pegawai/tunjangan/Kehormatan.js";
import { adminOnly } from "../../../../../middleware/userOnly.js";

const router = express.Router();

router.get("/tunjangankehormatan", getTunjangankehormatan);
router.get("/tunjangankehormatan/:nip", getTunjangankehormatanByNip);
router.post("/tunjangankehormatan", adminOnly, createTunjangankehormatan);
router.patch("/tunjangankehormatan/:nip", adminOnly,  updateTunjangankehormatan);
router.delete("/tunjangankehormatan/:nip", adminOnly,  deleteTunjangankehormatan);

export default router;
