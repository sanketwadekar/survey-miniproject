const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
	value: { type: String, required: true },
});
const querySchema = new mongoose.Schema({
	title: { type: String, required: true },
	options: [optionSchema],
});

const surveySchema = new mongoose.Schema(
	{
		author: { type: mongoose.Types.ObjectId, ref: "user", index: true },
		title: { type: String, required: true },
		queries: [querySchema],
		startTime: {
			type: Date,
			default: Date.now,
		},
		endTime: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("survey", surveySchema);
