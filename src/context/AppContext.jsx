import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useCallback,
  useEffect,
} from 'react';

const AppContext = createContext();

const getCartStorageKey = (email) =>
  `store_cart_v2_${email.trim().toLowerCase()}`;

const getSavedCart = (email) => {
  if (!email) {
    return [];
  }

  try {
    const savedCart = localStorage.getItem(getCartStorageKey(email));
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const loadAuthenticatedUser = () => {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return null;
  }

  try {
    const previousUser = JSON.parse(savedUser);
    const email = previousUser.email?.trim().toLowerCase();

    // Only accounts created in the new account system are accepted.
    const accounts = JSON.parse(
      localStorage.getItem('store_accounts_v2') || '{}'
    );

    const account = email ? accounts[email] : null;

    if (
      previousUser.authVersion !== 2 ||
      !account?.salt ||
      !account?.passwordHash ||
      !account?.name
    ) {
      localStorage.removeItem('user');
      return null;
    }

    return {
      name: account.name,
      email,
      authVersion: 2,
    };
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return action.payload;

    case 'ADD': {
      const exist = state.find(
        (item) => item.id === action.payload.id
      );

      if (exist) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'INCREASE':
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case 'DECREASE':
      return state
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

    case 'REMOVE':
      return state.filter(
        (item) => item.id !== action.payload
      );

    case 'CLEAR':
      return [];

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(loadAuthenticatedUser);

  const [cart, dispatch] = useReducer(
    cartReducer,
    user,
    (currentUser) =>
      currentUser ? getSavedCart(currentUser.email) : []
  );

  const [theme, setTheme] = useState('light');

  const addToCart = useCallback(
    (product) => {
      if (!user) {
        return;
      }

      dispatch({
        type: 'ADD',
        payload: product,
      });
    },
    [user]
  );

  const increaseQuantity = useCallback((id) => {
    dispatch({
      type: 'INCREASE',
      payload: id,
    });
  }, []);

  const decreaseQuantity = useCallback((id) => {
    dispatch({
      type: 'DECREASE',
      payload: id,
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({
      type: 'REMOVE',
      payload: id,
    });
  }, []);

  // Clear the current user's cart after a successful order.
  const clearCart = useCallback(() => {
    if (user?.email) {
      localStorage.setItem(
        getCartStorageKey(user.email),
        JSON.stringify([])
      );
    }

    dispatch({ type: 'CLEAR' });
  }, [user]);

  const login = useCallback(({ name, email }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const newUser = {
      name,
      email: normalizedEmail,
      authVersion: 2,
    };

    setUser(newUser);

    localStorage.setItem('user', JSON.stringify(newUser));

    dispatch({
      type: 'LOAD',
      payload: getSavedCart(normalizedEmail),
    });
  }, []);

  const logout = useCallback(() => {
    // Save the cart before signing out.
    if (user?.email) {
      localStorage.setItem(
        getCartStorageKey(user.email),
        JSON.stringify(cart)
      );
    }

    setUser(null);
    dispatch({ type: 'CLEAR' });
    localStorage.removeItem('user');
  }, [user, cart]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(
        getCartStorageKey(user.email),
        JSON.stringify(cart)
      );
    }
  }, [cart, user]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) =>
      previous === 'light' ? 'dark' : 'light'
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        user,
        login,
        logout,
        theme,
        toggleTheme,
      }}
    >
      <div className={theme === 'dark' ? 'app dark-mode' : 'app'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);