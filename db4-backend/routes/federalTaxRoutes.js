import express from 'express';
import { federalTaxController } from '../controllers/federalTaxController.js';

const router = express.Router();

router.get('/', federalTaxController.getAllTaxes);
router.post('/', federalTaxController.createTax);
router.put('/:id', federalTaxController.updateTax);
router.delete('/:id', federalTaxController.deleteTax);

export default router;
