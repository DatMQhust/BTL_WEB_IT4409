// Footer.jsx
// Đây là Footer giao diện tĩnh: không state, không điều hướng router
import React from "react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from "react-icons/fa";
import footerLogo from "../../assets/website/logo.png";

// Danh sách link tĩnh
const FooterLinks = [
    { title: "Home", link: "/" },
    { title: "About", link: "/#about" },
    { title: "Contact", link: "/#contact" },
];

const Footer = () => {
    return (
        <div className="bg-gray-100 dark:bg-gray-950">
            <section className="container">
                <div className="grid md:grid-cols-3 py-5">
                    {/* Thông tin công ty */}
                    <div className="py-8 px-4">
                        <h1 className="sm:text-3xl text-xl font-bold flex items-center gap-3 mb-3">
                            {/* Logo */}
                            <img src={footerLogo} alt="Logo" className="max-w-[50px]" />
                            Books Store
                        </h1>

                        {/* Mô tả ngắn */}
                        <p>
                            Tạo cảm hứng cho giới trẻ với sách đầy thú vị,
                            biến sách trở thành công cụ hữu ích dẫn tới thành công.
                        </p>

                        {/* Địa chỉ */}
                        <div className="flex items-center gap-3 mt-4">
                            <FaLocationArrow />
                            <p>Đặng Ngọc Quý</p>
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex items-center gap-3 mt-3">
                            <FaMobileAlt />
                            <p>0948377358</p>
                        </div>

                        {/* Mạng xã hội */}
                        <div className="flex items-center gap-4 mt-6">
                            <a href="https://www.instagram.com/ngquy16.1/" target="_blank" rel="noreferrer">
                                <FaInstagram className="text-3xl" />
                            </a>
                            <a href="https://www.facebook.com/ngocquy.160104" target="_blank" rel="noreferrer">
                                <FaFacebook className="text-3xl" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                                <FaLinkedin className="text-3xl" />
                            </a>
                        </div>
                    </div>

                    {/* Các nhóm link */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
                        {/* Important Links */}
                        <div className="py-8 px-4">
                            <h1 className="sm:text-xl text-xl font-bold mb-3">
                                Important Links
                            </h1>
                            <ul className="flex flex-col gap-3">
                                {FooterLinks.map(item => (
                                    <li key={item.title}>
                                        <a
                                            href={item.link}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary text-gray-500 flex gap-1"
                                        >
                                            <span>&#11162;</span>
                                            <span>{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Links */}
                        <div className="py-8 px-4">
                            <h1 className="sm:text-xl text-xl font-bold mb-3">
                                Links
                            </h1>
                            <ul className="flex flex-col gap-3">
                                {FooterLinks.map(item => (
                                    <li key={item.title}>
                                        <a
                                            href={item.link}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary text-gray-500 flex gap-1"
                                        >
                                            <span>&#11162;</span>
                                            <span>{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Location Links */}
                        <div className="py-8 px-4">
                            <h1 className="sm:text-xl text-xl font-bold mb-3">
                                Location
                            </h1>
                            <ul className="flex flex-col gap-3">
                                {FooterLinks.map(item => (
                                    <li key={item.title}>
                                        <a
                                            href={item.link}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary text-gray-500 flex gap-1"
                                        >
                                            <span>&#11162;</span>
                                            <span>{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Dòng cuối */}
                <div className="text-center py-10 border-t-2 border-gray-300/50">
                    Nhóm 31 Ngọc Quý và những người bạn ❤️
                </div>
            </section>
        </div>
    );
};

export default Footer;
