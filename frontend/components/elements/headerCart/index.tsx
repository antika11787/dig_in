"use client";
import "./index.scss";
import { useEffect, useState, useRef } from "react";
import { BsCart3 } from "react-icons/bs";
import { GetMyCartApi, ClearCartApi, CheckoutApi, AddToCartApi, UpdateQuantityApi, RemoveFromCartApi } from "@/apiEndpoints/cart";
import { CartResponse, CartState, ItemResponse } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { saveNumberOfItems } from "@/redux/slices/CartSlice";
import { AiFillDelete } from "react-icons/ai";

const HeaderCart = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const numberOfItems = useSelector(
    (state: CartState) => state.cart.numberOfItems
  );
  const cartRef = useRef<HTMLDivElement>(null);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartData, setCartData] = useState<CartResponse>();
  const [quantity, setQuantity] = useState<number>(1);
  const [itemId, setItemId] = useState<string>("");

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const updateQuantity = async (increment: number, id: string) => {
    const newQuantity = quantity + increment;
    console.log("quan", quantity)
    setQuantity(newQuantity);
    if (newQuantity === 0) {
      await RemoveFromCartApi(id);
      return;
    }
    await UpdateQuantityApi({ itemID: id, quantity: newQuantity })
      .then((response) => {
        dispatch(
          saveNumberOfItems({ numberOfItems: -1 })
        );
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetMyCartApi();
        setCartData(response);
        const initialQuantity = response?.items.find((item: any) => item.itemID._id === itemId)?.quantity || 1;
        setQuantity(initialQuantity);
        dispatch(saveNumberOfItems({ numberOfItems: response?.items?.length || 0 }));
      } catch (error) {
        // Handle the error
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, [numberOfItems]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header-cart" ref={cartRef}>
      <BsCart3 className="cart-icon" onClick={handleCartClick} />
      {cartData && cartData.items.length > 0 && (
        <div className="cart-count">{cartData.items.length}</div>
      )}
      {showCart && (
        <div className="header-cart-dropdown custom-scrollbar">
          {cartData && cartData.items.length > 0 ? (
            <div className="header-cart-items" key={cartData._id}>
              {cartData.items.map((item: ItemResponse) => (
                <div key={item._id}>
                  <div key={item._id} className="header-cart-item">
                    <img
                      src={`http://localhost:3000/uploads/${typeof item.itemID === "object"
                        ? (item.itemID as { banner: string }).banner
                        : ""
                        }`}
                      alt={item.title}
                      className="header-cart-item-image"
                    />
                    <div className="header-cart-item-details">
                      <div className='header-cart-item-title-container'>
                        <p className="header-cart-item-title">
                          {typeof item.itemID === 'object' ? (item.itemID as { title: string }).title : ''}
                          <span className='header-cart-item-quantity'> x {item.quantity}</span>
                        </p>
                        <div className="header-cart-item-quantity-container">
                          <div className="quantity-increment-header">
                            <button
                              className="quantity-button-header"
                              onClick={() => {
                                if (typeof item.itemID === 'object') {
                                  setItemId((item.itemID as { _id: string })._id);
                                  // updateQuantity(-1, (item.itemID as { _id: string })._id);
                                  UpdateQuantityApi({ itemID: (item.itemID as { _id: string })._id,  quantity: item.quantity as number - 1 })
                                    .then((response) => {
                                      dispatch(
                                        saveNumberOfItems({ numberOfItems: -1 })
                                      );
                                    });
                                }
                              }}
                              disabled={quantity === 0}
                            >
                              -
                            </button>
                            <p className="quantity-header">{item.quantity}</p>
                            <button
                              className="quantity-button-header"
                              onClick={() => {
                                if (typeof item.itemID === 'object') {
                                  setItemId((item.itemID as { _id: string })._id);
                                  // updateQuantity(1, (item.itemID as { _id: string })._id);
                                  UpdateQuantityApi({ itemID: (item.itemID as { _id: string })._id, quantity: item.quantity as number + 1 })
                                    .then((response) => {
                                      dispatch(
                                        saveNumberOfItems({ numberOfItems: -1 })
                                      );
                                    });
                                }
                              }}
                              disabled={quantity === 50}
                            >
                              +
                            </button>
                          </div>
                          <AiFillDelete
                            className="cart-remove-button"
                            onClick={async () => {
                              if (typeof item.itemID === 'object') {
                                RemoveFromCartApi((item.itemID as { _id: string })._id);
                                dispatch(saveNumberOfItems({
                                  numberOfItems: -1
                                }))
                              }
                            }} />
                        </div>
                      </div>
                      <div className='cart-item-price-container'>
                        <p className="cart-item-price">Item price: BDT {" "}
                          <span style={{ fontWeight: "bold" }}>
                            {typeof item.itemID === 'object' ? (item.itemID as { price: number }).price : ''}
                          </span>
                        </p>
                        <p className='cart-item-price'>Total cost: BDT <span style={{ fontWeight: "bold" }}>{item.cost}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="cart-buttons">
                <p className="total-cost">Subtotal: BDT {cartData.totalAmount}</p>
                <button
                  className="checkout-button"
                  onClick={() => {
                    router.push("/checkout");
                  }}
                >
                  Checkout
                </button>
                <button
                  className="clear-cart-button"
                  onClick={() => {
                    ClearCartApi();
                    dispatch(saveNumberOfItems({ numberOfItems: -1 }));
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          ) : (
            <div className="no-cart">
              <Image src="/no-cart.png" alt="no items" width={50} height={50} />
              <p className='no-items'>No items in cart</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderCart;
