import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({children}) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    
    if(checkProductInCart){
      const updatedCartItems = cartItems.map((cartProduct) => {
        if(cartProduct.id === product.id) return {
          ...cartProduct, 
          quantity: cartProduct.quantity + quantity
        }
        // if(cartProduct._id === product._id) {
        //   return {
        //     ...cartProduct,
        //     quantity: cartProduct.quantity + quantity
        //   } 
        // } 
        // else {
        //   return {...cartProduct}
        // }
      setCartItems(updatedCartItems);
    });

    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }])
    }
    // toast.success(`Product added to cart successfully`)
    toast.success(`${qty} of ${product.name} added to cart successfully`)
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id) 
    const newCartItems = cartItems.filter((item) => item._id !== product._id);
    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  }


  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);

    const newCartItems = cartItems.filter((item) => item._id !== id);
    if( value === "inc") {
      // setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1}]); 
      newCartItems.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity + 1 });
      setCartItems(newCartItems);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1); 
    } else if( value === "dec") {
      if(foundProduct.quantity > 1 ){
        // setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1}]);
        newCartItems.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity - 1 });
        setCartItems(newCartItems);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities -  1); 
      }
    }
  }

  const increaseQuantity = () => {
    setQty((previousQty) => previousQty + 1 )
  }

  const decreaseQuantity = () => {
    setQty((previousQty) => {
      // This condition is necessary to ensure that the quantity is not negative or 0;
      if(previousQty -1 < 1)
        return 1;
      return previousQty - 1
      
    });
  }



  return (
    <Context.Provider 
      value={{
        showCart,
        setShowCart,
        cartItems, 
        totalPrice,
        totalQuantities,
        qty,
        decreaseQuantity,
        increaseQuantity,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context);