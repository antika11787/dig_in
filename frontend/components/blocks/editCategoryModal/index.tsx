import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import FormInput from "@/components/elements/formInput";
import DropzoneInput from "@/components/elements/dropzoneInput";
import { useForm } from "react-hook-form";
import { CategoryResponse } from "@/types/interfaces";
import { UpdateCategoryApi } from "@/apiEndpoints/category";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { useDispatch } from "react-redux";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import { CreateCategoryForm } from "@/types/interfaces";

interface EditCategory {
  isEditModalOpen: boolean;
  editModalCategory: CategoryResponse | null;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryResponse[]>>;
}

const EditCategoryModal = (props: EditCategory) => {
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
      categoryName: props.editModalCategory?.categoryName,
      file: props.editModalCategory?.file,
    },
  });

  useEffect(() => {
    reset({
      categoryName: props.editModalCategory?.categoryName,
      file: props.editModalCategory?.file,
    });
  }, [props.editModalCategory]);

  const onEditSubmit = async (data: CreateCategoryForm) => {
    const formData = new FormData();

    formData.append("categoryName", data.categoryName || "");
    if (file) {
      formData.append("file", file);
    }

    await UpdateCategoryApi(
      props.editModalCategory && props.editModalCategory._id
        ? props.editModalCategory._id
        : "",
      formData
    );
    const updatedCateogries = await GetCategoriesApi();
    props.setCategories(updatedCateogries);
    dispatch(
      saveContentLength({ contentLength: updatedCateogries.length || 0 })
    );

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
      <div className="create-category-form-container">
        <h2 className="create-category-form-heading">Edit Category</h2>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="create-category-form"
        >
          <FormInput
            label="Category Name"
            nameProp="categoryName"
            requiredProp="This field is required"
            placeholder="Enter category name"
            control={control}
            errors={errors}
          />

          <div className="create-category-form-upload">
            <DropzoneInput
              label="Upload Image for the Category"
              setFile={setFile}
            />
            <div>
              {file && props.editModalCategory ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="image"
                  className="upload-image"
                />
              ) : props.editModalCategory ? (
                <img
                  src={`http://localhost:3000/uploads/${props.editModalCategory.file}`}
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
  );
};

export default EditCategoryModal;
