import React, { useContext, useState } from "react";
import SurveyContext from "../context/SurveyContext";
import { Link } from "react-router-dom";
import UserSurveyListContext, { types } from "../context/UserSurveyListContext";
import "./SurveyComponents.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const SurveyTileComponent = (props) => {
	const [surveyList, setSurveyList] = useContext(UserSurveyListContext);
	async function deleteQuery(id) {
		try {
			const url = `/api/survey/delete/${id}`;
			const options = { method: "get" };
			const response = await fetch(url, options);
			if (response.status === 200) {
				setSurveyList({ id, type: types.deleteQuery });
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="survey-tile">
			<div className="survey-tile-header">
				<Link to={`/survey/view/${props.survey._id}`}>
					{props.survey.title}
				</Link>
			</div>
			<div className="survey-items">
				<CopyToClipboard
					text={`http://${window.location.host}/survey/fill/${props.survey._id}`}
					onCopy={() => alert("URL copied to clipboard")}
				>
					<button>Copy URL</button>
				</CopyToClipboard>
				<button
					style={{ background: "red" }}
					aria-hidden="true"
					onClick={(e) => {
						deleteQuery(props.survey._id);
					}}
				>
					Delete survey
				</button>
			</div>
		</div>
	);
};

function SurveyOption(props) {
	const [survey, setSurvey] = useContext(SurveyContext);
	return (
		<div>
			<div className="option">
				<label className="option-label">{props.optionId}</label>
				<input
					type="text"
					value={props.value}
					onChange={(e) => {
						setSurvey({
							type: "updateOption",
							queryId: props.queryId,
							optionId: props.optionId,
							value: e.target.value,
						});
					}}
					placeholder="Enter option"
				/>
				<i
					className="fa fa-trash"
					onClick={(e) => {
						setSurvey({
							type: "deleteOption",
							queryId: props.queryId,
							optionId: props.optionId,
						});
					}}
				></i>
			</div>
		</div>
	);
}

function SurveyQuery(props) {
	const [survey, setSurvey] = useContext(SurveyContext);
	const query = survey.queries.filter((query) => query.id === props.queryId);
	return (
		<div className="survey-container">
			<div>
				<label className="survey-label">
					Query
					<input
						type="text"
						className="survey-title-input"
						value={query[0].title}
						onChange={(e) => {
							setSurvey({
								type: "updateTitle",
								queryId: props.queryId,
								value: e.target.value,
							});
						}}
						placeholder="Enter query"
					/>
				</label>
			</div>

			{query[0].options.map((option, index) => {
				return (
					<SurveyOption
						queryId={props.queryId}
						optionId={option.id}
						value={option.value}
						key={index}
					/>
				);
			})}
			<div className="query-bar">
				<button
					onClick={(e) => {
						setSurvey({ type: "addOption", queryId: props.queryId });
					}}
				>
					Add Option
				</button>
				<button
					onClick={(e) => {
						setSurvey({ type: "deleteQuery", queryId: props.queryId });
					}}
					className="bg-red"
				>
					Delete Query
				</button>
			</div>
		</div>
	);
}

export const SurveyCreatorComponent = (props) => {
	const [survey, setSurvey] = useContext(SurveyContext);
	const [saved, setSaved] = useState(false);
	async function saveSurvey(e) {
		try {
			if (survey.endTime <= survey.startTime) {
				alert("End time cannot be before start time");
			}
			if (!survey.title) {
				alert("Title is empty");
			}
			const url = "/api/survey/create";
			const options = {
				method: "post",
				body: JSON.stringify(survey),
				headers: { "Content-Type": "application/json" },
			};
			const response = await fetch(url, options);
			if (response.status === 200) {
				setSurvey({ type: "clearState" });
				setSaved(true);
			}
		} catch (err) {
			console.error(err);
		}
	}
	return saved ? (
		<div className="survey-container survey-title">Survey saved</div>
	) : (
		<div>
			<div className="survey-container">
				<label className="survey-label">
					Title
					<input
						type="text"
						className="survey-title-input"
						onChange={(e) => {
							setSurvey({ type: "updateSurveyTitle", value: e.target.value });
						}}
						value={survey.title}
					/>
				</label>
			</div>
			<div className="survey-container">
				<label className="survey-label">
					Start time
					<input
						type="datetime-local"
						className="survey-title-input"
						min={Date.now()}
						placeholder="start time"
						onChange={(e) => {
							setSurvey({ type: "updateStartTime", value: e.target.value });
						}}
						value={survey.startTime}
					></input>
				</label>
			</div>
			<div className="survey-container">
				<label className="survey-label">
					End time
					<input
						type="datetime-local"
						min={Date.now()}
						className="survey-title-input"
						value={survey.endTime}
						placeholder="end time"
						onChange={(e) => {
							setSurvey({ type: "updateEndTime", value: e.target.value });
						}}
					></input>
				</label>
			</div>
			<div>
				{survey.queries.map((query, index) => {
					return <SurveyQuery queryId={query.id} key={index} />;
				})}
			</div>
			<div className="survey-container">
				<button
					onClick={(e) => {
						setSurvey({ type: "addQuery" });
					}}
					className="bg-green"
				>
					Add query
				</button>
				<button onClick={saveSurvey}>Save survey</button>
			</div>
		</div>
	);
};
