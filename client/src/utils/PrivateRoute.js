import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Componente PrivateRoute - uma rota protegida que redireciona para a página de login se o usuário não estiver autenticado
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            auth.isAuthenticated === true ? (
                // Se autenticado, renderiza o componente passando as props
                <Component {...props} />
            ) : (
                // Se não autenticado, redireciona para a página de login
                <Redirect to="/login" />
            )
        }
    />
);

// Define os tipos esperados das propriedades
PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

// Mapeia o estado do Redux para as propriedades do componente
const mapStateToProps = state => ({
    auth: state.auth
});

// Conecta o componente ao Redux
export default connect(mapStateToProps)(PrivateRoute);
