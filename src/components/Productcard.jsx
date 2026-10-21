import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProductCard = React.memo(({
product,
onAddToCart,
search,
category
}) => {

const { user, cart } = useApp();

const added = Array.isArray(cart) && cart.some(
  (item) => item.id === product.id
);

const navigate = useNavigate();

const openDetails = () => {
sessionStorage.setItem(
'productsScrollPosition',
String(window.scrollY)
);

navigate(`/product/${product.id}`, {
  state: {
    search,
    category
  }
});
};

const handleAdd = () => {
if (!user) {
navigate('/login');
return;
}
onAddToCart(product);
};

return ( <div className="product-card">
<div
className="product-image"
onClick={openDetails}
style={{ cursor: 'pointer' }}
> <img
       src={product.thumbnail}
       alt={product.title}
     /> </div>

  <div className="product-info">
    <p className="product-category">
      {product.category}
    </p>

    <h3>{product.title}</h3>

    <p className="product-price">
      ${product.price}
    </p>

    <div className="product-actions">
      <button
        onClick={openDetails}
        className="details-btn"
      >
        View
      </button>

      <button
        onClick={handleAdd}
        className="add-btn"
      >
        {added ? '✓ Added' : 'Add to Cart'}
      </button>
    </div>
  </div>
</div>
);
});
