import React, { Component } from 'react';
import './UserPage.css';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom"; // Import the CSS file

class UserPage extends Component {
    render() {
        const { user } = this.props; // Assuming user data is passed as a prop

        if (!user) {
            return null; // Return nothing if user data is not available
        }

        return (
            <div className="user-profile">
                <h2>User Profile</h2>
                <div className="user-info">
                    <div>
                        <strong>Name:</strong> {user.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                        <strong>Preferences:</strong>
                        <ul>
                            <li>House or Apartment: {user.preferences.houseOrApartment}</li>
                            <li>Gender Preference: {user.preferences.genderPreference}</li>
                            <li>Accepts Pets: {user.preferences.acceptsPets ? 'Yes' : 'No'}</li>
                            {/* Add more preference fields here */}
                        </ul>
                    </div>
                </div>
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