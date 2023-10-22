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
                houseOrApartment: "",
                genderPreference: "",
                acceptsPets: "",
                location: "",
                roommates: "",
                leaseLength: "",
                budget: "",
                wheelchairAccessible: "",
                noiseLevel: "",
                acceptSmoker: "",
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
                this.setState({ preferences: userPreferences });
            })
            .catch((err) => {
                console.error("Erro ao listar as preferências do usuário:", err);
            });
    }

    onChange = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState((prevState) => ({
            preferences: {
                ...prevState.preferences,
                [name]: type === "checkbox" ? checked : value,
            },
        }));
    }

    onSubmit = (e) => {
        e.preventDefault();

        // Create an object with updated preferences
        const updatedPreferences = {
            ...this.state.preferences,
        };

        // Dispatch an action to update user preferences
        this.props.updateUserPreferences(updatedPreferences, this.props.history);
    }

    render() {
        const { preferences } = this.state;
        return (
            <div className="edit-preferences-container">
                <div className="edit-preferences-form">
                    <h4 className="form-title">
                        <b>Editar Preferências</b>
                    </h4>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="form-field">
                            <label>Bairro de preferência</label>
                            <input
                                name="location"
                                type="text"
                                value={preferences.location}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-field">
                            <label>Valor de aluguel (R$):</label>
                            <input
                                name="budget"
                                type="number"
                                value={preferences.budget}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-field">
                            <label>Prefere casa ou apartamento?</label>
                            <select
                                name="houseOrApartment"
                                value={preferences.houseOrApartment}
                                onChange={this.onChange}
                            >
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Procuro anúncios de aluguéis destinados à:</label>
                            <select
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
                        <div className="form-field">
                            <label>Aluguel compartilhado?</label>
                            <select
                                name="roommates"
                                value={preferences.roommates}
                                onChange={this.onChange}
                            >
                                <option value="sozinho">Sozinho</option>
                                <option value="compartilhado">Compartilhado</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Duração do aluguel</label>
                            <select
                                name="leaseLength"
                                value={preferences.leaseLength}
                                onChange={this.onChange}
                            >
                                <option value="aluguel anual">Aluguel anual</option>
                                <option value="aluguel temporada">Aluguel temporada</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Nível de barulho</label>
                            <select
                                name="noiseLevel"
                                value={preferences.noiseLevel}
                                onChange={this.onChange}
                            >
                                <option value="tranquilo">Silencioso</option>
                                <option value="barulhento">Social</option>
                            </select>
                        </div>
                        <div className="form-field checkbox-label">
                            <input
                                type="checkbox"
                                name="acceptsPets"
                                checked={preferences.acceptsPets}
                                onChange={this.onChange}
                            />
                            <span className="checkbox-text">Aceita Pets?</span>
                        </div>
                        <div className="form-field checkbox-label">
                            <input
                                type="checkbox"
                                name="wheelchairAccessible"
                                checked={preferences.wheelchairAccessible}
                                onChange={this.onChange}
                            />
                            <span className="checkbox-text">Acessível à cadeirantes?</span>
                        </div>
                        <div className="form-field checkbox-label">
                            <input
                                type="checkbox"
                                name="acceptSmoker"
                                checked={preferences.acceptSmoker}
                                onChange={this.onChange}
                            />
                            <span className="checkbox-text">Fumante?</span>
                        </div>
                        <div className="form-container">
                            <button className="btn-update" type="submit">
                                Atualizar
                            </button>
                        </div>
                    </form>
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
