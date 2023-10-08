import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserPreferences } from "../../actions/authActions";
import "./RecommendedGrid.css"; // Import the CSS file
import axios from "axios"; // Import axios for making API requests

class RecommendedGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendations: [], // Initialize an empty array to store recommendations
        };
    }

    componentDidMount() {
        // Make an API request to fetch recommendations when the component mounts
        axios.get("/api/recommendation") // Replace with your API endpoint
            .then((response) => {
                this.setState({ recommendations: response.data }); // Update the state with recommendations data
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
            });
    }

    render() {
        const { recommendations } = this.state;
        return (
            <div className="recommended-grid">
                <h2>Recommended Items</h2>
                <div className="grid">
                    {recommendations.map((item) => (
                        <div key={item.id} className="grid-item">
                            {/* Display recommended items here */}
                            <img src={item.imageUrl} alt={item.name} />
                            <h3>{item.name}</h3>

                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

RecommendedGrid.propTypes = {
    updateUserPreferences: PropTypes.func.isRequired,
};

export default withRouter(
    connect(null, { updateUserPreferences })(RecommendedGrid)
);
