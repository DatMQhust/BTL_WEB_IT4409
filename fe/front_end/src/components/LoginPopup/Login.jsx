import React, { useState, useRef } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { IoPersonCircleOutline } from "react-icons/io5";

import { MdOutlineVpnKey } from "react-icons/md";

import { Formik } from "formik";

import { TextField, InputAdornment } from "@mui/material";

import * as yup from "yup";

import Cookies from "js-cookie";

import "./Login.css"; // Import file CSS mới

// import logo from "../../assets/website/logo.png";

// import bgVideo from "./video/185096-874643413.mp4";

import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword"; // Import component ForgotPassword



const Login = ({ resetStates, switchToSignUp, switchToForgotPassword }) => {

    const [currentView, setCurrentView] = useState('login'); // 'login' hoặc 'forgot'

    const navigate = useNavigate();

    const formRef = useRef(null);



    // --- STATE MANAGEMENT ---

    const [showPassword, setShowPassword] = useState(false);

    const [inputError, setInputError] = useState("");

    const [passwordError, setPasswordError] = useState("");

    const [notification, setNotification] = useState({ show: false, message: "", isError: false });



    // --- FORM SUBMISSION ---

    const handleFormSubmit = async (values, { resetForm }) => {
        const apiUrl = import.meta.env.VITE_API_URL; // Lấy URL từ biến môi trường
        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier: values.input, // username / email / phone
                    password: values.password,
                }),
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                // 🟢 Đăng nhập thành công
                Cookies.set("token", result.token, { expires: 7 }); // lưu token trong 7 ngày
                // Cookies.set("user", JSON.stringify(result.data.user)); // nếu muốn lưu user

                setNotification({
                    show: true,
                    message: "Login successful! Redirecting...",
                    isError: false,
                });

                setTimeout(() => {
                    navigate("/dashboard"); // Đường dẫn muốn chuyển tới sau đăng nhập
                    window.location.reload();
                }, 1500);
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


    // Nếu view là 'forgot', hiển thị component ForgotPassword
    if (currentView === 'forgot') {
        return <ForgotPassword
            resetStates={resetStates}
            backToLogin={() => setCurrentView('login')}
        />;
    }



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

                        initialValues={initialValues}

                        validationSchema={checkoutSchema}

                    >

                        {({

                            values,

                            errors,

                            touched,

                            handleBlur,

                            handleChange,

                            handleSubmit,

                        }) => (

                            <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>

                                {/* Username or Email */}

                                <div className="relative">

                                    <TextField

                                        id="input"

                                        type="text"

                                        onBlur={handleBlur}

                                        label="Enter Username"

                                        sx={{

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

                                        }}

                                        onChange={(e) => {

                                            handleChange(e);

                                            setInputError(""); // reset nếu nhập lại

                                        }}

                                        value={values.input}

                                        name="input"

                                        error={!!touched.input && (!!errors.input || !!inputError)}

                                        helperText={(touched.input && errors.input) || inputError}

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



                                {/* Password */}

                                <div className="relative">

                                    <TextField

                                        id="password"

                                        type={showPassword ? "text" : "password"}

                                        onBlur={handleBlur}

                                        label="Enter Password"

                                        sx={{

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

                                        }}

                                        onChange={(e) => {

                                            handleChange(e);

                                            setPasswordError("");

                                        }}

                                        value={values.password}

                                        name="password"

                                        error={!!touched.password && (!!errors.password || !!passwordError)}

                                        helperText={(touched.password && errors.password) || passwordError}

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

                                >

                                    Login

                                </button>

                            </form>

                        )}

                    </Formik>



                    <div className="flex flex-col items-center mt-4 w-full max-w-xs">

                        <button

                            className="text-sm text-green-600 dark:text-green-400 hover:underline mb-2"
                            onClick={() => setCurrentView('forgot')}

                        >

                            Forgot your password?

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};



// Regex & validation

const phoneRegExp = /^\d{5,15}$/;

const emailRegExp = /^[^@\s]+$/;

const usernameRegExp = /^[a-zA-Z0-9_.@]+$/;



const checkoutSchema = yup.object().shape({

    input: yup

        .string()

        .matches(usernameRegExp, "Username must not contain special characters")

        .test("checkInput", "Phone or Email is Required", (item) => {

            return phoneRegExp.test(item) || !emailRegExp.test(item);

        })

        .required("Required"),

    password: yup.string().required("Required"),

});



const initialValues = {

    input: "",

    phone: "",

    mail: "",

    password: "",

};
export default Login;