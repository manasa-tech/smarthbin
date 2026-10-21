import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Recycle,
  Leaf,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import "../styles/classifier.css";

export default function AIClassifier() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");

  function handleImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult("Please choose an image file.");
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
  }

  function classifyWaste() {
    if (!selectedImage) {
      setResult("Please upload a waste image first.");
      return;
    }

    // Demo classification only; connect a trained model/API for real predictions.
    setResult(
      "Image uploaded successfully. Connect your AI classification backend to identify the waste category."
    );
  }

  return (
    <div className="classifier-page">
      <header className="classifier-header">
        <Link to="/dashboard" className="classifier-back">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="classifier-brand">
          <Recycle size={23} />
          <strong>SmartBin AI</strong>
        </div>
      </header>

      <main className="classifier-main">
        <div className="classifier-heading">
          <span>AI-POWERED WASTE MANAGEMENT</span>
          <h1>AI Waste Classifier</h1>
          <p>
            Upload a photo of waste to prepare it for classification and
            responsible disposal.
          </p>
        </div>

        <section className="classifier-card">
          <div className="classifier-card-heading">
            <div className="classifier-heading-icon">
              <Camera size={23} />
            </div>
            <div>
              <h2>Upload waste image</h2>
              <p>Choose a clear image from your device.</p>
            </div>
          </div>

          <label className="classifier-upload">
            {preview ? (
              <img
                className="classifier-preview"
                src={preview}
                alt="Selected waste"
              />
            ) : (
              <>
                <div className="classifier-upload-icon">
                  <ImageIcon size={30} />
                </div>
                <strong>Click to upload an image</strong>
                <span>JPG, PNG, WEBP</span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
            />
          </label>

          <button
            className="classifier-button"
            type="button"
            onClick={classifyWaste}
          >
            <Recycle size={18} />
            Classify Waste
          </button>

          {result && (
            <div className="classifier-result" role="status">
              <CheckCircle2 size={20} />
              <p>{result}</p>
            </div>
          )}
        </section>

        <section className="classifier-categories">
          <h2>Waste categories</h2>
          <p>Learn how common waste categories should be handled.</p>

          <div className="classifier-category-grid">
            <article className="classifier-category">
              <span className="category-icon organic">
                <Leaf size={23} />
              </span>
              <h3>Organic</h3>
              <p>Food scraps and biodegradable waste.</p>
            </article>

            <article className="classifier-category">
              <span className="category-icon recyclable">
                <Recycle size={23} />
              </span>
              <h3>Recyclable</h3>
              <p>Clean paper, cardboard, glass and accepted plastics.</p>
            </article>

            <article className="classifier-category">
              <span className="category-icon general">
                <Trash2 size={23} />
              </span>
              <h3>General waste</h3>
              <p>Waste that cannot be recycled through available local systems.</p>
            </article>
          </div>
        </section>

        <Link to="/nearest-disposal" className="classifier-disposal-link">
          Find a nearby disposal centre →
        </Link>
      </main>
    </div>
  );
}
