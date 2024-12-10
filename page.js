"use client";
import React, { useState } from "react";
import Pica from "pica";
import imageCompression from "browser-image-compression"; 

// CompressImagePage Component for Image Compression
const CompressImagePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState("");


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const compressedFile = await compressImage(selectedFile);
      const compressedImageUrl = URL.createObjectURL(compressedFile);
      setCompressedImageUrl(compressedImageUrl);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("An error occurred during the compression.");
    }
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 1, 
        maxWidthOrHeight: 800, 
        useWebWorker: true, 
      };
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      throw error;
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Compress Image</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Compress</button>

      {compressedImageUrl && (
        <div>
          <h2>Compressed Image:</h2>
          <img
            src={compressedImageUrl}
            alt="Compressed"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <a href={compressedImageUrl} download="compressed-image.jpg">
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
};

// Home Component with PNG Conversion and Image Compression
export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const image = await convertToPng(selectedFile);
      const imageUrl = URL.createObjectURL(image);
      setConvertedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error converting image:", error);
      alert("An error occurred during the conversion.");
    }
  };

  const convertToPng = async (file) => {
    const pica = new Pica();
    const canvas = document.createElement("canvas");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        try {
          const resizedCanvas = await pica.resize(img, canvas);
          const blob = await pica.toBlob(resizedCanvas, "image/png");
          resolve(blob);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Convert Image to PNG</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Convert</button>
      {convertedImageUrl && (
        <div>
          <h2>Converted Image:</h2>
          <img
            src={convertedImageUrl}
            alt="Converted"
            style={{ maxWidth: "40%", height: "auto" }}
          />
          <a href={convertedImageUrl} download="converted-image.png">
            Download Image
          </a>
        </div>
      )}

      {/* Compress Image Component */}
      <CompressImagePage />
    </div>
  );
}
