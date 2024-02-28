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
import appConfig from '@/config/constants';
import Image from 'next/image';
import DropzoneInput from '@/components/elements/dropzoneInput';
import FormInput from '@/components/elements/formInput';

type CreateBlogs = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBlogs: React.Dispatch<React.SetStateAction<BlogResponse[]>>;
}

const CreateBlogsModal = (props: CreateBlogs) => {
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
            title: "",
            content: "",
            banner: null,
            tags: "",
        },
    });

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("tags", data.tags);
        formData.append("banner", file);

        await CreateBlogApi(formData);

        const response = await GetBlogsApi();
        props.setBlogs(response);

        dispatch(saveContentLength({ contentLength: response.length || 0 }));
        reset();
        setFile(null);
        props.setIsModalOpen(false);
    };

    const closeModal = () => {
        props.setIsModalOpen(false);
        reset()
        setFile(null);
    };

    return (
        <Modal
            isOpen={props.isModalOpen}
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
                            label="Upload a Banner Image for the Blog"
                            setFile={setFile}
                        />
                        <div>
                            {file ? (
                                <Image src={URL.createObjectURL(file)}
                                    alt="image"
                                    width={100}
                                    height={100}
                                    className="upload-image" />
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
    )
}

export default CreateBlogsModal;
