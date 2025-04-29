import React from 'react';

// Placeholder image function (adapt as needed)
const getProductImageUrl = (productId) => {
  return `https://via.placeholder.com/150/E8F5E9/4CAF50?text=Producto`;
};

export default function ExploreProductCard({ product }) {
  if (!product) return null;

  const productName = product.nombre || 'Producto';
  const productId = product.id || Date.now(); // Fallback key
  const displayPrice = product.precio_base ? `Q${Number(product.precio_base).toFixed(2)}` : '';

  const handleCardClick = () => {
    console.log("View product details:", productId);
    // TODO: Implement navigation to product detail page if needed
    // Example: navigate(`/user/products/${productId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={getProductImageUrl(productId)}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm text-gray-800 mb-1 truncate flex-grow" title={productName}>
          {productName}
        </h3>
        {displayPrice && (
          <div className="mt-auto pt-1">
            <span className="text-primary font-bold text-sm">{displayPrice}</span>
          </div>
        )}
        {/* Add other details or actions like an 'Add' button if needed */}
      </div>
    </div>
  );
}