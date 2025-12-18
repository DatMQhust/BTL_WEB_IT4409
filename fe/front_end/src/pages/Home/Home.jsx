import React, { useState, useEffect } from "react";
import axios from 'axios';

  const backgroundImageUrl = "https://source.unsplash.com/random/1920x1080/?books,library,dark"; // URL hình ảnh nền ngẫu nhiên
import { Link } from "react-router-dom";


const Home = () => { // Đổi tên Hero thành Home
  const [imageId, setImageId] = useState('https://source.unsplash.com/random/800x1200/?book,cover');
  const [title, setTitle] = useState("Loading...");
  const [bookId, setBookId] = useState('');
  const [description, setDescription] = useState("Loading book description...");
  const [author, setAuthor] = useState('Loading author...');
  const [booklist, setBooklist] = useState([]);

  // Lấy theme từ localStorage (do navbar quản lý)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    const handleStorage = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect( () => {
    const getBook = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/product?page=1&limit=1`);
        const book = response.data.data.products[0]; // Assuming the first book in the array
        if (book) {
          setImageId(book.coverImageUrl);
          setTitle(book.name);
          setDescription(book.description);
          // Assuming authors is an array of objects with a 'name' property
          setAuthor(book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author');
          setBookId(book._id);
        }
      } catch (error) {
        console.error('Error fetching book data:', error.response ? error.response.data : error.message);
        // Set default values or show error message to user
        setTitle("Failed to load book");
        setDescription("Could not load book details. Please try again later.");
        setAuthor("");
        setImageId("https://via.placeholder.com/800x1200?text=Book+Not+Found");
      }
    };
    getBook();
  }, []);

  useEffect(() => {
    const getBookList = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/product?page=1&limit=5`);
        setBooklist(response.data.data.products);
      } catch (error) {
        console.error('Error fetching book list:', error);
      }
    };
    getBookList();
  }, []);

  return (
      <div
        className="relative min-h-[550px] sm:min-h-[650px] flex justify-center items-center dark:text-white duration-200"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay làm tối ảnh: dark mode 60%, light mode 0.1 */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-60"
          style={{
            background: "black",
            //opacity: theme === "dark" ? 0.6 : 0.1
          }}
        ></div>
        {/* Nền mờ để hiển thị rõ chữ trên desktop, không hiện trên mobile */}
        <div
          className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none hidden sm:flex"
        >
          <div
            className="w-full max-w-7xl mx-auto rounded-2xl backdrop-blur-md p-6 sm:p-12 bg-[#ffffff4d] dark:bg-[#1118274d]"
            style={{
              //backgroundColor: theme === "dark" ? "rgba(17,24,39,0.3)" : "rgba(255,255,255,0.3)",
              minHeight: "600px",
              maxWidth: "1200px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              pointerEvents: "auto",
            }}
          >
            <div className="container pb-8 sm:pb-0 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div
                  data-aos-once="true"
                  className="flex flex-col justify-center gap-8 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1"
                >
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {title}
                    <p className="bg-clip-text text-transparent bg-gradient-to-b from-primary text-right text-xl to-secondary">
                      {author}
                    </p>{" "}
                  </h1>
                  <p
                    data-aos="slide-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-xl line-clamp-3"
                    
                  >
                    {description}
                  </p>
                  <div>
                     <Link to={"../book-detail/"+bookId}>
                      <button
                        // onClick={handleOrderPopup} // Loại bỏ handleOrderPopup vì không còn được truyền vào
                        className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                      >
                        Order Now
                      </button>
                    </Link>
                  </div>
                </div>
                {/* Image section */}
                <div className="min-h-[450px] sm:min-h-[450px] flex justify-center items-center relative order-1 sm:order-2 ">
                  <div className="h-[300px] sm:h-[450px] overflow-hidden flex justify-center items-center">
                    <img
                      data-aos="zoom-in"
                      data-aos-once="true"
                      src={imageId}
                      alt="biryani img"
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-125 object-contain mx-auto"
                    />
                  </div>
                  <div className="flex lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:py-2 justify-center gap-4 absolute -bottom-[40px] lg:-right-1 bg-white rounded-full">
                    {booklist.map((book, idx) => (
                      <img
                        data-aos="zoom-in"
                        data-aos-once="true"
                        src={book.coverImageUrl}
                        onClick={() => {
                          // Khi click vào thumbnail, chuyển ngay và reset interval
                          setImageId(
                            book.coverImageUrl
                          );
                          setTitle(book.name);
                          setDescription(book.description);
                          setAuthor(book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author');
                          setBookId(book._id);
                        }}
                        alt="book cover"
                        className="max-w-[100px] h-[100px] object-contain inline-block hover:scale-110 duration-200"
                        key={book._id || idx}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Hiển thị sách và nội dung luôn luôn trên mobile */}
        <div className="sm:hidden w-full max-w-7xl mx-auto p-4 relative z-10">
          <div className="container pb-8 sm:pb-0">
            <div className="grid grid-cols-1">
              {/* text content section */}
              <div
                data-aos-once="true"
                className="flex flex-col justify-center gap-8 pt-12 text-center order-2"
              >
                <h1
                  data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="text-4xl font-bold"
                >
                  {title}
                  <p className="bg-clip-text text-transparent bg-gradient-to-b from-primary text-right text-xl to-secondary">
                    {author}
                  </p>{" "}
                </h1>
                <p
                  data-aos="slide-up"
                  data-aos-duration="500"
                  data-aos-delay="100"
                  className="text-lg line-clamp-3"
                >
                  {description}
                </p>
                <div>
                  <Link to={"../book-detail/" + bookId}>
                    <button
                      // onClick={handleOrderPopup} // Loại bỏ handleOrderPopup vì không còn được truyền vào
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Order Now
                    </button>
                  </Link>
                </div>
              </div>
              {/* Image section */}
              <div className="min-h-[300px] flex justify-center items-center relative order-1 mt-8">
                <div className="h-[300px] overflow-hidden flex justify-center items-center">
                  <img
                    data-aos="zoom-in"
                    data-aos-once="true"
                    src={imageId}
                    alt="biryani img"
                    className="w-[220px] h-[220px] object-contain mx-auto"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {booklist.map((book, idx) => (
                    <img
                      data-aos="zoom-in"
                      data-aos-once="true"
                      src={book.coverImageUrl}
                      onClick={() => {
                        setImageId(book.coverImageUrl);
                        setTitle(book.name);
                        setDescription(book.description);
                        setAuthor(book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author');
                        setBookId(book._id);
                      }}
                      alt="book cover"
                      className="max-w-[60px] h-[60px] object-contain inline-block hover:scale-110 duration-200"
                      key={book._id || idx}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Đảm bảo ChatButton luôn hiển thị trên cùng */}
        <div className="fixed z-[100] bottom-5 right-5 pointer-events-auto">
          {/* Nếu bạn import ChatButton ở đây, render nó tại đây */}
          {/* <ChatButton /> */}
        </div>
      </div>
  );
};

export default Home;
