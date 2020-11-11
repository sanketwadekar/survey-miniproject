const express = require("express");
const dotnev = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const path = require("path");

dotnev.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "client", "survey", "build")));

app.use("/api", indexRouter);
app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use((err, req, res, next) => {
	console.error(err);
	if (err.statusCode) {
		return res.status(err.statusCode).end();
	}
	return res.status(500).end();
});

mongoose.connect(
	process.env.MONGO_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	(err) => {
		if (err) {
			throw err;
		}
		app.listen(process.env.PORT, () =>
			console.log(`Server started at port ${process.env.PORT}`)
		);
	}
);
