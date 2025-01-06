// import express from 'express'
// const router = express.Router();
// import PayrollContract from '../models/payrollContract';

// // // Fetch all contracts
// // router.get("/", async (req, res) => {
// //   try {
// //     const contracts = await PayrollContract.find();
// //     res.json(contracts);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // // Create a contract
// // router.post("/", async (req, res) => {
// //   try {
// //     const newContract = new PayrollContract(req.body);
// //     const savedContract = await newContract.save();
// //     res.status(201).json(savedContract);
// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // });


// // // Update a contract
// // router.put("/:id", async (req, res) => {
// //   const { id } = req.params;
// //   const updatedContract = await Contract.findByIdAndUpdate(id, req.body, { new: true });
// //   res.json(updatedContract);
// // });

// // // Delete a contract
// // router.delete("/:id", async (req, res) => {
// //   const { id } = req.params;
// //   await Contract.findByIdAndDelete(id);
// //   res.json({ message: "Contract deleted" });
// // });

// // module.exports = router;


import express from 'express';
import { createContract, getContracts,updateContract, deleteContract  } from '../controllers/payrollContractController.js';

const router = express.Router();

router.post('/', createContract);
router.get('/', getContracts);

router.route('/:id')
  .put(updateContract)
  .delete(deleteContract);

export default router;
