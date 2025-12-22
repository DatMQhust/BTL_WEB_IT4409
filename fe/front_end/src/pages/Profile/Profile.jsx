import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Mail, Phone, Edit } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useOrderService } from '../../services/useOrderService';
import EditProfilePopup from './EditProfilePopup';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Profile = () => {
    const { user, setUser } = useAuth();
    const { getMyOrders, updateProfile } = useOrderService();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState(null);
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);

    if (!user) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoadingOrders(true);
                setOrdersError(null);
                const res = await getMyOrders();
                setOrders(res?.data?.orders || []);
            } catch (e) {
                setOrdersError(e?.message || 'Không thể tải danh sách đơn hàng.');
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [getMyOrders]);

    const handleUpdateProfile = async (updatedData) => {
        try {
            const res = await updateProfile(updatedData);
            if (res?.data?.user) {
                setUser((prev) => ({ ...prev, ...res.data.user }));
                setEditPopupOpen(false);
            }
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    /* =======================
       Derived data
    ======================= */
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
        (o) => o.status === 'pending'
    ).length;

    const totalSpending = useMemo(() => {
        return orders.reduce(
            (sum, order) => sum + Number(order.totalAmount || 0),
            0
        );
    }, [orders]);

    /* =======================
       Chart Data
    ======================= */
    const chartData = useMemo(() => {
        const now = new Date();
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(
                now.getFullYear(),
                now.getMonth() - 5 + i,
                1
            );
            return {
                key: `${d.getFullYear()}-${String(
                    d.getMonth() + 1
                ).padStart(2, '0')}`,
                label: d.toLocaleDateString('vi-VN', {
                    month: 'short',
                    year: 'numeric',
                }),
                value: 0,
            };
        });

        const monthIndexMap = new Map(
            months.map((m, idx) => [m.key, idx])
        );

        for (const order of orders) {
            if (!order?.createdAt) continue;
            const d = new Date(order.createdAt);
            const key = `${d.getFullYear()}-${String(
                d.getMonth() + 1
            ).padStart(2, '0')}`;
            if (monthIndexMap.has(key)) {
                const idx = monthIndexMap.get(key);
                months[idx].value += Number(order.totalAmount || 0);
            }
        }

        return {
            labels: months.map((m) => m.label),
            datasets: [
                {
                    label: 'Chi tiêu hàng tháng',
                    data: months.map((m) => m.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }, [orders]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.dataset.label}: ${new Intl.NumberFormat(
                            'vi-VN',
                            {
                                style: 'currency',
                                currency: 'VND',
                            }
                        ).format(context.parsed.y)}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) =>
                        new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(value),
                },
            },
        },
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-5xl mx-auto px-4">
                    {/* MAIN CARD */}
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                        {/* ================= HEADER ================= */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-center gap-5">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
                                    {user.name?.charAt(0)}
                                </div>

                                {/* User Info */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {user.email}
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                                        Role: {user.role || 'user'}
                                    </p>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setEditPopupOpen(true)}
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                            >
                                <Edit size={16} />
                                Chỉnh sửa thông tin
                            </button>
                        </div>

                        {/* ================= STATISTICS ================= */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Đơn hàng đang chờ
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {pendingOrders}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tổng số đơn hàng
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {totalOrders}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tổng chi tiêu
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {totalSpending.toLocaleString('vi-VN')}₫
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ================= CONTACT INFO ================= */}
                        <div className="mt-10">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin liên hệ
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail size={18} />
                                        <span>Email</span>
                                    </div>
                                    <span className="text-gray-900">
                                        {user.email}
                                    </span>
                                </div>

                                {user.phone && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={18} />
                                            <span>Số điện thoại</span>
                                        </div>
                                        <span className="text-gray-900">
                                            {user.phone}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ================= CHART ================= */}
                        <div className="mt-12 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Biểu đồ chi tiêu
                            </h3>

                            {loadingOrders ? (
                                <p className="text-sm text-gray-500 text-center py-8">
                                    Đang tải dữ liệu...
                                </p>
                            ) : ordersError ? (
                                <p className="text-sm text-red-500 text-center py-8">
                                    {ordersError}
                                </p>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= EDIT POPUP ================= */}
            {isEditPopupOpen && (
                <EditProfilePopup
                    user={user}
                    onClose={() => setEditPopupOpen(false)}
                    onSave={handleUpdateProfile}
                />
            )}
        </>
    );
};

export default Profile;
