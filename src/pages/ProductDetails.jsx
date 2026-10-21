import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useApp } from '../context/AppContext';

export const ProductDetails = () => {
const { id } = useParams();
const location = useLocation();
const { state } = location;

const { data: fetchedProduct, loading, error } = useFetch(
`https://dummyjson.com/products/${id}`
);

const product = state?.product || fetchedProduct;

const { user, addToCart, cart } = useApp();
const navigate = useNavigate();

const added = Boolean(
product &&
Array.isArray(cart) &&
cart.some((item) => item.id === product.id)
);

const handleAdd = () => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (product) {
    addToCart(product);
  }
};

if (loading) {
return <div className="loading">Loading product...</div>;
}

if (error || !product) {
return <div className="error-message">Product not found.</div>;
}

return ( <div className="product-detail"> <div className="detail-image"> <img src={product.thumbnail} alt={product.title} /> </div>

  <div className="detail-info">
    <Link
      to="/products"
      state={{
        restoreScroll: true,
        search: state?.search || '',
        category: state?.category || 'all'
      }}
      className="back-link"
    >
      ↩ Back to collection
    </Link>

    <p className="detail-category">{product.category}</p>

    <h1>{product.title}</h1>

    <p className="detail-description">
      {product.description}
    </p>

    <p className="detail-price">${product.price}</p>

    <button onClick={handleAdd} className="detail-add">
      {added ? '✓ Added' : 'Add to Cart'}
    </button>
  </div>
</div>
);
};
