
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Recycle,
  Trash2,
  MapPin,
  BarChart3,
  Users,
  Wifi,
  Activity,
  Wind,
  Building2,
  Globe2,
} from "lucide-react";

import "../styles/landing.css";

const features = [
  {
    icon: Trash2,
    title: "Real-Time Monitoring",
    description:
      "Track bin fill levels and get alerts when collection is needed.",
    link: "Explore monitoring",
  },
  {
    icon: Leaf,
    title: "AI Waste Classification",
    description:
      "Identify waste types and discover the right disposal method.",
    link: "Explore classification",
  },
  {
    icon: MapPin,
    title: "Optimized Collection Routes",
    description:
      "Plan efficient routes to reduce fuel usage and collection time.",
    link: "Explore routes",
  },
  {
    icon: BarChart3,
    title: "Insights & Reports",
    description:
      "Understand waste patterns through clear data visualizations.",
    link: "Explore reports",
  },
];

function SmartBinIllustration() {
  return (
    <div className="scene">
      <div className="scene-sun" />
      <div className="scene-cloud cloud-one" />
      <div className="scene-cloud cloud-two" />

      <div className="scene-city">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="scene-trees tree-a">
        <i />
        <b />
      </div>

      <div className="scene-trees tree-b">
        <i />
        <b />
      </div>

      <div className="scene-hill hill-back" />
      <div className="scene-hill hill-front" />
      <div className="scene-path" />

      <div className="smart-bin-illustration">
        <div className="smart-bin-lid">
          <span />
        </div>

        <div className="smart-bin-panel">
          <span className="bin-connect">
            <Wifi size={28} />
          </span>

          <strong>
            SmartBin <small>AI</small>
          </strong>

          <Recycle size={58} strokeWidth={1.8} />

          <span className="bin-indicator">
            <i /> SMART SYSTEM
          </span>
        </div>

        <div className="bin-wheel wheel-a" />
        <div className="bin-wheel wheel-b" />
      </div>

      <div className="monitor-card fill-monitor">
        <div className="monitor-heading">
          <span className="mini-icon">
            <Trash2 size={17} />
          </span>
          <span>Fill Level</span>
          <Activity size={17} className="monitor-green" />
        </div>

        <div className="monitor-ring">
          <span>
            65<small>%</small>
          </span>
        </div>

        <div className="monitor-status">
          <i /> Monitoring preview
        </div>
      </div>

      <div className="monitor-card location-monitor">
        <span className="mini-icon">
          <MapPin size={19} />
        </span>

        <div>
          <small>Location</small>
          <strong>City Park</strong>

          <span className="map-preview">
            <i />
            <b />
            <em />
          </span>
        </div>
      </div>

      <div className="monitor-card air-monitor">
        <span className="mini-icon">
          <Leaf size={19} />
        </span>

        <div>
          <small>Environment</small>
          <strong>Greener choices</strong>
          <span className="monitor-caption">
            A cleaner tomorrow
          </span>
        </div>
      </div>

      <div className="monitor-card weather-monitor">
        <Wind size={19} className="monitor-green" />

        <div>
          <small>Smart city</small>
          <strong>Connected</strong>
          <span className="monitor-caption">
            Illustrative status
          </span>
        </div>
      </div>

      <span className="scene-leaf leaf-one" />
      <span className="scene-leaf leaf-two" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="sb-landing">
      {/* Navigation */}
      <header className="sb-header">
        <Link to="/" className="sb-brand">
          <span className="sb-brand-icon">
            <Leaf size={25} />
          </span>
          <span>
            SmartBin <b>AI</b>
          </span>
        </Link>

        <nav className="sb-nav" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#impact">Impact</a>
          <a href="#about">About</a>
        </nav>

        <div className="sb-header-actions">
          <Link to="/login" className="sb-login">
            Log in
          </Link>

          <Link to="/signup" className="sb-get-started">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="sb-hero" id="home">
          <div className="sb-hero-copy">
            <div className="sb-eyebrow">
              <Leaf size={14} />
              CLEANER CITIES. BRIGHTER TOMORROWS.
            </div>

            <h1>
              Smarter
              <span>Waste Management</span>
              for a Greener Tomorrow.
              <Leaf className="sb-title-leaf" size={31} />
            </h1>

            <p className="sb-hero-description">
              SmartBin AI brings real-time data and artificial
              intelligence together to make waste management
              smarter, cleaner and more sustainable for every
              community.
            </p>

            <div className="sb-hero-actions">
              <Link to="/signup" className="sb-primary-button">
                Get Started <ArrowRight size={19} />
              </Link>

              <a href="#how-it-works" className="sb-secondary-button">
                <span className="sb-play">▶</span>
                Explore Features
              </a>
            </div>

            <div className="sb-hero-metrics">
              <div className="sb-metric">
                <span className="sb-metric-icon">
                  <Recycle size={25} />
                </span>
                <div>
                  <strong>Smarter</strong>
                  <small>Waste decisions</small>
                </div>
              </div>

              <div className="sb-metric">
                <span className="sb-metric-icon">
                  <Leaf size={25} />
                </span>
                <div>
                  <strong>Greener</strong>
                  <small>Communities</small>
                </div>
              </div>

              <div className="sb-metric">
                <span className="sb-metric-icon">
                  <Users size={25} />
                </span>
                <div>
                  <strong>Connected</strong>
                  <small>City solutions</small>
                </div>
              </div>
            </div>
          </div>

          <SmartBinIllustration />
        </section>

        {/* Features */}
        <section className="sb-features" id="features">
          <div className="sb-section-heading">
            <div>
              <span className="sb-section-label">
                WHY SMARTBIN AI?
              </span>

              <h2>
                Simple Solutions for
                <br />
                <span>Cleaner Communities.</span>
              </h2>
            </div>

            <div className="sb-section-intro">
              <p>
                From real-time monitoring to AI-powered waste
                classification, manage your waste workflow in
                one smart workspace.
              </p>

              <a href="#how-it-works" className="sb-outline-link">
                Explore all features <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="sb-feature-grid">
            {features.map(({ icon: Icon, title, description, link }) => (
              <article className="sb-feature-card" key={title}>
                <div className="sb-feature-top">
                  <span className="sb-feature-icon">
                    <Icon size={25} />
                  </span>

                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>

                <div
                  className={`sb-feature-art ${
                    title === "Real-Time Monitoring"
                      ? "monitor-art"
                      : title === "AI Waste Classification"
                        ? "waste-art"
                        : title === "Optimized Collection Routes"
                          ? "route-art"
                          : "report-art"
                  }`}
                  aria-hidden="true"
                >
                  {title === "Real-Time Monitoring" && (
                    <>
                      <span className="art-bin">
                        <Recycle size={27} />
                      </span>
                      <span className="art-bars">
                        <i /><i /><i /><i />
                      </span>
                    </>
                  )}

                  {title === "AI Waste Classification" && (
                    <>
                      <span className="waste-item waste-bottle">♧</span>
                      <span className="waste-item waste-box">□</span>
                      <span className="art-scan">AI SCAN</span>
                    </>
                  )}

                  {title === "Optimized Collection Routes" && (
                    <>
                      <span className="route-line" />
                      <MapPin className="route-pin pin-one" size={25} />
                      <MapPin className="route-pin pin-two" size={25} />
                      <span className="route-van">↗</span>
                    </>
                  )}

                  {title === "Insights & Reports" && (
                    <>
                      <span className="report-paper">
                        ≡<br />≡<br />≡
                      </span>
                      <span className="report-bars">
                        <i /><i /><i /><i />
                      </span>
                    </>
                  )}
                </div>

                <a href="#how-it-works" className="sb-feature-link">
                  {link} <ArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Impact strip */}
        <section className="sb-impact" id="impact">
          <div className="sb-impact-item">
            <Leaf size={29} />
            <div>
              <strong>Smart bins</strong>
              <span>Connected monitoring</span>
            </div>
          </div>

          <div className="sb-impact-item">
            <Users size={29} />
            <div>
              <strong>Communities</strong>
              <span>Built for people</span>
            </div>
          </div>

          <div className="sb-impact-item">
            <Building2 size={29} />
            <div>
              <strong>Smart cities</strong>
              <span>Better planning</span>
            </div>
          </div>

          <div className="sb-impact-item">
            <Globe2 size={29} />
            <div>
              <strong>Greener future</strong>
              <span>One step at a time</span>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="sb-how" id="how-it-works">
          <span className="sb-section-label">
            A GREENER WAY FORWARD
          </span>

          <h2>Make every bin count.</h2>

          <p>
            Monitor bins, identify waste and make better collection
            decisions with one connected platform.
          </p>

          <Link to="/signup" className="sb-primary-button">
            Get Started <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="sb-footer" id="about">
        <Link to="/" className="sb-brand">
          <span className="sb-brand-icon">
            <Leaf size={22} />
          </span>
          <span>
            SmartBin <b>AI</b>
          </span>
        </Link>

        <p>Smarter waste management, one step at a time.</p>

        <span>© {new Date().getFullYear()} SmartBin AI</span>
      </footer>
    </div>
  );
}
