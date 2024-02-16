import { useState, useEffect, useCallback } from "react";
import {
    GetAllItemsApi,
    GetItemByIdApi,
    RemoveImageFromItemApi,
    UpdateItemApi,
    UploadImageToItemApi,
} from "@/apiEndpoints/item";
import {
    CategoryResponse,
    CreateItemForm,
    InputFieldProps,
    ItemResponse,
    SelectOptionProps,
} from "@/types/interfaces";
import { AiFillDelete } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { updateContentState } from "@/types/interfaces";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import { useRouter } from "next/navigation";
import "./index.scss";

const EditModal = ({ itemId, closeEditModal }: { itemId: string, closeEditModal: () => void }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalItem, setEditModalItem] = useState<ItemResponse | null>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [items, setItems] = useState<ItemResponse[]>([]);
    const [itemID, setItemID] = useState<string>("");
    const [file, setFile] = useState<File[]>([]);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [isFileAvailable, setIsFileAvailable] = useState<boolean>(false);

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



    const onEditSubmit = async (data: CreateItemForm) => {
        const formData = new FormData();

        formData.append("title", data.title || "");
        formData.append("description", data.description || "");
        formData.append("price", data.price.toString() || "");
        formData.append("categoryID", data.categoryID || "");
        formData.append("banner", imageIndex.toString() || "0");

        await UpdateItemApi(
            itemID,
            formData
        );
        const updatedItems = await GetAllItemsApi(searchQuery);
        setItems(updatedItems);
        dispatch(saveContentLength({ contentLength: updatedItems?.length || 0 }));

        console.log("cat", categories)

        reset();
        // setFile([]);
        setIsEditModalOpen(false);
    };

    const handleImageUpload = async () => {
        try {
            console.log("id out", itemID);
            if (file.length > 0) {
                console.log("id in", itemID);
                console.log("file in", file);
                const response = await UploadImageToItemApi(itemID, file);
                console.log("resp", response);
                // Handle response if needed
            } else {
                console.log("id err", itemID);

                console.error("No file selected for upload.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        if (isEditModalOpen) {
            handleImageUpload().then(() => {
                GetItemByIdApi(itemID).then((response) => {
                    console.log("res-re", response);
                    setEditModalItem(response);
                });
            });
        }
    }, [file]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setFile(acceptedFiles);
        setIsFileAvailable(true);

    }, []);

    console.log("file", file.length);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleDeleteImage = async (index: number) => {
        const fileId = (editModalItem?.files && editModalItem?.files[index]) || "";
        const itemId = editModalItem?._id ?? "";

        try {
            await RemoveImageFromItemApi(itemId, fileId);

            if (
                editModalItem &&
                editModalItem.files &&
                editModalItem.files.length > 1
            ) {
                const updatedFiles = [...editModalItem.files];
                updatedFiles.splice(index, 1);
                setEditModalItem({ ...editModalItem, files: updatedFiles });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <Modal
            isOpen={isEditModalOpen}
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
                    <div className="create-item-form">
                        <label className="create-item-form-label">
                            Item Name:{" "}
                        </label>
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
                                    className="create-item-form-input"
                                />
                            )}
                        />
                        {errors.title && <h5>{errors.title.message}</h5>}
                    </div>

                    <div className="create-item-form">
                        <label className="create-item-form-label">
                            Description:{" "}
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: "Item description is required",
                            }}
                            render={({ field }: { field: InputFieldProps }) => (
                                <input
                                    placeholder="Enter item description"
                                    {...field}
                                    className="create-item-form-input"
                                />
                            )}
                        />
                        {errors.description && (
                            <h5>{errors.description.message}</h5>
                        )}
                    </div>

                    <div className="create-item-form">
                        <label className="create-item-form-label">
                            Item Price:{" "}
                        </label>
                        <Controller
                            name="price"
                            control={control}
                            rules={{
                                required: "Item price is required",
                            }}
                            render={({ field }: { field: InputFieldProps }) => (
                                <input
                                    placeholder="Enter item price"
                                    {...field}
                                    className="create-item-form-input"
                                />
                            )}
                        />
                        {errors.price && <h5>{errors.price.message}</h5>}
                    </div>

                    <div className="create-item-form">
                        <label className="create-item-form-label">
                            Category:{" "}
                        </label>
                        <Controller
                            name="categoryID"
                            control={control}
                            rules={{
                                required: "Item category is required",
                            }}
                            render={({
                                field,
                            }: {
                                field: SelectOptionProps;
                            }) => (
                                <select
                                    {...field}
                                    className="create-item-form-input"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.description && (
                            <h5>{errors.description.message}</h5>
                        )}
                    </div>

                    <div className="create-item-form-upload">
                        <div className="upload">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the files here ...</p>
                                ) : (
                                    <img
                                        src="/upload.png"
                                        className="upload-icon"
                                    />
                                )}
                            </div>
                            <label>
                                Select images and click on an image to make it the
                                banner.
                            </label>
                        </div>

                        <div className="upload-image-container">
                            {/* Render existing images from the database */}
                            {editModalItem &&
                                editModalItem.files &&
                                editModalItem.files.map((file, index) => (
                                    <div key={index} className="image-container">
                                        <img
                                            src={`http://localhost:3000/uploads/${file}`}
                                            alt="image"
                                            className={`upload-image ${imageIndex === index ? "active" : ""
                                                }`}
                                            onClick={() => {
                                                setImageIndex(index);
                                                console.log("imageIndex", index)
                                                // set an active classname
                                                // console.log("file.indexOf(f)", file.indexOf(f));
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

export default EditModal;
