import {
  CheckCircle2,
  Recycle,
  AlertTriangle,
  Trash2,
  Leaf,
  Info,
} from "lucide-react";
import "../../style/classifierResult.css";

export default function ClassifierResult({
  result,
  loading = false,
  error = "",
  onReset,
}) {
  if (loading) {
    return (
      <section className="classifier-result classifier-result-loading">
        <div className="classifier-result-spinner" />
        <h3>Analyzing your waste...</h3>
        <p>Our AI is identifying the waste category.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classifier-result classifier-result-error">
        <AlertTriangle size={28} />
        <h3>Classification failed</h3>
        <p>{error}</p>
        {onReset && (
          <button type="button" onClick={onReset}>
            Try Again
          </button>
        )}
      </section>
    );
  }

  if (!result) return null;

  const category =
    result.category ??
    result.predicted_class ??
    result.class_name ??
    result.label ??
    "Unknown";

  const confidence = Number(
    result.confidence ?? result.confidence_score ?? 0
  );

  const confidencePercent = Math.min(
    100,
    Math.max(0, confidence <= 1 ? confidence * 100 : confidence)
  );

  const categoryText = String(category).toLowerCase();

  const isRecyclable =
    categoryText.includes("recycl") ||
    categoryText.includes("plastic") ||
    categoryText.includes("paper") ||
    categoryText.includes("metal") ||
    categoryText.includes("glass");

  const isOrganic =
    categoryText.includes("organic") ||
    categoryText.includes("food") ||
    categoryText.includes("compost");

  const CategoryIcon = isOrganic
    ? Leaf
    : isRecyclable
      ? Recycle
      : Trash2;

  const recommendation =
    result.recommendation ??
    result.disposal_recommendation ??
    result.disposal_tip ??
    (isOrganic
      ? "Place this waste in the organic waste bin for composting, where accepted."
      : isRecyclable
        ? "Check local recycling rules and place this item in the appropriate recycling bin."
        : "Place this waste in the appropriate general waste bin according to local guidelines.");

  return (
    <section className="classifier-result">
      <div className="classifier-result-header">
        <div className="classifier-result-heading">
          <CheckCircle2 size={21} />
          <h3>Classification Result</h3>
        </div>

        <span className="classifier-result-badge">AI Analysis</span>
      </div>

      <div className="classifier-result-category">
        <div className={`classifier-result-category-icon ${isOrganic ? "organic" : isRecyclable ? "recyclable" : "general"}`}>
          <CategoryIcon size={30} />
        </div>

        <div className="classifier-result-category-info">
          <span>Detected Category</span>
          <h2>{String(category).replace(/[_-]/g, " ")}</h2>
        </div>
      </div>

      <div className="classifier-result-confidence">
        <div className="classifier-result-confidence-label">
          <span>Confidence Score</span>
          <strong>{confidencePercent.toFixed(1)}%</strong>
        </div>

        <div
          className="classifier-result-confidence-track"
          role="progressbar"
          aria-label="Classification confidence"
          aria-valuenow={Math.round(confidencePercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="classifier-result-confidence-fill"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      <div className="classifier-result-recommendation">
        <Info size={19} />
        <div>
          <strong>Disposal Recommendation</strong>
          <p>{recommendation}</p>
        </div>
      </div>

      {result.message && (
        <p className="classifier-result-message">{result.message}</p>
      )}

      {onReset && (
        <button
          type="button"
          className="classifier-result-reset"
          onClick={onReset}
        >
          Classify Another Image
        </button>
      )}
    </section>
  );
}
