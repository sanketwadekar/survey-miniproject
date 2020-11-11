const response = require("../models/responseSchema");
const survey = require("../models/surveySchema");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const user = require("../models/userSchema");


exports.getSurvey = async (req, res, next) => {
	try {
		const s = await survey.findById(req.params.id);
		return res.json(s);
	} catch (err) {
		next(err);
	}
};

exports.getAllSurveys = async (req, res, next) => {
	try {
		const token = req.token;
		const u = await user.findOne({ email: token.email });
		const s = await survey.find({ author: u._id });
		return res.json(s);
	} catch (err) {
		next(err);
	}
};

exports.postCreateSurvey = async (req, res, next) => {
	try {
		if (moment(req.body.startTime).isSameOrAfter(req.body.endTime)) {
			return res
				.status(400)
				.json({ message: "start time should be before end time" });
		}
		const token = req.token;
		const u = await user.findOne({ email: token.email });
		if (!u) {
			return res.end();
		}
		const s = new survey({ ...req.body, author: u._id });
		const ns = await s.save();
		u.surveys.push(ns._id);
		await u.save();
		return res.end();
	} catch (err) {
		next(err);
	}
};

exports.getDeleteSurvey = async (req, res, next) => {
	try {
		const token = req.token;
		const u = await survey.findOne({_id: req.params.id})
		if(!u){
			throw new Error({statusCode: 404});
		}
		if( token.id != u.author){
			throw new Error({statusCode: 401});
		}
		const r = await response.deleteMany({query: req.params.id});
		await u.remove();
		return res.end();
	} catch (err) {
		next(err);
	}
};
