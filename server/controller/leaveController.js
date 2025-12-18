const { validationResult } = require('express-validator');
const Leave = require('../model/Leave');

// --- EMPLOYEE ACTIONS ---

exports.createLeave = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { startDate, endDate, reason } = req.body;

    if (new Date(endDate) < new Date(startDate)) {
        return res.status(400).json({ msg: 'End date cannot be before start date' });
    }

    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    try {
        const leave = new Leave({
            user: req.user._id,
            startDate,
            endDate,
            reason,
            totalDays,
        });
        await leave.save();
        res.status(201).json(leave);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// --- ADMIN ACTIONS ---

// Get all leaves (with user details)
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('user', 'name email') 
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get ONLY pending leaves (for admin dashboard)
exports.getPendingLeaves = async (req, res) => {
    try {
        const pendingLeaves = await Leave.find({ status: 'pending' })
            .populate('user', 'name email employeeId') 
            .sort({ createdAt: -1 });
        res.json(pendingLeaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ msg: 'Leave not found' });

        leave.status = status;
        await leave.save();

        res.json({ msg: `Leave status updated to ${status}`, leave });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};