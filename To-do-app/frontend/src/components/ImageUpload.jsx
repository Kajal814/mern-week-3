
import { useState } from "react";
import api from "../services/api";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Select an image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  // Upload image to backend
  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const response = await api.post("/upload", formData);

      setPreview(`http://localhost:5000${response.data.image.path}`);
      setMessage("Image uploaded successfully!");
      setImage(null);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Image upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {preview && (
        <img
          src={preview}
          alt="Selected preview"
          width="200"
        />
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ImageUpload;
