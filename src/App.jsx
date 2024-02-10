import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import Cabinet from "./pages/Cabinet/Cabinet";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./utils/firebase.config";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const openPage = ["/login", "/register"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refCollection = collection(firestore, "users");

    const q = query(refCollection, where("token", "==", token));

    getDocs(q)
      .then((res) => {
        setShow(true);
      })
      .catch((err) => {
        setShow(false);
        if (!openPage.includes(location.pathname)) {
          navigate("/login");
        }
      });
  }, [location.pathname]);

  return (
    <div>
      <div className="p-3 bg-dark mb-3 text-white d-flex align-items-center justify-content-between">
        <h1>LOGO</h1>
        <div className="d-flex align-items-center gap-3">
          {show ? (
            ""
          ) : (
            <Link to={"/login"} className="btn btn-primary">
              Вход
            </Link>
          )}
          <Link to={"/cabinet"} className="btn btn-warning">Кабинет</Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cabinet" element={<Cabinet />} />
      </Routes>
    </div>
  );
};

export default App;
