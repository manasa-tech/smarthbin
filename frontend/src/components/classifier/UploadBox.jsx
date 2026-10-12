import { useRef, useState, useEffect } from "react";
import { Upload, ImagePlus, X, FileImage, RefreshCw } from "lucide-react";
import "../../style/uploadBox.css";

export default function UploadBox({
  onFileSelect,
  onClassify,
  loading = false,
  maxSizeMB = 10,
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size must be less than ${maxSizeMB} MB.`);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    onFileSelect?.(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onFileSelect?.(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="upload-box">
      <div className="upload-box-heading">
        <span className="upload-box-heading-icon">
          <ImagePlus size={21} />
        </span>
        <div>
          <h3>Upload Waste Image</h3>
          <p>Upload an image for AI waste classification</p>
        </div>
      </div>

      <input
        ref={inputRef}
        className="upload-box-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Choose a waste image"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />

      {!preview ? (
        <button
          type="button"
          className={`upload-box-dropzone ${dragging ? "is-dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          disabled={loading}
        >
          <span className="upload-box-upload-icon"><Upload size={27} /></span>
          <strong>Drag and drop your image here</strong>
          <span>or click to browse your device</span>
          <span className="upload-box-formats">
            JPG, PNG or WebP · Maximum {maxSizeMB} MB
          </span>
        </button>
      ) : (
        <div className="upload-box-preview">
          <img src={preview} alt="Selected waste" />

          <div className="upload-box-file-info">
            <FileImage size={19} />
            <div>
              <strong>{file?.name}</strong>
              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <button
              type="button"
              className="upload-box-remove"
              aria-label="Remove image"
              onClick={removeFile}
              disabled={loading}
            >
              <X size={18} />
            </button>
          </div>

          <button
            type="button"
            className="upload-box-change"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            <RefreshCw size={15} /> Change image
          </button>
        </div>
      )}

      {error && <p className="upload-box-error">{error}</p>}

      {file && (
        <button
          type="button"
          className="upload-box-classify"
          disabled={loading}
          onClick={() => onClassify?.(file)}
        >
          {loading ? "Analyzing image..." : "Classify Waste"}
        </button>
      )}
    </section>
  );
}
