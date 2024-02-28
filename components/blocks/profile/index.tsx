'use client';
import './index.scss';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetMyProfileApi } from '@/apiEndpoints/user';
import { ProfileInfo } from '@/types/interfaces';
import { VscVerifiedFilled } from "react-icons/vsc";
import Image from 'next/image';

const Profile = () => {
    const role = useSelector((state: any) => state.user.role);
    const [profile, setProfile] = useState<ProfileInfo>();

    useEffect(() => {
        GetMyProfileApi().then((response: ProfileInfo) => {
            setProfile(response);
        })
    }, [])

    return (
        <div className="profile-container">
            {role === 'admin' ? (
                <div className='profile'>
                    <Image
                        src={'/profile.png'}
                        alt='profile image'
                        width={100}
                        height={100}
                        className='profile-image' />
                    <div className='profile-name-container'>
                        <p className='profile-name'>{profile?.username}</p>
                        <p className='profile-verified-icon'>{profile?.isVerified ? <VscVerifiedFilled /> : ""}</p>
                    </div>
                    <p className='profile-role'>Role: {profile?.role}</p>
                    <p className='profile-email'>Email: {profile?.email}</p>
                </div>
            ) : role === 'customer' ? (
                <div className='profile'>
                    <Image
                        src={'/working.png'}
                        alt='profile image'
                        width={100}
                        height={100}
                        className='profile-image' />
                    <div className='profile-name-container'>
                        <p className='profile-name'>{profile?.username}</p>
                        <p className='profile-verified-icon'>{profile?.isVerified ? <VscVerifiedFilled /> : ""}</p>
                    </div>
                    <p className='profile-role'>Role: {profile?.role}</p>
                    <p className='profile-email'>Email: {profile?.email}</p>
                </div>
            ) : role === 'author' ? (
                <div className='profile'>
                    <Image
                        src={'/editor.png'}
                        alt='profile image'
                        width={100}
                        height={100}
                        className='profile-image' />
                    <div className='profile-name-container'>
                        <p className='profile-name'>{profile?.username}</p>
                        <p className='profile-verified-icon'>{profile?.isVerified ? <VscVerifiedFilled /> : ""}</p>
                    </div>
                    <p className='profile-role'>Role: {profile?.role}
                        {profile?.isAuthorVerified ? ' (Verified author)' : ' (Author is not verified)'}
                    </p>
                    <p className='profile-email'>Email: {profile?.email}</p>
                </div>
            ) : null}
        </div>
    )
}

export default Profile;
