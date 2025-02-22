import express from "express";
import {
  getPejabat,
  getPejabatByNip,
  createPejabat,
  updatePejabat,
  deletePejabat,
} from "../../../controllers/satkeruniv/RUHPejabat/RUHPejabat.js";
import { allroleOnly } from "../../../middleware/userOnly.js";

const router = express.Router();

router.get("/ruhpejabat", getPejabat);
router.get("/ruhpejabat/:nip", getPejabatByNip);
router.post("/ruhpejabat", allroleOnly, createPejabat);
router.patch("/ruhpejabat/:nip", allroleOnly,  updatePejabat);
router.delete("/ruhpejabat/:nip", allroleOnly,  deletePejabat);

export default router;
