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
import appConfig from '@/config/constants';
import Image from 'next/image';
import ItemSkeleton from '@/components/elements/itemSkeleton';

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
    const [loading, setLoading] = useState<boolean>(true);

    const handleSortParam = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortParam(e.target.value);
    };

    useEffect(() => {
        GetBlogsApi(searchQuery, limit, currentPage, sortParam,)
            .then((response) => {
                setBlogs(response.blogs);
                setTotalRecords(response.totalRecords);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setBlogs([]);
                setLoading(false);
            });
    }, [sortParam, searchQuery, limit, currentPage]);

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
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <ItemSkeleton key={index} />
                    ))
                ) :
                    blogs && blogs.length > 0 ? (
                        blogs.map((blog) => {
                            return (
                                <div key={blog._id} className='blog-card'>
                                    <Image src={`${appConfig.nextPublicApiBaseUrl}/uploads/${blog.banner}`}
                                        alt="banner"
                                        width={300}
                                        height={250}
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
                        <div className='no-blogs'>
                            <Image src={'/cross.png'} height={20} width={20} alt="loading" />
                            <h4>No blogs found</h4>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Blogs;
