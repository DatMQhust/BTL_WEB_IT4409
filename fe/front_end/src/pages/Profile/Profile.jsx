import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        // If user is not logged in, redirect to home or show login prompt
        return <Navigate to="/" />;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Thông tin tài khoản</h1>
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                        </div>
                        {user.phone && (
                             <div>
                                <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                                <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Vai trò</label>
                            <p className="mt-1 text-lg text-gray-900 capitalize">{user.role || 'user'}</p>
                        </div>
                         {/* Add more fields as needed */}
                    </div>
                    {/* Optional: Add an edit button */}
                    <div className="mt-8 border-t pt-6">
                         <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                           Chỉnh sửa thông tin
                         </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;
