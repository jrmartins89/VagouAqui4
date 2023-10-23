import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
import "./Landing.css"; // Import the CSS file

class Landing extends Component {
    render() {
        const { user } = this.props.auth;

        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Hey there,</b> {user.name.split(" ")[0]}
                        </h4>
                        <p className="flow-text grey-text text-darken-1">
                            You are logged into VagouAqui
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <Link
                            to="/products"
                            className="btn produtos-btn waves-effect waves-light hoverable"
                        >
                            Anúncios
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

Landing.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Landing);
