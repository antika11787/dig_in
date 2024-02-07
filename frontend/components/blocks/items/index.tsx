'use client';

import './index.scss';
import { GetAllItemsApi } from "@/apiEndpoints/item";
import { ItemResponse } from '@/types/interfaces';
import { useState, useEffect } from 'react';
import React, { ChangeEvent } from 'react';
import { GetMyCartApi } from '@/apiEndpoints/cart';
import { CartResponse } from '@/types/interfaces';
import helper from '@/utils/helper';
import { useRouter } from 'next/navigation';
import Search from '@/components/elements/search';
import Dropdown from '@/components/elements/dropdown';
import PriceRangeSlider from '@/components/elements/slider';
import CartIcon from '@/components/elements/cartIcon';

const Items = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const [items, setItems] = useState<ItemResponse[]>([]);
    const [cartData, setCartData] = useState<CartResponse>();

    //pagination
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    //search
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [sortParam, setSortParam] = useState<string>('');

    const handleSortParam = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortParam(e.target.value);
    };

    useEffect(() => {
        GetMyCartApi().then((response) => {
            setCartData(response);
        });
    }, []);

    useEffect(() => {
        GetAllItemsApi(currentPage, searchQuery, sortParam).then((response) => {
            setItems(response.items);
            setTotalPages(response.totalPages);
        }).catch(error => {
            console.error('Error fetching items:', error);
            setItems([]);
        });
    }, [currentPage, sortParam, searchQuery]);

    return (
        // <div className='items-page'>
        //     <div className='items-filter'>
        //         <PriceRangeSlider />
        //         <PriceRangeSlider />
        //         <PriceRangeSlider />
        //     </div>
        <div className='items-wrapper'>
            <div className='search-and-sort'>
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
                />
            </div>
            <div className='items-container'>
                {/* {items && items.length > 0 ? ( */}
                {items.map((item) => {
                    return (
                        <div key={item._id} className='item-card'
                        >
                            <img src={`http://localhost:3000/uploads/${item.banner}`}
                                alt="banner"
                                className='item-banner'
                                onClick={() => router.push(`/items/${item._id}`)}
                            />
                            <div className='item-details'>
                                <div className='item-title-cart'>
                                    <h4 className='item-title'>{item.title}</h4>
                                    <CartIcon itemID={item._id || ''} quantity={1} showText={false} />
                                </div>
                                <p className='item-description'>{truncateText(item.description || '', 60)}</p>
                                <p className='item-price'>Price: ${item.price}</p>
                            </div>
                        </div>
                    )
                })}
                {/* ) : (
                <p>No items found</p>
            )} */}
            </div>
        </div>
        // </div>
    )
}

export default Items;
