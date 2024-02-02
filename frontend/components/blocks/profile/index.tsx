'use client';

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
    const state = useSelector((state: any) => state);

    return (
        <div>
            {state.user.role === "admin" ? (
                <div>
                    Admin
                </div>
            ) : (
                <div>
                    User
                </div>
            )}
        </div>
    )
}

export default Profile;
