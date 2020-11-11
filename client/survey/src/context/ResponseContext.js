import React, { createContext, useReducer } from "react";

const ResponseContext = createContext();

const reducer = (state, action) => {
	switch (action.type) {
		case "updateChoice":
			let flag = false;
			for (let i = 0; i < state.choices.length; i++) {
				if (state.choices[i].query === action.queryId) {
					state.choices[i].choice = action.value;
					flag = true;
					break;
				}
			}
			if (!flag) {
				state.choices.push({ query: action.queryId, choice: action.value });
			}
			return { ...state };
		case "setSurvey":
			state.survey = action.value;
			return { ...state };
		case "clearResponse":
			return { survey: state.survey, choices: [] };
		default:
			return { ...state };
	}
};

export const ResponseContextProvider = (props) => {
	const [response, setResponse] = useReducer(reducer, { survey: "", choices: [] });
	return (
		<ResponseContext.Provider value={[response, setResponse]}>
			{props.children}
		</ResponseContext.Provider>
	);
};

export default ResponseContext;
