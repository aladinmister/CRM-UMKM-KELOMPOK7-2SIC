import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-primary font-bold">Rp {product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;
