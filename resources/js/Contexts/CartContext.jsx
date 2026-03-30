import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem('fapclas_ecommerce_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('fapclas_ecommerce_cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, cantidad: item.cantidad + quantity }
                    : item
                );
            }
            return [...prev, { ...product, cantidad: quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, cantidad) => {
        if (cantidad < 1) return;
        setCart(prev => prev.map(item => 
            item.id === productId ? { ...item, cantidad } : item
        ));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.precio_final * item.cantidad), 0);
    const cartCount = cart.reduce((count, item) => count + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
