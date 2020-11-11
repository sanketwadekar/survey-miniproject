import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";
import "./NavBar.css";

export default function NavBar(props) {
	const { user, setUser } = useContext(UserContext);
	function logoutController(e) {
		localStorage.removeItem("user");
		setUser(false);
	}
	return (
		<div>
			<ul className="navbar">
				{user && (
					<React.Fragment>
						<li>
							<NavLink
								activeClassName="selected"
								className="navbar-item"
								to="/user/dashboard"
							>
								Profile
							</NavLink>
						</li>

						<li>
							<NavLink
								activeClassName="selected"
								className="navbar-item"
								to="/survey/create"
							>
								Create survey
							</NavLink>
						</li>
						<li >
							<NavLink
								className="navbar-item"
								onClick={logoutController}
								to="/auth/login"
							>
								Logout
							</NavLink>
						</li>
					</React.Fragment>
				)}
				{!user && (
					<React.Fragment>
						<li>
							<NavLink
								activeClassName="selected"
								className="nav-item"
								to="/auth/register"
							>
								Register
							</NavLink>
						</li>
						<li>
							<NavLink
								activeClassName="selected"
								className="nav-item"
								to="/auth/login"
							>
								Login
							</NavLink>
						</li>
					</React.Fragment>
				)}
			</ul>
		</div>
	);
}

export function Header() {
	return <header className="header purple">Purple Surveys</header>;
}
