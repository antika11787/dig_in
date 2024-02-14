"use client";

import Search from "@/components/elements/search";
import { useState, useEffect, useCallback } from "react";
import {
  CreateItemsApi,
  GetAllItemsApi,
  GetItemByIdApi,
  RemoveImageFromItemApi,
  UploadImageToItemApi
} from "@/apiEndpoints/item";
import {
  CategoryResponse,
  CreateItemForm,
  InputFieldProps,
  ItemResponse,
  SelectOptionProps,
} from "@/types/interfaces";
import { RiFileEditFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { updateContentState } from "@/types/interfaces";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import { DeleteItemApi } from "@/apiEndpoints/item";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { useRouter } from "next/navigation";
import "./index.scss";

const ManageItems = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const contentLength = useSelector(
    (state: updateContentState) => state.content.contentLength
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (itemID: string) => {
    setItemID(itemID);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (itemID: string) => {
    setItemID(itemID);
    GetItemByIdApi(itemID).then((response) => {
      setValue("title", response?.title || "");
      setValue("description", response?.description || "");
      setValue("price", response?.price || "");
      setValue("categoryID", response?.categoryID || "");
      setValue("files", response?.files || []);
      setValue("banner", response?.banner || null);

      setEditModalItem(response);
    });

  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    reset();
    setFile([]);
  };

  const onSubmit = async (data: CreateItemForm) => {
    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString() || "");
    formData.append("categoryID", data.categoryID || "");
    formData.append("banner", imageIndex.toString() || "0");
    file.forEach((file, index) => {
      formData.append("files", file);
    });

    await CreateItemsApi(formData);
    const response = await GetAllItemsApi(searchQuery);
    setItems(response?.items);
    console.log("response after submit", response);

    dispatch(
      saveContentLength({ contentLength: response?.items?.length || 0 })
    );

    setValue("title", "");
    setValue("description", "");
    setValue("price", "");
    setValue("categoryID", "");

    setFile([]);
    console.log("form after", file[0]);

    setIsModalOpen(false);
  };

  const onEditSubmit = async (data: CreateItemForm) => {
    const formData = new FormData();

    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString() || "");
    formData.append("categoryID", data.categoryID || "");
    formData.append("banner", imageIndex.toString() || "0");

    GetItemByIdApi(itemID).then((response) => {
      const existingFiles = response?.files || [];
      setFile(existingFiles);
    });
    // if (file) {
    //   formData.append("file", file);
    // }

    // await UpdateItems(
    //   editModalCategory && editModalCategory._id ? editModalCategory._id : "",
    //   formData
    // );
    // const updatedCateogries = await GetCategoriesApi();
    // setCategories(updatedCateogries);
    // dispatch(saveContentLength({ contentLength: updatedCateogries.length || 0 }));

    reset();
    // setFile([]);
    setIsEditModalOpen(false);
  };

  const handleImageUpload = async () => {
    try {
      if (file.length > 0) {
        const response = await UploadImageToItemApi(itemID, file[0]);
        console.log("response", response);
        // Handle response if needed
      } else {
        console.error("No file selected for upload.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFile(acceptedFiles);
    setIsFileAvailable(true);

    // Call handleImageUpload when files are dropped
    await handleImageUpload();
  }, []);

  console.log("file", file.length);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteImage = async (index: number) => {
    const fileId = (editModalItem?.files && editModalItem?.files[index]) || '';
    const itemId = editModalItem?._id ?? '';

    try {
      await RemoveImageFromItemApi(itemId, fileId);

      if (editModalItem && editModalItem.files && editModalItem.files.length > 1) {
        const updatedFiles = [...editModalItem.files]; updatedFiles.splice(index, 1);
        setEditModalItem({ ...editModalItem, files: updatedFiles });
      }

    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  useEffect(() => {
    GetAllItemsApi(searchQuery)
      .then((response) => {
        setItems(response.items);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setItems([]);
      });
  }, [searchQuery]);

  useEffect(() => {
    GetCategoriesApi()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    fetchItems();
  }, [contentLength]);

  const fetchItems = async () => {
    const response = await GetAllItemsApi(searchQuery);
    setItems(response?.items);
    dispatch(
      saveContentLength({ contentLength: response?.items?.length || 0 })
    );
  };

  const deleteItem = async (itemID: string) => {
    await DeleteItemApi(itemID);
    const updatedItems = items.filter((item) => item._id !== itemID);
    setItems(updatedItems);
    dispatch(saveContentLength({ contentLength: updatedItems.length || 0 }));
  };

  console.log("index", imageIndex)

  return (
    <div className="manage-items-container">
      <div className="manage-items-header">
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
          <div className="create-item-form-container">
            <h3>Create Item</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="create-item-form">
              <div className="create-item-form">
                <label className="create-item-form-label">
                  Item Name:{" "}
                </label>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: "Item name is required",
                  }}
                  render={({ field }: { field: InputFieldProps }) => (
                    <input
                      placeholder="Enter item name"
                      {...field}
                      className="create-item-form-input"
                    />
                  )}
                />
                {errors.title && <h5>{errors.title.message}</h5>}
              </div>

              <div className="create-item-form">
                <label className="create-item-form-label">Description: </label>
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
                {errors.description && <h5>{errors.description.message}</h5>}
              </div>

              <div className="create-item-form">
                <label className="create-item-form-label">Item Price: </label>
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
                <label className="create-item-form-label">Category: </label>
                <Controller
                  name="categoryID"
                  control={control}
                  rules={{
                    required: "Item category is required",
                  }}
                  render={({ field }: { field: SelectOptionProps }) => (
                    <select {...field} className="create-item-form-input">
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.description && <h5>{errors.description.message}</h5>}
              </div>

              <div className="create-item-form-upload">
                <div className="upload">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <img src="/upload.png" className="upload-icon" />
                    )}
                  </div>
                  <label>Select images and click on an image to make it the banner.</label>
                </div>
                <div className="upload-image-container">
                  {file.length > 0
                    ? file.map((f: any, index) => {
                      return (
                        <img key={index}
                          src={URL.createObjectURL(f)}
                          alt="image"
                          className={`upload-image ${imageIndex === index ? "active" : ""}`}
                          onClick={() => {
                            setImageIndex(file.indexOf(f))
                            // set an active classname
                            console.log("file.indexOf(f)", file.indexOf(f))
                          }}
                        />
                      );
                    })
                    : <div></div>
                  }
                </div>
              </div>

              <div>
                <button className="submit-button">Submit</button>
              </div>
            </form>
          </div>
          <CgCloseR className="close-button" onClick={closeModal} />
        </Modal>
        <h3 className="manage-items-title">Manage Items</h3>
        <Search
          type="text"
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="create-items-button" onClick={openModal}>
          Create Item
        </button>
      </div>
      <div className="manage-items-body custom-scrollbar">
        {items &&
          items.length > 0 &&
          items.map((item) => {
            return (
              <div key={item._id} className="manage-items-card">
                <div className="manage-items-image-title">
                  <img
                    src={`http://localhost:3000/uploads/${item.banner}`}
                    className="manage-items-image"
                    onClick={() => {
                      router.push(`/items/${item._id}`);
                    }}
                  />
                  <div className="manage-items-details">
                    <p className="manage-items-name">{item.title}</p>
                    <p className="manage-items-category">
                      {item.categoryID?.categoryName}
                    </p>
                    <p className="manage-items-price">Price: ${item.price}</p>
                  </div>
                </div>
                <div className="manage-items-button">
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
                    <div className="create-item-form-container">
                      <h3>Edit Item</h3>
                      <form onSubmit={handleSubmit(onEditSubmit)}>
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
                          {errors.title && (
                            <h5>{errors.title.message}</h5>
                          )}
                        </div>

                        <div className="create-item-form">
                          <label className="create-item-form-label">Description: </label>
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
                          {errors.description && <h5>{errors.description.message}</h5>}
                        </div>

                        <div className="create-item-form">
                          <label className="create-item-form-label">Item Price: </label>
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
                          <label className="create-item-form-label">Category: </label>
                          <Controller
                            name="categoryID"
                            control={control}
                            rules={{
                              required: "Item category is required",
                            }}
                            render={({ field }: { field: SelectOptionProps }) => (
                              <select {...field} className="create-item-form-input">
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                          {errors.description && <h5>{errors.description.message}</h5>}
                        </div>

                        <div className="create-item-form-upload">
                          <div className="upload">
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <p>Drop the files here ...</p>
                              ) : (
                                <img src="/upload.png" className="upload-icon" />
                              )}
                            </div>
                            <label>Select images and click on an image to make it the banner.</label>
                          </div>

                          <div className="upload-image-container">
                            {/* Render existing images from the database */}
                            {editModalItem && editModalItem.files && editModalItem.files.map((file, index) => (
                              <div key={index} className="image-container">
                                <img
                                  src={`http://localhost:3000/uploads/${file}`}
                                  alt="image"
                                  className={`upload-image ${imageIndex === index ? "active" : ""}`}
                                  onClick={() => {
                                    setImageIndex(index);
                                  }}
                                />
                                <div className="delete-icon"
                                  onClick={() => {
                                    handleDeleteImage(index);
                                  }}
                                >
                                  <AiFillDelete />
                                </div>
                              </div>
                            ))}
                            {/* Render newly added images */}
                            {/* {file.length > 0 && file.map((f: any, index) => (
                              <div key={index + (editModalItem?.files?.length ?? 0)} className="image-container">
                                <img
                                  src={URL.createObjectURL(f)}
                                  alt="image"
                                  className={`upload-image ${imageIndex === (index + (editModalItem?.files?.length || 0)) ? "active" : ""}`}
                                  onClick={() => {
                                    setImageIndex(index + (editModalItem?.files?.length || 0));
                                  }}
                                />
                                <div className="delete-icon"
                                  onClick={() => {
                                    removeImage(file, index);
                                  }}
                                >
                                  <AiFillDelete />
                                </div>
                              </div>
                            ))} */}
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
                      setIsEditModalOpen(true);
                      item?._id && openEditModal(item._id);
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
                      <h2>Delete Item</h2>
                      <p>
                        Are you sure you want to delete this item?
                      </p>
                      <div className="delete-modal-button">
                        <button
                          className="yes-button"
                          onClick={() => {
                            deleteItem(itemID);
                            closeDeleteModal();
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="no-button"
                          onClick={closeDeleteModal}
                        >
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
                      openDeleteModal(item?._id ?? "");
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ManageItems;
