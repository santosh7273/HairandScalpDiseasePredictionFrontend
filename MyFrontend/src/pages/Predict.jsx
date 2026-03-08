import React, { useState, useRef } from "react";

const Predict = () => {

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/predict_disease_and_give_assistance",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // RESET FUNCTION
  const handleReset = () => {

    setImage(null);
    setResult(null);
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>

      <h2>Hair & Scalp Disease Prediction</h2>

      <form onSubmit={handleSubmit}>

        <label htmlFor="image-upload">Upload the Image</label>

        <input
          type="file"
          id="image-upload"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <br /><br />

        <button type="submit">Predict</button>

        <button type="button" onClick={handleReset} style={{marginLeft:"10px"}}>
          Reset
        </button>

      </form>

      {loading && <p>Analyzing image...</p>}

      {result && (
        <div>

          <h3>Prediction Result</h3>

          {Object.entries(result).map(([key, value]) => (
            <p key={key}>
              <b>{key.replaceAll("_"," ").toUpperCase()}:</b> {value}
            </p>
          ))}

        </div>
      )}

    </div>
  );
};

export default Predict;