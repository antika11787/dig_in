import { useState, useEffect } from "react";
import {
    GetAllItemsApi,
    RemoveImageFromItemApi,
    UpdateItemApi,
    UploadImageToItemApi
} from "@/apiEndpoints/item";
import {
    CategoryResponse,
    CreateItemForm,
    ItemResponse,
} from "@/types/interfaces";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import DropzoneMultipleImage from "@/components/elements/dropzoneMultipleImage";
import FormInput from "@/components/elements/formInput";
import FormSelect from "@/components/elements/formSelect";
import appConfig from "@/config/constants";
import { AiFillDelete } from "react-icons/ai";
import Image from "next/image";

interface EditItem {
    isEditModalOpen: boolean;
    editModalItem: ItemResponse | null;
    imageIndex: number;
    searchQuery: string;
    itemID: string;
    categories: CategoryResponse[];
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditModalItem: React.Dispatch<React.SetStateAction<ItemResponse | null>>;
    setImageIndex: React.Dispatch<React.SetStateAction<number>>;
    setItems: React.Dispatch<React.SetStateAction<ItemResponse[]>>;
}

const EditItemModal = (props: EditItem) => {
    const [file, setFile] = useState<File[]>([]);
    const dispatch = useDispatch();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: props.editModalItem?.title,
            description: props.editModalItem?.description,
            price: props.editModalItem?.price,
            categoryID: props.editModalItem?.categoryID,
            banner: props.editModalItem?.banner,
            files: props.editModalItem?.files,
        },
    });

    const onEditSubmit = async (data: CreateItemForm) => {
        const formData = new FormData();
        const itemFormData: CreateItemForm = {
            title: data.title,
            description: data.description,
            price: data.price,
            categoryID: data.categoryID,
            files: null,
            banner: null
        };

        Object.entries(itemFormData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (file.length > 0) {
            file.forEach((image) => {
                formData.append("files", image);
            });
        }

        // Set the banner based on the selected image index
        formData.append("banner", file.length > 0 ? props.imageIndex.toString() : "");

        try {
            await UpdateItemApi(props.itemID, formData);

            // Fetch updated items
            const updatedItems = await GetAllItemsApi(props.searchQuery);
            props.setItems(updatedItems);
            dispatch(saveContentLength({ contentLength: updatedItems?.length || 0 }));

            reset();
            props.setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const closeEditModal = () => {
        props.setIsEditModalOpen(false);
        reset();
        setFile([]);
    };

    const handleImageUpload = async () => {
        try {
            if (file.length > 0) {
                const response = await UploadImageToItemApi(props.itemID, file);
            } else {
                console.error("No file selected for upload.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        // if (props.isEditModalOpen) {
        //     handleImageUpload().then(() => {
        reset({
            title: props.editModalItem?.title,
            description: props.editModalItem?.description,
            price: props.editModalItem?.price,
            categoryID: props.editModalItem?.categoryID,
            banner: props.editModalItem?.banner,
        });
        //     });
        // }
    }, [props.editModalItem, file, reset]);


    const handleDeleteImage = async (index: number) => {
        const fileId = (props.editModalItem?.files && props.editModalItem?.files[index]) || "";
        const itemId = props.editModalItem?._id ?? "";

        try {
            await RemoveImageFromItemApi(itemId, fileId);

            if (
                props.editModalItem &&
                props.editModalItem.files &&
                props.editModalItem.files.length > 1
            ) {
                const updatedFiles = [...props.editModalItem.files];
                updatedFiles.splice(index, 1);
                props.setEditModalItem({ ...props.editModalItem, files: updatedFiles });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <Modal
            isOpen={props.isEditModalOpen}
            onRequestClose={closeEditModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
            <div className="create-item-form-container">
                <h2 className="create-item-form-heading">Edit Item</h2>
                <form
                    onSubmit={handleSubmit(onEditSubmit)}
                    className="create-item"
                >
                    <FormInput
                        label="Item Name"
                        nameProp="title"
                        requiredProp="This field is required"
                        placeholder="Enter item name"
                        control={control}
                        errors={errors}
                    />

                    <FormInput
                        label="Description"
                        nameProp="description"
                        requiredProp="This field is required"
                        placeholder="Enter item description"
                        control={control}
                        errors={errors}
                    />
                    <FormInput
                        label="Price"
                        nameProp="price"
                        requiredProp="This field is required"
                        placeholder="Enter item price"
                        control={control}
                        errors={errors}
                    />
                    <FormSelect
                        label="Category"
                        nameProp="categoryID"
                        requiredProp="This field is required"
                        options={props?.categories.map(category => ({ label: category.categoryName, value: category._id })) || []}
                        control={control}
                        errors={errors}
                    />

                    <div className="create-item-form-upload">
                        <DropzoneMultipleImage
                            label="Select images and click on an image to make it the banner."
                            setFile={setFile}
                        />
                        <div className="upload-image-container">
                            {props.editModalItem &&
                                props.editModalItem.files &&
                                props.editModalItem.files.map((file, index) => (
                                    <div key={index} className="image-container">
                                        <Image
                                            src={`${appConfig.nextPublicApiBaseUrl}/uploads/${file}`}
                                            alt="image"
                                            width={100}
                                            height={100}
                                            className={`upload-image ${props.imageIndex === index ? "active" : ""
                                                }`}
                                            onClick={() => {
                                                props.setImageIndex(index);
                                            }}
                                        />
                                        <div
                                            className="delete-icon"
                                            onClick={() => {
                                                handleDeleteImage(index);
                                            }}
                                        >
                                            <AiFillDelete />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div>
                        <button className="submit-button">Submit</button>
                    </div>
                </form>
            </div>
            <CgCloseR
                className="close-button"
                onClick={closeEditModal}
            />
        </Modal>
    )
}

export default EditItemModal;
