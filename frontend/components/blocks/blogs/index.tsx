'use client';

import { useEffect, useState } from 'react';
import { GetBlogsApi } from "@/apiEndpoints/blog";
import { BlogResponse } from "@/types/interfaces";
import helper from '@/utils/helper';
import './index.scss';

const Blogs = () => {
    const { truncateText } = helper();
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);

    useEffect(() => {
        GetBlogsApi().then((response) => {
            setBlogs(response);
        })
    }, []);

    console.log("blogs from page", blogs);

    return (
        <div className='blog-wrapper'>
            <h2>Blogs</h2>
            <div className='blog-container'>
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => {
                        return (
                            <div key={blog._id} className='blog-card'>
                                <img src={`http://localhost:3000/uploads/${blog.banner}`} className='blog-banner' />
                                <div className='blog-details'>
                                    <h3 className='blog-title'>{blog.title}</h3>
                                    <p className='blog-description'>{truncateText(blog.content, 100)}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p>No blogs found</p>
                )}
            </div>
        </div>
    )
}

export default Blogs;
