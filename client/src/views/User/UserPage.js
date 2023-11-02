import React, { Component } from "react";
import axios from "axios"; // For making API requests
import "./UserPage.css";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";

class UserPage extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            error: null,
        };
    }

    componentDidMount() {
        // Make an API request to get the user's information
        axios
            .get("/api/users/me") // Assuming your API route is configured correctly
            .then((response) => {
                this.setState({ user: response.data });
            })
            .catch((error) => {
                this.setState({ error: "Error fetching user information" });
            });
    }

    render() {
        const { user, error } = this.state;

        return (
            <div className="user-profile">
                <h2>User Profile</h2>
                {error && <p className="error">{error}</p>}
                {user && (
                    <div className="user-profile-info">
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        {/* Display other user properties as needed */}
                    </div>
                )}
            </div>
        );
    }
}

UserPage.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(UserPage));
