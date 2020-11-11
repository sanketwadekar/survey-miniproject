import React, { useReducer } from "react";

const SurveyContext = React.createContext();

function balanceArrayId(array) {
	array.sort((a, b) => a.id - b.id);
	let i = 0;
	for (i = 0; i < array.length; i++) {
		if (array[i].id !== i + 1) {
			array[i].id = i + 1;
		}
	}
	return array;
}

const reducer = (state, action) => {
	switch (action.type) {
		case "updateTitle":
			for (let i = 0; i < state.queries.length; i += 1) {
				if (state.queries[i].id === action.queryId) {
					state.queries[i].title = action.value;
				}
			}
			return { ...state };
		case "updateOption":
			for (let i = 0; i < state.queries.length; i += 1) {
				if (state.queries[i].id === action.queryId) {
					for (let j = 0; j < state.queries[i].options.length; j++) {
						if (state.queries[i].options[j].id === action.optionId) {
							state.queries[i].options[j].value = action.value;
						}
					}
				}
			}
			return { ...state };
		case "addOption":
			for (let i = 0; i < state.queries.length; i++) {
				if (state.queries[i].id === action.queryId) {
					state.queries[i].options.push({
						id: state.queries[i].options.length + 1,
						value: "",
					});
				}
			}
			return { ...state };
		case "deleteOption":
			for (let i = 0; i < state.queries.length; i++) {
				if (state.queries[i].id === action.queryId) {
					for (let j = 0; j < state.queries[i].options.length; j++) {
						if (state.queries[i].options[j].id === action.optionId) {
							state.queries[i].options.splice(j, 1);
							state.queries[i].options = balanceArrayId(
								state.queries[i].options
							);
							break;
						}
					}
				}
			}
			return { ...state };
		case "addQuery":
			state.queries.push({
				id: state.queries.length + 1,
				title: "",
				options: [],
			});
			return { ...state };
		case "deleteQuery":
			for (let i = 0; i < state.queries.length; i++) {
				if (state.queries[i].id === action.queryId) {
					state.queries.splice(i, 1);
					break;
				}
			}
			state.queries = balanceArrayId(state.queries);
			return { ...state };
		case "updateSurveyTitle":
			state.title = action.value;
			return { ...state };
		case "updateStartTime":
			state.startTime = action.value;
			return { ...state };
		case "updateEndTime":
			state.endTime = action.value;
			return { ...state };
		case "clearState":
			return {
				title: "",
				queries: [],
				id: "1",
				startTime: "",
				endTime: "",
				mode: "write",
			};
		default:
			return { ...state };
	}
};

export const SurveyProvider = (props) => {
	const [survey, setSurvey] = useReducer(reducer, {
		title: "",
		queries: [],
		id: "1",
		startTime: "",
		endTime: "",
	});
	return (
		<SurveyContext.Provider value={[survey, setSurvey]}>
			{props.children}
		</SurveyContext.Provider>
	);
};

export default SurveyContext;
