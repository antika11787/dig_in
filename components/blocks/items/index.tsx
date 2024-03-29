"use client";

import "./index.scss";
import { GetAllItemsApi } from "@/apiEndpoints/item";
import { ItemResponse } from "@/types/interfaces";
import { useState, useEffect, Suspense } from "react";
import React, { ChangeEvent } from "react";
import { GetMyCartApi } from "@/apiEndpoints/cart";
import { CartResponse } from "@/types/interfaces";
import helper from "@/utils/helper";
import { useRouter } from "next/navigation";
import Search from "@/components/elements/search";
import Dropdown from "@/components/elements/dropdown";
import PriceRangeSlider from "@/components/elements/slider";
import CartIcon from "@/components/elements/cartIcon";
import Pagination from "@/components/elements/pagination";
import FoodFilter from "../itemFilter";
import { BsFilterRight } from "react-icons/bs";
import ItemSkeleton from "@/components/elements/itemSkeleton";
import appConfig from "@/config/constants";
import Image from "next/image";

const Items = () => {
  const router = useRouter();
  const { truncateText } = helper();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [cartData, setCartData] = useState<CartResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<{ [key: string]: string[] }>({
    price: [],
    category: [],
    tags: [],
  });

  //pagination
  const [limit, setLimit] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(1);

  //search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortParam, setSortParam] = useState<string>("");

  const handleSortParam = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortParam(e.target.value);
  };

  useEffect(() => {
    GetMyCartApi().then((response) => {
      setCartData(response);
    });
  }, []);

  useEffect(() => {
    GetAllItemsApi(searchQuery, filter, limit, currentPage, sortParam)
      .then((response) => {
        setItems(response.items);
        setTotalRecords(response.totalRecords);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setItems([]);
        setLoading(false);
      });
  }, [currentPage, sortParam, searchQuery, filter, limit]);

  return (
    <div className="items-wrapper">
      <div className="items-page">
        <div className="items-filter">
          <h3>
            <BsFilterRight />
            <span>Filter</span>
          </h3>
          <FoodFilter
            setFilter={(filter) => {
              setFilter(filter);
            }}
          />
        </div>
        <div>
          <div className="search-and-sort">
            <Search
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="searchbar"
            />
            <Dropdown
              title="Sort by"
              options={[
                { value: "priceAsc", label: "Price (Ascending)" },
                { value: "priceDesc", label: "Price (Descending)" },
                { value: "updatedAtAsc", label: "Oldest" },
                { value: "updatedAtDesc", label: "Newest" },
              ]}
              selectedOption={sortParam}
              onChange={handleSortParam}
              className="dropdown"
            />
          </div>
          <div className="item-container">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <ItemSkeleton key={index} />
              ))
            ) : items && items.length > 0 ? (
              items.map((item) => {
                return (
                  <div key={item._id} className="item-card">
                    <Image
                      src={`${appConfig.nextPublicApiBaseUrl}/uploads/${item.banner}`}
                      alt="banner"
                      width={300}
                      height={250}
                      className="item-banner"
                      onClick={() => router.push(`/items/${item._id}`)}
                    />
                    <div className="item-details">
                      <div className="item-title-cart">
                        <h4 className="item-title">{item.title}</h4>
                        <CartIcon
                          itemID={item._id || ""}
                          quantity={1}
                          showText={false}
                        />
                      </div>
                      <p className="item-description">
                        {truncateText(item.description || "", 60)}
                      </p>
                      <p className="item-price">Price: BDT {item.price}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              [...Array(6)].map((_, index) => (
                <ItemSkeleton key={index} />
              ))
            )}
          </div>

          <div className="item-pagination">
            <Pagination
              itemsPerPage={limit}
              totalItems={totalRecords}
              setPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
