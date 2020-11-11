const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const surveyRouter = require("./survey");
const responseRouter = require("./response");

router.use('/auth', authRouter);
router.use('/survey', surveyRouter);
router.use('/response', responseRouter);

module.exports = router;