const express = require('express');
const { body } = require('express-validator');
const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require('../controller/leaveController');
const { authMiddleware, roleMiddleware } = require('../midlware/auth');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('employee'),
  [
    body('startDate').isDate().withMessage('Valid start date required'),
    body('endDate').isDate().withMessage('Valid end date required'),
    body('reason').notEmpty().withMessage('Reason is required'),
  ],
  createLeave
);

router.get('/my-leaves', authMiddleware, roleMiddleware('employee'), getMyLeaves);

router.get('/all', authMiddleware, roleMiddleware('admin'), getAllLeaves);

router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  [body('status').isIn(['approved', 'rejected'])],
  updateLeaveStatus
);

module.exports = router;