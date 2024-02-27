'use client';

import './index.scss';
import { useEffect, useState } from 'react';
import { GetBlogsByIdApi, GetBlogsApi, DeleteBlogApi } from '@/apiEndpoints/blog'
import { useDispatch, useSelector } from 'react-redux';
import { updateContentState, BlogResponse } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { AiFillDelete } from 'react-icons/ai';
import { RiFileEditFill } from 'react-icons/ri';
import Search from '@/components/elements/search';
import helper from '@/utils/helper';
import appConfig from '@/config/constants';
import Image from 'next/image';
import CreateBlogsModal from '../modals/createBlogsModal';
import EditBlogsModal from '../modals/editBlogsModal';
import DeleteBlogsModal from '../modals/deleteBlogsModal';
import CmsSkeleton from '@/components/elements/cmsSkeleton';

const ManageBlogs = () => {
    const dispatch = useDispatch();
    const { formatTimeAgo } = helper();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalBlog, setEditModalBlog] = useState<BlogResponse | null>(null);
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [blogId, setBlogId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openDeleteModal = (blogId: string) => {
        setBlogId(blogId);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (blogId: string) => {
        GetBlogsByIdApi(blogId).then((response) => {
            setEditModalBlog(response);
        });
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        GetBlogsApi(searchQuery || "").then((response) => {
            setBlogs(response.blogs);
            dispatch(saveContentLength({ contentLength: response?.blogs?.length || 0 }));
            setLoading(false);
        })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
                setBlogs([]);
                setLoading(false);
            });
    }, [contentLength, searchQuery, dispatch]);

    return (
        <div className='manage-blogs-container'>
            <div className='manage-blogs-header'>
                <CreateBlogsModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setBlogs={setBlogs}
                />
                <h3 className="manage-blogs-title">Manage Blogs</h3>
                <Search
                    type="text"
                    placeholder="Search Blogs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="create-blogs-button" onClick={openModal}>
                    Create Blog
                </button>
            </div>
            <div className='manage-blogs-body custom-scrollbar'>
                <div className="manage-blogs-card-table-header">
                    <p className="manage-blogs-card-table-title">Title</p>
                    <p className="manage-blogs-card-table-author">Author</p>
                    <p className="manage-blogs-card-table-date">Date</p>
                    <p className="manage-blogs-card-table-action">Action</p>
                </div>
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <CmsSkeleton key={index} />
                    ))
                ) :
                    blogs && blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog._id} className="manage-blogs-card">
                                <div className='manage-blogs-card-container'>
                                    <div className='manage-blogs-card-image-title'>
                                        <Image src={`${appConfig.nextPublicApiBaseUrl}/uploads/${blog.banner}`}
                                            alt="image"
                                            width={100}
                                            height={100}
                                            className="manage-blogs-card-image" />
                                        <p className='manage-blogs-card-title'>{blog.title}</p>
                                    </div>
                                    <p className='manage-blogs-card-author'>{blog.author?.username}</p>
                                    <p className='manage-blogs-card-date'>{formatTimeAgo(blog.createdAt)}</p>
                                </div>
                                <div className='manage-blogs-card-buttons'>
                                    <EditBlogsModal
                                        isEditModalOpen={isEditModalOpen}
                                        setIsEditModalOpen={setIsEditModalOpen}
                                        editModalBlog={editModalBlog}
                                        setBlogs={setBlogs}
                                    />
                                    <RiFileEditFill
                                        className="edit-button"
                                        onClick={() => {
                                            openEditModal(blog._id || "");
                                        }}
                                    />
                                    <DeleteBlogsModal
                                        isDeleteModalOpen={isDeleteModalOpen}
                                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                                        setBlogs={setBlogs}
                                        blogID={blog._id || ""}
                                        blogs={blogs}
                                    />
                                    <AiFillDelete
                                        className="delete-button"
                                        onClick={() => {
                                            openDeleteModal(blog._id);
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No blogs found</div>
                    )}
            </div>
        </div>
    );
}

export default ManageBlogs;
