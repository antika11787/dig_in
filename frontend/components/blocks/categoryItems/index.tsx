'use client';

import { useEffect, useState } from "react";
import { GetItemsByCategoryIDApi } from "@/apiEndpoints/item";
import { ItemResponse } from "@/types/interfaces";
import { useParams } from "next/navigation";

const categoryItems = () => {
    const { id } = useParams();
    const [categoryItems, setCategoryItems] = useState<ItemResponse[]>([]);

    useEffect(() => {
        const categoryId = Array.isArray(id) ? id[0] : id;

        GetItemsByCategoryIDApi(categoryId).then((response) => {
            setCategoryItems(response);
        });
    }, [id]);

    return (
        <div>
            <h1>Category Items</h1>
            {categoryItems && categoryItems?.length > 0 ? (
                categoryItems.map((item) => (
                    <div key={item._id}>
                        <p>{item.title}</p>
                    </div>
                ))
            ) : (
                <p>No items found</p>
            )}
        </div>
    )
}

export default categoryItems;
