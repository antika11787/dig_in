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
} from "@/apiEndpoints/cart";
import { GetItemByIdApi, GetItemsByCategoryIDApi } from "@/apiEndpoints/item";
import { saveNumberOfItems } from "@/redux/slices/CartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "@/types/interfaces";
import appConfig from "@/config/constants";
import SingleItemSkeleton from "@/components/elements/singleItemSkeleton";
import CartIcon from "@/components/elements/cartIcon";
import helper from "@/utils/helper";

const SingleItem = () => {
  const state = useSelector((state: any) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const numberOfItems = useSelector(
    (state: CartState) => state.cart.numberOfItems
  );
  const { truncateText } = helper();
  const { id } = useParams();
  const [item, setItem] = useState<ItemResponse>();
  const [moreItems, setMoreItems] = useState<ItemResponse>();
  const [categoryId, setCategoryId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const itemId = Array.isArray(id) ? id[0] : id;
      const [itemResponse, cartResponse] = await Promise.all([
        GetItemByIdApi(itemId),
        GetMyCartApi(),
      ]);
      setItem(itemResponse);
      setCategoryId(itemResponse.categoryID);
      setBanner(itemResponse.banner);
      setLoading(false);
    };
    fetchData();
  }, [id, quantity]);

  useEffect(() => {
    GetItemsByCategoryIDApi(categoryId).then((response) => {
      setMoreItems(response);
    })
  }, [categoryId]);


  const updateQuantity = (increment: number) => {
    const newQuantity = quantity + increment;
    setQuantity(newQuantity);
    setLoading(false);
  };

  return (
    <>
      <div className="single-item-container">
        {loading ? (
          <SingleItemSkeleton />
        ) :
          item && (
            <>
              <div className="single-item-banner-details">
                <Image
                  src={`${appConfig.nextPublicApiBaseUrl}/uploads/${banner}`}
                  className="single-item-banner"
                  height={350}
                  width={400}
                  alt="banner"
                />

                <div className="single-item-details">
                  <h1 className="single-item-title">{item.title}</h1>
                  <p className="single-item-description">{item.description}</p>
                  <div className="price-and-quantity">
                    <p className="single-item-price">Price: BDT {item.price}</p>
                    <div className="quantity-increment">
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(-1)}
                        disabled={quantity === 1}
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
                    <div className="add-to-cart">
                      <button className="save-quantity-button"
                        onClick={async () => {
                          if (state.token) {
                            const response = await AddToCartApi({ itemID: item?._id ?? '', quantity: quantity });
                            if (response) {
                              dispatch(saveNumberOfItems({
                                numberOfItems: response?.items?.length || 0
                              }))
                              setQuantity(1);
                            }
                          }
                          else {
                            router.push('/login');
                          }
                        }}
                      >Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>

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
                            src={`${appConfig.nextPublicApiBaseUrl}/uploads/${file}`}
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
      <div className="more-item-container">
        <h2 className="more-item-heading">More Items from This Category</h2>
        <div className="more-items-wrapper">
          <div className="more-item-container">
            {moreItems && Array.isArray(moreItems) && moreItems.length > 0 ? (
              <Splide
                aria-label="Categories"
                className="more-slider"
                options={{
                  type: 'carousel',
                  perPage: 2,
                  perMove: 2,
                  marginRight: '0px',
                  marginBottom: '5px',
                  padding: '0px 15px',
                  pagination: false,
                  arrows: true,
                  drag: 'free',
                }}
              >
                {moreItems.map((item: ItemResponse) => {
                  return (
                    <SplideSlide key={item._id}>
                      <div className="more-item-card">
                        <div className="more-item-image-container">
                          <Image
                            src={`${appConfig.nextPublicApiBaseUrl}/uploads/${item.banner}`}
                            alt="banner"
                            width={150}
                            height={150}
                            className="more-item-banner"
                            onClick={() => router.push(`/items/${item._id}`)}
                          />
                        </div>
                        <div className="more-item-details">
                          <div className="more-item-title-cart">
                            <h4 className="more-item-title">{item.title}</h4>
                            <CartIcon
                              itemID={item._id || ""}
                              quantity={1}
                              showText={false}
                            />
                          </div>
                          <p className="more-item-description">
                            {truncateText(item.description || "", 60)}
                          </p>
                          <p className="more-item-price">Price: BDT {item.price}</p>
                        </div>
                      </div>
                    </SplideSlide>
                  );
                })}
              </Splide>
            ) : (
              <div>No items Found</div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default SingleItem;
