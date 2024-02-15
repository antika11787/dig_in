'use client';

import { useEffect, useState } from 'react';
import { GetBlogsApi } from "@/apiEndpoints/blog";
import { BlogResponse } from "@/types/interfaces";
import helper from '@/utils/helper';
import { Button } from '@/components/elements/button';
import { useRouter } from 'next/navigation';
import './index.scss';

const Blogs = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);

    useEffect(() => {
        GetBlogsApi().then((response) => {
            setBlogs(response);
        })
    }, []);

    return (
        <div className='blog-wrapper'>
            <h2>Blogs</h2>
            <div className='blog-container'>
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => {
                        return (
                            <div key={blog._id} className='blog-card'>
                                <img src={`http://localhost:3000/uploads/${blog.banner}`}
                                    alt="banner"
                                    className='blog-banner' />
                                <div className='blog-details'>
                                    <h3 className='blog-title'>{blog.title}</h3>
                                    <p className='blog-description'>{truncateText(blog.content, 60)}</p>
                                    <Button type="button" value="Read More" additionalStyle="read-more-button"
                                        onClick={() => {
                                            router.push(`/blogs/${blog._id}`)
                                        }} />
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div>No blogs found</div>
                )}
            </div>
        </div>
    )
}

export default Blogs;
