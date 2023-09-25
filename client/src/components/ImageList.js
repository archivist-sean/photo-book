import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);
  const imgList = images.map((image) => (
    <img
      key={image.key}
      style={{ width: "100%", margin: "10px auto" }}
      src={`http://localhost:5001/uploads/${image.key}`}
    />
  ));
  return <div>{imgList}</div>;
};

export default ImageList;
