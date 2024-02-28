import React from "react";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import { CategoryResponse } from "@/types/interfaces";
import { DeleteCategoryApi } from "@/apiEndpoints/category";
import { useDispatch } from "react-redux";
import { saveContentLength } from "@/redux/slices/ContentSlice";

type DeleteCategory = {
  categoryID: string;
  categories: CategoryResponse[];
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryResponse[]>>;
};

const DeleteCategoryModal = (props: DeleteCategory) => {
  const dispatch = useDispatch();
  const closeDeleteModal = () => {
    props.setIsDeleteModalOpen(false);
  };

  const deleteCategory = async (categoryId: string) => {
    await DeleteCategoryApi(categoryId);
    const updatedCategories = props.categories.filter(
      (category) => category._id !== categoryId
    );
    props.setCategories(updatedCategories);
    dispatch(
      saveContentLength({ contentLength: updatedCategories.length || 0 })
    );
  };


  return (
    <Modal
      isOpen={props.isDeleteModalOpen}
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
        <h2 className="delete-modal-heading">Delete Category</h2>
        <p className="delete-modal-description">
          Are you sure you want to delete this category? All the Items under
          this cateory will be deleted too.
        </p>
        <div className="delete-modal-button">
          <button
            className="yes-button"
            onClick={() => {
              deleteCategory(props.categoryID);
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
      <CgCloseR className="close-button" onClick={closeDeleteModal} />
    </Modal>
  );
};

export default DeleteCategoryModal;
