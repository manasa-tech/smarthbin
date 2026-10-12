import { useState } from "react";
import {
  Leaf,
  Recycle,
  Trash2,
  Droplets,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../../style/disposalTip.css";

const DEFAULT_TIPS = [
  {
    title: "Separate waste correctly",
    description:
      "Keep recyclable, organic, and general waste separate according to local collection rules.",
    icon: Recycle,
  },
  {
    title: "Reduce contamination",
    description:
      "Empty food and liquid residues from recyclable containers when local guidelines require it.",
    icon: Droplets,
  },
  {
    title: "Choose reusable alternatives",
    description:
      "Reduce single-use products and reuse items whenever practical.",
    icon: Leaf,
  },
];

export default function DisposalTip({
  category = "General Waste",
  recommendation = "",
  tips = DEFAULT_TIPS,
}) {
  const [expanded, setExpanded] = useState(true);

  const normalizedCategory = String(category).toLowerCase();

  const categoryTip = normalizedCategory.includes("organic") ||
    normalizedCategory.includes("food")
    ? "Keep food scraps separate for composting where facilities are available."
    : normalizedCategory.includes("plastic") ||
      normalizedCategory.includes("paper") ||
      normalizedCategory.includes("glass") ||
      normalizedCategory.includes("metal") ||
      normalizedCategory.includes("recycl")
    ? "Check local recycling rules and sort this item into the appropriate recycling stream."
    : "Follow local waste collection guidelines for safe disposal.";

  return (
    <section className="disposal-tip">
      <button
        type="button"
        className="disposal-tip-header"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <span className="disposal-tip-heading-icon">
          <Lightbulb size={21} />
        </span>

        <span className="disposal-tip-heading-text">
          <strong>Smart Disposal Tips</strong>
          <small>Make waste management greener</small>
        </span>

        {expanded ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
      </button>

      {expanded && (
        <div className="disposal-tip-content">
          <div className="disposal-tip-recommendation">
            <span className="disposal-tip-category">
              <Trash2 size={15} />
              {category}
            </span>
            <p>{recommendation || categoryTip}</p>
          </div>

          <div className="disposal-tip-list">
            {tips.map((tip, index) => {
              const TipIcon = tip.icon || Leaf;

              return (
                <div className="disposal-tip-item" key={`${tip.title}-${index}`}>
                  <span className="disposal-tip-item-icon">
                    <TipIcon size={18} />
                  </span>
                  <div>
                    <strong>{tip.title}</strong>
                    <p>{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="disposal-tip-footer">
            <Leaf size={16} />
            <span>Small actions create a cleaner environment.</span>
          </div>
        </div>
      )}
    </section>
  );
}
