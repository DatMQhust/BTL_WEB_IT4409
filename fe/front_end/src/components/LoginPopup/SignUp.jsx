import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import { TextField, InputAdornment } from "@mui/material";
import * as yup from "yup";
import "./LoginPopup.css";

const SignUp = ({ resetStates, backToLogin, handleSignUp, handleVerify, handleMail }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", isError: false });
    const [isDark, setIsDark] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const showNotification = (message, isError = false) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => {
            setNotification({ show: false, message: "", isError: false });
        }, 3000);
    };

    const handleFormSubmit = (values) => {
        if (handleMail) handleMail(values);
        createUser(values);
    };

    const createUser = (form) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((response) => (response.ok ? response.json() : response.text()))
            .then((data) => {
                if (data) {
                    showNotification("Account created successfully! Please log in.");
                    setTimeout(backToLogin, 2000);
                } else {
                    showNotification("User Already Exist", true);
                }
            });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" ref={formRef} style={{ maxWidth: "450px", maxHeight: "90vh", overflowY: "auto" }}>
                <button className="popup-close-btn" onClick={resetStates} aria-label="Close">
                    &times;
                </button>

                <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleFormSubmit}>
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form className="popup-form" onSubmit={handleSubmit}>
                            <h2>Tạo tài khoản</h2>

                            {notification.show && (
                                <div
                                    className={`error-message ${notification.isError ? "" : "text-green-700 bg-green-100"
                                        }`}
                                >
                                    {notification.message}
                                </div>
                            )}

                            {/* Input Groups */}
                            {[
                                { id: "name", label: "Username", type: "text" },
                                { id: "email", label: "Email", type: "email" },
                                { id: "phone", label: "Phone Number", type: "tel" },
                            ].map((field) => (
                                <div className="form-group" key={field.id}>
                                    <TextField
                                        fullWidth
                                        id={field.id}
                                        name={field.id}
                                        label={field.label}
                                        type={field.type}
                                        value={values[field.id]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched[field.id] && Boolean(errors[field.id])}
                                        helperText={touched[field.id] && errors[field.id]}
                                    />
                                </div>
                            ))}

                            {/* Password */}
                            <div className="form-group">
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <button
                                                    type="button"
                                                    className="text-gray-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <TextField
                                    fullWidth
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    label="Confirm Password"
                                    type={showPassword ? "text" : "password"}
                                    value={values.passwordConfirm}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.passwordConfirm && Boolean(errors.passwordConfirm)}
                                    helperText={touched.passwordConfirm && errors.passwordConfirm}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <button type="button" className="text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Tạo tài khoản
                            </button>

                            <p className="switch-form-text">
                                Đã có tài khoản?{" "}
                                <span onClick={backToLogin} className="cursor-pointer text-green-600">
                                    Đăng nhập
                                </span>
                            </p>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

/* ============================
   Validation + Initial Values
============================ */

const usernameRegExp = /^[a-zA-Z0-9_.]+$/;
const nameRegExp = /^[a-zA-Z0-9_. ]+$/;
const phoneRegExp = /^[\d]{5,15}$/;
const passwordSafeRegExp = /^[^'";<>\\/]*$/;

const checkoutSchema = yup.object().shape({
    name: yup.string().matches(usernameRegExp, "Username must not contain special characters").required("Required"),
    email: yup.string().email("Invalid email format"),
    phone: yup.string().matches(phoneRegExp, "Phone number is not valid").required("Required"),
    password: yup.string().min(8, "Password must be at least 8 characters").matches(passwordSafeRegExp, "Password contains invalid characters").required("Required"),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Required'),
});

const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    code: "",
};

export default SignUp;
