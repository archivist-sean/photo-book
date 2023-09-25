import React, { useContext, useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const [images, setImages] = useContext(ImageContext);
  const defaultFileName = "이미지 파일을 업로드 해주세요.";
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const imageSelectHandler = (e) => {
    const imageFiles = e.target.files[0];
    setFile(imageFiles);
    setFileName(imageFiles.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFiles);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };
  const onSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          setPercent(
            Math.round((100 * progressEvent.loaded) / progressEvent.total)
          );
        },
      });
      console.log({ res });
      setImages([...images, res.data]);
      toast.success("업로드 완료");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 6000);
    } catch (error) {
      console.error(error);
      toast.error(`업로드 오류 - ${error.message}`);
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 6000);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <img
        src={imgSrc}
        className={`image-preview ${imgSrc && "image-preview-show"}`}
      />
      <ProgressBar percent={percent} />
      <div className="image-dropper">
        {fileName}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          height: "35px",
          cursor: "pointer",
        }}
      >
        업로드
      </button>
    </form>
  );
};

export default UploadForm;
