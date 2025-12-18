const { validationResult } = require('express-validator');
const Leave = require('../model/Leave');
// const AuditLog = require('../model/AuditLog');

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
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('user', 'email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { status } = req.body;

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ msg: 'Leave not found' });

    leave.status = status;
    await leave.save();

    // Bonus: Audit Log
    const log = new AuditLog({
      action: `Admin ${req.user.email} ${status} leave ${leave._id} at ${new Date().toISOString()}`,
      admin: req.user._id,
      leave: leave._id,
    });
    await log.save();

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};