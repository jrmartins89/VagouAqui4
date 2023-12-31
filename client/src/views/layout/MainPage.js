import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./MainPage.css"; // Importa os estilos CSS para a MainPage

class MainPage extends Component {
    render() {
        const { isAuthenticated } = this.props.auth;

        return (
            <div className="container-valign">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4 className="title">
                            <b>Página Principal</b>
                        </h4>
                        <p className="description">
                            Portal de anúncios de aluguéis em Florianópolis indexados a partir de técnicas de WebScrapping
                        </p>
                        <p className="description">INE - UFSC - 2023</p>
                        <br />
                        {isAuthenticated ? (
                            <div className="main-buttons">
                                <Link to="/products" className="btn btn-produtos">
                                    <b>Anúncios</b>
                                </Link>
                                <Link to="/me" className="btn btn-profile">
                                    <b>Perfil</b>
                                </Link>
                            </div>
                        ) : (
                            <div className="main-buttons">
                                <Link to="/register" className="btn btn-cadastro">
                                    <b>Cadastro</b>
                                </Link>
                                <Link to="/login" className="btn btn-login">
                                    <b>Log In</b>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(MainPage);
