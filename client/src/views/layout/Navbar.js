import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import "./Navbar.css";

class Navbar extends Component {
    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        return (
            <div className="navbar">
                <nav className="z-depth-0">
                    <div className="nav-wrapper">
                        <Link to="/" className="col s5 brand-logo center black-text">
                            <b className="home-link"> Início</b>
                        </Link>
                        <div className="nav-buttons">
                            {isAuthenticated && (
                                <Link to="/preferences" className="btn-edit-prefs">
                                    <p>Editar Preferências</p>
                                </Link>
                            )}
                            {isAuthenticated && (
                                <Link to="/recommendation" className="btn-show-recommendations">
                                    <p>Recomendações</p>
                                </Link>
                            )}
                        </div>
                        {isAuthenticated ? (
                            <div className="user-info">
                                <span className="user-email">{user.email}</span>
                                <button
                                    onClick={this.onLogoutClick}
                                    className="btn btn-logout"
                                >
                                    <b>Logout</b>
                                </button>
                            </div>
                        ) : null}
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps, { logoutUser })(Navbar));
