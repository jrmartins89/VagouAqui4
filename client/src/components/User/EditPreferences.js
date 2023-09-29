import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserPreferences } from "../../actions/authActions";
import "./EditPreferences.css"; // Import the CSS file

class EditPreferences extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preferences: {
                houseOrApartment: "Apartment",
                genderPreference: "Any",
                acceptsPets: false,
                location: "",
                roommates: "Alone",
                amenities: "",
                leaseLength: "",
                budget: "",
                securityDeposit: "",
                wheelchairAccessible: false,
                noiseLevel: "Quiet",
                acceptSmoker: false,
                // Add more preference fields as needed
            }
        };
    }

    componentDidMount() {
        // Populate preferences from the Redux store or API
        const { user } = this.props.auth;
        if (user && user.preferences) {
            this.setState({ preferences: user.preferences });
        }
    }

    onChange = (e) => {
        const { preferences } = this.state;

        if (e.target.id.startsWith("preferences.")) {
            // Handle changes in preference fields
            const preferenceField = e.target.id.split(".")[1];
            const newValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;

            this.setState({
                preferences: {
                    ...preferences,
                    [preferenceField]: newValue
                }
            });
        }
    };

    onSubmit = (e) => {
        e.preventDefault();

        // Create an object with updated preferences
        const updatedPreferences = {
            preferences: this.state.preferences
        };

        // Dispatch an action to update user preferences
        this.props.updateUserPreferences(updatedPreferences, this.props.history);
    };

    render() {
        const { preferences } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2">
                        <div className="col s12 form-container">
                            <h4 className="form-title">
                                <b>Edit Preferences</b>
                            </h4>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            {/* Preferences Fields */}
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">location_on</i>
                                <input
                                    id="preferences.location"
                                    name="location"
                                    type="text"
                                    value={preferences.location}
                                    onChange={this.onChange}
                                    className="validate"
                                />
                                <label htmlFor="preferences.location">Preferred Location</label>
                            </div>
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">attach_money</i>
                                <input
                                    id="preferences.budget"
                                    name="budget"
                                    type="number"
                                    value={preferences.budget}
                                    onChange={this.onChange}
                                    className="validate"
                                />
                                <label htmlFor="preferences.budget">Budget (R$):</label>
                            </div>
                            {/* Render other preference fields */}
                            {/* ... (other preference fields) ... */}
                            <div className="col s12 form-container">
                                <button
                                    className="btn btn-large waves-effect waves-light hoverable btn-update"
                                    type="submit"
                                >
                                    Update Preferences
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

EditPreferences.propTypes = {
    updateUserPreferences: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { updateUserPreferences }
)(withRouter(EditPreferences));
