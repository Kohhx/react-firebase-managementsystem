import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useFirestoreImage } from "../hooks/useFirestoreImage";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiSolidCloudUpload } from "react-icons/bi";
import { toast } from "react-toastify";
import { MdAddPhotoAlternate } from "react-icons/md";
import { AiFillMinusCircle } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { CSSTransition } from "react-transition-group";
import { BsThreeDotsVertical } from "react-icons/bs";
import Modal from "../components/Modal";
import { AiFillLeftCircle } from "react-icons/ai";
import { AiFillRightCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import { projectStorage } from "../firebase/config";
import "./PhotoList.css";

const PhotoList = () => {
  const addPhotoRef = useRef(null);
  const { user } = useAuthContext();
  const [images, setImages] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileData, setFileData] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const { addImageDocument, getAllImages, isPending, deleteImage } =
    useFirestoreImage(user.uid, "images");
  console.log(addImageDocument);
  const { register, handleSubmit, watch, errors } = useForm();
  const [dotMenu, setDotMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imagesLength, setImagesLength] = useState(-1);
  const [blobUrl, setBlobUrl] = useState(null);
  const downloadLinkRef = useRef(null);

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex((prev) => prev - 1);
    }
  };
  const nextImage = () => {
    if (selectedImageIndex < imagesLength - 1) {
      setSelectedImageIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    getAllImages().then((data) => {
      setImages(data);
      setImagesLength(data.length);
    });
  }, []);

  console.log(images);

  const handleFormSubmit = async (data) => {
    const imgDoc = {
      caption: data.caption,
      imageFile: fileData || null,
      imageDate: new Date(data.imageDate),
    };

    await addImageDocument(imgDoc);

    getAllImages().then((data) => {
      setImages(data);
    });
  };

  const deletePhoto = (image) => {
    deleteImage(image.id).then(() => {
      getAllImages().then((data) => {
        setImages(data);
        setImagesLength(data.length);
      });
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // check if file exist
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType !== "jpeg" && fileType !== "png" && fileType !== "jpg") {
      toast.error("Only jpeg, png and jpg file types are allowed.");
      return false;
    }

    // Set File
    setFileData(file);

    console.log(file);

    // Set File URL
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const arrowContent = (
    <>
      <AiFillLeftCircle className="arrow-icon arrow-prev" onClick={prevImage} />
      <AiFillRightCircle
        className="arrow-icon arrow-next"
        onClick={nextImage}
      />
    </>
  );

  const downloadFile = async (image) => {
    const imageRef = projectStorage.ref(image.imgId);
    const name = imageRef.name;
    const downloadURL = await imageRef.getDownloadURL();
    console.log(downloadURL);
    const response = await fetch(downloadURL, {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    });
    const file = await response.blob();
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name; // Specify the desired filename for the downloaded image
    link.click();
    link.remove();
  };

  const imagesList = images.map((image, index) => (
    <div
      className="image-card cursor-pointer"
      onMouseLeave={() => setDotMenu(false)}
      onClick={() => {
        setSelectedImageIndex(index);
        setOpenModal(true);
      }}
    >
      <span
        className="dot-container"
        onClick={(e) => {
          e.stopPropagation();
          setDotMenu(!dotMenu);
        }}
      >
        <BsThreeDotsVertical className="dot-options" />
        {dotMenu && (
          <div className="dot-menu">
            <p onClick={() => deletePhoto(image)} className="border-b">Delete</p>
            <button onClick={() => downloadFile(image)}>Download</button>
          </div>
        )}
      </span>

      <img src={image.imgUrl} className="photo" alt="" loading="lazy" />
      <div className="caption-box">
        <p>{image.caption}</p>
      </div>
    </div>
  ));

  return (
    <div className="gallery-container flex flex-col gap-5">
      <Modal
        arrow={
          <>
            <AiFillLeftCircle
              className="arrow-icon arrow-prev"
              onClick={prevImage}
            />
            <AiFillRightCircle
              className="arrow-icon arrow-next"
              onClick={nextImage}
            />
          </>
        }
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
      >
        <div className="modal-children-content">
          <img
            height={"600px"}
            width="600px"
            src={images[selectedImageIndex]?.imgUrl}
            alt="image"
          />
          <div className="modal-caption">
            <span>{images[selectedImageIndex]?.caption}</span>
          </div>
        </div>
      </Modal>
      <div className="create-initial-container">
        {openCreate ? (
          <AiFillMinusCircle
            className="minimize-icon"
            onClick={() => setOpenCreate(false)}
          />
        ) : (
          <AiFillPlusCircle
            className="maximize-icon"
            onClick={() => setOpenCreate(true)}
          />
        )}
        <CSSTransition
          in={openCreate}
          timeout={200}
          classNames="growc"
          unmountOnExit
          appear
        >
          <div className="create-container">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div>
                <div className="flex gap-5">
                  <textarea
                    className="caption-area"
                    {...register("caption")}
                    placeholder="Enter a caption"
                  ></textarea>
                  <div className="center-line"></div>
                  <div className="image-preview-container flex items-center justify-center">
                    {fileUrl ? (
                      <div className="image-preview">
                        <img className="image-preview" src={fileUrl} alt="" />
                      </div>
                    ) : (
                      <div className="text-center">
                        <BiSolidCloudUpload className="upload-icon mx-auto" />
                        <p className="upload-text">Upload image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="horizontal-line"></div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => addPhotoRef.current.click()}
                  type="button"
                  className="add-photo-button flex items-center mr-10 py-[10px]"
                >
                  <MdAddPhotoAlternate className="add-photo-icon" />
                  <span>Add Photo</span>
                </button>
                <input
                  {...register("imageFile")}
                  onChange={handleFileChange}
                  type="file"
                  ref={addPhotoRef}
                  hidden
                />
                {/* </div> */}
                <div>
                  <input
                    className="date-input"
                    {...register("imageDate")}
                    type="date"
                  />
                </div>
                <button className="add-photo" type="submit">
                  <span>Add photo</span>
                </button>
              </div>
            </form>
          </div>
        </CSSTransition>
      </div>

      {isPending ? (
        <h1>Loading</h1>
      ) : (
        <div className="gallery-grid">{imagesList}</div>
      )}
    </div>
  );
};

export default PhotoList;
