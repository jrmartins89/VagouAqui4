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
                houseOrApartment: "apartamento",
                genderPreference: "tanto faz",
                acceptsPets: false,
                location: "",
                roommates: "sozinho",
                leaseLength: "",
                budget: "",
                wheelchairAccessible: false,
                noiseLevel: "tranquilo",
                acceptSmoker: false,
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
                        <Link to="/" className="btn-flat waves-effect btn-back">
                            <i className="material-icons left">keyboard_backspace</i> Voltar ao início
                        </Link>
                        <div className="col s12 form-container">
                            <h4 className="form-title">
                                <b>Cadastre-se</b> abaixo
                            </h4>
                            <p className="grey-text text-darken-1">
                                Já possui uma conta? <Link to="/login" className="login-link">Fazer log in</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">{fieldIcons.name}</i>
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
                                <label htmlFor="name">Nome</label>
                                <span className="red-text">{errors.name}</span>
                            </div>
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">{fieldIcons.email}</i>
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
                                <i className="material-icons prefix">{fieldIcons.password}</i>
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
                                <label htmlFor="password">Digitar Senha</label>
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">{fieldIcons.password2}</i>
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
                                <label htmlFor="password2">Confirmar Senha</label>
                                <span className="red-text">{errors.password2}</span>
                            </div>

                            {/* Preferences Fields */}
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">{fieldIcons.location}</i>
                                <input
                                    id="preferences.location"
                                    name="location"
                                    type="text"
                                    value={preferences.location}
                                    onChange={this.onChange}
                                />
                                <label htmlFor="preferences.location">Bairro preferencial para locação</label>
                            </div>
                            <div className="input-field col s12 form-field">
                                <i className="material-icons prefix">{fieldIcons.budget}</i>
                                <input
                                    id="preferences.budget"
                                    name="budget"
                                    type="text"
                                    value={preferences.budget}
                                    onChange={this.onChange}
                                />
                                <label htmlFor="preferences.budget">Procuro anúncios em torno de (R$):</label>
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
                                    <option value="casa">Casa</option>
                                    <option value="apartmento">Apartamento</option>
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
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="tanto faz">Tanto Faz</option>
                                    <option value="ambos">Ambos</option>
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
                                    <option value="sozinho">Sozinho</option>
                                    <option value="compartihado">Compartilhado</option>
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
                                    <option value="aluguel anual">Aluguel anual</option>
                                    <option value="aluguel mensal">Aluguel temporada</option>
                                </select>
                            </div>
                            <div className="input-field col s12 form-field">
                                <div>
                                    <label>Nível de barulho</label>
                                </div>
                                <i className="material-icons prefix">{fieldIcons.noiseLevel}</i>
                                <select
                                    id="preferences.noiseLevel"
                                    name="noiseLevel"
                                    value={preferences.noiseLevel}
                                    onChange={this.onChange}
                                >
                                    <option value="tranquilo">Silencioso</option>
                                    <option value="barulhento">Social</option>
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
