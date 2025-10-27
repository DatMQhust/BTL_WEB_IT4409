import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/website/logo.png";
import { Bell, BellDot } from "lucide-react";
// import DarkMode from "./DarkMode"; // Đã xóa
import { FaCaretDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

// --- Các hàm hỗ trợ tạo Avatar (Giữ nguyên) ---
const getColorFromName = (name) => {
    const colors = ["1abc9c", "3498db", "9b59b6", "e67e22", "e74c3c"];
    const hash = Array.from(name || "").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};
const generateAvatar = (name) => {
    const initials = (name || "NA")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    const bgColor = getColorFromName(name);
    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff`;
};

// --- Bắt đầu Component ---
const Navbar = ({ handleLoginPopup }) => {

    // --- DỮ LIỆU GIẢ (MOCK DATA) ---
    const hasToken = true;
    const user = {
        id: 16,
        full_name: "Lập Trình Viên",
        balance: 120000,
    };
    const notice = [
        { id: 1, message: "Đơn hàng #123 của bạn đã được xác nhận.", created_at: new Date().toISOString(), is_read: false },
        { id: 2, message: "Chào mừng bạn đến với Books!", created_at: new Date().toISOString(), is_read: true },
    ];
    const unreadCount = 1;

    // --- LOGIC UI (State và Ref cho Giao diện) ---
    const [showNoti, setShowNoti] = useState(false);
    const [showOption, setShowOption] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileNoti, setShowMobileNoti] = useState(false);

    const mobileMenuRef = useRef(null);
    const dropdownRef = useRef(null);
    const notiRef = useRef(null);
    const location = useLocation();

    // --- LOGIC UI (useEffect để đóng menu khi bấm ra ngoài) ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setShowNoti(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOption(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
                setShowMobileNoti(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- CÁC HÀM GIẢ (MOCK FUNCTIONS) ---
    const clearAll = () => alert("Logic 'Clear All' sẽ được code ở Bước 5");
    const markAll = () => alert("Logic 'Mark All' sẽ được code ở Bước 5");
    const markAsRead = (id) => alert(`Logic 'Mark Read ${id}' sẽ được code ở Bước 5`);
    const deleteNotification = (id) => alert(`Logic 'Delete ${id}' sẽ được code ở Bước 5`);
    const handleSignOut = () => alert("Logic 'Sign Out' sẽ được code ở Bước 5");

    // --- Giao diện (Đã xóa các class 'dark:') ---
    return (
        <>
            {/* Xóa class dark: */}
            <div className="shadow-md bg-white text-gray-900 duration-200 w-full">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <a href="/" className="font-bold text-3xl flex gap-3 items-center">
                            <img src={Logo} alt="Logo" className="w-12 h-12" />
                            <span className="tracking-wide hidden md:inline">Books</span>
                        </a>
                    </div>
                    {/* Các thành phần bên phải navbar */}
                    <div className="flex items-center gap-2 md:gap-8">
                        {/* Desktop menu */}
                        <ul className="hidden md:flex items-center gap-8 font-semibold text-lg">
                            <li>
                                <Link to="/" className={`inline-block py-2 px-4 rounded-lg duration-200 hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
                            </li>
                            <li>
                                <Link to="/books" className={`inline-block py-2 px-4 rounded-lg duration-200 hover:text-primary ${location.pathname.startsWith('/books') ? 'text-primary' : ''}`}>Books List</Link>
                            </li>
                            <li>
                                <Link to="/cart" className={`inline-block py-2 px-4 rounded-lg duration-200 hover:text-primary ${location.pathname.startsWith('/cart') ? 'text-primary' : ''}`}>Cart</Link>
                            </li>
                            <li>
                                <Link to="/placeorder" className={`inline-block py-2 px-4 rounded-lg duration-200 hover:text-primary ${location.pathname.startsWith('/placeorder') ? 'text-primary' : ''}`}>Order</Link>
                            </li>
                        </ul>

                        {/* <DarkMode /> Đã xóa */}

                        {hasToken ? (
                            <>
                                {/* Xu */}
                                {user && (
                                    // Xóa class dark:
                                    <div className="flex items-center gap-1 text-green-600 font-bold text-base ml-2">
                                        <span className="bg-yellow-400 text-white rounded-full px-2 py-0.5 text-xs font-bold">x</span>
                                        {user.balance?.toLocaleString() || 0} Xu
                                    </div>
                                )}
                                {/* Notification icon */}
                                <div className="relative ml-2 hidden md:block" ref={notiRef}>
                                    <button
                                        onClick={() => setShowNoti(!showNoti)}
                                        // Xóa class dark:
                                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors shadow-none border-none"
                                    >
                                        {unreadCount > 0 ? (
                                            <BellDot className="text-primary" size={28} />
                                        ) : (
                                            // Xóa class dark:
                                            <Bell className="text-gray-600" size={28} />
                                        )}
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {showNoti && (
                                        // Xóa class dark:
                                        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transform transition-all duration-200 ease-out">
                                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                                {/* Xóa class dark: */}
                                                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                                <div className="flex gap-2">
                                                    {notice.length > 0 && (
                                                        <>
                                                            <button
                                                                onClick={markAll}
                                                                // Xóa class dark:
                                                                className="text-sm text-primary hover:text-primary-dark transition-colors"
                                                            >
                                                                Mark all as read
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Are you sure you want to delete all notifications?')) {
                                                                        clearAll();
                                                                    }
                                                                }}
                                                                // Xóa class dark:
                                                                className="text-sm text-red-500 hover:text-red-600 transition-colors"
                                                            >
                                                                Delete all
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notice.length === 0 ? (
                                                    // Xóa class dark:
                                                    <div className="p-4 text-center text-gray-500">
                                                        No notifications
                                                    </div>
                                                ) : (
                                                    notice.toReversed().map((noti) => (
                                                        <div
                                                            key={noti.id}
                                                            // Xóa class dark:
                                                            className={`group p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${!noti.is_read ? 'bg-blue-50' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div
                                                                    // Xóa class dark:
                                                                    className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${!noti.is_read ? 'bg-blue-500' : 'bg-gray-300'
                                                                        }`}
                                                                />
                                                                <div className="flex-1" onClick={() => markAsRead(noti.id)}>
                                                                    {/* Xóa class dark: */}
                                                                    <p className="text-sm text-gray-900">
                                                                        {noti.message}
                                                                    </p>
                                                                    {/* Xóa class dark: */}
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {new Date(noti.created_at).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (window.confirm('Are you sure you want to delete this notification?')) {
                                                                            deleteNotification(noti.id);
                                                                        }
                                                                    }}
                                                                    // Xóa class dark:
                                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                                                                    title="Delete notification"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Avatar + Option */}
                                <div className="relative flex items-center" style={{ marginTop: '2px' }}>
                                    <button onClick={() => setShowOption(!showOption)} className="w-14 h-14 ml-2 flex items-center justify-center">
                                        <img
                                            src={generateAvatar(user.full_name || user.name)}
                                            alt="Avatar"
                                            className="rounded-full border-4 border-indigo-500 shadow-lg"
                                        />
                                    </button>
                                    {showOption && (
                                        <div
                                            ref={dropdownRef}
                                            // Xóa class dark:
                                            className="absolute right-0 w-[150px] rounded-md bg-white p-2 text-black shadow-lg z-50"
                                            style={{ top: 'calc(100% + 8px)' }}
                                        >
                                            <ul className="space-y-3">
                                                <li >
                                                    <Link
                                                        className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                                                        to={`/user-detail`}
                                                    >
                                                        User Detail
                                                    </Link>
                                                    {user.id == 16 ?
                                                        <Link
                                                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                                                            to={`/admin`}
                                                        >
                                                            Admin Page
                                                        </Link> : <></>}
                                                    <a
                                                        className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                                                        onClick={handleSignOut}
                                                    >
                                                        Log Out
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center ml-2">
                                <button
                                    onClick={handleLoginPopup}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-2 text-lg shadow transition-all duration-150"
                                    style={{ minWidth: 120 }}
                                >
                                    Login
                                </button>
                            </div>
                        )}
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                // Xóa class dark:
                                className="flex items-center px-3 py-2 rounded hover:bg-gray-100"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                id="mobile-menu-btn"
                            >
                                <FaCaretDown size={28} />
                            </button>
                            {showMobileMenu && (
                                <div
                                    ref={mobileMenuRef}
                                    // Xóa class dark:
                                    className="absolute right-4 top-20 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                                >
                                    <ul className="flex flex-col font-semibold text-base">
                                        <li>
                                            <Link
                                                to="/"
                                                className={`block py-2 px-4 hover:bg-primary/10 ${location.pathname === '/' ? 'text-primary' : ''}`}
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/books"
                                                className={`block py-2 px-4 hover:bg-primary/10 ${location.pathname.startsWith('/books') ? 'text-primary' : ''}`}
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                Books List
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/cart"
                                                className={`block py-2 px-4 hover:bg-primary/10 ${location.pathname.startsWith('/cart') ? 'text-primary' : ''}`}
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                Cart
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/placeorder"
                                                className={`block py-2 px-4 hover:bg-primary/10 ${location.pathname.startsWith('/placeorder') ? 'text-primary' : ''}`}
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                Order
                                            </Link>
                                        </li>
                                        {hasToken && (
                                            <li>
                                                <button
                                                    className="w-full flex items-center gap-2 py-2 px-4 hover:bg-primary/10 focus:outline-none"
                                                    onClick={() => setShowMobileNoti(!showMobileNoti)}
                                                >
                                                    <span>Notifications</span>
                                                    {unreadCount > 0 && (
                                                        <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                    {/* Notification dropdown for mobile */}
                                    {hasToken && showMobileNoti && (
                                        // Xóa class dark:
                                        <div className="border-t border-gray-200 mt-2">
                                            <div className="flex items-center justify-between px-4 py-2">
                                                {/* Xóa class dark: */}
                                                <span className="font-semibold text-gray-900">Notifications</span>
                                                {notice.length > 0 && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={markAll}
                                                            // Xóa class dark:
                                                            className="text-xs text-primary hover:text-primary-dark"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                        <button
                                                            onClick={clearAll}
                                                            // Xóa class dark:
                                                            className="text-xs text-red-500 hover:text-red-600"
                                                        >
                                                            Delete all
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {notice.length === 0 ? (
                                                    // Xóa class dark:
                                                    <div className="p-4 text-center text-gray-500">
                                                        No notifications
                                                    </div>
                                                ) : (
                                                    notice.toReversed().map((noti) => (
                                                        <div
                                                            key={noti.id}
                                                            // Xóa class dark:
                                                            className={`group px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${!noti.is_read ? 'bg-blue-50' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div
                                                                    // Xóa class dark:
                                                                    className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${!noti.is_read ? 'bg-blue-500' : 'bg-gray-300'
                                                                        }`}
                                                                />
                                                                <div className="flex-1" onClick={() => markAsRead(noti.id)}>
                                                                    {/* Xóa class dark: */}
                                                                    <p className="text-sm text-gray-900">
                                                                        {noti.message}
                                                                    </p>
                                                                    {/* Xóa class dark: */}
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {new Date(noti.created_at).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteNotification(noti.id);
                                                                    }}
                                                                    // Xóa class dark:
                                                                    className="opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                                                                    title="Delete notification"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;