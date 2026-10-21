import React, { useState, useMemo, useCallback, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/Productcard';

export const ProductsPage = () => {
const { data, loading, error } = useFetch(
'https://dummyjson.com/products?limit=0'
);
const { addToCart } = useApp();
const location = useLocation();

const [search, setSearch] = useState(
location.state?.search || ''
);

const [category, setCategory] = useState(
location.state?.category || 'all'
);

useLayoutEffect(() => {
if (loading || !location.state?.restoreScroll) {
return;
}

const savedPosition = sessionStorage.getItem(
  'productsScrollPosition'
);

if (savedPosition !== null) {
  window.scrollTo(0, Number(savedPosition));

  sessionStorage.removeItem('productsScrollPosition');
}

}, [loading, location.key, location.state]);

const handleAddToCart = useCallback(
(product) => {
addToCart(product);
},
[addToCart]
);

const categories = [
{ value: 'all', label: 'All Categories' },
{ value: 'beauty', label: 'Beauty' },
{ value: 'mens-shirts', label: 'Men Shirts' },
{ value: 'womens-dresses', label: 'Women Dresses' },
{ value: 'tops', label: 'Women Tops' },
{ value: 'womens-jewellery', label: 'Jewellery' },
{ value: 'fragrances', label: 'Fragrances' },
{ value: 'sunglasses', label: 'Sunglasses' },
{ value: 'skin-care', label: 'Skin Care' },
{ value: 'womens-bags', label: 'Bags' },
{ value: 'womens-shoes', label: 'Women Shoes' }
];

const allowedCategories = [
'beauty',
'mens-shirts',
'womens-dresses',
'tops',
'womens-jewellery',
'womens-shoes',
'fragrances',
'sunglasses',
'skin-care',
'womens-bags'
];

const filteredProducts = useMemo(() => {
if (!data?.products) return [];

return data.products.filter((product) => {
  const isAllowedCategory =
    allowedCategories.includes(product.category);

  const matchesSearch = product.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === 'all' ||
    product.category === category;

  return (
    isAllowedCategory &&
    matchesSearch &&
    matchesCategory
  );
});
}, [data, search, category]);

if (loading) {
return ( <div className="loading">
Loading collection... </div>
);
}

if (error) {
return ( <div className="error-message">
{error} </div>
);
}

return ( <div className="products-page"> <div className="products-header"> <div> <p>OUR COLLECTION</p> <h1>Shop all products</h1> </div>
    <span>
      {filteredProducts.length} items
    </span>
  </div>

  <div className="product-filters">
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      {categories.map((item) => (
        <option
          key={item.value}
          value={item.value}
        >
          {item.label}
        </option>
      ))}
    </select>
  </div>

  <div className="product-grid">
    {filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onAddToCart={handleAddToCart}
        search={search}
        category={category}
      />
    ))}
  </div>
</div>
);
};
