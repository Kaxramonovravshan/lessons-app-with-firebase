import React, { useEffect } from "react";
import { useState } from "react";
import Rodal from "rodal";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { firestore } from "../../utils/firebase.config";

const Home = () => {
  const [lessons, setLessonss] = useState([]);
  const [currentLesson, setCurrentLesson] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [inpValue, setInpValue] = useState("");
  const [newVideo, setNewVideo] = useState([]);
  const [currentItem, setCurrentItem] = useState("");

  useEffect(() => {
    getLessons();
  }, []);

  function getLessons() {
    const refCollection = collection(firestore, "lessons");
    const token = localStorage.getItem("token");
    const q = query(refCollection, where("userID", "==", token));

    getDocs(q).then((res) => {
      let arr = res.docs.map((itm) => {
        return { ...itm.data(), id: itm.id };
      });

      setLessonss(arr);
    });
  }

  function openVideo(i) {
    setCurrentLesson(i);
    setIsOpen(!isOpen);
  }

  function saveVideo() {
    newVideo.push({
      vName: "",
      vLink: ""
    });
    setNewVideo([...newVideo]);
  }

  function saveValue(e, i) {
    newVideo[i].vName = e.target.value;
    setNewVideo([...newVideo]);
  }
  function saveValue2(e, i) {
    newVideo[i].vLink = e.target.value;
    setNewVideo([...newVideo]);
  }

  function saveLesson() {
    const id = localStorage.getItem("token");

    if (currentItem === "") {
      const refCollection = collection(firestore, "lessons");
      addDoc(refCollection, {
        name: inpValue,
        userID: id,
        video: newVideo,
        dislikeCount:0,
        likeCount:0
      }).then((res) => {
        getLessons();
      });
    } else {
      const refCollection = collection(firestore, "lessons");
      const oneUser = doc(refCollection, currentItem);
      updateDoc(oneUser, { name: inpValue, video: newVideo }).then((res) => {
        getLessons();
      });
      setCurrentItem("");
    }
    setInpValue("");
    setNewVideo([]);
    setSaveModal(!saveModal);
  }

  function delItem(id) {
    const refCollection = collection(firestore, "lessons");
    const oneUser = doc(refCollection, id);
    deleteDoc(oneUser).then((res) => {
      getLessons();
    });
  }

  function editItem(itm) {
    setCurrentItem(itm.id);
    setSaveModal(!saveModal);
    setNewVideo(itm.video);
    setInpValue(itm.name);
  }

  function deleteInp(i) {
    newVideo.splice(i, 1);
    setNewVideo([...newVideo]);
  }

  return (
    <div>
      <div className="w-50 mx-auto d-flex justify-content-end mb-2">
        <button
          onClick={() => setSaveModal(!saveModal)}
          className="btn my-btn_ btn-success w-25 "
        >
          +
        </button>
      </div>

      <div className="p-4 d-flex f-box_ gap-3 flex-wrap w-100 container">
        {lessons.map((itm, i) => {
          return (
            <div
              onDoubleClick={() => editItem(itm)}
              className="border p-2 _box"
              key={itm.id}
            >
              <h5 className="text-center">{itm.name}</h5>
              <h6 className="text-center mb-3">
                В этом уроке{" "}
                <span className="text-danger">{itm.video.length}</span> видео
              </h6>
              <p onClick={() => openVideo(i)} className="text-primary">
                посмотреть видео
              </p>
              <button
                onClick={() => delItem(itm.id)}
                className="btn btn-danger"
              >
                Удалить урок
              </button>
            </div>
          );
        })}
      </div>
      <Rodal
        width={600}
        height={300}
        visible={isOpen}
        onClose={() => setIsOpen(!isOpen)}
      >
        <div className="py-4">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>имя</th>
                <th>ссылка</th>
              </tr>
            </thead>
            <tbody>
              {lessons[currentLesson]?.video.map((itm, i) => {
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

      <Rodal
        width={500}
        height={300}
        visible={saveModal}
        onClose={() => setSaveModal(!saveModal)}
      >
        <div className="d-flex flex-column gap-2 py-4">
          <input
            value={inpValue}
            onChange={(e) => setInpValue(e.target.value)}
            className="form-control"
            type="text"
            placeholder="имя урока"
          />

          {newVideo.map((itm, i) => {
            return (
              <div key={i} className="mb-2 d-flex gap-2">
                <input
                  value={newVideo[i].vName}
                  onChange={(e) => saveValue(e, i)}
                  className="form-control"
                  placeholder="имя видео"
                  type="text"
                />
                <input
                  value={newVideo[i].vLink}
                  onChange={(e) => saveValue2(e, i)}
                  className="form-control "
                  placeholder="ссылка видео"
                  type="text"
                />
                <button onClick={() => deleteInp(i)} className="btn btn-danger">
                  X
                </button>
              </div>
            );
          })}

          <button onClick={saveVideo} className="btn btn-dark w-50">
            добавить видео
          </button>
          <button
            onClick={saveLesson}
            className="btn btn-success w-50 d-block mx-auto"
          >
            сохранить
          </button>
        </div>
      </Rodal>
    </div>
  );
};

export default Home;
