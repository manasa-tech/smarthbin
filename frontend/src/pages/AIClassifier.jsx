import { useRef, useState } from "react";
import {
  Upload, ImagePlus, ScanSearch, Recycle, Leaf, Trash2, ShieldAlert,
  CheckCircle2, Clock3, Search, FileImage, X, ArrowRight, Sparkles,
  RotateCcw, TrendingUp, PackageCheck
} from "lucide-react";
import "./ai-classifier.css";

const categories = [
  { name: "Plastic", count: 42, color: "#15994d" },
  { name: "Paper", count: 28, color: "#4f8df7" },
  { name: "Organic", count: 18, color: "#f5a623" },
  { name: "Metal", count: 12, color: "#9b7bea" },
];

const historySeed = [
  { name: "Plastic bottle", category: "Plastic", confidence: 98, time: "Today, 10:42 AM", color: "plastic", icon: "♻" },
  { name: "Cardboard box", category: "Paper", confidence: 96, time: "Today, 10:18 AM", color: "paper", icon: "▤" },
  { name: "Food scraps", category: "Organic", confidence: 94, time: "Today, 09:56 AM", color: "organic", icon: "♧" },
  { name: "Aluminium can", category: "Metal", confidence: 97, time: "Today, 09:31 AM", color: "metal", icon: "◉" },
];

function recommendation(category) {
  const data = {
    Plastic: { icon: Recycle, title: "Recyclable waste", text: "Empty and rinse the container. Place it in the designated dry-recyclables bin.", bin: "Blue / dry waste bin", color: "green" },
    Paper: { icon: PackageCheck, title: "Paper recycling", text: "Keep paper and cardboard dry and clean. Flatten boxes before disposal.", bin: "Paper recycling bin", color: "blue" },
    Organic: { icon: Leaf, title: "Compostable waste", text: "Separate food scraps from packaging and send them for composting.", bin: "Green / wet waste bin", color: "yellow" },
    Metal: { icon: Recycle, title: "Recyclable metal", text: "Empty the container and place it with other recyclable metal items.", bin: "Dry recycling bin", color: "purple" },
    General: { icon: Trash2, title: "General waste", text: "Keep this item separate from recyclable materials unless local guidance says otherwise.", bin: "General waste bin", color: "gray" },
  };
  return data[category] || data.General;
}

