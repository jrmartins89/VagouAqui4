import React from "react";
const ProductList = ({filteredProductList, loading}) => {

    if(loading)
        return <>Loading</> // use your loading state or component

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
                    overflowY: 'auto'
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
                            border: '1px solid #E5E7EB'
                        }}
                    >
                        <img
                            src={product.thumbnail}
                            alt='product'
                            style={{
                                width: '100%',
                                height: '7rem',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', padding: '0.75rem' }}>
                            <div style={{ fontWeight: '600' }}>
                                {product.title.length > 25 ? product.title.substring(0, 22) + '...' : product.title}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                                {product.category}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductList