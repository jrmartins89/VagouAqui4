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
        const { isAuthenticated } = this.props.auth;

        return (
            <div className="navbar-fixed">
                <nav className="z-depth-0">
                    <div className="nav-wrapper white">
                        <Link
                            to="/"
                            className="col s5 brand-logo center black-text"
                        >
                            <i className="material-icons">code</i>
                            Página Inicial
                        </Link>
                        <Link to="/preferences" className="btn btn-edit-prefs">
                            <p>Edit Preferences</p>
                        </Link>
                        { isAuthenticated ? (
                            <button
                                onClick={this.onLogoutClick}
                                className="btn btn-logout"
                            >
                                <b>Logout</b>
                            </button>
                        ) : null }
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
