// import React, { useState } from "react";
import React from "react";

// import { Link } from "react-router-dom"; 

import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from "react-icons/fa";
import footerLogo from "../../assets/website/logo.png";

// Danh sách link (tĩnh)
const FooterLinks = [
    {
        title: "Home",
        link: "/",
    },
    {
        title: "About",
        link: "/#about",
    },
    {
        title: "Contact",
        link: "/#contact",
    },
];

const Footer = () => {
    return (
        <div className="bg-gray-100 dark:bg-gray-950">
            <section className="container">
                <div className=" grid md:grid-cols-3 py-5">
                    {/* company Details */}
                    <div className=" py-8 px-4 ">
                        <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
                            <img src={footerLogo} alt="Logo" className="max-w-[50px]" />
                            Books Store
                        </h1>

                        <p className="">
                            Tạo cảm hứng cho giới trẻ với sách đầy thú vị, biến sách trở thành
                            công cụ hữu ích dẫn tới thành công
                        </p>

                        <br />

                        <div className="flex items-center gap-3">
                            <FaLocationArrow />

                        </div>

                        <div className="flex items-center gap-3 mt-3">
                            <FaMobileAlt />
                            <p>011111111</p>
                        </div>

                        {/* Social Handle */}
                        <div className="flex items-center gap-3 mt-6">
                            <a href="https://www.instagram.com/ngquy16.1/">
                                <FaInstagram className="text-3xl" />
                            </a>
                            <a href="https://www.facebook.com/ngocquy.160104">
                                <FaFacebook className="text-3xl" />
                            </a>
                            <a href="https://linkedin.com">
                                <FaLinkedin className="text-3xl" />
                            </a>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10 ">
                        <div className="">
                            <div className="py-8 px-4 ">
                                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                    Important Links
                                </h1>
                                <ul className={`flex flex-col gap-3`}>
                                    {FooterLinks.map((link) => (
                                        <li
                                            key={link.title}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary space-x-1 text-gray-500"
                                        >
                                            <span>&#11162;</span>

                                            {/* Dùng thẻ a cho web tĩnh */}
                                            <a href={link.link}>
                                                {link.title}
                                            </a>

                                            {
                                                // Đây là version SPA, để comment lại
                                                /* <Link to={link.link}>
                                                  {link.title}
                                                </Link> */
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Lặp lại nhóm link */}
                        <div className="py-8 px-4 ">
                            <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                Links
                            </h1>
                            <ul className="flex flex-col gap-3">
                                {FooterLinks.map((link) => (
                                    <li key={link.title}>
                                        <a
                                            href={link.link}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary text-gray-500 flex gap-1"
                                        >
                                            <span>&#11162;</span>
                                            <span>{link.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Location */}
                        <div className="py-8 px-4 ">
                            <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                Location
                            </h1>
                            <ul className="flex flex-col gap-3">
                                {FooterLinks.map((link) => (
                                    <li key={link.title}>
                                        <a
                                            href={link.link}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary text-gray-500 flex gap-1"
                                        >
                                            <span>&#11162;</span>
                                            <span>{link.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/*<div>
          <div className="text-center py-10 border-t-2 border-gray-300/50">
            Nhóm 31 Ngọc Quý và những người bạn ❤️
          </div>
        </div>*/}
            </section>
        </div>
    );
};

export default Footer;
