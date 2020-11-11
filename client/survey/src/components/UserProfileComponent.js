import React, { useContext, useEffect } from "react";
import UserSurveyListContext, { types } from "../context/UserSurveyListContext";
import { LoadingComponent } from "./MessageBoxComponent";
import { SurveyTileComponent } from "./SurveyComponent";
import "./UserProfileComponent.css";
import UserContext from "../context/UserContext";

export default function UserProfileComponent(props) {
	const [surveyList, setSurveyList] = useContext(UserSurveyListContext);
	const {user, setUser} = useContext(UserContext);
	async function fetchSurveyList() {
		try {
			const url = `/api/survey/all`;
			const options = { method: "get" };
			const response = await fetch(url, options);
			if (response.status === 200) {
				const data = await response.json();
				setSurveyList({ type: types.addQuery, data: data });
			} else {
				alert(`Error code ${response.status}: ${response.statusText}`);
			}
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		fetchSurveyList();
	}, []);

	return (
		<div>
			<div className="list-container username">
				{user.name}
			</div>
			<div className="list-container">
				{!surveyList ? (
					<LoadingComponent />
				) : surveyList.length ? (
					<React.Fragment>
						<div className="list-container-header">Surveys</div>
						<div>
							{surveyList.map((survey) => {
								return <SurveyTileComponent survey={survey} key={survey._id} />;
							})}
						</div>
					</React.Fragment>
				) : (
					<div className="list-container-header">No surveys created</div>
				)}
			</div>
		</div>
	);
}
