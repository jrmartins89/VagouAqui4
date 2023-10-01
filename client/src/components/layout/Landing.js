import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; // Import connect from React Redux
import "./Landing.css"; // Import the CSS file

class Landing extends Component {
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
                            Portal de anúncios de aluguéis em Florianópolis indexados a partir de técnicas de{" "}
                            <span className="monospace">WebScrapping</span>
                        </p>
                        <p className="flow-text grey-text text-darken-1">INE - UFSC - 2023</p>
                        <br />
                        {isAuthenticated ? (
                            <div className="col s6">
                                <Link
                                    to="/products"
                                    className="btn button btn-produtos waves-effect waves-light hoverable"
                                >
                                    Produtos
                                </Link>
                            </div>
                        ) : (
                            <div className="col s6">
                                <Link
                                    to="/register"
                                    className="btn button btn-cadastro waves-effect waves-light hoverable"
                                >
                                    Cadastro
                                </Link>
                            </div>
                        )}
                        <div className="col s6">
                            <Link
                                to="/login"
                                className="btn button btn-login waves-effect waves-light hoverable"
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

export default connect(mapStateToProps)(Landing); // Connect the component to Redux
