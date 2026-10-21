import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const CartPage = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart
} = useApp();

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [message, setMessage] = useState('');

  // Checkout states
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [payment, setPayment] = useState('COD');

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const discountAmount = couponApplied ? subtotal * 0.1 : 0;
  const shipping =
    subtotal === 0 || subtotal - discountAmount >= 100 ? 0 : 5;
  const total = subtotal - discountAmount + shipping;

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'WELCOME10') {
      setCouponApplied(true);
      setMessage('10% discount applied!');
    } else {
      setCouponApplied(false);
      setMessage('Invalid coupon code.');
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCoupon('');
    setMessage('');
  };

  const handleCustomerChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = (e) => {
  e.preventDefault();

  if (cart.length === 0) return;

  setOrderPlaced(true);
  clearCart();
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setOrderPlaced(false);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="cart-page">
        <p className="cart-eyebrow">YOUR SELECTION</p>
        <h1 className="cart-title">
          Your Bag<span>.</span>
        </h1>

        <div className="empty-cart">
          <h2>Your bag is empty.</h2>
          <p>Find something lovely to add to your bag.</p>
          <Link to="/products" className="cart-shop-btn">
            Continue Shopping →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">YOUR SELECTION</p>
          <h1 className="cart-title">
            Your Bag<span>.</span>
          </h1>
        </div>
        <p className="cart-item-count">{cart.length} ITEMS</p>
      </div>

      <div className="cart-editorial-line">
        <span>YOUR ITEMS</span>
        <span>REVIEW YOUR SELECTION</span>
      </div>

      <div className="cart-layout">
        <div className="cart-items-column">
          <section className="cart-list">
            {cart.map((item) => (
              <article className="cart-product" key={item.id}>
                <div className="cart-product-image">
                  <img src={item.thumbnail} alt={item.title} />
                </div>

                <div className="cart-product-info">
                  <p className="cart-product-category">
                    {item.category}
                  </p>

                  <h3>{item.title}</h3>

                  <p className="cart-unit-price">
                    ${Number(item.price).toFixed(2)} each
                  </p>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-product-end">
                  <strong>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <Link to="/products" className="cart-back-link">
            ← Continue shopping
          </Link>
        </div>

        <div className="cart-bottom-summary">
          <div className="cart-bottom-heading">
            <div>
              <h2>Order Summary</h2>
            </div>
            <p>{itemCount} pieces</p>
          </div>

          <div className="cart-coupon">
            <label htmlFor="cart-coupon">Coupon code</label>

            <div className="cart-coupon-row">
              <input
                id="cart-coupon"
                type="text"
                placeholder="Enter WELCOME10"
                value={coupon}
                disabled={couponApplied}
                onChange={(e) => setCoupon(e.target.value)}
              />

              {couponApplied ? (
                <button type="button" onClick={removeCoupon}>
                  Remove
                </button>
              ) : (
                <button type="button" onClick={applyCoupon}>
                  Apply
                </button>
              )}
            </div>

            {message && (
              <p
                className={
                  couponApplied
                    ? 'coupon-message success'
                    : 'coupon-message'
                }
              >
                {message}
              </p>
            )}

            {!couponApplied && (
              <p className="coupon-hint">
                Use your coupon code to get 10% off.
              </p>
            )}
          </div>

          <div className="cart-totals">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {couponApplied && (
              <div className="summary-line discount-line">
                <span>Discount (10%)</span>
                <span>−${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-line">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <p className="cart-payment-note">
            Choose your payment method at checkout.
          </p>

          <button
            type="button"
            className="cart-checkout-btn"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout <span>→</span>
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div
          className="checkout-overlay"
          onClick={closeCheckout}
        >
          <section
            className="checkout-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="checkout-close"
              onClick={closeCheckout}
              aria-label="Close checkout"
            >
              ×
            </button>

            {orderPlaced ? (
              <div className="order-success">
                <div className="order-success-icon">✓</div>
                <p className="cart-eyebrow">THANK YOU</p>
                <h2>Order Confirmed!</h2>
                <p>
                  Thank you, {customer.name}. Your order information
                  has been received.
                </p>

                <div className="checkout-success-total">
                  <span>Total Payment</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <p className="checkout-payment-detail">
                  Payment method:{' '}
                  {payment === 'COD' ? 'Cash on Delivery' : 'KPay'}
                </p>

                <button
                  type="button"
                  className="checkout-submit"
                  onClick={closeCheckout}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="checkout-title">Checkout</h2>
                <p className="checkout-description">
                  Enter your delivery details to complete your order.
                </p>

                <form onSubmit={handleCheckout}>
                  <div className="checkout-fields">
                    <div className="checkout-field">
                      <label htmlFor="customer-name">
                        Full Name
                      </label>
                      <input
                        id="customer-name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={customer.name}
                        onChange={handleCustomerChange}
                        required
                      />
                    </div>

                    <div className="checkout-field">
                      <label htmlFor="customer-address">
                        Delivery Address
                      </label>
                      <textarea
                        id="customer-address"
                        name="address"
                        placeholder="Enter your full delivery address"
                        value={customer.address}
                        onChange={handleCustomerChange}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="checkout-field">
                      <label htmlFor="customer-phone">
                        Phone Number
                      </label>
                      <input
                        id="customer-phone"
                        name="phone"
                        type="tel"
                        placeholder="09xxxxxxxxx"
                        value={customer.phone}
                        onChange={handleCustomerChange}
                        pattern="[0-9+() -]{7,20}"
                        title="Please enter a valid phone number."
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-payment">
                    <p className="checkout-section-title">
                      Payment Method
                    </p>

                    <label
                      className={`payment-option ${
                        payment === 'COD' ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={payment === 'COD'}
                        onChange={(e) => setPayment(e.target.value)}
                      />
                      <span className="payment-option-icon">💵</span>
                      <span className="payment-option-text">
                        <strong>Cash on Delivery</strong>
                        <small>Pay when your order arrives</small>
                      </span>
                    </label>

                    <label
                      className={`payment-option ${
                        payment === 'KPay' ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="KPay"
                        checked={payment === 'KPay'}
                        onChange={(e) => setPayment(e.target.value)}
                      />
                      <span className="payment-option-icon">📱</span>
                      <span className="payment-option-text">
                        <strong>KPay</strong>
                        <small>KBZPay mobile payment</small>
                      </span>
                    </label>
                  </div>

                  <div className="checkout-total-box">
                    <div>
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {couponApplied && (
                      <div className="checkout-discount">
                        <span>Discount (10%)</span>
                        <span>−${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div>
                      <span>Shipping</span>
                      <span>
                        {shipping === 0
                          ? 'Free'
                          : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="checkout-final-total">
                      <strong>Total Payment</strong>
                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <button type="submit" className="checkout-submit">
                    Confirm Order <span>→</span>
                  </button>

                  <p className="checkout-secure-note">
                    Please check your delivery information before
                    confirming.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
};
