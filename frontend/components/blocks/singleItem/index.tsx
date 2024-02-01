'use client';

import './index.scss';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ItemResponse } from '@/types/interfaces';
import { GetItemByIdApi } from '@/apiEndpoints/item';

const SingleItem = () => {
    const { id } = useParams();

    const [item, setItem] = useState<ItemResponse>();

    useEffect(() => {
        const itemId = Array.isArray(id) ? id[0] : id;
        GetItemByIdApi(itemId).then((response) => {
            setItem(response);
        })
    }, []);

    console.log("item from component", item);
    return (
        <div className='single-item-container'>
            <img src={`http://localhost:3000/uploads/${item?.banner}`} className='single-item-banner'/>
            <div className='single-item-details'>
                <h1 className='single-item-title'>{item?.title}</h1>
                <p className='single-item-description'>{item?.description}</p>
                <p className='single-item-price'>${item?.price}</p>
            </div>
        </div>
    )
}

export default SingleItem;
