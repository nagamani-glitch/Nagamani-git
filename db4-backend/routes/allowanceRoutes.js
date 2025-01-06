import express from 'express';
import { getAllowances, createAllowance, updateAllowance, deleteAllowance } from '../controllers/allowanceController.js';
const router = express.Router();


router.route('/')
  .get(getAllowances)
  .post(createAllowance);


  router.route('/:id')
  .put(updateAllowance)
  .delete(deleteAllowance);

 export default router;
