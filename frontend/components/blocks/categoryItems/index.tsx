'use client';

import { useEffect, useState } from "react";
import { GetItemsByCategoryIDApi } from "@/apiEndpoints/item";
import { ItemResponse } from "@/types/interfaces";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import helper from "@/utils/helper";
import CategoryList from "../../layout/categoryList";
import './index.scss';

const categoryItems = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const { id } = useParams();
    const [categoryItems, setCategoryItems] = useState<ItemResponse[]>([]);

    useEffect(() => {
        const categoryId = Array.isArray(id) ? id[0] : id;

        GetItemsByCategoryIDApi(categoryId).then((response) => {
            setCategoryItems(response);
        });
    }, [id]);

    return (
        <div className="category-wrapper">
            <CategoryList/>
            {/* <h2 className="category-items-title">Category Items</h2> */}
            <div className="items-container-category">
                {/* {categoryItems && categoryItems?.length > 0 ? ( */}
                    {categoryItems.map((item) => {
                        return (
                            <div key={item._id} className='item-card'
                                onClick={() => router.push(`/items/${item._id}`)}>
                                <img src={`http://localhost:3000/uploads/${item.banner}`}
                                    alt="banner"
                                    className='item-banner' />
                                <div className='item-details'>
                                    <h3 className='item-title'>{item.title}</h3>
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
    )
}

export default categoryItems;
