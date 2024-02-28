'use client';

import './index.scss';
import { useEffect, useState, useCallback } from 'react';
import { GetBlogsByIdApi, GetBlogsApi, CreateBlogApi, DeleteBlogApi, UpdateBlogApi, GetMyBlogsApi } from '@/apiEndpoints/blog'
import { useDispatch, useSelector } from 'react-redux';
import { updateContentState, CreateBlogForm, CreateCategoryForm, BlogResponse, TextareaProps } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { AiFillDelete } from 'react-icons/ai';
import { RiFileEditFill } from 'react-icons/ri';
import { CgCloseR } from 'react-icons/cg';
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';
import { InputFieldProps } from '@/types/interfaces';
import Search from '@/components/elements/search';
import helper from '@/utils/helper';
import appConfig from '@/config/constants';
import Image from 'next/image';
import CreateBlogsModal from '../modals/createBlogsModal';
import EditBlogsModal from '../modals/editBlogsModal';
import DeleteBlogsModal from '../modals/deleteBlogsModal';
import CreateMyBlogModal from '../modals/createMyBlogModal';
import EditMyBlogsModal from '../modals/editMyBlogsModal';

const MyBlogs = () => {
    const dispatch = useDispatch();
    const { formatTimestamp } = helper();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalBlog, setEditModalBlog] = useState<BlogResponse | null>(null);
    const [file, setFile] = useState<any>(null);
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [blogId, setBlogId] = useState<string>("");

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
        GetMyBlogsApi().then((response) => {
            setBlogs(response);
            dispatch(saveContentLength({ contentLength: response?.length || 0 }));
        });
    }, [contentLength, dispatch]);

    return (
        <div className='my-blogs-container'>
            <div className='my-blogs-header'>
                <CreateMyBlogModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setBlogs={setBlogs}
                />
                <h3 className="my-blogs-title">Manage Blogs</h3>
                <button className="create-blogs-button" onClick={openModal}>
                    Create Blog
                </button>
            </div>
            <div className='my-blogs-body custom-scrollbar'>
                <div className="my-blogs-card-table-header">
                    <p className="my-blogs-card-table-title">Title</p>
                    <p className="my-blogs-card-table-author">Author</p>
                    <p className="my-blogs-card-table-date">Date</p>
                    <p className="my-blogs-card-table-action">Action</p>
                </div>
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog._id} className="my-blogs-card">
                            <div className='my-blogs-card-container'>
                                <div className='my-blogs-card-image-title'>
                                    <Image
                                        src={`${appConfig.nextPublicApiBaseUrl}/uploads/${blog.banner}`}
                                        alt="image"
                                        width={100}
                                        height={100}
                                        className="my-blogs-card-image" />
                                    <p className='my-blogs-card-title'>{blog.title}</p>
                                </div>
                                <p className='my-blogs-card-author'>{blog.author?.username}</p>
                                <p className='my-blogs-card-date'>{formatTimestamp(blog.createdAt)}</p>
                            </div>
                            <div className='my-blogs-card-buttons'>
                                <EditMyBlogsModal
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

export default MyBlogs;
