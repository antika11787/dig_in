'use client';
import './index.scss';
import { useEffect, useState } from "react";
import { GetItemsByCategoryIDApi } from "@/apiEndpoints/item";
import { ItemResponse } from "@/types/interfaces";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import helper from "@/utils/helper";
import CategoryList from "../../layout/categoryList";
import Image from "next/image";
import CartIcon from "@/components/elements/cartIcon";
import appConfig from "@/config/constants";
import ItemSkeleton from '@/components/elements/itemSkeleton';

const CategoryItems = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const { id } = useParams();
    const [categoryItems, setCategoryItems] = useState<ItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const categoryId = Array.isArray(id) ? id[0] : id ?? 'defaultCategoryId';
        GetItemsByCategoryIDApi(categoryId).then((response) => {
            setCategoryItems(response);
            setLoading(false);
        })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="category-wrapper">
            <CategoryList />
            <div className="item-container">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <ItemSkeleton key={index} />
                    ))
                ) :
                    categoryItems ? (categoryItems.map((item) => {
                        return (
                            <div key={item._id} className='item-card'>
                                <Image src={`${appConfig.nextPublicApiBaseUrl}/uploads/${item.banner}`}
                                    alt="banner"
                                    width={300}
                                    height={350}
                                    className='item-banner'
                                    onClick={() => router.push(`/items/${item._id}`)} />
                                <div className='item-details'>
                                    <div className='item-title-cart'>
                                        <h4 className='item-title'>{item.title}</h4>
                                        <CartIcon itemID={item._id || ''} quantity={1} showText={false} />
                                    </div>
                                    <p className='item-description'>{truncateText(item.description || '', 60)}</p>
                                    <p className='item-price'>Price: BDT {item.price}</p>
                                </div>
                            </div>
                        )
                    })
                    ) : (
                        <div className="no-items">
                            <Image src={'/cross.png'} height={20} width={20} alt="loading" />
                            <h4>No items found</h4>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default CategoryItems;
