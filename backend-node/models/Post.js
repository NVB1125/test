var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
	userid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	description: String,
	count: Number,
	comments: Array,
    created_time: {
		type: Date,
		default: Date.now()
	},
});
mongoose.model('Post', postSchema);