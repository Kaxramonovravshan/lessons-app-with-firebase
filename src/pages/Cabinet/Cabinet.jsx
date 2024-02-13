import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rodal from "rodal";
import { firestore } from "../../utils/firebase.config";

const Cabinet = () => {
  const navigate = useNavigate();
  const userCollection = collection(firestore, "users");
  const postCollection = collection(firestore, "lessons");

  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");
    getDocs(userCollection).then((res) => {
      const arr = res.docs.map((itm) => {
        if (token === itm.data().uid) {
          delete itm.data();
        } else {
          return { ...itm.data(), id: itm.id };
        }
      });
      setUsers(arr);
    });
  }, []);

  function logoutUser() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function showUserLesson(uid) {
    const q = query(postCollection, where("userID", "==", uid));
    getDocs(q).then((res) => {
      const vArr = res.docs.map((itm) => {
        console.log(itm.data());
        return itm.data();
      });
      setVideos(vArr);
    });
  }

  function openVideo(i) {
    setIsOpen(!isOpen);
    setCurrentLesson(i);
  }

  return (
    <div>
      <button onClick={logoutUser} className="btn btn-danger">
        Выход
      </button>
      <div className="col-2 user-box  p-3 ">
            <ul className="list-group overflow-auto">
              {users.map((itm, i) => (
                <li
                  onClick={() => showUserLesson(itm?.uid)}
                  key={i}
                  className="list-group-item"
                >
                  {itm?.username}
                </li>
              ))}
            </ul>
          </div>
      {show ? (
        <div className="row f-box_ mt-3">
          {/* ------------------------------ */}
          
          {/* ----------------------------- */}
          <div className="col-8 my-col p-3">
            {videos.length === 0 ? (
              <h1 className="text-center">
                {" "}
                У этого пользователя нет Уроков !{" "}
              </h1>
            ) : (
              <div className="d-flex f-box_ flex-wrap gap-3 w-100 container">
                {videos.map((itm, i) => {
                  return (
                    <div className="border p-2 _box" key={i}>
                      <h5 className="text-center">{itm.name}</h5>
                      <h6 className="text-center h6 mb-3">
                        В этом уроке{" "}
                        <span className="text-danger">{itm.video.length}</span>{" "}
                        видео
                      </h6>
                      <p onClick={() => openVideo(i)} className="text-primary">
                        посмотреть видео
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      <Rodal visible={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <div className="py-4">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>имя</th>
                <th>ссылка</th>
              </tr>
            </thead>
            <tbody>
              {videos[currentLesson]?.video.map((itm, i) => {
                return (
                  <tr key={i}>
                    <td>{itm.vName}</td>
                    <td>
                      <a target={"_blank"} href={itm.vLink}>
                        {itm.vLink}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Rodal>
    </div>
  );
};

export default Cabinet;
