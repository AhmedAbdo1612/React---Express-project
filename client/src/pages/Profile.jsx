/* eslint-disable no-unused-vars */
import React from "react";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import UserListings from './UserListings'

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user)[
    "user"
  ];
  const [file, setFile] = useState(undefined);
  const [fileUploadPer, setFileUploadPer] = useState(null);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const dispatch = useDispatch();
  const [userListings, setUserListings] = useState([])

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  }
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  async function handleFileUpload(file) {
    setFileUploadErr(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPer(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
        setFileUploadErr(false);
      }
    );
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.message));
      setUpdateSuccess(true);
    } catch (error) {
      updateUserFailure(error.message);
    }
  }
  async function handleDeleteAccount() {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function handleSignout() {
    try {
      dispatch(signOutUserStart);
      const res = await fetch("/api/users/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
  async function handleShowListings() {
    try {
      const res = await fetch(`/api/users/listings/${currentUser.id}`)
      const data = await res.json()
      if (data.success === false) return 
      setUserListings(data)
    } catch (error) {}
  }

  return (
    <div className="max-w-lg mx-auto ">
      <h1 className="text-center font-bold my-11 text-4xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="mt-5 rounded-full w-[150px] h-[150px]
             self-center p-5 cursor-pointer object-cover"
          src={formData.avatar || currentUser.avatar}
          alt="user"
        />
        <p className="flex justify-center">
          {fileUploadErr ? (
            <span className="text-red-800 font-semibold">
              Erro Image Upload
            </span>
          ) : (
            ""
          )}
          {fileUploadPer > 0 && fileUploadPer < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileUploadPer}%`}</span>
          ) : (
            ""
          )}
          {fileUploadPer === 100 ? (
            <span className="text-green-700 self-center">
              Image Uploaded Successfully!
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          onChange={handleChange}
          placeholder="username"
          className="border p-3 rounded-lg"
          name="username"
          defaultValue={currentUser.username}
        />

        <input
          onChange={handleChange}
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          name="email"
          defaultValue={currentUser.email}
        />

        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          name="password"
          className="border p-3 rounded-lg"
        />

        <button
          className="bg-slate-700 p-4 rounded-lg
             text-white font-semibold
              hover:bg-slate-500 
              disabled:opacity-95"
        >
          Update
        </button>
        <Link
          className="text-center mt-5 rounded-lg
         text-white bg-green-600 py-4
         hover:opacity-90"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 p-5 text-center text-3xl">
        {error ? error : ""}
      </p>
      {updateSuccess && (
        <p className="text-green-700 p-5 text-center text-3xl">
          User is updated successfully!
        </p>
      )}
      <button
        onClick={handleShowListings}
        className="text-green-700 font-semibold w-full text-xl hover:"
      >
        Show Listings
      </button>
      {userListings.length>0 && <UserListings listings = {userListings}/>}
    </div>
  );
}
