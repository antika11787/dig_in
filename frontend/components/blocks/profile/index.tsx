'use client';
import './index.scss';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetMyProfileApi } from '@/apiEndpoints/user';
import { ProfileInfo } from '@/types/interfaces';

const Profile = () => {
    const role = useSelector((state: any) => state.user.role);
    const [profile, setProfile] = useState<ProfileInfo>();

    useEffect(() => {
        GetMyProfileApi().then((response) => {
            setProfile(response);
        })
    }, [])

    return (
        <div className="profile-container">
            {role === 'admin' ? (
                <div className='profile'>
                    <img src={'/profile.png'} className='profile-image' />
                    <p className='profile-name'>{profile?.username}</p>
                    <p className='profile-role'>Role: {profile?.role}</p>
                    <p className='profile-email'>Email: {profile?.email}</p>
                </div>
            ) : role === 'customer' ? (
                <div>Customer</div>
            ) : role === 'author' ? (
                <div>Author</div>
            ) : null}
        </div>
    )
}

export default Profile;
