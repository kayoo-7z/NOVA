import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';
import {
  listChildren,
  createChild,
  getChild,
  updateChild,
  deleteChild,
  addMeasurement,
  listMeasurements,
  assessRisk,
  listRiskHistory,
} from '../controllers/childController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', listChildren);
router.post('/', createChild);
router.get('/:childId', getChild);
router.patch('/:childId', updateChild);
router.delete('/:childId', deleteChild);

router.post('/:childId/measurements', addMeasurement);
router.get('/:childId/measurements', listMeasurements);

router.post('/:childId/assess-risk', assessRisk);
router.get('/:childId/risk-history', listRiskHistory);

export default router;