import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions.js";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./views/layout/Navbar";
import Landing from "./views/layout/MainPage";
import Register from "./views/User/Register";
import Login from "./views/User/Login";
import PrivateRoute from "./utils/PrivateRoute";
import Dashboard from "./views/layout/Landing";
import AdGrid from "./views/adGrid/AdGrid";
import EditPreferences from "./views/User/EditPreferences";
import RecommendedGrid from "./views/adGrid/RecommendedGrid";
import UserPage from "./views/User/UserPage";

// Verifica se há um token para manter o usuário logado
if (localStorage.jwtToken) {
    // Define o cabeçalho do token do usuário
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decodifica o token e obtém as informações do usuário e expiração
    const decoded = jwt_decode(token);
    // Define o usuário e isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Verifica se o token expirou
    const currentTime = Date.now() / 1000; // para obter em milissegundos
    if (decoded.exp < currentTime) {
        // Faz logout do usuário
        store.dispatch(logoutUser());
        // Redireciona para a página de login
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
