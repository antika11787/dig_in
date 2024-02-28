'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';
import './index.scss';
import CartIcon from "@/components/elements/cartIcon";
import { Button } from "@/components/elements/button";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { GetItemsByCategoryIDApi } from "@/apiEndpoints/item";
import { GetBlogsApi } from "@/apiEndpoints/blog";
import { CategoryResponse, BlogResponse, ItemResponse } from "@/types/interfaces";
import helper from "@/utils/helper";
import { PiHamburgerFill } from "react-icons/pi";
import appConfig from "@/config/constants";
import ItemSkeleton from "@/components/elements/itemSkeleton";

const HomePage = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [categoryID, setCategoryID] = useState<string>("");
    const [items, setItems] = useState<ItemResponse[]>([]);
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const parallaxFactor = 0.8;
        const image = document.querySelector(".image-wrapper img") as HTMLElement;

        if (image) {
            image.style.transform = `translateY(${scrollTop * parallaxFactor}px)`;
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        GetCategoriesApi().then((response) => {
            setCategories(response);
        })
    }, []);

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCategoryID(categories[0]._id);
        }
    }, [categories]);

    useEffect(() => {
        GetBlogsApi().then((response) => {
            setBlogs(response?.blogs);
            setLoading(false);
        })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        if (categoryID) {
            GetItemsByCategoryIDApi(categoryID).then((response) => {
                setItems(response);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
                setItems([]);
                setLoading(false);
            })
        }
    }, [categoryID]);

    const handleCategoryClick = (categoryId: string) => {
        setCategoryID(categoryId);
    };

    return (
        <div className="container">
            <div className="banner-container">
                <div className="image-wrapper">
                    <Image
                        src={'/back5.jpg'}
                        alt="banner"
                        layout="responsive"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="banner-overlay"></div>
                <div className="text-container">
                    <h2 className="banner-title">Welcome to Dig In</h2>
                    <p className="banner-tag">Explore and savour amazing foods!</p>
                    <Button type="button" value="Explore" additionalStyle="explore-button" />
                </div>
            </div>
            <div className="category-container-home">
                <div className="category-tags">
                    <div className="category-names">
                        <Splide
                            aria-label="Categories"
                            className="slider"
                            options={{
                                type: 'carousel',
                                perPage: 3,
                                perMove: 1,
                                marginRight: '0px',
                                padding: '0 15px',
                                pagination: false,
                                arrows: true,
                                drag: 'free',
                            }}
                        >
                            {
                                categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <SplideSlide key={category._id}>
                                            <div>
                                                <p
                                                    className={`category-tag ${categoryID === category._id ? "active" : ""
                                                        }`}
                                                    onClick={() => handleCategoryClick(category._id)}
                                                >
                                                    {category.categoryName}
                                                </p>
                                            </div>
                                        </SplideSlide>
                                    ))
                                ) : (
                                    <div>No categories found</div>
                                )}
                        </Splide>
                    </div>
                    <div className="item-container">
                        {loading ? (
                            [...Array(3)].map((_, index) => (
                                <ItemSkeleton key={index} />
                            ))
                        ) :
                            items && items.length > 0 ? (items.slice(0, 3).map((item) => {
                                return (
                                    <div key={item._id} className='item-card'>
                                        <Image src={`${appConfig.nextPublicApiBaseUrl}/uploads/${item.banner}`}
                                            alt="banner"
                                            width={300}
                                            height={250}
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
                        <button className="view-all-button"
                            onClick={() => router.push('/items')}>
                            View All Items
                        </button>
                    </div>
                </div>
            </div>
            <div className="blog-container">
                <h2 className="blog-title">Our Stories</h2>
                <p className="blog-text">Dig in invites you to delve into the rich tapestry of our culinary adventures,
                    from the farm-fresh ingredients to the chef&apos;s meticulous craftsmanship.
                    Discover the inspirations behind each dish and share your own memorable dining experiences with us.</p>

                <div className="blog-cards">
                    {
                        loading ? (
                            [...Array(3)].map((_, index) => (
                                <ItemSkeleton key={index} />
                            ))
                        ) : blogs && blogs.slice(0, 3).map((blog) => {
                            return (
                                <div key={blog._id}>
                                    <div className="blog-card">
                                        <Image src={`${appConfig.nextPublicApiBaseUrl}/uploads/${blog.banner}`}
                                            alt="banner"
                                            width={300}
                                            height={250}
                                            className="banner-image" />
                                        <div className="blog-details">
                                            <PiHamburgerFill className="blog-icon" />
                                            <h4>{blog.title}</h4>
                                            <p className="blog-card-content">
                                                {truncateText(blog.content ?? "", 60)}</p>
                                            <Button type="button" value="Read More" additionalStyle="read-more-button"
                                                onClick={() => router.push(`/blogs/${blog._id}`)} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    <button className="view-all-button"
                        onClick={() => router.push('/blogs')}>
                        View All Blogs
                    </button>
                </div>
            </div>

        </div>
    )
}

export default HomePage;
