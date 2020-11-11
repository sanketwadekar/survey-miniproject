import React, { useContext, useState } from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import UserContext from "../context/UserContext";
import "./AuthComponents.css";

export function LoginComponent(props) {
	const { setUser } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const loginController = async () => {
		try {
			const url = "/api/auth/login";
			const options = {
				method: "post",
				body: JSON.stringify({ email, password }),
				headers: { "Content-Type": "application/json" },
			};
			const response = await fetch(url, options);
			if (response.status === 200) {
				const data = await response.json();
				setUser({ ...data });
				localStorage.setItem("user", JSON.stringify(data));
			} else {
				alert(`Error code ${response.status}: ${response.statusText}`);
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className="auth-container">
			<div className="auth-header">Login</div>
			<div>
				<div>
					{" "}
					<input
						type="text"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						placeholder="Email"
					/>
				</div>
				<div>
					<input
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						placeholder="Password"
					/>
				</div>
				<div>
					<button onClick={loginController}>Login</button>
				</div>
			</div>
			<div>
				<p>
					No Account? <NavLink to="/auth/register">Register here..</NavLink>
				</p>
			</div>
		</div>
	);
}

export function RegisterComponent(props) {
	const { setUser } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");
	const registerController = async () => {
		try {
			if(!(password && passwordCheck && email && name)){
				alert("Enter all fields");
			}
			if (password !== passwordCheck) {
				alert("Passwords do not match");
				return;
			}
			const url = "/api/auth/register";
			const options = {
				method: "post",
				body: JSON.stringify({ email, name, password, passwordCheck }),
				headers: { "Content-Type": "application/json" },
			};
			const response = await fetch(url, options);
			if (response.status === 200) {
				const data = await response.json();
				setUser({ ...data});
				localStorage.setItem("user", JSON.stringify(data));
			} else {
				alert(`Error code ${response.status}: ${response.statusText}`);
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className="auth-container">
			<div className="auth-header">Register</div>
			<div>
				<input
					type="text"
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
					placeholder="Name"
				/>
			</div>
			<div>
				<input
					type="text"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
					placeholder="Email"
				/>
			</div>
			<div>
				<input
					type="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					placeholder="Password"
				/>
			</div>
			<div>
				<input
					type="password"
					value={passwordCheck}
					onChange={(e) => {
						setPasswordCheck(e.target.value);
					}}
					placeholder="Confirm Password"
				/>
			</div>
			<div>
				<button onClick={registerController}>Register</button>
			</div>
			<div>
				<div>
					<p>
						Have an account?
						<NavLink to="/auth/login"> Login here..</NavLink>
					</p>
				</div>
			</div>
		</div>
	);
}

export default function AuthComponent(props) {
	return (
		<Switch>
			<React.Fragment>
				<Route path={`/auth/login`} exact>
					<LoginComponent />
				</Route>
				<Route path={`/auth/register`} exact>
					<RegisterComponent />
				</Route>
			</React.Fragment>
		</Switch>
	);
}
