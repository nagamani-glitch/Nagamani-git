import express from 'express';
import {
    getAllHiredEmployees,
    createHiredEmployee,
    updateHiredEmployee,
    deleteHiredEmployee,
    getHiredEmployeeById,
    filterHiredEmployees
} from '../controllers/hiredEmployeeController.js';

const router = express.Router();

router.route('/')
    .get(getAllHiredEmployees)
    .post(createHiredEmployee);

router.get('/filter', filterHiredEmployees);

router.route('/:id')
    .get(getHiredEmployeeById)
    .put(updateHiredEmployee)
    .delete(deleteHiredEmployee);

export default router;
