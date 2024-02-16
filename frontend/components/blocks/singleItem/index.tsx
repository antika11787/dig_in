"use client";

import "./index.scss";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ItemResponse } from "@/types/interfaces";
import {
  AddToCartApi,
  GetMyCartApi,
  RemoveFromCartApi,
  UpdateQuantityApi,
} from "@/apiEndpoints/cart";
import { GetItemByIdApi } from "@/apiEndpoints/item";
import CartIcon from "@/components/elements/cartIcon";
import Image from "next/image";

const SingleItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState<ItemResponse>();
  const [quantity, setQuantity] = useState<number>(0);
  const [banner, setBanner] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const itemId = Array.isArray(id) ? id[0] : id;
      const [itemResponse, cartResponse] = await Promise.all([
        GetItemByIdApi(itemId),
        GetMyCartApi(),
      ]);
      setItem(itemResponse);
      setBanner(itemResponse.banner);
      const initialQuantity =
        cartResponse?.items.find((item: any) => item.itemID._id === itemId)
          ?.quantity || 0;
      setQuantity(initialQuantity);
    };
    fetchData();
  }, [id]);

  const updateQuantity = (increment: number) => {
    const newQuantity = quantity + increment;
    setQuantity(newQuantity);
    if (newQuantity === 0) {
      RemoveFromCartApi(item?._id || "");
      return;
    }
    if (newQuantity === 1) {
      AddToCartApi({ itemID: item?._id || "", quantity: newQuantity });
      return;
    }
    UpdateQuantityApi({ itemID: item?._id || "", quantity: newQuantity });
  };

  return (
    <div className="single-item-container">
      {item && (
        <>
          <div className="single-item-banner-details">
            {/* <div className="single-item-banner-container"> */}
            <Image
              src={`http://localhost:3000/uploads/${banner}`}
              className="single-item-banner"
              height={350}
              width={400}
              alt="banner"
            />
            {/* </div> */}

            <div className="single-item-details">
              <h1 className="single-item-title">{item.title}</h1>
              <p className="single-item-description">{item.description}</p>
              <div className="price-and-quantity">
                <p className="single-item-price">Price: BDT {item.price}</p>
                <div className="add-to-cart">
                  <CartIcon
                    itemID={item._id || ""}
                    quantity={1}
                    showText={true}
                  />
                </div>
                <div className="quantity-increment">
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity === 0}
                  >
                    -
                  </button>
                  <p className="quantity">{quantity}</p>
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(1)}
                    disabled={quantity === 50}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="single-item-images-cart"> */}
          <div className="single-item-images">
            {item.files && item.files.length > 0 ? (
              <Splide
                aria-label="Categories"
                className="slider"
                options={{
                  type: 'carousel',
                  perPage: 3,
                  perMove: 1,
                  marginRight: '0px',
                  marginBottom: '0px',
                  padding: '0px 15px',
                  pagination: false,
                  arrows: true,
                  drag: 'free',
                }}
              >
                {item.files?.map((file: any) => {
                  return (
                    <SplideSlide key={item._id}>
                      <Image
                        src={`http://localhost:3000/uploads/${file}`}
                        className="single-item-image"
                        onClick={() =>
                          setBanner(file)
                        }
                        height={50}
                        width={50}
                        alt="banner"
                      />
                    </SplideSlide>
                  );
                })}
              </Splide>
            ) : (
              <div></div>
            )}
          </div>



        </>
      )}
    </div>
  );
};

export default SingleItem;
