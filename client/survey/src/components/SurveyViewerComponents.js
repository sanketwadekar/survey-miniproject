import React, { useContext, useState, useEffect } from "react";
import UserSurveyListContext from "../context/UserSurveyListContext";
import { LoadingComponent } from "./MessageBoxComponent";
import "./SurveyComponents.css";
import "./SurveyViewComponent.css";

export function SurveyViewComponent(props) {
	const [surveyList, setSurveyList] = useContext(UserSurveyListContext);
	const x = surveyList.filter((s) => s._id === props.match.params.id);
	const [survey, setSurvey] = useState(x[0]);
	const [responses, setResponses] = useState();
	async function getSurvey() {
		try {
			if (!survey) {
				const url = `/api/survey/${props.match.params.id}`;
				const options = { method: "get" };
				const response = await fetch(url, options);
				if (response.status === 200) {
					const data = await response.json();
					setSurvey(data);
				} else {
					alert(`Error code ${response.status}: ${response.statusText}`);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}
	async function getResponses() {
		try {
			const url = `/api/response/${props.match.params.id}`;
			const options = { method: "get" };
			const response = await fetch(url, options);
			if (response.status === 200) {
				const data = await response.json();
				setResponses(data);
			} else {
				alert(`Error code ${response.status}: ${response.statusText}`);
			}
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getSurvey();
		getResponses();
	}, []);

	return (
		<div>
			{survey && responses && (
				<div className="survey-container survey-query-container">
					<div className="survey-title">{survey.title}</div>
					<div>Responses recorded: {responses.total}</div>
				</div>
			)}
			{survey && responses ? (
				survey.queries.map((s, i) => {
					return (
						<SurveyQueryBar
							query={s}
							response={{
								...responses.stats[s._id],
								total: responses.total,
							}}
							key={i}
						/>	
					);
				})
			) : (
				<LoadingComponent/>
			)}
		</div>
	);
}

function SurveyQueryBar(props) {
	return (
		<div className="survey-container survey-query-container">
			<div className="survey-query-title">{props.query.title}</div>
			{props.query.options.map((q, i) => {
				let perc = (
					((props.response[q.value] ?? 0) / props.response.total) *
					100
				).toFixed(2);
				if (isNaN(perc)) {
					perc = 0;
				}
				return <SurveyOptionBar option={q} key={i} perc={perc} />;
			})}
		</div>
	);
}

const colors = {
	10: "rgb(218, 2, 2)",
	20: "rgb(226, 122, 25)",
	30: "rgb(233, 217, 0)",
	40: "rgb(129, 221, 42)",
	50: "rgb(42, 221, 57)",
	60: "rgb(10, 214, 241)",
	70: "rgb(0, 89, 255)",
	80: "rgb(65, 62, 238)",
	90: "rgb(152, 62, 255)",
	100: "rgb(214, 51, 255)",
};

function SurveyOptionBar(props) {
	const roundedPerc = Math.round(props.perc);
	return (
		<div className="option-bar">
			<div>
				{props.option.value}
				<span className="percentage">{props.perc}%</span>
			</div>
			<div
				style={{
					width: `${roundedPerc}%`,
					borderColor: colors[roundedPerc - (roundedPerc % 10)],
				}}
				className="percentage-bar"
			></div>
		</div>
	);
}
