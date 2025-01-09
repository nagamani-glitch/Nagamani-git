import HiredEmployee from '../models/HiredEmployee.js';

export const getAllHiredEmployees = async (req, res) => {
    try {
        const hiredEmployees = await HiredEmployee.find().sort({ createdAt: -1 });
        res.status(200).json(hiredEmployees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hired employees', error: error.message });
    }
};

export const createHiredEmployee = async (req, res) => {
    try {
        const newHiredEmployee = new HiredEmployee(req.body);
        const savedHiredEmployee = await newHiredEmployee.save();
        res.status(201).json(savedHiredEmployee);
    } catch (error) {
        res.status(400).json({ message: 'Error creating hired employee', error: error.message });
    }
};

export const updateHiredEmployee = async (req, res) => {
    try {
        const updatedHiredEmployee = await HiredEmployee.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedHiredEmployee) {
            return res.status(404).json({ message: 'Hired employee not found' });
        }
        res.status(200).json(updatedHiredEmployee);
    } catch (error) {
        res.status(400).json({ message: 'Error updating hired employee', error: error.message });
    }
};

export const deleteHiredEmployee = async (req, res) => {
    try {
        const deletedHiredEmployee = await HiredEmployee.findByIdAndDelete(req.params.id);
        if (!deletedHiredEmployee) {
            return res.status(404).json({ message: 'Hired employee not found' });
        }
        res.status(200).json({ message: 'Hired employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting hired employee', error: error.message });
    }
};

export const getHiredEmployeeById = async (req, res) => {
    try {
        const hiredEmployee = await HiredEmployee.findById(req.params.id);
        if (!hiredEmployee) {
            return res.status(404).json({ message: 'Hired employee not found' });
        }
        res.status(200).json(hiredEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hired employee', error: error.message });
    }
};

export const filterHiredEmployees = async (req, res) => {
    try {
        const { department, status, search } = req.query;
        let query = {};

        if (department && department !== 'All') {
            query.department = department;
        }
        if (status && status !== 'All') {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { jobPosition: { $regex: search, $options: 'i' } }
            ];
        }

        const hiredEmployees = await HiredEmployee.find(query).sort({ createdAt: -1 });
        res.status(200).json(hiredEmployees);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering hired employees', error: error.message });
    }
};
