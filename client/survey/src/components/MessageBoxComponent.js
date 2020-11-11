import React from "react";
import { NavLink } from "react-router-dom";
import "./SurveyComponents.css";

export default function MessageBoxComponent(props) {
	return (
		<div style={{ textAlign: "center" }} className="survey-container">
			<div className="survey-title">{props.title || ""}</div>
			<div>{props.message || ""}</div>
			<NavLink to="/">Click here to return to Home Page</NavLink>
		</div>
	);
}

export function LoadingComponent(props) {
	return (
		<div
			style={{ textAlign: "center" }}
			className="survey-container survey-title"
		>
			Loading
		</div>
	);
}
