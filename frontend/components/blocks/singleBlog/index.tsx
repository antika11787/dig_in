"use client";
import { GetBlogByIdApi } from "@/apiEndpoints/blog";
import { BlogResponse } from "@/types/interfaces";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./index.scss";

const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<BlogResponse>();
    const [banner, setBanner] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const blogId = Array.isArray(id) ? id[0] : id;
            const blogResponse = await GetBlogByIdApi(blogId);
            setBlog(blogResponse);
            setBanner(blogResponse.banner);
        }
        fetchData();
    }, [id]);

    return (
        <div className="single-blog-container">
            {blog && (
                <div>
                    <div className="single-blog-banner-container">
                        <Image src={`http://localhost:3000/uploads/${blog.banner}`} alt="banner" width={1500} height={300} className="single-blog-banner" />
                    </div>
                    <div className="single-blog-details">
                        <h1 className="single-blog-title">{blog.title}</h1>
                        <hr className="single-blog-line"></hr>
                        <Image src={`/writer.png`} alt="banner" width={50} height={50} className="single-blog-author-img" />
                        <p className="single-blog-username">{blog.author.username}</p>
                        <p className="single-blog-email">{blog.author.email}</p>
                    </div>
                    <div className="single-blog-content">
                        {blog.content}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleBlog;
