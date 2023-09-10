import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import "./Register.css"; // Import the CSS file

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {},
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
                noiseLevel: "Quiet"
                // Add more preference fields as needed
            }
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        if (e.target.id.startsWith("preferences.")) {
            // Handle changes in preference fields
            const preferenceField = e.target.id.split(".")[1];
            const newValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;

            this.setState(prevState => ({
                preferences: {
                    ...prevState.preferences,
                    [preferenceField]: newValue
                }
            }));
        } else {
            // Handle changes in non-preference fields
            this.setState({ [e.target.id]: e.target.value });
        }
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            preferences: this.state.preferences
        };
        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        const { errors, preferences } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect btn-back">
                            <i className="material-icons left">keyboard_backspace</i> Back to home
                        </Link>
                        <div className="col s12 form-container">
                            <h4 className="form-title">
                                <b>Register</b> below
                            </h4>
                            <p className="grey-text text-darken-1">
                                Already have an account? <Link to="/login" className="login-link">Log in</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12 form-field">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    error={errors.name}
                                    id="name"
                                    name="name"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.name
                                    })}
                                />
                                <label htmlFor="name">Name</label>
                                <span className="red-text">{errors.name}</span>
                            </div>
                            <div className="input-field col s12 form-field">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={classnames("", {
                                        invalid: errors.email
                                    })}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="red-text">{errors.email}</span>
                            </div>
                            <div className="input-field col s12 form-field">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password
                                    })}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="input-field col s12 form-field">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    id="password2"
                                    name="password2"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password2
                                    })}
                                />
                                <label htmlFor="password2">Confirm Password</label>
                                <span className="red-text">{errors.password2}</span>
                            </div>

                            {/* Preferences Fields */}
                            <div className="input-field col s12 form-field">
                                <label htmlFor="preferences.location">Preferred Location</label>
                                <input
                                    id="preferences.location"
                                    name="location"
                                    type="text"
                                    value={preferences.location}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="input-field col s12 form-field">
                                <label>House or Apartment</label>
                                <select
                                    id="preferences.houseOrApartment"
                                    name="houseOrApartment"
                                    value={preferences.houseOrApartment}
                                    onChange={this.onChange}
                                >
                                    <option value="House">House</option>
                                    <option value="Apartment">Apartment</option>
                                </select>
                            </div>

                            <div className="input-field col s12 form-field">
                                <label>Gender Preference</label>
                                <select
                                    id="preferences.genderPreference"
                                    name="genderPreference"
                                    value={preferences.genderPreference}
                                    onChange={this.onChange}
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Any">Any</option>
                                </select>
                            </div>

                            <div className="input-field col s12 form-field">
                                <label>Accepts Pets</label>
                                <p>
                                    <label>
                                        <input
                                            type="checkbox"
                                            id="preferences.acceptsPets"
                                            name="acceptsPets"
                                            checked={preferences.acceptsPets}
                                            onChange={this.onChange}
                                        />
                                        <span>Yes</span>
                                    </label>
                                </p>
                            </div>

                            {/* Add more preference fields here */}

                            <div className="col s12 form-container">
                                <button
                                    className="btn btn-large waves-effect waves-light hoverable btn-register"
                                    type="submit"
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));
