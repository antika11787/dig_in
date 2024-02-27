import React from "react";
import Modal from "react-modal";
import { CgCloseR } from "react-icons/cg";
import { ItemResponse } from "@/types/interfaces";
import { DeleteItemApi } from "@/apiEndpoints/item";
import { useDispatch } from "react-redux";
import { saveContentLength } from "@/redux/slices/ContentSlice";

type DeleteItem = {
    isDeleteModalOpen: boolean;
    items: ItemResponse[];
    itemID: string;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setItems: React.Dispatch<React.SetStateAction<ItemResponse[]>>;
};

const DeleteItemModal = (props: DeleteItem) => {

    const dispatch = useDispatch();
    const closeDeleteModal = () => {
        props.setIsDeleteModalOpen(false);
    };

    const deleteItem = async (itemID: string) => {
        await DeleteItemApi(itemID);
        const updatedItems = props.items.filter((item) => item._id !== itemID);
        props.setItems(updatedItems);
        dispatch(saveContentLength({ contentLength: updatedItems.length || 0 }));
    };

    return (
        <Modal
            isOpen={props.isDeleteModalOpen}
            onRequestClose={closeDeleteModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
                <h2 className="delete-modal-heading">Delete Item</h2>
                <p className="delete-modal-description">Are you sure you want to delete this item?</p>
                <div className="delete-modal-button">
                    <button
                        className="yes-button"
                        onClick={() => {
                            deleteItem(props.itemID);
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
    );
};

export default DeleteItemModal;
