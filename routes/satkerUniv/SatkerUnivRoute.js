import express from "express";
import {
  getSatkerUniv,
  getSatkerUnivByKDsatker,
  createSatkerUniv,
  updateSatkerUniv,
  deleteSatkerUniv,
} from "../../controllers/satkeruniv/SatkerUniv.js";
import { adminOnly } from "../../middleware/userOnly.js";

const router = express.Router();

router.get("/satkeruniv", getSatkerUniv);
router.get("/satkeruniv/:kdsatker",  getSatkerUnivByKDsatker);
router.post("/satkeruniv",adminOnly, createSatkerUniv);
router.patch("/satkeruniv/:kdsatker", adminOnly, updateSatkerUniv);
router.delete("/satkeruniv/:kdsatker", adminOnly,  deleteSatkerUniv);

export default router;
