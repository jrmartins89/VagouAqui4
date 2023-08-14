import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";

const ProductList = () =>  {
    const [filteredProductList] = useState([]);
        return (
            <div className="w-full h-[85%] px-5">
                <h4>
                    <b>Hey there,</b>
                </h4>
                <div className="w-full">Anúncios: </div>
                <div className="w-full h-full flex flex-wrap gap-1 justify-between items-start overflow-y-auto">
                    {
                        filteredProductList.map((product) => (
                            <div key={product.id} className='w-[19%] h-fit my-3 rounded-xl overflow-hidden border border-gray-200'>
                                <img
                                    src={product.thumbnail}
                                    alt='product'
                                    className='w-full h-28 object-cover'
                                />
                                <div className="mt-2 mb-2 px-3">
                                    <div className="font-semibold">
                                        {(product.title.length > 25)? product.title.substring(0,22) + '...': product.title}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {product.category}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
}
ProductList.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(ProductList);