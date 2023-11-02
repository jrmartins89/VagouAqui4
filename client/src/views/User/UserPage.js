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
                        <p>Nome: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Prefiro casa ou apartamento: {user.preferences.houseOrApartment}</p>
                        <p>Anúncios com colegas de quarto do gênero: {user.preferences.genderPreference}</p>
                        <p>Anúncios com pets: {user.preferences.acceptsPets ? 'Sim' : 'Não'}</p>
                        <p>Preferência por anúncios localizados em: {user.preferences.location}</p>
                        <p>Preferência por anúncios de aluguéis compartilhados: {user.preferences.roommates}</p>
                        <p>Preferência por anúncios do tipo: {user.preferences.leaseLength}</p>
                        <p>Preferência por anúncios que aceitem fumante: {user.preferences.acceptSmoker ? 'Sim' : 'Não'}</p>
                        <p>Preferência por anúncios que possuem mobília: {user.preferences.hasFurniture ? 'Sim' : 'Não'}</p>
                        <p>Preferência por anúncios de locais com nível de barulho: {user.preferences.noiseLevel}</p>
                        <p>Preferência por anúncios de locais acessíveis à cadeirantes: {user.preferences.wheelchairAccessible ? 'Sim' : 'Não'}</p>
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
