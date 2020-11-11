import React, { useContext, useState } from "react";
import "./App.css";
import AuthComponent from "./components/AuthComponents";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import NavBar, { Header } from "./components/NavBar";
import UserContext from "./context/UserContext";
import { SurveyCreatorComponent } from "./components/SurveyComponent";
import { SurveyProvider } from "./context/SurveyContext";
import ResponseComponent from "./components/ResponseComponent";
import { ResponseContextProvider } from "./context/ResponseContext";
import UserProfileComponent from "./components/UserProfileComponent";
import { UserSurveyListContextProvider } from "./context/UserSurveyListContext";
import { SurveyViewComponent } from "./components/SurveyViewerComponents";

function ProtectedRoute(props) {
	const { user, setUser } = useContext(UserContext);
	return user ? props.children : <Redirect to="/auth/login" push />;
}

function App() {
	const u = JSON.parse(localStorage.getItem("user"));
	const [user, setUser] = useState(
		u && u.expiresAt > Math.round(Date.now() / 10000) ? u : false
	);
	const value = { user, setUser };
	return (
		<div className="App">
			<Header />
			<UserContext.Provider value={value}>
				<ResponseContextProvider>
					<UserSurveyListContextProvider>
						<Router>
							<NavBar />
							<Switch>
								<Route path="/auth">
									{user ? <Redirect to="/user/dashboard" /> : <AuthComponent />}
								</Route>
								<Route path="/survey/create" exact>
									<ProtectedRoute>
										<SurveyProvider>
											<SurveyCreatorComponent />
										</SurveyProvider>
									</ProtectedRoute>
								</Route>
								<Route
									path="/survey/fill/:id"
									component={ResponseComponent}
								></Route>
								<Route path="/user/dashboard">
									<ProtectedRoute>
										<UserProfileComponent />
									</ProtectedRoute>
								</Route>
								<ProtectedRoute>
									<Route
										path="/survey/view/:id"
										component={SurveyViewComponent}
									></Route>
								</ProtectedRoute>
							</Switch>
						</Router>
					</UserSurveyListContextProvider>
				</ResponseContextProvider>
			</UserContext.Provider>
		</div>
	);
}

export default App;
