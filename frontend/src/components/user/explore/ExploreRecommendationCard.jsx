import React from 'react';

// Placeholder image function (adapt as needed)
const getProductImageUrl = (productId) => {
  return `https://via.placeholder.com/120/E8F5E9/4CAF50?text=Rec`;
};

export default function ExploreRecommendationCard({ product }) {
  if (!product) return null;

  // Recommendations might only have basic info (id, nombre)
  const productName = product.nombre || 'Producto Recomendado';
  const productId = product.id || Date.now(); // Fallback key

  const handleCardClick = () => {
    console.log("View recommended product details:", productId);
    // TODO: Implement navigation logic if needed
    // Example: navigate(`/user/products/${productId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer flex-shrink-0 w-32 sm:w-36" // Fixed width for horizontal scroll
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={getProductImageUrl(productId)}
          alt={productName}
          className="w-full h-full object-cover"
          loading="lazy" // Lazy load images in horizontal scroll
        />
      </div>
      <div className="p-2">
        <h3 className="font-semibold text-xs text-gray-700 mb-1 truncate" title={productName}>
          {productName}
        </h3>
        {/* Add price or other details if available in recommendation data */}
      </div>
    </div>
  );
}