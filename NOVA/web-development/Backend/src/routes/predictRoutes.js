import express from "express";
import {
  predict,
  getPredictionHistory,
} from "../controllers/predictController.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/predict", authenticationMiddleware, async (req, res, next) => {
  console.log("[ROUTE] POST /predict hit");
  await predict(req, res, next);
});

router.get(
  "/predict/history",
  authenticationMiddleware,
  async (req, res, next) => {
    console.log("[ROUTE] GET /predict/history hit");
    await getPredictionHistory(req, res, next);
  }
);

export default router;