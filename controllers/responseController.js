const jwt = require("jsonwebtoken");
const response = require("../models/responseSchema");
const survey = require("../models/surveySchema");;
const moment = require("moment");
exports.postCreateResponse = async (req, res, next) => {
	try {
		const s = await survey.findOne({ _id: req.body.survey });
		if(moment(Date.now()).isAfter(s.endTime) || moment(Date.now()).isBefore(s.startTime)){
			throw new Error();
		}
		const r = new response({ survey: s._id, choices: req.body.choices });
		const n = await r.save();
		return res.end();
	} catch (err) {
		next(err);
	}
};

exports.getAllResponsesForSurvey = async (req, res, next) => {
	try {
		const s = await survey.findOne({ _id: req.params.id });
		if (!s) {
			throw new Error({ statusCode: 404 });
		}
		const token = req.token;
		if (s.author != token.id) {
			const e = new Error();
			e.statusCode = 400;
			throw e;
		}
		const t = await response.find({ survey: s._id });
		const r = {};
		await t.forEach((q) => {
			q.choices.forEach((i) => {
				if (!r[i.query]) {
					r[i.query] = {};
				}
				r[i.query][i.choice] = r[i.query][i.choice]
					? r[i.query][i.choice] + 1
					: 1;
			});
		});
		res.json({stats: r, total: t.length });
		return;
	} catch (err) {
		next(err);
	}
};
