const express = require("express");
const { param, body } = require("express-validator");
const router = express.Router();
const responseRouter = require("../controllers/responseController");
const jwtAuth = require("../utils/jwtAuth");

router.post(
	"/",
	[body("survey").isMongoId()],
	responseRouter.postCreateResponse
);
router.get(
	"/:id",
	[param("id").isMongoId()],
	jwtAuth.ensureVerified,
	jwtAuth.renewToken,
	responseRouter.getAllResponsesForSurvey
);
module.exports = router;
