import React from "react";

const UserContext = React.createContext({user: undefined, setUserContext: ()=>{}});

export default UserContext;