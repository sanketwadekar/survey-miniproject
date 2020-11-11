const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema({
	query: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	choice: {
		type: String,
		required: true,
	},
});

const responseSchema = new mongoose.Schema(
	{
		survey: {
			type: mongoose.Types.ObjectId,
			ref: "survey",
			required: true,
			index: true,
		},
		choices: [choiceSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("response", responseSchema);
