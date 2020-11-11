const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const jwtAuth = require("../utils/jwtAuth");

router.post(
	"/login",
	[
		body("email").isEmail(),
		body("password").notEmpty(),
	],
	authController.loginController,
	jwtAuth.createToken,
	(req, res, next) => {
		res.json({...res.locals});
	}
);
router.post(
	"/register",
	[
		body("email").isEmail(),
		body("name").notEmpty(),
		body("password").notEmpty(),
		body("passwordCheck").notEmpty()
	],
	authController.registerController,
	jwtAuth.createToken,
	(req, res, next) => {
		res.json({...res.locals});
	}
);

module.exports = router;
