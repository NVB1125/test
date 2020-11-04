var mongoose = require('mongoose');
var resettokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    resettoken: { type: String, required: true },
    type: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});
mongoose.model('ResetToken', resettokenSchema);