const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  leave: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
