import React, { Component } from "react";
import { Link } from "react-router-dom";
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
                            Início
                        </Link>
                        <div className="nav-buttons"> {/* Wrap the buttons in a div */}
                            {isAuthenticated && (
                                <Link to="/preferences" className="btn btn-edit-prefs">
                                    <p>Editar Preferências</p>
                                </Link>
                            )}
                            {isAuthenticated && (
                                <button
                                    onClick={this.showRecommendations}
                                    className="btn btn-show-recommendations"
                                >
                                    <p>Show Recommendations</p>
                                </button>
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

export default connect(mapStateToProps, { logoutUser })(Navbar);
