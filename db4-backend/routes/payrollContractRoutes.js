import express from 'express';
import { 
  getContracts,
  createContract, 
  updateContract,
  deleteContract,
  filterContracts
} from '../controllers/payrollContractController.js';n

const router = express.Router();

router.get('/', getContracts);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);
router.get('/filter', filterContracts);

export default router;
