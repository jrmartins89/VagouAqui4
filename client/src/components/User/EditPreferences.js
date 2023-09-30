import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserPreferences } from "../../actions/authActions";
import "./EditPreferences.css"; // Import the CSS file
import axios from "axios"; // Import axios for making API requests

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
            },
        };
    }

    componentDidMount() {
        // Fetch user preferences from the database
        axios
            .get("/api/users/preferences")
            .then((res) => {
                const userPreferences = res.data;
                console.log('preferencia',res.data);
                this.setState({ preferences: userPreferences });
            })
            .catch((err) => {
                console.error("Error fetching user preferences:", err);
            });
    }

    onSubmit = (e) => {
        e.preventDefault();

        // Create an object with updated preferences
        const updatedPreferences = {
            ...this.state.preferences,
        };

        // Dispatch an action to update user preferences
        this.props.updateUserPreferences(updatedPreferences, this.props.history);
    };

    render() {
        const { preferences } = this.state;
        const fieldIcons = {
            name: "account_circle",
            email: "email",
            password: "lock",
            password2: "lock",
            location: "location_on",
            budget: "attach_money",
            houseOrApartment: "home",
            genderPreference: "people",
            acceptsPets: "pets",
            roommates: "groups",
            leaseLength: "event",
            securityDeposit: "security",
            wheelchairAccessible: "accessible",
            noiseLevel: "volume_up",
            acceptSmoker: "smoking_rooms",
            // Add more fields and icons as needed
        };
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
                            <div className="input-field col s12 form-field">
                                <div>
                                    <label>Prefere casa ou apartamento?</label>
                                </div>
                                <select
                                    id="preferences.houseOrApartment"
                                    name="houseOrApartment"
                                    value={preferences.houseOrApartment}
                                    onChange={this.onChange}
                                >
                                    <option value="House">Casa</option>
                                    <option value="Apartment">Apartamento</option>
                                </select>
                            </div>
                            <div className="input-field col s12 form-field">
                                <div>
                                    <label>Procuro anúncios de aluguéis destinados à:</label>
                                </div>
                                <i className="material-icons prefix">{fieldIcons.genderPreference}</i>
                                <select
                                    id="preferences.genderPreference"
                                    name="genderPreference"
                                    value={preferences.genderPreference}
                                    onChange={this.onChange}
                                >
                                    <option value="Men">Homens</option>
                                    <option value="Women">Mulheres</option>
                                    <option value="Any">Tanto Faz</option>
                                </select>
                            </div>
                            {/* Add more preference fields here */}
                            <div className="input-field col s12 form-field">
                                <div>
                                    <label>Aluguel compartilhado?</label>
                                </div>
                                <i className="material-icons prefix">{fieldIcons.roommates}</i>
                                <select
                                    id="preferences.roommates"
                                    name="roommates"
                                    value={preferences.roommates}
                                    onChange={this.onChange}
                                >
                                    <option value="Alone">Sozinho</option>
                                    <option value="With Roommates">Compartilhado</option>
                                </select>
                            </div>
                            <div className="input-field col s12 form-field">
                                <div>
                                    <label>Duração do aluguel</label>
                                </div>
                                <i className="material-icons prefix">{fieldIcons.leaseLength}</i>
                                <select
                                    id="preferences.leaseLength"
                                    name="leaseLength"
                                    value={preferences.leaseLength}
                                    onChange={this.onChange}
                                >
                                    <option value="year round">Aluguel anual</option>
                                    <option value="monthly basis">Aluguel temporada</option>
                                </select>
                            </div>
                            <div className="input-field col s12 form-field">
                                <p className="checkbox-label">
                                    <i className="material-icons prefix">{fieldIcons.acceptsPets}</i>
                                    <label>
                                        <input
                                            type="checkbox"
                                            id="preferences.acceptsPets"
                                            name="acceptsPets"
                                            checked={preferences.acceptsPets}
                                            onChange={this.onChange}
                                        />
                                        <span className="checkbox-text">Aceita Pets?</span>
                                    </label>
                                </p>
                            </div>
                            <div className="input-field col s12 form-field">
                                <p className="checkbox-label">
                                    <i className="material-icons prefix">{fieldIcons.wheelchairAccessible}</i>
                                    <label>
                                        <input
                                            type="checkbox"
                                            id="preferences.wheelchairAccessible"
                                            name="wheelchairAccessible"
                                            checked={preferences.wheelchairAccessible}
                                            onChange={this.onChange}
                                        />
                                        <span className="checkbox-text">Acessível à cadeirantes?</span>
                                    </label>
                                </p>
                            </div>
                            <div className="input-field col s12 form-field">
                                <p className="checkbox-label">
                                    <i className="material-icons prefix">{fieldIcons.acceptSmoker}</i>
                                    <label>
                                        <input
                                            type="checkbox"
                                            id="preferences.acceptSmoker"
                                            name="acceptSmoker"
                                            checked={preferences.acceptSmoker}
                                            onChange={this.onChange}
                                        />
                                        <span className="checkbox-text">Fumante?</span>
                                    </label>
                                </p>
                            </div>
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
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { updateUserPreferences })(
    withRouter(EditPreferences)
);
