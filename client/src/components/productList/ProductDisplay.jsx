import React, { useEffect, useState } from 'react'
import ProductList from "./ProductList";

const ProductDisplay = () => {

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
        <div
            style={{
                width: '100vw',
                height: '100vh',
                padding: '1.25rem',
                backgroundColor: '#E5E7EB',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '90%',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '15%',
                        display: 'flex',
                        alignItems: 'center',
                        overflowX: 'auto',
                    }}
                >
      <span
          style={{
              margin: '0.75rem 1rem 0 0.875rem',
              fontWeight: '500',
              fontSize: '1rem',
          }}
      >
        Filtros:
      </span>
                    {categories.map((category) => (
                        <div
                            key={category}
                            onClick={() => {
                                if (selectedCategories.includes(category)) {
                                    removeCategory(category);
                                } else {
                                    addCategory(category);
                                }
                            }}
                            style={{
                                width: 'fit-content',
                                minWidth: 'fit-content',
                                height: '2rem',
                                margin: '0.25rem 0.5rem 0 0.125rem',
                                padding: '0.5rem 1.25rem',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '0.875rem',
                                border: '1px solid',
                                borderRadius: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 300ms',
                                borderColor: selectedCategories.includes(category)
                                    ? '#3B82F6'
                                    : '#9CA3AF',
                                backgroundColor: selectedCategories.includes(category)
                                    ? '#3B82F6'
                                    : 'white',
                                color: selectedCategories.includes(category)
                                    ? 'white'
                                    : '#4B5563',
                            }}
                        >
                            {category.split('-').join(' ')}
                        </div>
                    ))}
                    <div
                        onClick={resetCategory}
                        style={{
                            opacity: selectedCategories.length > 0 ? 1 : 0,
                            pointerEvents: selectedCategories.length > 0 ? 'auto' : 'none',
                            position: 'sticky',
                            right: '0',
                            width: 'fit-content',
                            height: '100%',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            color: '#3B82F6',
                            backgroundColor: 'white',
                            backdropFilter: 'blur(10px)',
                            cursor: 'pointer',
                            transition: 'all 300ms',
                            ':hover': {
                                color: '#2563EB',
                            },
                        }}
                    >
                        clear
                    </div>
                </div>
                <ProductList filteredProductList={fileredProductList} loading={loading} />
            </div>
        </div>
    )
}
export default ProductDisplay