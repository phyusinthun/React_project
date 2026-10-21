import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useApp } from '../context/AppContext';
import homeImage from '../assets/shoppingImage.jpg';

export const HomePage = () => {
  const { data, loading } = useFetch(
    'https://dummyjson.com/products?limit=0'
  );

  const { user } = useApp();
  const navigate = useNavigate();

  const bestGridRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(2);

  const bestSellers = [
    'beauty',
    'sunglasses',
    'womens-dresses',
    'womens-bags',
    'womens-shoes'
  ]
    .map(category =>
      data?.products?.find(
        product => product.category === category
      )
    )
    .filter(Boolean);

  const scrollBest = (direction) => {
    setActiveIndex(current => {
      return (
        current + direction + bestSellers.length
      ) % bestSellers.length;
    });
  };

  
useEffect(() => {
  if (loading || bestSellers.length === 0) return;

  const grid = bestGridRef.current;
  const centerCard = grid?.children[activeIndex];

  if (grid && centerCard) {
    const gridRect = grid.getBoundingClientRect();
    const cardRect = centerCard.getBoundingClientRect();

    grid.scrollTo({
      left:
        grid.scrollLeft +
        (cardRect.left + cardRect.width / 2) -
        (gridRect.left + gridRect.width / 2),
      behavior: 'auto'
    });
  }
}, [activeIndex, loading, bestSellers.length]);


  const handleProductClick = (event, product) => {
    event.preventDefault();

    navigate(`/product/${product.id}`, {
      state: { product }
    });
  };

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-small">
            NEW COLLECTION 2026⋆✴︎˚｡⋆
          </p>

          <h1>
            Simple things.
            <br />
            <span>Beautifully chosen.</span>
          </h1>

          <p>
            Discover everyday pieces made to fit your style,
            your mood, and your life.
          </p>

          <Link to="/products" className="shop-btn">
            Explore Collection →
          </Link>
        </div>

        <div className="hero-image">
          <img src={homeImage} alt="Fashion Collection" />
        </div>
      </section>

      {/* Best Selling */}
      <section className="best-selling">
        <div className="best-selling-header">
          <div>
            <p className="section-label">
              THE PIECES YOU LOVE
            </p>

            <h2>
              Best Selling<span>.</span>
            </h2>

            <p className="best-description">
              A little something to make your everyday special.
            </p>
          </div>

          <Link to="/products" className="view-all">
            Shop all pieces <span>↗</span>
          </Link>
        </div>

        {loading ? (
          <p className="best-loading">Loading products...</p>
        ) : (
          <>
            <div className="best-controls">
              <p>
                CURATED FOR YOU <span>✳</span>
              </p>

              <div className="best-arrows">
                <button
                  type="button"
                  onClick={() => scrollBest(-1)}
                  aria-label="Previous products"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() => scrollBest(1)}
                  aria-label="Next products"
                >
                  →
                </button>
              </div>
            </div>

            <div className="best-grid" ref={bestGridRef}>
              {bestSellers.map((product, index) => (
                <Link
                  to={`/product/${product.id}`}
                  state={{ product }}
                  onClick={event =>
                    handleProductClick(event, product)
                  }
                  className={`best-card ${
                    activeIndex === index ? 'active' : ''
                  }`}
                  key={product.id}
                >
                  <div className="best-image">
                    <span className="best-badge">
                      {index === 0
                        ? 'NEW ARRIVAL'
                        : index === 1
                        ? 'TRENDING'
                        : index === 2
                        ? 'BEST LOVED'
                        : index === 3
                        ? 'FAVORITE'
                        : 'JUST FOR YOU'}
                    </span>

                    <img
                      src={product.thumbnail}
                      alt={product.title}
                    />

                    <span className="best-view">
                      View Details <span>↗</span>
                    </span>
                  </div>

                  <div className="best-info">
                    <p className="best-number">
                      0{index + 1} / YOUR LITTLE STORE
                    </p>

                    <h3>{product.title}</h3>

                    <div className="best-meta">
                      <span>
                        <span className="best-star">★</span>
                        {Number(product.rating).toFixed(1)}
                      </span>

                      <strong>
                        ${Number(product.price).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Intro */}
      <section className="home-intro">
        <p>OUR COLLECTION</p>

        <h2>Made for your everyday⋆. 𐙚 ˚</h2>

        <p className="intro-text">
          From simple essentials to pieces that stand out,
          find something that feels like you ₊˚⊹♡
        </p>
      </section>

    </div>
  );
};