export default function AIClassifier() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState(historySeed);
  const [error, setError] = useState("");

  function chooseFile(selected) {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file such as JPG, PNG, or WEBP.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB.");
      return;
    }
    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  }

  function classifyImage() {
    if (!file) {
      setError("Upload a waste image first.");
      return;
    }
    // Demo-only result. Replace this block with your AI backend API call.
    const demo = {
      category: "Plastic",
      confidence: 98,
      object: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") || "Uploaded item",
    };
    setResult(demo);
    setHistory((old) => [
      { name: demo.object, category: demo.category, confidence: demo.confidence, time: "Just now", color: "plastic", icon: "♻" },
      ...old,
    ].slice(0, 5));
  }

  function resetUpload() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const advice = result ? recommendation(result.category) : null;
  const AdviceIcon = advice?.icon;
  const filteredHistory = history.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="aic-page">
      <div className="aic-breadcrumb"><span>SmartBin</span><span>›</span><strong>AI Waste Classifier</strong></div>

      <header className="aic-heading">
        <div className="aic-heading-icon"><ScanSearch size={28} /></div>
        <div className="aic-heading-copy">
          <h1>AI Waste Classifier</h1>
          <p>Identify waste types instantly and get smarter disposal recommendations.</p>
        </div>
        <div className="aic-status"><span /> AI Classification <b>Demo</b></div>
      </header>

      <section className="aic-stats">
        <article className="aic-stat"><div className="aic-stat-icon aic-green"><ScanSearch /></div><div><small>Total Classifications</small><strong>{128 + history.length - historySeed.length}</strong><span>Images processed</span></div></article>
        <article className="aic-stat"><div className="aic-stat-icon aic-blue"><CheckCircle2 /></div><div><small>Model Accuracy</small><strong>96.8%</strong><span>Demo metric</span></div></article>
        <article className="aic-stat"><div className="aic-stat-icon aic-yellow"><Clock3 /></div><div><small>Avg. Processing Time</small><strong>1.2s</strong><span>Illustrative estimate</span></div></article>
        <article className="aic-stat"><div className="aic-stat-icon aic-purple"><Recycle /></div><div><small>Recyclable Identified</small><strong>70%</strong><span>Sample distribution</span></div></article>
      </section>

      <section className="aic-main-grid">
        <article className="aic-card aic-upload-card">
          <div className="aic-card-heading"><div><h2>Upload Waste Image</h2><p>Choose a clear photo of one waste item.</p></div><span className="aic-step">STEP 01</span></div>

          {!preview ? (
            <button className="aic-dropzone" onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); chooseFile(e.dataTransfer.files?.[0]); }}>
              <span className="aic-upload-icon"><ImagePlus size={29} /></span>
              <strong>Drag and drop your image here</strong>
              <span>or click to browse files</span>
              <span className="aic-file-types">JPG, PNG, WEBP · Maximum 10 MB</span>
              <span className="aic-browse"><Upload size={16} /> Choose Image</span>
            </button>
          ) : (
            <div className="aic-preview">
              <img src={preview} alt="Selected waste for classification" />
              <button className="aic-remove" onClick={resetUpload} aria-label="Remove image"><X size={18}/></button>
              <div className="aic-file-name"><FileImage size={16}/><span>{file?.name}</span></div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => chooseFile(e.target.files?.[0])} />
          {error && <p className="aic-error">{error}</p>}
          <div className="aic-upload-actions">
            <button className="aic-secondary" onClick={resetUpload}><RotateCcw size={15}/> Reset</button>
            <button className="aic-primary" onClick={classifyImage}><Sparkles size={16}/> Classify Waste <ArrowRight size={16}/></button>
          </div>
          <div className="aic-privacy"><ShieldAlert size={15}/> Demo mode: classification output is simulated, not AI-generated.</div>
        </article>

        <article className="aic-card aic-result-card">
          <div className="aic-card-heading"><div><h2>Classification Result</h2><p>Predicted category and disposal advice.</p></div><span className="aic-step">STEP 02</span></div>
          {result ? (
            <div className="aic-result-content">
              <div className="aic-result-banner"><span className="aic-result-symbol"><Recycle size={28}/></span><div><small>DETECTED CATEGORY</small><h3>{result.category} Waste</h3><p>{result.object}</p></div><span className="aic-confidence">{result.confidence}%<small>confidence*</small></span></div>
              <div className="aic-confidence-track"><span style={{width:`${result.confidence}%`}}/></div>
              <div className={`aic-advice aic-advice-${advice.color}`}><div className="aic-advice-icon"><AdviceIcon size={21}/></div><div><strong>{advice.title}</strong><p>{advice.text}</p><small>Recommended: {advice.bin}</small></div></div>
              <p className="aic-demo-note">*Demo score for UI preview; verify results with a connected model.</p>
            </div>
          ) : (
            <div className="aic-empty-result"><div className="aic-empty-icon"><ScanSearch size={35}/></div><strong>Your result will appear here</strong><p>Upload a waste image, then select <b>Classify Waste</b> to preview the result layout.</p><div className="aic-empty-tags"><span>Category</span><span>Confidence</span><span>Disposal tips</span></div></div>
          )}
        </article>
      </section>

      <section className="aic-analytics-grid">
        <article className="aic-card aic-category-card">
          <div className="aic-card-heading"><div><h2>Waste Category Distribution</h2><p>Example breakdown of recent classifications.</p></div><span className="aic-mini-label">SAMPLE</span></div>
          <div className="aic-category-content">
            <div className="aic-donut"><div><strong>100</strong><span>Items</span></div></div>
            <div className="aic-category-list">{categories.map((c) => <div className="aic-category-row" key={c.name}><span><i style={{background:c.color}}/>{c.name}</span><b>{c.count}%</b><div><i style={{width:`${c.count}%`,background:c.color}}/></div></div>)}</div>
          </div>
        </article>
        <article className="aic-card aic-performance-card">
          <div className="aic-card-heading"><div><h2>Classifier Performance</h2><p>Illustrative weekly confidence trend.</p></div><span className="aic-trend"><TrendingUp size={15}/> +4.2%</span></div>
          <div className="aic-performance"><div className="aic-chart-y"><span>100%</span><span>90%</span><span>80%</span><span>70%</span></div><div className="aic-chart-area"><div className="aic-gridline"/><div className="aic-gridline"/><div className="aic-gridline"/><div className="aic-gridline"/><svg viewBox="0 0 400 130" preserveAspectRatio="none" role="img" aria-label="Illustrative confidence trend line"><defs><linearGradient id="aicFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#15994d" stopOpacity=".22"/><stop offset="100%" stopColor="#15994d" stopOpacity="0"/></linearGradient></defs><path d="M0 90 L65 70 L130 77 L195 45 L260 52 L330 26 L400 17 L400 130 L0 130Z" fill="url(#aicFill)"/><polyline points="0,90 65,70 130,77 195,45 260,52 330,26 400,17" fill="none" stroke="#15994d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>{[[0,90],[65,70],[130,77],[195,45],[260,52],[330,26],[400,17]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4" fill="#fff" stroke="#15994d" strokeWidth="2"/>)}</svg><div className="aic-chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div>
          <div className="aic-performance-footer"><span>Average confidence</span><strong>96.8%</strong></div>
        </article>
      </section>

      <section className="aic-card aic-history-card">
        <div className="aic-card-heading aic-history-heading"><div><h2>Recent Classifications</h2><p>Latest image classification activity.</p></div><label className="aic-history-search"><Search size={15}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search classifications"/></label></div>
        <div className="aic-table-wrap"><table className="aic-table"><thead><tr><th>ITEM</th><th>CATEGORY</th><th>CONFIDENCE</th><th>TIME</th><th>STATUS</th></tr></thead><tbody>{filteredHistory.map((item,index)=><tr key={`${item.name}-${index}`}><td><span className={`aic-item-icon ${item.color}`}>{item.icon}</span><strong>{item.name}</strong></td><td><span className={`aic-category-pill ${item.color}`}>{item.category}</span></td><td><div className="aic-table-confidence"><span>{item.confidence}%</span><i><b style={{width:`${item.confidence}%`}}/></i></div></td><td>{item.time}</td><td><span className="aic-complete"><CheckCircle2 size={14}/> Complete</span></td></tr>)}</tbody></table>{filteredHistory.length===0&&<p className="aic-no-results">No matching classifications.</p>}</div>
        <div className="aic-history-footer">Showing {filteredHistory.length} of {history.length} records <span>Sample records are for demonstration only.</span></div>
      </section>
      <footer className="aic-footer"><span><i/> Classifier interface ready</span><span>SmartBin AI · Sample analytics</span></footer>
    </div>
  );
}
