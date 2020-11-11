const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	surveys: [{ type: mongoose.Types.ObjectId, ref: "survey"}],
},{timestamps: true});


module.exports = mongoose.model("user", userSchema);