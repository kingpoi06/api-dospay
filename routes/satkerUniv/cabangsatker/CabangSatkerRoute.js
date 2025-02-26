import express from "express";
import {
  getCabangSatker,
  getCabangSatkerByKDanak,
  createCabangSatker,
  updateCabangSatker,
  deleteCabangSatker,
} from "../../../controllers/satkerUniv/cabangsatker/CabangSatker.js";
import { adminOnly } from "../../../middleware/userOnly.js";

const router = express.Router();

router.get("/cabangsatker", getCabangSatker);
router.get("/cabangsatker/:kdanak", getCabangSatkerByKDanak);
router.post("/cabangsatker", adminOnly, createCabangSatker);
router.patch("/cabangsatker/:kdanak", adminOnly,  updateCabangSatker);
router.delete("/cabangsatker/:kdanak", adminOnly,  deleteCabangSatker);

export default router;
