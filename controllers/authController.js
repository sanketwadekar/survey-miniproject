const User = require("../models/userSchema");
const crypto = require("crypto");

exports.registerController = async (req, res, next) => {
	try {
		const u = await User.findOne({ email: req.body.email });
		if (u || req.body.password !== req.body.passwordCheck) {
			return res.status(400).end();
		}
		const hash = crypto.createHash("sha256");
		hash.update(req.body.password);
		const newUser = new User({
			email: req.body.email,
			name: req.body.name,
			password: hash.digest("hex"),
		});
		const n = await newUser.save();
		res.locals = {
			id: n.id,
			name: n.name,
			expiresAt:
				Math.round(Date.now() / 1000) +
				parseInt(eval(process.env.JWT_EXPIRES_IN)),
		};
		next();
	} catch (err) {
		next(err);
	}
};

exports.loginController = async (req, res, next) => {
	try {
		const u = await User.findOne({ email: req.body.email });
		if (!u) {
			return res.status(401).end();
		}
		const hash = crypto.createHash("sha256");
		hash.update(req.body.password);
		if (u.password === hash.digest("hex")) {
			res.locals = {
				id: u.id,
				name: u.name,
				expiresAt:
					Math.round(Date.now() / 1000) +
					parseInt(eval(process.env.JWT_EXPIRES_IN)),
			};
			next();
		} else {
			return res.status(401).end();
		}
	} catch (err) {
		next(err);
	}
};
