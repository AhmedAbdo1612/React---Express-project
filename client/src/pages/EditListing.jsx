import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
export default function CreateListing() {
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    parking: false,
    type: "rent",
    offer: false,
    furnished: false,
    discountPrice: 0,
    regularPrice: 50,
  });

  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user)["user"];
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchListing() {
      const listingId = params.id;
      try {
        const res = await fetch(`/api/listings/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        
        setFormData(data)
      } catch (error) {setError(error.message)}
    }
    fetchListing();
  }, []);
  function handleImagesSubmit(event) {
    event.preventDefault();
    if (files.length + formData.imageUrls.length < 7 && files.length > 0) {
      setImageUploadError(null);
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed, 2MB per image max");
          setUploading(false);
        });
    } else {
      setUploading(false);
      setImageUploadError("You can only upload 6 images per listing");
    }
  }
  async function uploadImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getDate() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot.bytesTransferred / snapshot.totalBytes / 100);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  }
  function handleRemoveImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  }
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "sale" || name === "rent")
        setFormData({ ...formData, ["type"]: name });
      else {
        setFormData({ ...formData, [name]: checked });
      }
      if (name === "offer") setFiles({ ...formData, discountPrice: 0 });
      return;
    }
    if (type == "number") {
      setFormData({ ...formData, [name]: Number(value) });
      return;
    }
    setFormData({ ...formData, [name]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.discountPrice > formData.regularPrice) {
        setError("Regular price must be bigger than discount price");
        return;
      }
      if (formData.imageUrls.length === 0) {
        setError("You must upload at least one image");
        return;
      }
      const res = await fetch(`/api/listings/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser.id }),
      });
      const data = await res.json();
      if (data.success === false) setError(data.message);
      else {
        setError(null);
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="p-3 max-w-7xl mx-auto">
      <h1 className="text-3xl text-center p-5 font-semibold">Update Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            type="text"
            placeholder="name"
            name="name"
            className="rounded-lg p-3"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
          />

          <textarea
            onChange={handleChange}
            type="text"
            placeholder="Description"
            name="description"
            className="rounded-lg p-3"
            required
            value={formData.description}
          />

          <input
            onChange={handleChange}
            type="text"
            placeholder="Address"
            name="address"
            className="rounded-lg p-3"
            minLength="10"
            required
            value={formData.address}
          />
          <div className="flex justify-evenly gap-4 flex-wrap">
            <div className="flex gap-3">
              <input
                onChange={handleChange}
                checked={formData["type"] === "sale" || false}
                type="checkbox"
                name="sale"
                id="sale"
                className="w-6 "
              />
              <label htmlFor="sale" className="font-semibold">
                Sell
              </label>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-6"
                name="rent"
                id="rent"
                checked={formData["type"] === "rent" || false}
                onChange={handleChange}
              />
              <label htmlFor="rent" className="font-semibold">
                Rent
              </label>
            </div>

            <div className="flex gap-3">
              <input
                checked={formData.parking}
                type="checkbox"
                className="w-6"
                name="parking"
                id="parking"
                onChange={handleChange}
              />
              <label htmlFor="parking" className="font-semibold">
                Parking spot
              </label>
            </div>

            <div className="flex gap-3">
              <input
                checked={formData.furnished}
                type="checkbox"
                className="w-6"
                name="furnished"
                id="furnished"
                onChange={handleChange}
              />
              <label htmlFor="furnished" className="font-semibold">
                Furnished
              </label>
            </div>

            <div className="flex gap-3">
              <input
                checked={formData.offer}
                onChange={handleChange}
                type="checkbox"
                className="w-6"
                name="offer"
                id="offer"
              />
              <label htmlFor="offer" className="font-semibold">
                Offer
              </label>
            </div>
          </div>
          <div className="pt-3 flex gap-4 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                onChange={handleChange}
                className="p-3 text-center rounded-lg"
                type="number"
                min="1"
                max="11"
                name="bedrooms"
                required
                defaultValue="1"
                value={formData.bedrooms}
              />
              <span className="font-semibold">Bedrooms</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={handleChange}
                className="p-3 text-center rounded-lg"
                type="number"
                min="1"
                max="11"
                name="bathrooms"
                required
                defaultValue="1"
                value={formData.bathrooms}
              />
              <span className="font-semibold">Baths</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={handleChange}
                className="p-3 text-center rounded-lg "
                type="number"
                min="0"
                name="regularPrice"
                required
                defaultValue="0"
                value={formData.regularPrice}
              />
              <div className="">
                <p className="font-semibold">Regular price</p>
                <span className="text-xs text-center">( $ / Month )</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  onChange={handleChange}
                  className="p-3 text-center rounded-lg"
                  type="number"
                  min="0"
                  name="discountPrice"
                  required
                  defaultValue="0"
                  value={formData.discountPrice}
                />
                <div className="">
                  <p className="font-semibold">Discount price</p>
                  <span className="text-xs text-center">( $ / Month )</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-red-700 font-semibold p-2 mx-auto ">
            {error ? error : ""}
          </p>
        </div>
        <div className="flex flex-col flex-1 gap-4 flex-wrap">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-slate-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="border p-3 border-gray-500 rounded w-full"
              type="file"
              name="images"
              accept="image/*"
              multiple
            />

            <button
              disabled={uploading}
              type="button"
              onClick={handleImagesSubmit}
              className="p-3 text-green-700 border font-bold border-green-700 rounded
                   uppercase hover:bg-green-700 hover:text-white disabled:opacity-80"
            >
              {uploading ? "Uploading...." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="p-3 text-center text-red-700 font-medium">
              {imageUploadError}
            </p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 hover:bg-white hover:border rounded-lg"
                >
                  <img
                    src={url}
                    className="w-20 h-20 rounded-lg object-contain "
                    alt="..."
                  />
                  <button
                    type="button"
                    className="text-red-700 font-semibold 
                      border border-red-700 py-3 px-5 rounded-lg hover:bg-red-700 hover:text-white"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={uploading}
            className=" bg-slate-700 p-4 font-semibold
               text-white rounded-lg uppercase hover:opacity-90"
          >
            Update Listing
          </button>
        </div>
      </form>
    </main>
  );
}
