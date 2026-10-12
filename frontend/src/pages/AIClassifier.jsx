import { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Recycle, LoaderCircle, X } from "lucide-react";
import { classifyWaste } from "../services/classifierService";
import "../style/classifier.css";

export default function AIClassifier() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClassify = async () => {
    if (!file) {
      setError("Please upload a waste image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await classifyWaste(file);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Classification failed. Check your backend endpoint and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classifier-page">
      <header className="classifier-header">
        <div>
          <h1>AI Waste Classifier</h1>
          <p>Upload a waste image to classify it.</p>
        </div>
      </header>

      <div className="classifier-content-grid">
        <section className="classifier-panel">
          <h2>
            <ImageIcon size={20} /> Upload Waste Image
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          {!preview ? (
            <button
              type="button"
              className="classifier-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={36} />
              <strong>Choose an image</strong>
              <span>JPG, PNG or WEBP · Maximum 10 MB</span>
            </button>
          ) : (
            <div className="classifier-preview">
              <img src={preview} alt="Selected waste" />
              <button
                type="button"
                className="classifier-clear-button"
                onClick={clearImage}
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
              <p>{file?.name}</p>
            </div>
          )}

          {error && <p className="classifier-error">{error}</p>}

          <div className="classifier-actions">
            <button
              type="button"
              className="classifier-primary-button"
              onClick={handleClassify}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="classifier-spinner" />
                  Classifying...
                </>
              ) : (
                <>
                  <Recycle size={18} />
                  Classify Waste
                </>
              )}
            </button>

            {preview && (
              <button
                type="button"
                className="classifier-secondary-button"
                onClick={clearImage}
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <section className="classifier-panel classifier-result-panel">
          <h2>Classification Result</h2>

          {!result && !loading && (
            <div className="classifier-empty-result">
              <Recycle size={40} />
              <h3>Ready to classify</h3>
              <p>Your prediction will appear here after image analysis.</p>
            </div>
          )}

          {loading && (
            <div className="classifier-loading">
              <LoaderCircle size={32} className="classifier-spinner" />
              <p>Analyzing your image...</p>
            </div>
          )}

          {result && (
            <div className="classifier-result">
              <span className="classifier-result-label">Predicted category</span>
              <h3>
                {result.category ||
                  result.class_name ||
                  result.prediction ||
                  "Unknown"}
              </h3>

              {result.confidence != null && (
                <p>
                  Confidence:{" "}
                  {`${Math.round(
                    Number(result.confidence) <= 1
                      ? Number(result.confidence) * 100
                      : Number(result.confidence)
                  )}%`}
                </p>
              )}

              {result.disposal_advice && (
                <div className="classifier-advice">
                  <strong>Disposal advice</strong>
                  <p>{result.disposal_advice}</p>
                </div>
              )}

              {result.message && <p>{result.message}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
