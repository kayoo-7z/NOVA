import express from "express";
import {
  createStuntingAnalysis,
  getStuntingAnalyses,
} from "../controllers/stuntingAnalysisController.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stunting-analyses-test", (req, res) => {
  res.json({
    status: "success",
    message: "Stunting analysis route connected",
  });
});

router.post("/stunting-analyses", authenticationMiddleware, createStuntingAnalysis);
router.get("/stunting-analyses", authenticationMiddleware, getStuntingAnalyses);

export default router;