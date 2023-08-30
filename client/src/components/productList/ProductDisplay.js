import React, { useEffect, useState } from 'react';

const ProductList = ({ filteredProductList, loading }) => {
    if (loading) return <>Loading</>; // Use your loading state or component

    return (
        <div style={{ width: '100%', height: '85%', padding: '5px' }}>
            <div style={{ width: '100%' }}>Anúncios: </div>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1px',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    overflowY: 'auto',
                }}
            >
                {filteredProductList.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            width: '19%',
                            height: 'fit-content',
                            margin: '3px 0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #E5E7EB',
                        }}
                    >
                        <img
                            src={product.thumbnail}
                            alt='product'
                            style={{
                                width: '100%',
                                height: '7rem',
                                objectFit: 'cover',
                            }}
                        />
                        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', padding: '0.75rem' }}>
                            <div style={{ fontWeight: '600' }}>
                                {product.title.length > 25 ? product.title.substring(0, 22) + '...' : product.title}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>{product.category}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductDisplay = () => {
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredProductList, setFilteredProductList] = useState([]);

    const addCategory = (category) => {
        if (!selectedCategories.includes(category)) {
            setSelectedCategories((prev) => [...prev, category]);
        }
    };

    const removeCategory = (category) => {
        if (selectedCategories.includes(category)) {
            const removedList = selectedCategories.filter((item) => item !== category);
            setSelectedCategories(removedList);
        }
    };

    const resetCategory = () => {
        setSelectedCategories([]);
    };

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredProductList(productList);
        } else {
            setFilteredProductList(productList.filter((item) => selectedCategories.includes(item.category)));
        }
    }, [selectedCategories, productList]);

    const fetchData = async (url, successCallback) => {
        setLoading(true);

        try {
            const response = await fetch(url);
            const data = await response.json();
            successCallback(data);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const getCategories = () => {
        fetchData('https://vagouaqui.s3.sa-east-1.amazonaws.com/categories.json', (data) => {
            const arr = data.slice(0, 30);
            setCategories(arr);
        });
    };

    const getProducts = () => {
        fetchData('https://vagouaqui.s3.sa-east-1.amazonaws.com/products.json', (data) => {
            setProductList(data.products);
            setFilteredProductList(data.products);
            getCategories();
        });
    };

    useEffect(() => {
        getProducts();
        // eslint-disable-next-line
    }, []);

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
                                borderColor: selectedCategories.includes(category) ? '#3B82F6' : '#9CA3AF',
                                backgroundColor: selectedCategories.includes(category) ? '#3B82F6' : 'white',
                                color: selectedCategories.includes(category) ? 'white' : '#4B5563',
                                ":hover": {
                                    borderColor: "#3B82F6",
                                    color: "#3B82F6",
                                    backgroundColor: "white",
                                },
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
                        }}
                    >
                        clear
                    </div>
                </div>
                <ProductList filteredProductList={filteredProductList} loading={loading} />
            </div>
        </div>
    );
};

export default ProductDisplay;