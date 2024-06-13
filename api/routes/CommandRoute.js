import express from "express";
import {
  createCommande,
  getCommndeEnAttente,
  getCommandesByUser,
  getCommandById,
  deleteCommande,
  updateCommandStatus,
  setStatusRefuser,
  setStatusConfirme,
  getAllCommands,
  getCommandes,
  updateCommande
} from "../controllers/CommandController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createCommande);
//router.get('/:userId', getCommandesByUser);

router.get("/attent", getCommndeEnAttente);
router.get("/getAll", getAllCommands);
router.get("/getByUser", verifyToken, getCommandesByUser);
router.get("/totalCommandes", getCommandes);

router.put("/commandes/:id", updateCommandStatus);
router.put("/confirm/:id", setStatusConfirme);

router.get("/:id", getCommandById);
router.put("/refuse/:id", setStatusRefuser);
router.put('/update/:id', updateCommande);
router.delete("/:id", deleteCommande);

export default router;