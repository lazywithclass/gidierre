import React, { useState } from 'react';

export default function MapUpload({ onUploadFinished }) {
  const [file, setFile] = useState(null) // eslint-disable-line
  const [preview, setPreview] = useState(null) // eslint-disable-line

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onUploadFinished(reader.result)
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
