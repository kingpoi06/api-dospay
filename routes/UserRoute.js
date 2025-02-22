import express from "express";
import {
  getUsers,
  getUserByUuid,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/login/Users.js";
import { adminOnly } from "../middleware/userOnly.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:uuid", getUserByUuid);
router.post("/users", createUser);
router.patch("/users/:uuid",  updateUser);
router.delete("/users/:uuid", adminOnly, deleteUser);

export default router;
