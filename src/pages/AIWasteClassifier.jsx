import { useRef, useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp, FileText,
  History, Bell, UserRound, Menu, Home, ChevronDown, UploadCloud,
  Image as ImageIcon, Database, Leaf, CheckCircle2, Info, CircleAlert,
  Trash2, Search, Eye, X, LoaderCircle
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import "../styles/ai-waste-classifier.css";

const examples = [
  { name: "Plastic Bottle", category: "Plastic Waste", material: "PET (Polyethylene Terephthalate)", recyclable: "Yes", impact: "Medium", action: "Clean and place in recycling bin", confidence: 98, color: "#1688df", emoji: "🧴" },
  { name: "Food Waste", category: "Organic Waste", material: "Organic material", recyclable: "Compostable", impact: "Low when composted", action: "Place in the organic waste bin", confidence: 96, color: "#e4a319", emoji: "🍌" },
  { name: "Paper", category: "Paper Waste", material: "Paper / cardboard fibre", recyclable: "Yes, if clean and dry", impact: "Low when recycled", action: "Place in the paper recycling bin", confidence: 94, color: "#8e9baa", emoji: "📄" },
  { name: "Glass Bottle", category: "Glass Waste", material: "Glass", recyclable: "Yes", impact: "Low when recycled", action: "Place in the glass recycling bin", confidence: 97, color: "#15934e", emoji: "🍾" },
  { name: "Metal Can", category: "Metal Waste", material: "Aluminium / steel", recyclable: "Yes", impact: "Low when recycled", action: "Place in the metal recycling bin", confidence: 95, color: "#e94d48", emoji: "🥫" },
];

const historySeed = [
  { ...examples[0], time: "2:30 PM", id: 1 },
  { ...examples[1], time: "2:25 PM", id: 2 },
  { ...examples[2], time: "2:20 PM", id: 3 },
  { ...examples[3], time: "2:18 PM", id: 4 },
  { ...examples[4], time: "2:15 PM", id: 5 },
];

const categoryData = [
  { name: "Plastic Waste", value: 42, color: "#079c50" },
  { name: "Organic Waste", value: 28, color: "#ffb500" },
  { name: "Paper Waste", value: 15, color: "#568cff" },
  { name: "Glass Waste", value: 9, color: "#8e70f8" },
  { name: "Metal Waste", value: 6, color: "#ff4c50" },
];

const accuracyData = [
  { day: "Oct 3", value: 87 },
  { day: "Oct 4", value: 89 },
  { day: "Oct 5", value: 91 },
  { day: "Oct 6", value: 93 },
  { day: "Oct 7", value: 93.5 },
  { day: "Oct 8", value: 94.2 },
  { day: "Oct 9", value: 95.2 },
];

const wasteExamples = [
  { name: "Plastic", description: "e.g. bottles, cups", emoji: "🥤", item: 0 },
  { name: "Organic", description: "e.g. food, peels", emoji: "🍃", item: 1 },
  { name: "Paper", description: "e.g. cardboard", emoji: "📦", item: 2 },
  { name: "Glass", description: "e.g. bottles", emoji: "🍾", item: 3 },
  { name: "Metal", description: "e.g. cans, foil", emoji: "🥫", item: 4 },
];

function Sidebar({ active, onNavigate }) {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "City Simulator", icon: Map },
    { label: "AI Waste Classifier", icon: Brain },
    { label: "Route Optimizer", icon: Route },
    { label: "Overflow Prediction", icon: TrendingUp },
    { label: "Citizen Reports", icon: FileText },
    { label: "Reports History", icon: History },
  ];

  return (
    <aside className="awc-sidebar">
      <div className="awc-brand">
        <span className="awc-brand-icon"><Recycle size={24}/></span>
        <div><strong>SmartBin</strong><small>Smart Waste Management</small></div>
      </div>
      <div className="awc-menu-label">MAIN MENU</div>
      <nav className="awc-nav">
        {items.map(({ label, icon: Icon }) => (
          <button key={label} className={`awc-nav-item ${active === label ? "active" : ""}`} onClick={() => onNavigate(label)}>
            <Icon size={18}/><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="awc-sidebar-note">
        <i/>
        <div><strong>Waste Management</strong><p>Monitor bins, optimize collection routes, and manage reports.</p></div>
      </div>
      <button className="awc-collapse" aria-label="Collapse sidebar"><ChevronDown size={17}/></button>
    </aside>
  );
}

function Metric({ icon: Icon, value, label, kind }) {
  return (
    <div className="awc-metric">
      <div className={`awc-metric-icon ${kind}`}><Icon size={19}/></div>
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}

export default function AIWasteClassifier() {
  const fileRef = useRef(null);
  const [activeNav, setActiveNav] = useState("AI Waste Classifier");
  const [selected, setSelected] = useState(examples[0]);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [history, setHistory] = useState(historySeed);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);

  function chooseExample(example) {
    setSelected(example);
    setPreview("");
    setFileName("");
    setNotice(`Example selected: ${example.name}. This is a demonstration classification.`);
  }

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image file such as JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice("Image is too large. Please choose an image under 10 MB.");
      return;
    }
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    setFileName(file.name);
    setNotice("Image loaded. Choose an example category to preview the demo result, or connect an AI model for real image classification.");
  }

  function runDemoClassification() {
    setBusy(true);
    setNotice("");
    window.setTimeout(() => {
      const entry = { ...selected, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), id: Date.now() };
      setHistory((old) => [entry, ...old].slice(0, 8));
      setBusy(false);
      setNotice(`Demo result ready: ${selected.category}. No AI model has analysed the uploaded image yet.`);
    }, 500);
  }

  function navigate(label) {
    setActiveNav(label);
    if (label !== "AI Waste Classifier") {
      window.dispatchEvent(new CustomEvent("smartbin-nav", { detail: label }));
      setNotice(`${label} selected. Connect this item to its page route when ready.`);
    } else {
      setNotice("");
    }
  }

  return (
    <div className="awc-app">
      <Sidebar active={activeNav} onNavigate={navigate}/>
      <main className="awc-main">
        <header className="awc-topbar">
          <button className="awc-menu-toggle" aria-label="Menu"><Menu size={19}/></button>
          <div className="awc-topbar-spacer"/>
          <button className="awc-bell" aria-label="Notifications" onClick={() => setNotice("You have notifications to review.")}><Bell size={17}/><i/></button>
          <span className="awc-avatar"><UserRound size={19}/></span>
          <div className="awc-admin"><strong>SmartBin Admin</strong><span>Administrator⌄</span></div>
        </header>

        <div className="awc-breadcrumb"><Home size={12}/> <span>Home</span><b>›</b><strong>AI Waste Classifier</strong></div>

        <section className="awc-heading">
          <div className="awc-heading-icon"><Brain size={30}/></div>
          <div className="awc-heading-copy"><h1>AI Waste Classifier</h1><p>Upload an image of waste and let AI classify it into the correct category.</p></div>
          <div className="awc-heading-metrics">
            <Metric icon={Database} value="95.2%" label="Classification Accuracy" kind="green"/>
            <Metric icon={Leaf} value="1,245" label="Items Classified Today" kind="leaf"/>
          </div>
        </section>

        {notice && <div className="awc-notice"><span>{notice}</span><button onClick={() => setNotice("")}><X size={14}/></button></div>}

        <section className="awc-main-grid">
          <article className="awc-card awc-upload-card">
            <h3>Upload Waste Image</h3>
            <div
              className={`awc-dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
              onClick={() => fileRef.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
            >
              {preview ? (
                <div className="awc-upload-preview"><img src={preview} alt="Selected waste upload"/><button type="button" onClick={(e) => { e.stopPropagation(); URL.revokeObjectURL(preview); setPreview(""); setFileName(""); }}>Remove image</button></div>
              ) : (
                <>
                  <UploadCloud size={37} strokeWidth={1.6}/>
                  <strong>Drag and drop an image here</strong>
                  <span>or click to upload</span>
                  <small>Supports: JPG, PNG, WEBP (Max 10MB)</small>
                  <button type="button" className="awc-choose-btn"><ImageIcon size={13}/>Choose Image</button>
                </>
              )}
            </div>
            <input ref={fileRef} className="awc-file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleFile(e.target.files?.[0])}/>
            {fileName && <p className="awc-file-name">{fileName}</p>}
            <div className="awc-example-heading">Try with an example:</div>
            <div className="awc-example-list">
              {wasteExamples.map((item) => (
                <button key={item.name} className={`awc-example ${selected.name === examples[item.item].name ? "chosen" : ""}`} onClick={() => chooseExample(examples[item.item])}>
                  <span className={`awc-example-image example-${item.item}`}>{item.emoji}</span>
                  <small>{item.name}</small>
                </button>
              ))}
            </div>
            <button className="awc-classify-btn" onClick={runDemoClassification} disabled={busy}>
              {busy ? <LoaderCircle size={15} className="awc-spin"/> : <Brain size={15}/>}
              {busy ? "Classifying..." : "Run Demo Classification"}
            </button>
          </article>

          <article className="awc-card awc-result-card">
            <div className="awc-card-heading"><h3>Classification Result</h3><span className="awc-confidence">Confidence: {selected.confidence}%</span></div>
            <div className="awc-result-image">
              {preview ? <img src={preview} alt="Uploaded waste"/> : <div className={`awc-large-example example-${examples.indexOf(selected)}`}>{selected.emoji}</div>}
            </div>
            <div className="awc-result-category">
              <div className={`awc-result-symbol example-${examples.indexOf(selected)}`}>{selected.emoji}</div>
              <div className="awc-result-category-copy"><strong>{selected.category}</strong><span>{selected.name === "Plastic Bottle" ? "Recyclable Waste" : selected.category}</span><div className="awc-confidence-track"><i style={{width:`${selected.confidence}%`}}/></div></div>
              <b>{selected.confidence}%</b>
            </div>
            <p className="awc-result-description">
              {selected.name === "Plastic Bottle"
                ? "This appears to be a plastic bottle. It should be disposed of in the recyclable waste bin."
                : `This example is categorised as ${selected.category}. Follow the recommended disposal guidance below.`}
            </p>
            <h4>Additional Information</h4>
            <div className="awc-info-row"><Database size={13}/><span>Material Type</span><strong>{selected.material}</strong></div>
            <div className="awc-info-row"><CheckCircle2 size={13}/><span>Recyclable</span><strong>{selected.recyclable}</strong></div>
            <div className="awc-info-row"><CircleAlert size={13}/><span>Environmental Impact</span><strong>{selected.impact}</strong></div>
            <div className="awc-info-row"><Info size={13}/><span>Suggested Action</span><strong>{selected.action}</strong></div>
          </article>

          <article className="awc-card awc-history-card">
            <div className="awc-card-heading"><h3>Recent Classifications</h3><button className="awc-view-all" onClick={() => setNotice(`Showing ${history.length} recent demo classifications.`)}>View All</button></div>
            <div className="awc-history-list">
              {history.slice(0, 5).map((item) => (
                <button className="awc-history-item" key={item.id} onClick={() => { setSelected(item); setPreview(""); setFileName(""); }}>
                  <span className={`awc-history-image example-${examples.findIndex((x) => x.name === item.name)}`}>{item.emoji}</span>
                  <span className="awc-history-copy"><strong>{item.name}</strong><small>{item.category}</small><time>{item.time}</time></span>
                  <span className="awc-history-confidence">{item.confidence}%</span>
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="awc-bottom-grid">
          <article className="awc-card awc-distribution-card">
            <h3>Waste Category Distribution</h3>
            <div className="awc-distribution-content">
              <div className="awc-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={categoryData} dataKey="value" innerRadius="60%" outerRadius="90%" paddingAngle={2} stroke="none">
                    {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}
                  </Pie><Tooltip formatter={(v) => `${v}%`}/></PieChart>
                </ResponsiveContainer>
                <div className="awc-donut-center"><strong>1,245</strong><span>Items</span></div>
              </div>
              <div className="awc-distribution-legend">
                {categoryData.map((item) => <div key={item.name}><span><i style={{background:item.color}}/>{item.name}</span><b>{item.value}%</b></div>)}
              </div>
            </div>
          </article>

          <article className="awc-card awc-accuracy-card">
            <div className="awc-card-heading"><h3>Classification Accuracy</h3><span className="awc-accuracy-badge"><strong>95.2%</strong><small>Oct 9</small></span></div>
            <div className="awc-line-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData} margin={{top:10,right:6,left:-17,bottom:0}}>
                  <CartesianGrid stroke="#e9eff5" strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="day" tick={{fontSize:8,fill:"#71829a"}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[60,100]} ticks={[60,70,80,90,100]} tickFormatter={(v) => `${v}%`} tick={{fontSize:8,fill:"#71829a"}} axisLine={false} tickLine={false}/>
                  <Tooltip formatter={(v) => `${v}%`}/>
                  <Line type="monotone" dataKey="value" stroke="#16a45a" strokeWidth={2} dot={{r:2.5,fill:"#16a45a",strokeWidth:1}} activeDot={{r:4}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="awc-card awc-types-card">
            <div className="awc-card-heading"><h3>Waste Type Examples</h3><button className="awc-view-all" onClick={() => setNotice("Select any example to view its demo classification.")}>View All</button></div>
            <div className="awc-types-grid">
              {wasteExamples.map((item) => (
                <button className="awc-type-item" key={item.name} onClick={() => chooseExample(examples[item.item])}>
                  <span className={`awc-type-image example-${item.item}`}>{item.emoji}</span>
                  <strong>{item.name}</strong><small>{item.description}</small>
                </button>
              ))}
            </div>
          </article>
        </section>
        <footer className="awc-footer"><span><i/>SmartBin AI system ready</span><span>AI Waste Classifier · Demo mode</span></footer>
      </main>
    </div>
  );
}
