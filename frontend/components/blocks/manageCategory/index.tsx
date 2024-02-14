"use client";

import "./index.scss";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import { CgCloseR } from "react-icons/cg";
import { useForm, Controller } from "react-hook-form";
import { CreateCategoryForm } from "@/types/interfaces";
import {
  CreateCategoryApi,
  GetCategoriesApi,
  GetCategoryByIdApi,
  DeleteCategoryApi,
  UpdateCategoryApi,
} from "@/apiEndpoints/category";
import { CategoryResponse } from "@/types/interfaces";
import { useState, useEffect, useCallback } from "react";
import { RiFileEditFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { updateContentState } from "@/types/interfaces";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import { InputFieldProps } from "@/types/interfaces";

const ManageCategory = () => {
  const dispatch = useDispatch();
  const contentLength = useSelector(
    (state: updateContentState) => state.content.contentLength
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editModalCategory, setEditModalCategory] =
    useState<CategoryResponse | null>(null);
  const [file, setFile] = useState<any>(null);
  const [isFileSet, setIsFileSet] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryID, setCategoryID] = useState<string>("");
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      categoryName: "",
      file: null,
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setFile(null);
  };

  const openDeleteModal = (categoryID: string) => {
    setCategoryID(categoryID);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (categoryId: string, banner: string) => {
    GetCategoryByIdApi(categoryId).then((response) => {
      setValue("categoryName", response?.categoryName || "");
      setValue("file", response?.file || "");
      setEditModalCategory(response);
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    reset();
    setFile(null)
  };

  const onSubmit = async (data: CreateCategoryForm) => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName || "");
    formData.append("file", file);

    await CreateCategoryApi(formData);
    const response = await GetCategoriesApi();
    setCategories(response);

    dispatch(saveContentLength({ contentLength: response.length || 0 }));

    // setValue("categoryName", "");
    // setFile([]);
    // console.log("form after", file[0]);
    reset();
    setFile(null);

    setIsModalOpen(false);
  };

  const onEditSubmit = async (data: CreateCategoryForm) => {
    const formData = new FormData();

    formData.append("categoryName", data.categoryName || "");
    if (file) {
      formData.append("file", file);
    }

    await UpdateCategoryApi(
      editModalCategory && editModalCategory._id ? editModalCategory._id : "",
      formData
    );
    const updatedCateogries = await GetCategoriesApi();
    setCategories(updatedCateogries);
    dispatch(saveContentLength({ contentLength: updatedCateogries.length || 0 }));

    reset();
    setFile(null);
    setIsEditModalOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    fetchCategories();
  }, [contentLength]);

  const fetchCategories = async () => {
    const response = await GetCategoriesApi();
    setCategories(response);
    dispatch(saveContentLength({ contentLength: response.length || 0 }));
  };

  const deleteCategory = async (categoryId: string) => {
    await DeleteCategoryApi(categoryId);
    const updatedCategories = categories.filter(
      (category) => category._id !== categoryId
    );
    setCategories(updatedCategories);
    dispatch(
      saveContentLength({ contentLength: updatedCategories.length || 0 })
    );
  };

  return (
    <div className="manage-category-container">
      <div className="manage-category-header">
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
              width: "50%",
              height: "55%",
              margin: "auto",
              borderRadius: "10px",
              overflow: "auto",
            },
          }}
        >
          <div className="create-category-form-container">
            <h3>Create Category</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="create-category-form-item">
                <label className="create-category-form-label">
                  Category Name:{" "}
                </label>
                <Controller
                  name="categoryName"
                  control={control}
                  rules={{
                    required: "Category name is required",
                  }}
                  render={({ field }: { field: InputFieldProps }) => (
                    <input
                      placeholder="Enter category name"
                      {...field}
                      className="create-category-form-input"
                    />
                  )}
                />
                {errors.categoryName && <h5>{errors.categoryName.message}</h5>}
              </div>

              <div className="create-category-form-upload">
                <div className="upload">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <img src="/upload.png" className="upload-icon" />
                    )}
                  </div>
                  <label>Upload Image for the Category</label>
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
        <h3 className="manage-category-title">Manage Category</h3>
        <button className="create-category-button" onClick={openModal}>
          Create Category
        </button>
      </div>
      <div className="manage-category-body custom-scrollbar">
        {categories &&
          categories.map((category) => (
            <div key={category._id} className="manage-category-card">
              <div className="manage-category-image-title">
                <img
                  src={`http://localhost:3000/uploads/${category.file}`}
                  className="manage-category-image"
                />
                <p className="manage-category-name">{category.categoryName}</p>
              </div>

              <div className="manage-category-button">
                <RiFileEditFill
                  className="edit-button"
                  onClick={() => {
                    openEditModal(category._id, category.file);
                  }}
                />
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
                  <div className="create-category-form-container">
                    <h3>Edit Category</h3>
                    <form onSubmit={handleSubmit(onEditSubmit)}>
                      <div className="create-category-form-item">
                        <label className="create-category-form-label">
                          Category Name:{" "}
                        </label>
                        <Controller
                          name="categoryName"
                          control={control}
                          rules={{
                            required: "Category name is required",
                          }}
                          render={({ field }: { field: InputFieldProps }) => (
                            <input
                              placeholder="Enter category name"
                              {...field}
                              className="create-category-form-input"
                            />
                          )}
                        />
                        {errors.categoryName && (
                          <h5>{errors.categoryName.message}</h5>
                        )}
                      </div>

                      <div className="create-category-form-upload">
                        <div className="upload">
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p>Drop the files here ...</p>
                            ) : (
                              <img src="/upload.png" className="upload-icon" />
                            )}
                          </div>
                          <label>Upload a Banner Image for the Category</label>
                        </div>
                        <div>
                          {file && editModalCategory ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="image"
                              className="upload-image"
                            />
                            
                          ) : editModalCategory ? (
                            <img
                              src={`http://localhost:3000/uploads/${editModalCategory.file}`}
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
                    <h2>Delete Category</h2>
                    <p>
                      Are you sure you want to delete this category? All the
                      Items under this cateory will be deleted too.
                    </p>
                    <div className="delete-modal-button">
                      <button
                        className="yes-button"
                        onClick={() => {
                          deleteCategory(categoryID);
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
                    openDeleteModal(category._id);
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManageCategory;
