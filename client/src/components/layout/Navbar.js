import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

class Navbar extends Component {
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
                        <Link
                            to="/edit-preferences"
                            className="btn btn-edit-prefs"
                        >
                            <p>Edit Preferences</p>
                        </Link>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;
