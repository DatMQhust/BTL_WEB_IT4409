import React, { useState, useRef } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { IoPersonCircleOutline } from "react-icons/io5";

import { MdOutlineVpnKey } from "react-icons/md";

import { Formik } from "formik";

import { TextField, InputAdornment } from "@mui/material";

import * as yup from "yup";

import "./Login.css"; // Import file CSS mới

// import logo from "../../assets/website/logo.png";

// import bgVideo from "./video/185096-874643413.mp4";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = ({ resetStates, switchToSignUp, switchToForgotPassword }) => {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const { login } = useAuth(); // Lấy hàm login từ context
    // --- STATE MANAGEMENT ---
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", isError: false });



    // --- FORM SUBMISSION ---

    const handleFormSubmit = async (values, { resetForm }) => {
        const apiUrl = import.meta.env.VITE_API_URL; // Lấy URL từ biến môi trường
        try {
            const response = await fetch(`${apiUrl}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier: values.identifier, // username / email / phone
                    password: values.password,
                }),
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                // 🟢 Đăng nhập thành công
                setNotification({
                    show: true,
                    message: "Login successful! Redirecting...",
                    isError: false,
                });
                // Gọi hàm login từ AuthContext để cập nhật trạng thái toàn cục
                login(result.token, result.data.user);
                if (resetStates) resetStates(); // Đóng popup nếu có
            } else {
                //  Sai tài khoản hoặc mật khẩu
                setNotification({
                    show: true,
                    message: result.message || "Invalid login credentials",
                    isError: true,
                });
            }
        } catch (error) {
            //  Lỗi kết nối server
            setNotification({
                show: true,
                message: "Server error. Please try again later.",
                isError: true,
            });
            console.error("Login failed:", error);
        }
    };

    return (

        <div className="login-overlay">

            <div ref={formRef} className="login-container">

                {/* Nút X */}

                <button

                    className="close-button"

                    onClick={resetStates}

                    aria-label="Close"

                >

                    &times;

                </button>

                {/* Left: Video + overlay */}

                <div className="login-intro-panel">

                    {/* <video

                        className="absolute inset-0 w-full h-full object-cover"

                        src={bgVideo}

                        autoPlay

                        loop

                        muted

                    /> */}

                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-8">

                        <h2 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">

                            Great experience <br /> Extraordinary Products

                        </h2>

                        <div className="mt-auto w-full flex flex-col items-center">

                            <span className="text-white/80 mb-2">Don't have an account?</span>

                            <button

                                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded-lg shadow transition"

                                onClick={switchToSignUp}

                            >

                                Sign Up

                            </button>

                        </div>

                    </div>

                </div>



                {/* Right: Login form */}

                <div className="login-form-panel">

                    {/* <img src={logo} alt="Logo" className="w-16 h-16 mb-4" /> */}

                    <h1 className="text-3xl font-bold text-center mb-2 text-green-700 dark:text-green-400">Welcome Back!</h1>



                    {/* Notification */}

                    {notification.show && (
                        <div className={`w-full mb-4 p-3 rounded-lg text-center ${notification.isError

                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'

                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'

                            }`}>

                            {notification.message}

                        </div>

                    )}



                    <Formik

                        onSubmit={handleFormSubmit}
                        initialValues={loginInitialValues}
                        validationSchema={loginValidationSchema}
                    >

                        {({

                            values,

                            errors,

                            touched,

                            handleBlur,

                            handleChange,

                            handleSubmit,
                            isSubmitting,

                        }) => (

                            <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                                <div className="relative">

                                    <TextField
                                        id="identifier"
                                        name="identifier"
                                        type="text"
                                        onBlur={handleBlur}
                                        label="Enter Username"
                                        sx={muiTextFieldStyles}
                                        value={values.identifier}
                                        onChange={handleChange}
                                        error={touched.identifier && Boolean(errors.identifier)}
                                        helperText={touched.identifier && errors.identifier}
                                        InputProps={{

                                            startAdornment: (

                                                <InputAdornment position="start">

                                                    <IoPersonCircleOutline size={22} className="text-gray-400 dark:text-gray-500" />

                                                </InputAdornment>

                                            ),
                                            style: { borderRadius: 12, background: "transparent" }
                                        }}

                                    />

                                </div>

                                <div className="relative">

                                    <TextField

                                        id="password"

                                        type={showPassword ? "text" : "password"}
                                        onBlur={handleBlur}
                                        label="Enter Password"
                                        sx={muiTextFieldStyles}
                                        value={values.password}
                                        name="password"
                                        onChange={handleChange}
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        InputProps={{

                                            startAdornment: (

                                                <InputAdornment position="start">

                                                    <MdOutlineVpnKey size={22} className="text-gray-400 dark:text-gray-500" />

                                                </InputAdornment>

                                            ),

                                            endAdornment: showPassword ? (

                                                <FaEye

                                                    className="cursor-pointer text-gray-400 dark:text-gray-500"

                                                    onClick={() => setShowPassword(!showPassword)}

                                                />

                                            ) : (

                                                <FaEyeSlash

                                                    className="cursor-pointer text-gray-400 dark:text-gray-500"

                                                    onClick={() => setShowPassword(!showPassword)}

                                                />

                                            ),
                                            style: { borderRadius: 12, background: "transparent" }
                                        }}

                                    />

                                </div>

                                <button

                                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg py-2 mt-2 transition"

                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </button>

                            </form>

                        )}

                    </Formik>

                    <div className="flex flex-col items-center mt-4 w-full max-w-xs">

                        <button
                            className="text-sm text-green-600 dark:text-green-400 hover:underline mb-2"
                            onClick={switchToForgotPassword}
                        >

                            Forgot your password?

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

// Tái cấu trúc style cho TextField để tránh lặp code
const muiTextFieldStyles = {
    width: "100%",
    '& .MuiInputLabel-root': {
        color: 'inherit',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#22c55e',
        },
    },
    '& .MuiInputBase-input': {
        color: 'inherit',
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: 'inherit',
        opacity: 0.7,
    },
};

// Regex & validation
const loginValidationSchema = yup.object().shape({
    identifier: yup.string().required("Username, email, or phone is required"),
    password: yup.string().required("Password is required"),
});

const loginInitialValues = {
    identifier: "",
    password: "",
};

export default Login;