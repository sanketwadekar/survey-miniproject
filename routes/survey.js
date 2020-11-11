const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const surveyController = require("../controllers/surveyController");
const jwtAuth = require("../utils/jwtAuth");

router.get(
	"/all",
	jwtAuth.ensureVerified,
	jwtAuth.renewToken,
	surveyController.getAllSurveys
);
router.get("/:id", [param("id").isMongoId()], surveyController.getSurvey);
router.get(
	"/delete/:id",
	[param("id").isMongoId()],
	jwtAuth.ensureVerified,
	jwtAuth.renewToken,
	surveyController.getDeleteSurvey
);
router.post(
	"/create",
	jwtAuth.ensureVerified,
	jwtAuth.renewToken,
	surveyController.postCreateSurvey
);
module.exports = router;
