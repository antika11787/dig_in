'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { GetBlogsApi } from "@/apiEndpoints/blog";
import { BlogResponse } from "@/types/interfaces";
import helper from '@/utils/helper';
import { Button } from '@/components/elements/button';
import { useRouter } from 'next/navigation';
import Search from '@/components/elements/search';
import Dropdown from '@/components/elements/dropdown';
import './index.scss';

const Blogs = () => {
    const router = useRouter();
    const { truncateText } = helper();
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortParam, setSortParam] = useState<string>("");
    // const [filter, setFilter] = useState<{ [key: string]: string[] }>({
    //     tags: [],
    //   });

    //pagination
    const [limit, setLimit] = useState<number>(6);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(1);

    const handleSortParam = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortParam(e.target.value);
    };

    useEffect(() => {
        GetBlogsApi(searchQuery, limit, currentPage, sortParam,)
            .then((response) => {
                setBlogs(response.blogs);
                setTotalRecords(response.totalRecords);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setBlogs([]);
            });
    }, [sortParam, searchQuery, limit]);

    return (
        <div className='blog-wrapper'>
            <div className="search-and-sort">
                <Search
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="searchbar"
                />
                <Dropdown
                    title="Sort by"
                    options={[
                        { value: "createdAtAsc", label: "Oldest" },
                        { value: "createdAtDesc", label: "Newest" },
                    ]}
                    selectedOption={sortParam}
                    onChange={handleSortParam}
                />
            </div>
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
