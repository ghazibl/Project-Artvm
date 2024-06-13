import express from "express";
import {
  getCardbyUser,
  removeFromCart,
  deleteCart,
  
} from "../controllers/CartController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getByUser", verifyToken, getCardbyUser);
router.post("/remove", removeFromCart);
router.delete("/:cartId", verifyToken, deleteCart);

export default router;