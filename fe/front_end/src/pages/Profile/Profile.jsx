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
import './Profile.css'; // Import the new CSS file

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
            <div className="profile-page-container">
                <div className="profile-content-wrapper">
                    {/* MAIN CARD */}
                    <div className="profile-card">
                        {/* ================= HEADER ================= */}
                        <div className="profile-header">
                            <div className="profile-header-info">
                                {/* Avatar */}
                                <div className="profile-avatar">
                                    {user.name?.charAt(0)}
                                </div>

                                {/* User Info */}
                                <div>
                                    <h2 className="profile-name">
                                        {user.name}
                                    </h2>
                                    <p className="profile-email">
                                        {user.email}
                                    </p>
                                    <p className="profile-role">
                                        Role: {user.role || 'user'}
                                    </p>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setEditPopupOpen(true)}
                                className="edit-profile-button"
                            >
                                <Edit size={16} />
                                Chỉnh sửa thông tin
                            </button>
                        </div>

                        {/* ================= STATISTICS ================= */}
                        <div className="statistics-section">
                            <div className="statistics-grid">
                                <div className="stat-item">
                                    <p className="stat-label">
                                        Đơn hàng đang chờ
                                    </p>
                                    <p className="stat-value">
                                        {pendingOrders}
                                    </p>
                                </div>

                                <div className="stat-item">
                                    <p className="stat-label">
                                        Tổng số đơn hàng
                                    </p>
                                    <p className="stat-value">
                                        {totalOrders}
                                    </p>
                                </div>

                                <div className="stat-item">
                                    <p className="stat-label">
                                        Tổng chi tiêu
                                    </p>
                                    <p className="stat-value">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(totalSpending)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ================= CONTACT INFO ================= */}
                        <div className="contact-info-section">
                            <h3 className="section-title">
                                Thông tin liên hệ
                            </h3>

                            <div className="contact-list">
                                <div className="contact-item">
                                    <div className="contact-detail">
                                        <Mail size={18} />
                                        <span>Email</span>
                                    </div>
                                    <span className="contact-value">
                                        {user.email}
                                    </span>
                                </div>

                                {user.phone && (
                                    <div className="contact-item">
                                        <div className="contact-detail">
                                            <Phone size={18} />
                                            <span>Số điện thoại</span>
                                        </div>
                                        <span className="contact-value">
                                            {user.phone}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ================= CHART ================= */}
                        <div className="chart-section">
                            <h3 className="section-title">
                                Biểu đồ chi tiêu
                            </h3>

                            {loadingOrders ? (
                                <p className="loading-message">
                                    Đang tải dữ liệu...
                                </p>
                            ) : ordersError ? (
                                <p className="error-message">
                                    {ordersError}
                                </p>
                            ) : (
                                <div className="chart-container">
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
