import React, { useState } from "react";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import FormInput from "@/components/elements/formInput";
import DropzoneInput from "@/components/elements/dropzoneInput";
import { useForm } from "react-hook-form";
import { CreateCategoryForm } from "@/types/interfaces";
import { CreateCategoryApi } from "@/apiEndpoints/category";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { useDispatch } from "react-redux";
import { saveContentLength } from "@/redux/slices/ContentSlice";
import { CategoryResponse } from "@/types/interfaces";

interface CreateCategory {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryResponse[]>>;
}

const CreateCategoryModal = (props: CreateCategory) => {
  const [file, setFile] = useState<any>(null);
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
      categoryName: "",
      file: null,
    },
  });

  const onSubmit = async (data: CreateCategoryForm) => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName || "");
    formData.append("file", file);

    await CreateCategoryApi(formData);
    const response = await GetCategoriesApi();
    props.setCategories(response);
    dispatch(saveContentLength({ contentLength: response.length || 0 }));
    reset();
    setFile(null);

    props.setIsModalOpen(false);
  };

  const closeModal = () => {
    props.setIsModalOpen(false);
    reset();
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
      <div className="create-category-form-container">
        <h2 className="create-category-form-heading">Create Category</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
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
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
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
      <CgCloseR className="close-button" onClick={closeModal} />
    </Modal>
  );
};

export default CreateCategoryModal;
