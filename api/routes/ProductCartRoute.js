import express from "express";
import {
  getProductCart,
  createProductCart,
  updateProductCartQuantity,
} from "../controllers/ProductCartController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.get("/", verifyToken, getProductCart);
router.post("/create", verifyToken, createProductCart);
router.put(
  "/updateQuantity/:productCartId",

  updateProductCartQuantity
);

export default router;