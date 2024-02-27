import { useEffect, useState } from 'react';
import { GetAllUsersApi, DeleteUsersApi, GetUserByIdApi, UpdateUserApi, VerifyAuthorApi } from '@/apiEndpoints/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateContentState, CreateUserForm, InputFieldProps, SelectOptionProps } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { UserResponse } from '@/types/interfaces';
import { AiFillDelete } from 'react-icons/ai';
import { RiFileEditFill } from 'react-icons/ri';
import { CgCloseR } from 'react-icons/cg';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import Modal from 'react-modal';
import Search from '@/components/elements/search';
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdDomainVerification } from "react-icons/md";
import EditUserModal from '../editUserModal';

type DeleteUser = {
    isDeleteModalOpen: boolean;
    users: UserResponse[];
    userID: string;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setUsers: React.Dispatch<React.SetStateAction<UserResponse[]>>;
}

const DeleteUserModal = (props: DeleteUser) => {
    const dispatch = useDispatch();
    const closeDeleteModal = () => {
        props.setIsDeleteModalOpen(false);
    };

    const deleteUser = async (userId: string) => {
        await DeleteUsersApi(userId);
        const updatedUsers = props.users.filter(user => user._id !== userId);
        props.setUsers(updatedUsers);
        dispatch(saveContentLength({ contentLength: updatedUsers.length || 0 }));
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
                <h2 className="delete-modal-title">Delete User</h2>
                <p className="delete-modal-description">
                    Are you sure you want to delete this user?
                </p>
                <div className="delete-modal-button">
                    <button
                        className="yes-button"
                        onClick={() => {
                            deleteUser(props.userID);
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
    )
}

export default DeleteUserModal;
