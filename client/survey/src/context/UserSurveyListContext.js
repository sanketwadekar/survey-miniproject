import React, { useReducer } from "react";

const UserSurveyListContext = React.createContext();
export default UserSurveyListContext;

export const types = {
	deleteQuery: "deleteQuery",
	addQuery: "addQuery",
};

const reducer = (state, action) => {
	switch (action.type) {
		case types.deleteQuery:
			return state.filter((s) => s._id !== action.id);
		case types.addQuery:
			return action.data;
		default:
			return state;
	}
};

export const UserSurveyListContextProvider = (props) => {
	const [surveys, setSurveys] = useReducer(reducer, []);
	return (
		<UserSurveyListContext.Provider value={[surveys, setSurveys]}>
			{props.children}
		</UserSurveyListContext.Provider>
	);
};
