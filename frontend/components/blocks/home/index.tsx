'use client';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeLogin } from "@/redux/slices/UserSlice";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import './index.scss';
import { Button } from "@/components/elements/button";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { GetBlogsApi } from "@/apiEndpoints/blog";
import { CategoryResponse, BlogResponse } from "@/types/interfaces";
import helper from "@/utils/helper";
import { PiHamburgerFill } from "react-icons/pi";

const HomePage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { truncateText } = helper();
    // const { categoryId } = router.query;
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        const parallaxFactor = 0.5;
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
        GetBlogsApi().then((response) => {
            setBlogs(response);
        })
    }, [])

    console.log("blogs from page", blogs);

    

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
            <div className="category-container">
                <h2 className="category-title">Categories</h2>
                <div className="category-tags">
                    {categories.map((category) => {
                        return (
                            <div key={category._id}>
                                <p className={`category-tag`}
                                    onClick={() => router.push(`/category/${category._id}`)}>
                                    {category.categoryName}
                                </p>
                            </div>
                        )
                    })}
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
                                    <Image className="blog-image" src={'/back1.jpg'} alt="blog" width={350} height={300} />
                                    <PiHamburgerFill className="blog-icon" />
                                    <h3>{blog.title}</h3>
                                    <p>
                                        {truncateText(blog.content ?? "", 100)}</p>
                                    <Button type="button" value="Read More" additionalStyle="read-more-button" />
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
