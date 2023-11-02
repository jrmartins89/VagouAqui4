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
                <h2>Perfil</h2>
                {error && <p className="error">{error}</p>}
                {user && (
                    <div className="user-profile-info">
                        <p className="user-profile-label">Nome:</p><b>{user.name}</b>
                        <p className="user-profile-label">Email:</p><b>{user.email}</b>
                        <p className="user-profile-label">Prefiro casa ou apartamento:</p><b>{user.preferences.houseOrApartment}</b>
                        <p className="user-profile-label">Anúncios com colegas de quarto do gênero:</p><b>{user.preferences.genderPreference}</b>
                        <p className="user-profile-label">Anúncios com pets:</p><b>{user.preferences.acceptsPets ? 'Sim' : 'Não'}</b>
                        <p className="user-profile-label">Preferência por anúncios localizados em:</p><b>{user.preferences.location}</b>
                        <p className="user-profile-label">Preferência por anúncios de aluguéis compartilhados:</p><b>{user.preferences.roommates}</b>
                        <p className="user-profile-label">Preferência por anúncios do tipo:</p><b>{user.preferences.leaseLength}</b>
                        <p className="user-profile-label">Preferência por anúncios que aceitem fumante:</p><b>{user.preferences.acceptSmoker ? 'Sim' : 'Não'}</b>
                        <p className="user-profile-label">Preferência por anúncios que possuem mobília:</p><b>{user.preferences.hasFurniture ? 'Sim' : 'Não'}</b>
                        <p className="user-profile-label">Preferência por anúncios de locais com nível de barulho:</p><b>{user.preferences.noiseLevel}</b>
                        <p className="user-profile-label">Preferência por anúncios de locais acessíveis à cadeirantes:</p><b>{user.preferences.wheelchairAccessible ? 'Sim' : 'Não'}</b>
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
