"use client";

import "./index.scss";
import {
  GetCategoriesApi,
  GetCategoryByIdApi,
  DeleteCategoryApi,
} from "@/apiEndpoints/category";
import { CategoryResponse } from "@/types/interfaces";
import { useState, useEffect } from "react";
import { RiFileEditFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { updateContentState } from "@/types/interfaces";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import CreateCategoryModal from "../modals/createCategoryModal";
import EditCategoryModal from "../modals/editCategoryModal";
import DeleteCategoryModal from "../modals/deleteCategoryModal";
import appConfig from "@/config/constants";
import Image from "next/image";
import CmsSkeleton from "@/components/elements/cmsSkeleton";

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
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryID, setCategoryID] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openDeleteModal = (categoryID: string) => {
    setCategoryID(categoryID);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (categoryId: string, banner: string) => {
    GetCategoryByIdApi(categoryId).then((response) => {
      setEditModalCategory(response);
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    GetCategoriesApi().then((response) => {
      setCategories(response);
      dispatch(saveContentLength({ contentLength: response?.length || 0 }));
      setLoading(false);
    })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setLoading(false);
      });
  }, [contentLength, dispatch]);

  return (
    <div className="manage-category-container">
      <div className="manage-category-header">
        <CreateCategoryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setCategories={setCategories}
        />
        <h3 className="manage-category-title">Manage Category</h3>
        <button className="create-category-button" onClick={openModal}>
          Create Category
        </button>
      </div>
      <div className="manage-category-body custom-scrollbar">
        <div className="manage-category-card-table-header">
          <p className="manage-category-card-table-name">Name</p>
          <p className="manage-category-card-table-action">Action</p>
        </div>
        {loading ? (
          [...Array(6)].map((_, index) => (
            <CmsSkeleton key={index} />
          ))
        ) :
          categories ? (
            categories.map((category) => (
              <div key={category._id} className="manage-category-card">
                <div className="manage-category-card-table">
                  <div className="manage-category-image-title">
                    <Image
                      alt="category"
                      width={100}
                      height={100}
                      src={`${appConfig.nextPublicApiBaseUrl}/uploads/${category.file}`}
                      className="manage-category-image"
                    />
                    <div className="manage-category-details">
                      <p className="manage-category-name">
                        {category.categoryName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="manage-category-button">
                  <RiFileEditFill
                    className="edit-button"
                    onClick={() => {
                      openEditModal(category._id, category.file);
                    }}
                  />

                  <EditCategoryModal
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                    editModalCategory={editModalCategory}
                    setCategories={setCategories}
                  />

                  <DeleteCategoryModal
                    categoryID={categoryID}
                    isDeleteModalOpen={isDeleteModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    setCategories={setCategories}
                    categories={categories}
                  />

                  <AiFillDelete
                    className="delete-button"
                    onClick={() => {
                      openDeleteModal(category._id);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div>No categories found</div>
          )}
      </div>
    </div>
  );
};

export default ManageCategory;
