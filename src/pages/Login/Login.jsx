import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase.config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        localStorage.setItem("token", res.user.uid);
        navigate("/");
      })
      .catch((err) => {
        alert("такого пользователя не существует !");
      });
  }
  return (
    <div className="w-25 login mx-auto p-3 card">
      <h4 className="text-center mb-4">Вход</h4>
      <input
        onChange={(e) => setEmail(e.target.value)}
        className="form-control mb-2"
        placeholder="Адрес электронной почты..."
        type="email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="form-control mb-4"
        placeholder="Пароль..."
        type="password"
      />
      <button onClick={login} className="btn btn-dark">
        Вход
      </button>
      <h6 className="mt-2 text-center">
        Если у вас нет аккаунта переходите сюда
      </h6>
      <Link className="text-center" to={"/register"}>
        Регистрация
      </Link>
    </div>
  );
};

export default Login;
