import React, { Component } from "react";
import axios from "axios";
import "./UserPage.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions"; // Import the logoutUser action

class UserPage extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            error: null,
            confirmDelete: false,
        };
    }

    componentDidMount() {
        this.fetchUserData();
    }

    fetchUserData = () => {
        axios
            .get("/api/users/me")
            .then((response) => {
                this.setState({ user: response.data });
            })
            .catch((error) => {
                this.setState({ error: "Error fetching user information" });
            });
    };

    handleDeleteAccount = () => {
        // Show confirmation dialog
        this.setState({ confirmDelete: true });
    };

    confirmDelete = () => {
        // User confirmed account deletion
        axios
            .delete("/api/users/delete")
            .then(() => {
                // Dispatch the logoutUser action to log the user out
                this.props.logoutUser();
                // Redirect to the home page after successful deletion
                this.props.history.push("/");
            })
            .catch((error) => {
                console.log(error);
                // Handle deletion error
            });
    };

    cancelDelete = () => {
        // User canceled account deletion
        this.setState({ confirmDelete: false });
    };

    render() {
        const { user, error, confirmDelete } = this.state;

        return (
            <div className="user-profile">
                {error && <p className="error">{error}</p>}
                {user && (
                    <div className="user-profile-info">
                        <div>
                        <h2>Perfil</h2>
                        <p className="user-profile-label"><b>Nome:</b></p><b className="user-profile-value">{user.name}</b>
                        <p className="user-profile-label"><b>Email:</b></p><b className="user-profile-value">{user.email}</b>
                        <p className="user-profile-label"><b>Prefiro casa ou apartamento:</b></p><b className="user-profile-value">{user.preferences.houseOrApartment}</b>
                        <p className="user-profile-label"><b>Anúncios com colegas de quarto do gênero:</b></p><b className="user-profile-value">{user.preferences.genderPreference}</b>
                        <p className="user-profile-label"><b>Anúncios com pets:</b></p><b className="user-profile-value">{user.preferences.acceptsPets ? 'Sim' : 'Não'}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios localizados em:</b></p><b className="user-profile-value">{user.preferences.location}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios de aluguéis compartilhados:</b></p><b className="user-profile-value">{user.preferences.roommates}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios do tipo:</b></p><b className="user-profile-value">{user.preferences.leaseLength}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios que aceitem fumante:</b></p><b className="user-profile-value">{user.preferences.acceptSmoker ? 'Sim' : 'Não'}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios que possuem mobília:</b></p><b className="user-profile-value">{user.preferences.hasFurniture ? 'Sim' : 'Não'}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios de locais com nível de barulho:</b></p><b className="user-profile-value">{user.preferences.noiseLevel}</b>
                        <p className="user-profile-label"><b>Preferência por anúncios de locais acessíveis à cadeirantes:</b></p><b className="user-profile-value">{user.preferences.wheelchairAccessible ? 'Sim' : 'Não'}</b>
                    </div>
                {confirmDelete ? (
                            <div>
                                <p>
                                    Tem certeza de que deseja excluir a sua conta?
                                </p>
                                <button
                                    className="btn btn-danger"
                                    onClick={this.confirmDelete}
                                >
                                    Confirmar Exclusão
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={this.cancelDelete}
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn btn-danger"
                                onClick={this.handleDeleteAccount}
                            >
                                Deletar conta
                            </button>
                        )}
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

export default connect(mapStateToProps, { logoutUser })(withRouter(UserPage));
