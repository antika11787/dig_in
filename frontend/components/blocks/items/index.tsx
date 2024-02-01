'use client';

import './index.scss';
import { GetAllItemsApi } from "@/apiEndpoints/item";
import { ItemResponse } from '@/types/interfaces';
import { useState, useEffect } from 'react';
import helper from '@/utils/helper';
import { useRouter } from 'next/navigation';

const Items = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const [items, setItems] = useState<ItemResponse[]>([]);

    useEffect(() => {
        GetAllItemsApi().then((response) => {
            setItems(response);
        })
    }, []);

    return (
        <div className='items-container'>
            {/* {items && items.length > 0 ? ( */}
            {items.map((item) => {
                return (
                    <div key={item._id} className='item-card'
                        onClick={() => router.push(`/items/${item._id}`)}>
                        <img src={`http://localhost:3000/uploads/${item.banner}`}
                            alt="banner"
                            className='item-banner' />
                        <div className='item-details'>
                            <h3 className='item-title'>{item.title}</h3>
                            <p className='item-description'>{truncateText(item.description, 100)}</p>
                            <p className='item-price'>${item.price}</p>
                        </div>
                    </div>
                )
            })}
            {/* ) : (
                <p>No items found</p>
            )} */}
        </div>
    )
}

export default Items;
