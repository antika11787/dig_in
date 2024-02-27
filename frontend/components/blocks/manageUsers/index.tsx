'use client';

import './index.scss';
import { useEffect, useState } from 'react';
import { GetAllUsersApi, GetUserByIdApi, VerifyAuthorApi } from '@/apiEndpoints/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateContentState } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { UserResponse } from '@/types/interfaces';
import { AiFillDelete } from 'react-icons/ai';
import { RiFileEditFill } from 'react-icons/ri';
import Image from 'next/image';
import Search from '@/components/elements/search';
import { VscVerifiedFilled } from "react-icons/vsc";
import EditUserModal from '../modals/editUserModal';
import DeleteUserModal from '../modals/deleteUserModal';
import CmsSkeleton from '@/components/elements/cmsSkeleton';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalUser, setEditModalUser] = useState<UserResponse | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const openDeleteModal = (userId: string) => {
        setUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (userId: string) => {
        GetUserByIdApi(userId).then((response) => {
            setEditModalUser(response);
        });
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        GetAllUsersApi(searchQuery || "").then((response) => {
            setUsers(response?.users);
            dispatch(saveContentLength({ contentLength: response?.users?.length || 0 }));
            setLoading(false);
        })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setUsers([]);
                setLoading(false);
            });
    }, [contentLength, searchQuery, dispatch]);

    return (
        <div className='manage-users-container'>
            <div className='manage-users-header'>
                <h3 className="manage-users-title">Manage Users</h3>
                <Search
                    type="text"
                    placeholder="Search Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className='manage-users-body custom-scrollbar'>
                <div className="manage-users-card-table-header">
                    <p className="manage-users-card-table-title">Name</p>
                    <p className="manage-users-card-table-email">Email</p>
                    <p className="manage-users-card-table-role">Role</p>
                    <p className="manage-users-card-table-action">Action</p>
                </div>
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <CmsSkeleton key={index} />
                    ))
                ) :
                    users ? (
                        users.map((user) => (
                            <div key={user._id} className="manage-users-card">
                                <div className='manage-users-card-name-image'>
                                    {user.role === "admin" ? (
                                        <div className='manage-users-card-image-container'>
                                            <VscVerifiedFilled className='verified-icon' />
                                            <Image src={'/profile.png'}
                                                alt="user avatar"
                                                width={50}
                                                height={50}
                                                className='manage-users-card-image' />
                                        </div>
                                    ) : user.role === "author" ? (
                                        <div className='manage-users-card-image-container'>
                                            {user.isVerified ? (
                                                <VscVerifiedFilled className='verified-icon' />
                                            ) : (<div></div>)}

                                            <Image src={'/editor.png'}
                                                alt="user avatar"
                                                width={50}
                                                height={50}
                                                className='manage-users-card-image' />
                                        </div>
                                    ) : (
                                        <div className='manage-users-card-image-container'>
                                            {user.isVerified ? (
                                                <VscVerifiedFilled className='verified-icon' />
                                            ) : (<div></div>)}
                                            <Image src={'/working.png'}
                                                alt="user avatar"
                                                width={50}
                                                height={50}
                                                className='manage-users-card-image' />
                                        </div>
                                    )}
                                    <p className='manage-users-card-title'>{user.username}</p>
                                </div>
                                <p className='manage-users-card-email'>{user.email}</p>
                                <div className='manage-users-card-role'>
                                    <p>{user.role}</p>
                                    {user.role === "author" && (
                                        <div>
                                            {user.isAuthorVerified ? (
                                                <p className='verified-button'>
                                                    Verified
                                                </p>
                                            ) : (
                                                <p className='verify-button'
                                                    title='Verify this author'
                                                    onClick={async () => {
                                                        await VerifyAuthorApi(user._id);
                                                    }}>Verify</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='manage-users-card-buttons'>
                                    <EditUserModal
                                        isEditModalOpen={isEditModalOpen}
                                        editModalUser={editModalUser}
                                        setIsEditModalOpen={setIsEditModalOpen}
                                        setEditModalUser={setEditModalUser} />
                                    <RiFileEditFill
                                        className="edit-button"
                                        onClick={() => {
                                            openEditModal(user._id);
                                        }}
                                    />
                                    <DeleteUserModal
                                        isDeleteModalOpen={isDeleteModalOpen}
                                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                                        users={users}
                                        setUsers={setUsers}
                                        userID={userId}
                                    />
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
