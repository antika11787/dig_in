'use client';

import './index.scss';
import { useEffect, useState, useCallback } from 'react';
// import { GetAllUsersApi, DeleteUsersApi, GetUserByIdApi, UpdateUserApi } from '@/apiEndpoints/user';
import { GetBlogsByIdApi, GetBlogsApi, CreateBlogApi, DeleteBlogApi } from '@/apiEndpoints/blog'
import { useDispatch, useSelector } from 'react-redux';
import { updateContentState, CreateUserForm, CreateBlogForm, CreateCategoryForm, BlogResponse } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { UserResponse } from '@/types/interfaces';
import { AiFillDelete } from 'react-icons/ai';
import { RiFileEditFill } from 'react-icons/ri';
import { CgCloseR } from 'react-icons/cg';
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

const ManageBlogs = () => {
    const dispatch = useDispatch();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalBlog, setEditModalBlog] = useState<UserResponse | null>(null);
    const [file, setFile] = useState<any>([]);
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            content: "",
            banner: "" as unknown as File,
            tags: "",
        },
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const openEditModal = (blogId: string) => {
        GetBlogsByIdApi(blogId).then((response) => {
            // setValue("username", response.username || "");
            // setValue("address", response.address || "");
            // setValue("role", response.role || "");

            setEditModalBlog(response);
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        // setValue("username", "");
        // setValue("address", "");
        // setValue("role", "");
    };

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("tags", data.tags);
        formData.append("banner", file[0]);

        await CreateBlogApi(formData);

        // Fetch the updated list of blogs after creating a new one
        const response = await GetBlogsApi();
        setBlogs(response);

        // Update the content length in Redux store
        dispatch(saveContentLength({ contentLength: response.length || 0 }));

        // Reset form fields and close modal
        setValue("title", "");
        setValue("content", "");
        setValue("tags", "");
        setFile([]);
        setIsModalOpen(false);
    };


    const onDrop = useCallback((acceptedFiles: any) => {
        setFile(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const response = await GetBlogsApi();
        setBlogs(response);
        dispatch(saveContentLength({ contentLength: response.length || 0 }));
    };

    const deleteBlog = async (blogId: string) => {
        await DeleteBlogApi(blogId);
        const updatedBlogs = blogs.filter(blog => blog._id !== blogId);
        setBlogs(updatedBlogs);
        dispatch(saveContentLength({ contentLength: updatedBlogs.length || 0 }));
    };

    console.log("blog", blogs, contentLength);

    return (
        <div className='manage-blogs-container'>
            <div className='manage-blogs-header'>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                            width: "45%",
                            height: "55%",
                            margin: "auto",
                            borderRadius: "10px",
                            overflow: "auto",
                        },
                    }}
                >
                    <div className="create-blogs-form-container">
                        <h3>Create Blog</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="create-blogs-form-item">
                                <label className="create-blogs-form-label">Title: </label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{
                                        required: "Title is required",
                                    }}
                                    render={({ field }) => (
                                        <input
                                            placeholder="Enter title"
                                            {...field}
                                            className="create-blogs-form-input"
                                        />
                                    )}
                                />
                                {errors.title && <h5>{errors.title.message}</h5>}
                            </div>

                            <div className="create-blogs-form-item">
                                <label className="create-blogs-form-label">Content: </label>
                                <Controller
                                    name="content"
                                    control={control}
                                    rules={{
                                        required: "Content is required",
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            placeholder="Enter Content"
                                            {...field}
                                            className="create-blogs-form-input"
                                        />
                                    )}
                                />
                                {errors.content && <h5>{errors.content.message}</h5>}
                            </div>

                            <div className="create-blogs-form-item">
                                <label className="create-blogs-form-label">Tags(Comma separated): </label>
                                <Controller
                                    name="tags"
                                    control={control}
                                    rules={{
                                        required: "Tags are required",
                                    }}
                                    render={({ field }) => (
                                        <input
                                            placeholder="Enter tags(use comma to separate tags)"
                                            {...field}
                                            className="create-blogs-form-input"
                                        />
                                    )}
                                />
                                {errors.tags && <h5>{errors.tags.message}</h5>}
                            </div>

                            <div className="create-blogs-form-upload">
                                <div className="upload">
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {isDragActive ? (
                                            <p>Drop the files here ...</p>
                                        ) : (
                                            <img src="/upload.png" className="upload-icon" />
                                        )}
                                    </div>
                                    <label>Upload a Banner Image for the Blog</label>
                                </div>
                                <div>
                                    {file[0] ? (
                                        <img src={URL.createObjectURL(file[0])} alt="image" className="upload-image" />
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button className="submit-button">Submit</button>
                            </div>
                        </form>
                    </div>
                    <CgCloseR className="close-button" onClick={closeModal} />
                </Modal>
                <h3 className="manage-blogs-title">Manage Blogs</h3>
                <button className="create-blogs-button" onClick={openModal}>
                    Create Blog
                </button>
            </div>
            <div className='manage-blogs-body custom-scrollbar'>
                {blogs &&
                    blogs.map((blog) => (
                        <div key={blog._id} className="manage-blogs-card">
                            <div className='manage-blogs-card-container'>
                                <img src={`http://localhost:3000/uploads/${blog.banner}`} alt="image" className="manage-blogs-card-image" />
                                <div className='manage-blogs-card-details'>
                                    <div className="manage-blogs-card-title">
                                        {blog?.title}
                                    </div>
                                    <div className="manage-blogs-card-content">
                                        {blog.content?.substring(0, 100)}...
                                    </div>
                                    <div className="manage-blogs-card-author">
                                        Author: {blog.author?.username}
                                    </div>
                                </div>
                            </div>
                            <div className='manage-blogs-card-buttons'>
                                <Modal
                                    isOpen={isEditModalOpen}
                                    onRequestClose={closeEditModal}
                                    ariaHideApp={false}
                                    contentLabel="Example Modal"
                                    style={{
                                        overlay: {
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        },
                                        content: {
                                            width: "45%",
                                            height: "55%",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            overflow: "auto",
                                        },
                                    }}
                                >
                                    <div className="create-blogs-form-container">
                                        <h3>Edit User</h3>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="create-blogs-form-item">
                                                <label className="create-blogs-form-label">Title: </label>
                                                <Controller
                                                    name="title"
                                                    control={control}
                                                    rules={{
                                                        required: "Title is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <input
                                                            placeholder="Enter title"
                                                            {...field}
                                                            className="create-blogs-form-input"
                                                        />
                                                    )}
                                                />
                                                {errors.title && <h5>{errors.title.message}</h5>}
                                            </div>

                                            <div className="create-blogs-form-item">
                                                <label className="create-blogs-form-label">Content: </label>
                                                <Controller
                                                    name="content"
                                                    control={control}
                                                    rules={{
                                                        required: "Content is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <textarea
                                                            placeholder="Enter Content"
                                                            {...field}
                                                            className="create-blogs-form-input"
                                                        />
                                                    )}
                                                />
                                                {errors.content && <h5>{errors.content.message}</h5>}
                                            </div>

                                            <div className="create-blogs-form-item">
                                                <label className="create-blogs-form-label">Tags(Comma separated): </label>
                                                <Controller
                                                    name="tags"
                                                    control={control}
                                                    rules={{
                                                        required: "Tags are required",
                                                    }}
                                                    render={({ field }) => (
                                                        <input
                                                            placeholder="Enter tags(use comma to separate tags)"
                                                            {...field}
                                                            className="create-blogs-form-input"
                                                        />
                                                    )}
                                                />
                                                {errors.tags && <h5>{errors.tags.message}</h5>}
                                            </div>

                                            <div className="create-blogs-form-upload">
                                                <div className="upload">
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        {isDragActive ? (
                                                            <p>Drop the files here ...</p>
                                                        ) : (
                                                            <img src="/upload.png" className="upload-icon" />
                                                        )}
                                                    </div>
                                                    <label>Upload a Banner Image for the blogs</label>
                                                </div>
                                                <div>
                                                    {/* {file[0] ? (
                                                        <img src={URL.createObjectURL(file[0])} alt="image" className="upload-image" />
                                                    ) : (
                                                        user.banner ? (
                                                            <img src={`http://localhost:3000/uploads/${blogs.file}`} alt="image" className="upload-image" />
                                                        ) : (
                                                            <div>No image available</div>
                                                        )
                                                    )} */}

                                                </div>
                                            </div>

                                            <div>
                                                <button className="submit-button">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                    <CgCloseR className="close-button" onClick={closeEditModal} />
                                </Modal>
                                <RiFileEditFill
                                    className="edit-button"
                                    onClick={() => {
                                        openEditModal(blog._id || "");
                                    }}
                                />
                                <Modal
                                    isOpen={isDeleteModalOpen}
                                    onRequestClose={closeDeleteModal}
                                    ariaHideApp={false}
                                    contentLabel="Example Modal"
                                    style={{
                                        overlay: {
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        },
                                        content: {
                                            width: "50%",
                                            height: "50%",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            overflow: "auto",
                                        },
                                    }}
                                >
                                    <div>
                                        <h2>Delete blogs</h2>
                                        <p>
                                            Are you sure you want to delete this blog?
                                        </p>
                                        <div className="delete-modal-button">
                                            <button
                                                className="yes-button"
                                                onClick={() => {
                                                    deleteBlog(blog._id || "");
                                                    // dispatch(saveContentLength({ contentLength: -1 }));
                                                    closeDeleteModal();
                                                }}
                                            >
                                                Yes
                                            </button>
                                            <button className="no-button" onClick={closeDeleteModal}>
                                                No
                                            </button>
                                        </div>
                                    </div>
                                    <CgCloseR
                                        className="close-button"
                                        onClick={closeDeleteModal}
                                    />
                                </Modal>
                                <AiFillDelete
                                    className="delete-button"
                                    onClick={() => {
                                        openDeleteModal();
                                    }}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ManageBlogs;
