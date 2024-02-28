import { useEffect, useState, useCallback } from 'react';
import { GetBlogsByIdApi, GetMyBlogsApi, CreateBlogApi, DeleteBlogApi, UpdateBlogApi } from '@/apiEndpoints/blog'
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
import CreateBlogsModal from '../createBlogsModal';
import DropzoneInput from '@/components/elements/dropzoneInput';
import FormInput from '@/components/elements/formInput';

type EditBlogsModalProps = {
    isEditModalOpen: boolean;
    editModalBlog: BlogResponse | null;
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBlogs: React.Dispatch<React.SetStateAction<BlogResponse[]>>;
}

const EditBlogsModal = (props: EditBlogsModalProps) => {
    const [file, setFile] = useState<any>(null);
    const dispatch = useDispatch();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: props.editModalBlog?.title,
            content: props.editModalBlog?.content,
            tags: props.editModalBlog?.tags,
            banner: props.editModalBlog?.banner,
        },
    });

    useEffect(() => {
        reset({
            title: props.editModalBlog?.title,
            content: props.editModalBlog?.content,
            tags: props.editModalBlog?.tags,
            banner: props.editModalBlog?.banner,
        });
    }, [props.editModalBlog, reset]);

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

        if (file) {
            formData.append("banner", file);
        }

        await UpdateBlogApi(
            props.editModalBlog && props.editModalBlog._id ? props.editModalBlog._id : "",
            formData
        );

        const updatedBlogs = await GetMyBlogsApi();
        props.setBlogs(updatedBlogs);
        dispatch(saveContentLength({ contentLength: updatedBlogs.length || 0 }));

        reset();
        setFile(null);
        props.setIsEditModalOpen(false);
    };

    const closeEditModal = () => {
        props.setIsEditModalOpen(false);
        reset();
        setFile(null);
    };

    return (
        <Modal
            isOpen={props.isEditModalOpen}
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
                    <FormInput
                        label="Title:"
                        nameProp="title"
                        requiredProp="This field is required"
                        placeholder="Enter title"
                        control={control}
                        errors={errors}
                    />
                    <FormInput
                        label="Content:"
                        nameProp="content"
                        requiredProp="This field is required"
                        placeholder="Enter content"
                        control={control}
                        errors={errors}
                    />
                    <FormInput
                        label="Tags(Comma separated):"
                        nameProp="tags"
                        requiredProp="This field is required"
                        placeholder="Enter tags"
                        control={control}
                        errors={errors}
                    />

                    <div className="create-blogs-form-upload">
                        <DropzoneInput
                            label="Upload Image for the blogs"
                            setFile={setFile}
                        />
                        <div>
                            {file ? (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="image"
                                    width={100}
                                    height={100}
                                    className="upload-image"
                                />
                            ) : props.editModalBlog ? (
                                <Image
                                    src={`${appConfig.nextPublicApiBaseUrl}/uploads/${props.editModalBlog.banner}`}
                                    alt="image"
                                    width={100}
                                    height={100}
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
    )
}

export default EditBlogsModal;
