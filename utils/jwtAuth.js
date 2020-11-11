const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

exports.ensureVerified = async (req, res, next) => {
	try {
		const verified = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
		if (verified) {
			req.token = jwt.decode(req.cookies.token);
			next();
		} else {
			return res.status(401).end();
		}
	} catch (err) {
		next(err);
	}
};

exports.renewToken = async (req, res, next) => {
	try {
		const token = jwt.decode(req.cookies.token, process.env.JWT_SECRET_KEY);
		if (token.exp - Math.round(Date.now() / 1000) < 60 * 60 * 1) {
			console.log("renewed");
			const newToken = jwt.sign(
				{ id: token.id, email: token.email, name: token.name },
				process.env.JWT_SECRET_KEY,
				{
					expiresIn: eval(process.env.JWT_EXPIRES_IN),
				}
			);
			res.cookie("token", newToken, {
				httpOnly: true,
				maxAge: eval(process.env.JWT_EXPIRES_IN) * 1000,
			});
		}
		next();
	} catch (err) {
		next(err);
	}
};

exports.createToken = async (req, res, next) => {
	try {
		const u = await User.findOne({ email: req.body.email });
		const payload = { email: u.email, name: u.name, id: u.id };
		const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
			expiresIn: eval(process.env.JWT_EXPIRES_IN),
		});
		res.cookie("token", token, {
			httpOnly: true,
			maxAge: eval(process.env.JWT_EXPIRES_IN) * 1000,
		});
		next();
	} catch (err) {
		next(err);
	}
};
