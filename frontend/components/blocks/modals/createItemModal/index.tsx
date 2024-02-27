import { useState } from "react";
import {
    CreateItemsApi,
    GetAllItemsApi,
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
import Image from "next/image";

interface CreateItem {
    isModalOpen: boolean;
    imageIndex: number;
    searchQuery: string;
    categories: CategoryResponse[];
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setImageIndex: React.Dispatch<React.SetStateAction<number>>;
    setItems: React.Dispatch<React.SetStateAction<ItemResponse[]>>;
}

const CreateItemModal = (props: CreateItem) => {
    const [file, setFile] = useState<File[]>([]);
    const dispatch = useDispatch();

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
            description: "",
            price: "",
            categoryID: "",
            files: [] as unknown as File[],
            banner: "" as unknown as number,
        },
    });

    const onSubmit = async (data: CreateItemForm) => {
        const formData = new FormData();
        formData.append("title", data.title || "");
        formData.append("description", data.description || "");
        formData.append("price", data.price.toString() || "");
        formData.append("categoryID", data.categoryID || "");
        formData.append("banner", props.imageIndex.toString() || "0");
        file.forEach((file, index) => {
            formData.append("files", file);
        });

        await CreateItemsApi(formData);
        const response = await GetAllItemsApi(props.searchQuery);
        props.setItems(response?.items);

        dispatch(
            saveContentLength({ contentLength: response?.items?.length || 0 })
        );

        setValue("title", "");
        setValue("description", "");
        setValue("price", "");
        setValue("categoryID", "");

        setFile([]);

        props.setIsModalOpen(false);
    };

    const closeModal = () => {
        props.setIsModalOpen(false);
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
            <div className="create-item-form-container">
                <h2 className="create-item-form-heading">Create Item</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
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
                            {props.isModalOpen && file.length > 0 ? (
                                file.map((f: any, index) => {
                                    return (
                                        <div className="image-container" key={index}>
                                            <Image
                                                src={URL.createObjectURL(f)}
                                                alt="image"
                                                width={100}
                                                height={100}
                                                className={`upload-image ${props.imageIndex === index ? "active" : ""
                                                    }`}
                                                onClick={() => {
                                                    props.setImageIndex(file.indexOf(f));
                                                }}
                                            />
                                        </div>
                                    );
                                })
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

export default CreateItemModal;
