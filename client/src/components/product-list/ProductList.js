import React, {useEffect, useState} from "react";

const ProductList = ({filteredProductList}) =>  {
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
export default ProductList;