'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import './index.scss';
import { Button } from "@/components/elements/button";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { GetItemsByCategoryIDApi } from "@/apiEndpoints/item";
import { GetBlogsApi } from "@/apiEndpoints/blog";
import { CategoryResponse, BlogResponse, ItemResponse } from "@/types/interfaces";
import helper from "@/utils/helper";
import { PiHamburgerFill } from "react-icons/pi";

const HomePage = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [categoryID, setCategoryID] = useState<string>("");
    const [items, setItems] = useState<ItemResponse[]>([]);
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);

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
            setBlogs(response);
        })
    }, []);

    useEffect(() => {
        if (categoryID) {
            GetItemsByCategoryIDApi(categoryID).then((response) => {
                setItems(response);
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
                <h2 className="category-title">Categories</h2>
                <div className="category-tags">
                    <div className="category-names">
                        {categories.map((category) => (
                            <div key={category._id}>
                                <p
                                    className={`category-tag ${categoryID === category._id ? "active" : ""
                                        }`}
                                    onClick={() => handleCategoryClick(category._id)}
                                >
                                    {category.categoryName}
                                </p>

                            </div>
                        ))}
                    </div>
                    <div className="category-items">
                        {items.map((item) => {
                            return (
                                <div key={item._id} className='item-card-home'
                                    onClick={() => router.push(`/items/${item._id}`)}>
                                    <img src={`http://localhost:3000/uploads/${item.banner}`}
                                        alt="banner"
                                        className='item-banner-home' />
                                    <div className='item-details-home'>
                                        <h3 className='item-title-home'>{item.title}</h3>
                                        <p className='item-description-home'>{truncateText(item.description, 100)}</p>
                                        <p className='item-price-home'>${item.price}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="blog-container">
                <h2 className="blog-title">Our Stories</h2>
                <p className="blog-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                <div className="blog-cards">
                    {blogs.map((blog) => {
                        return (
                            <div key={blog._id}>
                                <div className="blog-card">
                                    <img src={`http://localhost:3000/uploads/${blog.banner}`} className="banner-image" />
                                    <div className="blog-details">
                                        <PiHamburgerFill className="blog-icon" />
                                        <h3>{blog.title}</h3>
                                        <p>
                                            {truncateText(blog.content ?? "", 100)}</p>
                                        <Button type="button" value="Read More" additionalStyle="read-more-button" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

        </div>
    )
}

export default HomePage;
