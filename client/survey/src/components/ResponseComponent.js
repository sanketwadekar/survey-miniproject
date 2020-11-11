import React, { useContext, useEffect, useState } from "react";
import ResponseContext from "../context/ResponseContext";
import "./SurveyComponents.css";
import "./ResponseComponent.css";
import MessageBoxComponent, { LoadingComponent } from "./MessageBoxComponent";
function ResponseChoice(props) {
	const [response, setResponse] = useContext(ResponseContext);
	return (
		<div className="response-container">
			<div className="response-title">{props.query.title}</div>
			<hr />
			{props.query.options.map((option, index) => (
				<div className="response-option" key={index}>
					<input
						type="radio"
						name={props.query._id}
						className="response-radio"
						onClick={(e) => {
							setResponse({
								type: "updateChoice",
								queryId: props.query._id,
								value: option.value,
							});
						}}
					/>
					<div className="response-label">{option.value}</div>
				</div>
			))}
		</div>
	);
}

export default function ResponseComponent(props) {
	const [survey, setSurvey] = useState({});
	const [didSubmit, setDidSubmit] = useState(false);
	const [response, setResponse] = useContext(ResponseContext);
	async function submitController(e) {
		try {
			if(Date.parse(survey.startTime) > Date.now() ){
				alert("Time to fill survey has not started yet");
				window.location.replace("/");
				return;
			}
			if(Date.parse(survey.endTime) < Date.now() ){
				alert("Time to fill survey has ended");
				window.location.replace("/");
				return;
			}
			if (response.choices.length !== survey.queries.length) {
				alert("Fill all queries");
				return;
			}
			const url = "/api/response";
			const options = {
				method: "post",
				body: JSON.stringify(response),
				headers: { "Content-Type": "application/json" },
			};
			let res = await fetch(url, options);
			if (res.status === 200) {
				setResponse({ type: "clearResponse" });
				setDidSubmit(true);
			} else {
				alert(`Error code ${res.status}: ${res.statusText}`);
			}
		} catch (er) {
			console.error(er);
		}
	}
	useEffect(() => {
		async function getSurvey() {
			try {
				const url = `/api/survey/${props.match.params.id}`;
				const response = await fetch(url);
				if (response.status === 200) {
					let survey = await response.json();
				
					setSurvey(survey);
					setResponse({ type: "setSurvey", value: survey._id });
				} else {
					alert(`Error code ${response.status}: ${response.statusText}`);
				}
			} catch (err) {
				console.error(err);
			}
		}
		getSurvey();
	}, []);
	return didSubmit ? (
		<MessageBoxComponent title="Response recorded" />
	) : survey ? (
		<div className="survey-container">
			<div className=" response-container survey-title">
				{survey.title || ""}
			</div>
			{survey.queries &&
				survey.queries.map((query, index) => (
					<ResponseChoice query={query} key={index}></ResponseChoice>
				))}
			<div className="response-container tool-bar">
				<button
					className="bg-purple response-submit"
					onClick={(e) => {
						submitController(e);
					}}
				>
					Submit
				</button>
			</div>
		</div>
	) : (
		<LoadingComponent />
	);
}
