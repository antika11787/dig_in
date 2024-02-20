'use client';

import './index.scss';
import { useEffect, useState, useCallback } from 'react';
import { GetBlogsByIdApi, GetBlogsApi, CreateBlogApi, DeleteBlogApi, UpdateBlogApi } from '@/apiEndpoints/blog'
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

const ManageBlogs = () => {
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
    const [searchQuery, setSearchQuery] = useState<string>("");

    const {
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            content: "",
            banner: null,
            tags: "",
        },
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset()
        setFile(null);
    };

    const openDeleteModal = (blogId: string) => {
        setBlogId(blogId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const openEditModal = (blogId: string) => {
        GetBlogsByIdApi(blogId).then((response) => {
            setValue("title", response.title || "");
            setValue("content", response.content || "");
            setValue("tags", response.tags || []);
            setValue("banner", response?.banner || "");

            setEditModalBlog(response);
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        reset();
        setFile(null);
        // setValue("title", "");
        // setValue("content", "");
        // setValue("tags", "");
        // setValue("banner", "" as unknown as File);
    };

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("tags", data.tags);
        formData.append("banner", file);

        await CreateBlogApi(formData);

        // Fetch the updated list of blogs after creating a new one
        const response = await GetBlogsApi();
        setBlogs(response);

        // Update the content length in Redux store
        dispatch(saveContentLength({ contentLength: response.length || 0 }));

        // Reset form fields and close modal
        // setValue("title", "");
        // setValue("content", "");
        // setValue("tags", "");
        // setFile([]);
        reset(); // Reset form fields after submission
        setFile(null);
        setIsModalOpen(false);
    };

    const onEditSubmit = async (data: CreateBlogForm) => {
        const formData = new FormData();
        const blogFormData: CreateBlogForm = {
            title: data.title,
            content: data.content,
            tags: data.tags
        };

        Object.entries(blogFormData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Only append the banner if a new file is selected
        if (file) {
            formData.append("banner", file);
        }

        await UpdateBlogApi(
            editModalBlog && editModalBlog._id ? editModalBlog._id : "",
            formData
        );

        const updatedBlogs = await GetBlogsApi();
        setBlogs(updatedBlogs);
        dispatch(saveContentLength({ contentLength: updatedBlogs.length || 0 }));

        reset(); // Reset form fields after submission
        setFile(null); // Reset file state after submission
        setIsEditModalOpen(false);
    };


    const onDrop = useCallback((acceptedFiles: any) => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    useEffect(() => {
        fetchBlogs();
    }, [contentLength, searchQuery]);

    const fetchBlogs = async () => {
        const response = await GetBlogsApi(searchQuery || "");
        setBlogs(response.blogs);
        dispatch(saveContentLength({ contentLength: response?.blogs?.length || 0 }));
    };

    const deleteBlog = async (blogId: string) => {
        await DeleteBlogApi(blogId);
        const updatedBlogs = blogs.filter(blog => blog._id !== blogId);
        setBlogs(updatedBlogs);
        dispatch(saveContentLength({ contentLength: updatedBlogs.length || 0 }));
    };

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
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
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
                        <h2 className='create-blogs-form-heading'>Create Blog</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className='create-blogs-form'>
                            <div className="create-blogs-form-item">
                                <label className="create-blogs-form-label">Title: </label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{
                                        required: "Title is required",
                                    }}
                                    render={({ field }: { field: InputFieldProps }) => (
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
                                    render={({ field }: { field: TextareaProps }) => (
                                        <textarea
                                            placeholder="Enter Content"
                                            {...field}
                                            className="create-blogs-form-input custom-scrollbar"
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
                                    render={({ field }: { field: InputFieldProps }) => (
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
                                    {file ? (
                                        <img src={URL.createObjectURL(file)} alt="image" className="upload-image" />
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
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog._id} className="manage-blogs-card">
                            <div className='manage-blogs-card-container'>
                                <div className='manage-blogs-card-image-title'>
                                    <img src={`http://localhost:3000/uploads/${blog.banner}`} alt="image" className="manage-blogs-card-image" />
                                    <p className='manage-blogs-card-title'>{blog.title}</p>
                                </div>
                                <p className='manage-blogs-card-author'>{blog.author?.username}</p>
                                <p className='manage-blogs-card-date'>{formatTimestamp(blog.createdAt)}</p>
                            </div>
                            <div className='manage-blogs-card-buttons'>
                                <Modal
                                    isOpen={isEditModalOpen}
                                    onRequestClose={closeEditModal}
                                    ariaHideApp={false}
                                    contentLabel="Example Modal"
                                    style={{
                                        overlay: {
                                            backgroundColor: "rgba(0, 0, 0, 0.2)",
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
                                        <h2 className='create-blogs-form-heading'>Edit Blog</h2>
                                        <form onSubmit={handleSubmit(onEditSubmit)} className='create-blogs-form'>
                                            <div className="create-blogs-form-item">
                                                <label className="create-blogs-form-label">Title: </label>
                                                <Controller
                                                    name="title"
                                                    control={control}
                                                    rules={{
                                                        required: "Title is required",
                                                    }}
                                                    render={({ field }: { field: InputFieldProps }) => (
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
                                                    render={({ field }: { field: TextareaProps }) => (
                                                        <textarea
                                                            placeholder="Enter Content"
                                                            {...field}
                                                            className="create-blogs-form-input custom-scrollbar"
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
                                                    render={({ field }: { field: InputFieldProps }) => (
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
                                                    {file ? (
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="image"
                                                            className="upload-image"
                                                        />
                                                    ) : editModalBlog ? (
                                                        <img
                                                            src={`http://localhost:3000/uploads/${editModalBlog.banner}`}
                                                            alt="image"
                                                            className="upload-image"
                                                        />
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
                                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                                        },
                                        content: {
                                            width: "40%",
                                            height: "35%",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            overflow: "auto",
                                        },
                                    }}
                                >
                                    <div className="delete-modal-container">
                                        <h2 className="delete-modal-heading">Delete Blog</h2>
                                        <p className="delete-modal-description">
                                            Are you sure you want to delete this blog?
                                        </p>
                                        <div className="delete-modal-button">
                                            <button
                                                className="yes-button"
                                                onClick={() => {
                                                    deleteBlog(blogId);
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

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     // Fetch data from your API
//     const blogData = await GetBlogsApi();

//     // Pass data to the component props
//     return {
//         props: {
//             blogData,
//         },
//     };
// }

export default ManageBlogs;
