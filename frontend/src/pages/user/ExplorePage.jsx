import React, { useState, useEffect, useMemo } from 'react';
import { FiCompass, FiSearch, FiX, FiLoader, FiTag } from 'react-icons/fi';
import graphService from '../../services/GraphService';
import productService from '../../services/ProductService';
// Import the new specific components - Verifica que estas rutas sean correctas
import ExploreProductCard from '../../components/user/explore/ExploreProductCard';
import ExploreRecommendationCard from '../../components/user/explore/ExploreRecommendationCard';
import ExploreCategoryFilter from '../../components/user/explore/ExploreCategoryFilter';
// Assuming you have or will create a CategoryService
import categoryService from '../../services/CategoryService'; // Adjust path if needed

export default function ExplorePage() {
  const [recommendations, setRecommendations] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // null means 'All'
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  // Add these missing state declarations
  const [loadingCats, setLoadingCats] = useState(true); // State for category loading
  const [errorCats, setErrorCats] = useState(null);     // State for category errors
  // End of added lines
  const [errorRecs, setErrorRecs] = useState(null);
  const [errorProds, setErrorProds] = useState(null);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecs = async () => {
      setLoadingRecs(true);
      setErrorRecs(null);
      const result = await graphService.getRecommendations();
      if (result.success) {
        setRecommendations(result.data);
      } else {
        setErrorRecs(result.message || 'No se pudieron cargar las recomendaciones.');
        console.error("Recommendation fetch error:", result.message);
      }
      setLoadingRecs(false);
    };
    fetchRecs();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProds(true);
      setErrorProds(null);
      const productResult = await productService.getAllProducts(); // Fetch active products
      if (productResult.success) {
        setProducts(productResult.data);
      } else {
        setErrorProds(productResult.message || 'No se pudieron cargar los productos.');
        console.error("Product fetch error:", productResult.message);
      }
      setLoadingProds(false);
    };
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true); // Now this variable is defined
      setErrorCats(null); // Now this variable is defined
      try {
        // Use the imported categoryService
        const categoryResult = await categoryService.getAllCategories();
        // Assuming the service returns the data directly or in a 'data' property
        // Adjust based on the actual structure returned by your service
        // If getAllCategories returns the array directly:
        setCategories(categoryResult || []);
        // If it returns { success: true, data: [...] }:
        // if (categoryResult.success) {
        //   setCategories(categoryResult.data);
        // } else {
        //   setErrorCats(categoryResult.message || 'No se pudieron cargar las categorías.');
        //   console.error("Category fetch error:", categoryResult.message);
        // }
      } catch (error) {
         const message = error.message || 'Error de red al cargar categorías.';
         setErrorCats(message); // Now this variable is defined
         console.error("Category fetch network error:", error);
      } finally {
        setLoadingCats(false); // Now this variable is defined
      }
    };
    fetchCategories();
  }, []);

  // Filter products based on search term and selected category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.categoria_id === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const isLoading = loadingRecs || loadingProds || loadingCats;

  return (
    <div className="pb-20"> {/* Add padding-bottom to avoid overlap with fixed nav */}
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
         <h1 className="text-xl font-semibold text-gray-800 flex items-center">
           <FiCompass className="mr-2 text-primary" /> Explorar
         </h1>
      </div>

      <main className="container mx-auto px-4 py-4">

        {/* Recommendations Section */}
        {!loadingRecs && !errorRecs && recommendations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Recomendado para ti</h2>
            {/* Use ExploreRecommendationCard */}
            <div className="flex overflow-x-auto space-x-3 pb-4 -mx-4 px-4 scrollbar-hide">
              {recommendations.map(rec => (
                <ExploreRecommendationCard key={`rec-${rec.id}`} product={rec} />
              ))}
            </div>
          </section>
        )}
        {loadingRecs && (
           <div className="flex justify-center items-center h-20 mb-4">
             <FiLoader className="animate-spin text-primary text-2xl" />
           </div>
        )}
         {errorRecs && <p className="text-red-500 text-center mb-4">{errorRecs}</p>}


        {/* Catalog Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Catálogo de Productos</h2>

          {/* Search and Filter Controls */}
          <div className="mb-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                 <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <FiX />
                 </button>
              )}
            </div>

            {/* Category Filter - Use ExploreCategoryFilter */}
            {/* Check loadingCats and errorCats before rendering */}
            {!loadingCats && !errorCats && categories.length > 0 && (
              <ExploreCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            )}
            {/* Show loader while loading categories */}
            {loadingCats && (
              <div className="flex justify-center items-center h-10">
                <FiLoader className="animate-spin text-primary text-xl" />
              </div>
            )}
            {/* Show error if category loading failed */}
            {errorCats && <p className="text-red-500 text-center text-sm">{errorCats}</p>}

          </div>

          {/* Product Grid */}
          {/* ... loading/error states for products ... */}
          {loadingProds && (
             <div className="flex justify-center items-center h-40">
               <FiLoader className="animate-spin text-primary text-3xl" />
             </div>
          )}
          {errorProds && <p className="text-red-500 text-center">{errorProds}</p>}

          {!loadingProds && !errorProds && (
            <>
              {filteredProducts.length > 0 ? (
                // Use ExploreProductCard
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {filteredProducts.map(product => (
                    <ExploreProductCard key={`prod-${product.id}`} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  {products.length === 0 && !searchTerm && !selectedCategory ? 'No hay productos disponibles.' : 'No se encontraron productos con esos criterios.'}
                </p>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}