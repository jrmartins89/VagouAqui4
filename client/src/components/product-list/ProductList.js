import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";


const [loading, setLoading] = useState(false);
const [productList, setProductList] = useState([]);
const [categories, setCategories] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);
const [fileredProductList, setFilteredProductList] = useState([]);

const addCategory = (category) => {
    if(!selectedCategories.includes(category)){
        setSelectedCategories(prev => ([...prev, category]))
    }
}

const removeCategory = (category) => {
    if(selectedCategories.includes(category)){
        console.log(selectedCategories)
        const removedList = selectedCategories.filter((item) => (item !== category));
        setSelectedCategories(removedList);
    }
}

const resetCategory = () => {
    setSelectedCategories([]);
}

useEffect(() => {
    if(selectedCategories.length === 0){
        setFilteredProductList(productList);
    } else{
        setFilteredProductList(productList.filter((item)=>(selectedCategories.includes(item.category))));
    }
}, [selectedCategories, productList])
const getCategories = async () => {
    setLoading(true);

    await fetch('https://dummyjson.com/products/categories')
        .then(res => res.json())
        .then(data => {
            const arr = data.slice(0, 6);
            setCategories(arr);
        })
        .catch(err => alert(err))
        .finally(()=>{
            setLoading(false);
        })
}

const getProducts = async () => {
    setLoading(true);

    await fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            setProductList(data.products);
            setFilteredProductList(data.products);
            getCategories(); // get the categories list
        })
        .catch(err => alert(err))
        .finally(()=>{
            setLoading(false);
        })
}

useEffect(() => {
    getProducts();
    // eslint-disable-next-line
}, [])

class ProductList extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    render() {
        const { user } = this.props.auth;

        return (
            <div className='w-screen h-screen px-5 bg-gray-100 flex justify-center items-center'>
                <div className='w-full h-[90%] rounded-md bg-white'>
                    <div className='relative w-full h-[15%] flex items-center overflow-x-auto'>
                        <span className='mx-3 ml-5 font-medium'> Filtros: </span>
                        {
                            categories.map((category) => (
                                <div
                                    onClick={() => {
                                        if(selectedCategories.includes(category)){
                                            removeCategory(category);
                                        } else{
                                            addCategory(category);
                                        }
                                    }}
                                    className={`w-fit min-w-fit h-8 mx-2 px-5 py-2 flex flex-row justify-center items-center text-sm border break-keep rounded-3xl cursor-pointer transition-all duration-300 ${(selectedCategories.includes(category))?'border-blue-500 bg-blue-500 text-white':' border-gray-500 bg-white text-gray-900'} `}>
                                    {category.split("-").join(" ")}
                                </div>
                            ))
                        }
                        <div
                            onClick={() => resetCategory()}
                            className={`${(selectedCategories.length>0)?'opacity-100':'opacity-0 pointer-events-none'} sticky right-0 w-fit h-full px-5 flex justify-center items-center text-blue-500 bg-white backdrop-blur-lg cursor-pointer hover:text-blue-700 transition-all duration-300`}
                        >
                            clear
                        </div>
                    </div>
                    <ProductList filteredProductList={fileredProductList} loading={loading} />
                </div>
            </div>
        );
    }
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