import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./views/layout/Navbar";
import Landing from "./views/layout/MainPage";
import Register from "./views/User/Register";
import Login from "./views/User/Login";
import PrivateRoute from "./views/privateRoute/PrivateRoute";
import Dashboard from "./views/layout/Landing";
import AdGrid from "./views/adGrid/AdGrid";
import EditPreferences from "./views/User/EditPreferences";
import RecommendedGrid from "./views/adGrid/RecommendedGrid";
import UserPage from "./views/User/UserPage";
// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set User token header User
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
// Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        // Redirect to log in
        window.location.href = "./login";
    }
}
class App extends Component {
    render() {
        return (
            <Provider store={store}>
            <Router>
                <div className="App">
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <Switch>
                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        <PrivateRoute exact path="/products" component={AdGrid} />
                        <PrivateRoute exact path="/preferences" component={EditPreferences} />
                        <PrivateRoute exact path="/recommendation" component={RecommendedGrid} />
                        <PrivateRoute exact path="/me" component={UserPage} />
                    </Switch>
                </div>
            </Router>
            </Provider>
        );
    }
}
export default App;