import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../../img/google.png";
import githubIcon from "../../img/github.png";
import facebookIcon from "../../img/facebook.jpg";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../../utils/firebase.config";

const Register = () => {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function register() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const refCollection = collection(firestore, "users");
        addDoc(refCollection, {
          email,
          password,
          username,
          token: res.user.uid
        }).then((res) => {
          navigate("/login");
        });
      })
      .catch((error) => {
        alert("Ошибка !");
      });
  }

  function signInGoogle() {
    signInWithPopup(auth, googleProvider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const refCollection = collection(firestore, "users");

      addDoc(refCollection, {
        email: user.email,
        username: user.displayName,
        token: result.user.uid
      }).then((res) => {
        localStorage.setItem("token", result.user.uid);
        navigate("/");
      });
    });
  }

  function signInFacebook() {
    const auth = getAuth();
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;

      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
    });
  }

  return (
    <div>
      <div className="w-25 login card p-3 mx-auto">
        <h4>Регистрация</h4>
        <input
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mb-2"
          placeholder="Имя..."
          type="text"
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-2"
          placeholder="Адрес электронной почты..."
          type="email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
          placeholder="Пароль..."
          type="password"
        />
        <button onClick={register} className="btn btn-dark">
          Регистрация
        </button>
        <p className="text-center mt-2 mb-2">или</p>
        <div className="d-flex gap-3 justify-content-center">
          <img
            onClick={signInGoogle}
            className="icon-width"
            src={googleIcon}
            alt=""
          />
          <img className="icon-width" src={githubIcon} alt="" />
          <img onClick={signInFacebook} className="icon-width" src={facebookIcon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Register;
