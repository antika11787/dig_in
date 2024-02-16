'use client';

import './index.scss';
import { useEffect, useState } from 'react';
import { GetAllUsersApi, DeleteUsersApi, GetUserByIdApi, UpdateUserApi } from '@/apiEndpoints/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateContentState, CreateUserForm, InputFieldProps, SelectOptionProps } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { UserResponse } from '@/types/interfaces';
import { AiFillDelete } from 'react-icons/ai';
import { RiFileEditFill } from 'react-icons/ri';
import { CgCloseR } from 'react-icons/cg';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalUser, setEditModalUser] = useState<UserResponse | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [userId, setUserId] = useState<string>("");

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            username: "",
            address: "",
            role: "",
        },
    });

    const openDeleteModal = (userId: string) => {
        setUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const openEditModal = (userId: string) => {
        GetUserByIdApi(userId).then((response) => {
            setValue("username", response.username || "");
            setValue("address", response.address || "");
            setValue("role", response.role || "");

            setEditModalUser(response);
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setValue("username", "");
        setValue("address", "");
        setValue("role", "");
    };
    const onSubmit = async (data: CreateUserForm) => {
        const formData = new FormData();
        const userFormData: CreateUserForm = {
            username: data.username,
            address: data.address,
            role: data.role
        };

        Object.entries(userFormData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await UpdateUserApi(
            editModalUser && editModalUser._id ? editModalUser._id : "",
            userFormData
        );
        dispatch(saveContentLength({ contentLength: -1 }));
        setIsEditModalOpen(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [contentLength]);

    const fetchUsers = async () => {
        const response = await GetAllUsersApi();
        setUsers(response);
        dispatch(saveContentLength({ contentLength: response.length || 0 }));
    };

    const deleteUser = async (userId: string) => {
        await DeleteUsersApi(userId);
        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
        dispatch(saveContentLength({ contentLength: updatedUsers.length || 0 }));
    };

    return (
        <div className='manage-users-container'>
            <div className='manage-users-header'>
                <h3 className="manage-users-title">Manage Users</h3>
            </div>
            <div className='manage-users-body custom-scrollbar'>
                {users ? (
                    users.map((user) => (
                        <div key={user._id} className="manage-users-card">
                            <div className='manage-users-card-container'>
                                <img src='/profile.png' alt='profile' className="manage-users-card-image" />
                                <div className='manage-users-card-details'>
                                    <div className="manage-users-card-title">
                                        {user.username} <span className="manage-users-card-role">({user.role})</span>
                                    </div>
                                    <div className="manage-users-card-email">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <div className='manage-users-card-buttons'>
                                <Modal
                                    isOpen={isEditModalOpen}
                                    onRequestClose={closeEditModal}
                                    ariaHideApp={false}
                                    contentLabel="Example Modal"
                                    style={{
                                        overlay: {
                                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                                        },
                                        content: {
                                            width: "40%",
                                            height: "60%",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            overflow: "auto",
                                        },
                                    }}
                                >
                                    <div className="create-user-form-container">
                                        <h2 className='create-user-form-heading'>Edit User</h2>
                                        <form onSubmit={handleSubmit(onSubmit)} className='create-user-form'>
                                            <div className="create-user-form-item">
                                                <label className="create-user-form-label">Username: </label>
                                                <Controller
                                                    name="username"
                                                    control={control}
                                                    rules={{
                                                        required: "Username is required",
                                                    }}
                                                    render={({ field }: { field: InputFieldProps }) => (
                                                        <input
                                                            placeholder="Enter username"
                                                            {...field}
                                                            className="create-user-form-input"
                                                        />
                                                    )}
                                                />
                                                {errors.username && <h5>{errors.username.message}</h5>}
                                            </div>

                                            <div className="create-user-form-item">
                                                <label className="create-user-form-label">Address: </label>
                                                <Controller
                                                    name="address"
                                                    control={control}
                                                    rules={{
                                                        required: "Address is required",
                                                    }}
                                                    render={({ field }: { field: InputFieldProps }) => (
                                                        <input
                                                            placeholder="Enter address"
                                                            {...field}
                                                            className="create-user-form-input"
                                                        />
                                                    )}
                                                />
                                                {errors.address && <h5>{errors.address.message}</h5>}
                                            </div>

                                            <div className="create-user-form-item">
                                                <label className="create-user-form-label">Role: </label>
                                                <Controller
                                                    name="role"
                                                    control={control}
                                                    rules={{
                                                        required: "Role is required",
                                                    }}
                                                    render={({ field }: { field: SelectOptionProps }) => (
                                                        <select {...field} className="create-user-form-input-select">
                                                            <option value="">Select a role</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="customer">Customer</option>
                                                            <option value="author">Author</option>
                                                        </select>
                                                    )}
                                                />
                                                {errors.role && <h5>{errors.role.message}</h5>}
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
                                        openEditModal(user._id);
                                    }}
                                />
                                <Modal
                                    isOpen={isDeleteModalOpen}
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
                                                    deleteUser(userId);
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
                                        openDeleteModal(user._id);
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No users found</div>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;
