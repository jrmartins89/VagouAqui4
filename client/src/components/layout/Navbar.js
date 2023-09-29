import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; // Import connect for Redux integration
import { logoutUser } from "../../actions/authActions"; // Import the logout action
import "./Navbar.css"; // Import the CSS file

class Navbar extends Component {
    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
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
                        {/* Logout button */}
                        <button
                            onClick={this.onLogoutClick}
                            className="btn btn-logout"
                        >
                            Logout
                        </button>
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
