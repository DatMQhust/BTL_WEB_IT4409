import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
<<<<<<< Updated upstream
import Booklist from "./pages/Booklist/Booklist";
import LoginPopup from "./components/LoginPopup/LoginPopup";
=======
<<<<<<< Updated upstream
=======
import Booklist from "./pages/Booklist/Booklist";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import AdminLayout from "./pages/Admin/AdminLayout";
import Authors from "./pages/Admin/Author";


>>>>>>> Stashed changes
>>>>>>> Stashed changes

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< Updated upstream
        <Route path="/books" element={<Booklist />} />
=======
<<<<<<< Updated upstream
=======
        <Route path="/books" element={<Booklist />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="author" element={<Authors/>} />
        </Route>  
>>>>>>> Stashed changes
>>>>>>> Stashed changes
      </Routes>
      <Footer />
    </>
  );
}

export default App;
