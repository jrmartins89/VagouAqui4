import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; // Import connect from React Redux
import "./MainPage.css"; // Import the CSS file

class MainPage extends Component {
    render() {
        const { isAuthenticated } = this.props.auth;

        return (
            <div className="container-valign container valign-wrapper">
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
                            <div className="col s6">
                                <Link
                                    to="/products"
                                    className="btn button btn-produtos"
                                >
                                    Anúncios
                                </Link>
                            </div>
                        ) : (
                            <div className="col s6">
                                <Link
                                    to="/register"
                                    className="btn button btn-cadastro"
                                >
                                    Cadastro
                                </Link>
                            </div>
                        )}
                        <div className="col s6">
                            <Link
                                to="/login"
                                className="btn button btn-login"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(MainPage); // Connect the component to Redux
