import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Recycle,
  MapPin,
  BrainCircuit,
  Route,
  BarChart3,
  ShieldCheck,
  Leaf,
  Trash2,
  Activity,
  CheckCircle2,
  Menu
} from "lucide-react";
import "../style/landing.css";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Waste Classification",
    description:
      "Identify waste categories with AI-assisted classification and make disposal decisions easier."
  },
  {
    icon: MapPin,
    title: "Smart Bin Monitoring",
    description:
      "Monitor bin locations and fill levels through an intuitive city-wide dashboard."
  },
  {
    icon: Route,
    title: "Optimized Collection Routes",
    description:
      "Plan smarter pickup routes to reduce unnecessary travel and improve collection efficiency."
  },
  {
    icon: Activity,
    title: "Overflow Prediction",
    description:
      "Discover bins that may fill soon and prioritize collection before overflow occurs."
  },
  {
    icon: BarChart3,
    title: "Reports and Analytics",
    description:
      "Explore collection activity, waste statistics, and operational insights in one place."
  },
  {
    icon: ShieldCheck,
    title: "Citizen Reporting",
    description:
      "Make it easier for citizens to report overflowing bins and waste-related concerns."
  }
];

const steps = [
  {
    number: "01",
    title: "Monitor",
    description: "View bin locations, current fill levels, and city waste activity."
  },
  {
    number: "02",
    title: "Predict",
    description: "Use AI-assisted insights to identify bins that may need attention."
  },
  {
    number: "03",
    title: "Optimize",
    description: "Prioritize collections and plan efficient pickup routes."
  }
];

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <Link to="/home" className="landing-brand">
          <span className="brand-icon">
            <Recycle size={25} />
          </span>
          <span>Smart<span className="brand-green">Bin</span></span>
        </Link>

        <nav className="landing-nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <Link to="/dashboard" className="landing-nav-cta">
          Open Dashboard <ArrowRight size={16} />
        </Link>

        <a href="#features" className="landing-mobile-menu" aria-label="View features">
          <Menu size={23} />
        </a>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-background-orb orb-one" />
          <div className="hero-background-orb orb-two" />

          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="live-dot" />
              SMARTER CITIES. CLEANER FUTURES.
            </div>

            <h1>
              A cleaner city
              <br />
              starts with <span>smarter waste.</span>
            </h1>

            <p className="hero-description">
              Meet a smarter approach to waste management. Monitor bins,
              anticipate overflow, optimize collection routes, and turn
              city waste data into meaningful action.
            </p>

            <div className="hero-actions">
              <Link to="/dashboard" className="primary-cta">
                Explore Dashboard <ArrowRight size={18} />
              </Link>
              <a href="#features" className="secondary-cta">
                Discover SmartBin
              </a>
            </div>

            <div className="hero-trust-row">
              <span><CheckCircle2 size={16} /> AI-assisted insights</span>
              <span><CheckCircle2 size={16} /> Real-time-ready dashboard</span>
              <span><CheckCircle2 size={16} /> Smarter collection</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="floating-label floating-label-top">
              <span className="floating-label-icon"><Activity size={18} /></span>
              <span>
                <strong>Smart monitoring</strong>
                <small>Bin status overview</small>
              </span>
              <span className="status-indicator" />
            </div>

            <div className="city-illustration">
              <div className="city-sun" />
              <div className="city-cloud cloud-one" />
              <div className="city-cloud cloud-two" />

              <div className="city-building building-one">
                <span /><span /><span /><span />
              </div>
              <div className="city-building building-two">
                <span /><span /><span /><span /><span /><span />
              </div>
              <div className="city-building building-three">
                <span /><span /><span /><span />
              </div>
              <div className="city-building building-four">
                <span /><span /><span /><span /><span /><span />
              </div>

              <div className="city-ground" />

              <div className="illustration-bin bin-one">
                <div className="bin-lid" />
                <div className="bin-body"><Recycle size={27} /></div>
                <div className="bin-wheel wheel-one" />
                <div className="bin-wheel wheel-two" />
              </div>

              <div className="illustration-bin bin-two">
                <div className="bin-lid" />
                <div className="bin-body"><Leaf size={23} /></div>
                <div className="bin-wheel wheel-one" />
                <div className="bin-wheel wheel-two" />
              </div>

              <div className="eco-leaf leaf-one"><Leaf size={36} /></div>
              <div className="eco-leaf leaf-two"><Leaf size={25} /></div>
            </div>

            <div className="floating-label floating-label-bottom">
              <span className="prediction-icon"><BrainCircuit size={20} /></span>
              <span>
                <strong>Predict. Plan. Prevent.</strong>
                <small>Make every collection count.</small>
              </span>
            </div>
          </div>
        </section>

        <section className="landing-benefits" aria-label="SmartBin benefits">
          <div className="benefit-item">
            <span className="benefit-icon"><BrainCircuit size={21} /></span>
            <div><strong>AI-powered insights</strong><small>Data-driven decisions</small></div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><MapPin size={21} /></span>
            <div><strong>Location awareness</strong><small>See bins across the city</small></div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><Route size={21} /></span>
            <div><strong>Efficient collection</strong><small>Plan smarter routes</small></div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon"><Leaf size={21} /></span>
            <div><strong>Sustainable cities</strong><small>Build cleaner communities</small></div>
          </div>
        </section>

        <section className="landing-about section-container" id="about">
          <div className="section-heading">
            <span className="section-kicker">ABOUT SMARTBIN</span>
            <h2>Waste management, <span>reimagined.</span></h2>
            <p>
              SmartBin brings bin monitoring, AI-assisted predictions,
              collection planning, and citizen feedback together in one
              simple platform for smarter waste management.
            </p>
          </div>

          <div className="about-content">
            <div className="about-card about-card-dark">
              <div className="about-card-symbol"><Recycle size={29} /></div>
              <span className="about-card-label">OUR MISSION</span>
              <h3>Less waste. Better decisions. Cleaner communities.</h3>
              <p>
                Help waste management teams move from reactive collection
                to informed, proactive planning.
              </p>
              <Leaf className="about-decoration" size={112} />
            </div>

            <div className="about-points">
              <div className="about-point">
                <span><CheckCircle2 size={21} /></span>
                <div>
                  <h3>One connected view</h3>
                  <p>Explore bin activity, reports, predictions, and routes from one dashboard.</p>
                </div>
              </div>
              <div className="about-point">
                <span><CheckCircle2 size={21} /></span>
                <div>
                  <h3>Proactive planning</h3>
                  <p>Identify collection priorities and make better use of available resources.</p>
                </div>
              </div>
              <div className="about-point">
                <span><CheckCircle2 size={21} /></span>
                <div>
                  <h3>Community participation</h3>
                  <p>Bring citizen waste reports into the waste management workflow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features" id="features">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">WHAT SMARTBIN OFFERS</span>
              <h2>Everything you need for a <span>smarter city.</span></h2>
              <p>
                Explore the tools designed to make waste monitoring,
                planning, and reporting easier.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article className="feature-card" key={feature.title}>
                    <div className="feature-icon"><Icon size={24} /></div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <Link to={feature.title === "AI Waste Classification" ? "/classifier" : feature.title === "Smart Bin Monitoring" ? "/" : feature.title === "Optimized Collection Routes" ? "/routes" : feature.title === "Overflow Prediction" ? "/predictions" : feature.title === "Citizen Reporting" ? "/reports" : "/reports-history"}>
                      Explore feature <ArrowRight size={15} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-how section-container" id="how-it-works">
          <div className="section-heading">
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>From waste data to <span>real action.</span></h2>
            <p>A simple workflow for more informed waste collection.</p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step.number}>
                <div className="step-top">
                  <span className="step-number">{step.number}</span>
                  {index === 0 ? <MapPin size={24} /> : index === 1 ? <BrainCircuit size={24} /> : <Route size={24} />}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector"><ArrowRight size={18} /></div>}
              </article>
            ))}
          </div>
        </section>

        <section className="landing-final-cta">
          <div className="final-cta-inner">
            <div className="final-cta-icon"><Trash2 size={28} /></div>
            <span className="section-kicker">THE FUTURE IS SMARTER</span>
            <h2>Let's build a cleaner tomorrow.</h2>
            <p>
              Start exploring SmartBin and see how connected waste management
              can support cleaner, more sustainable communities.
            </p>
            <Link to="/dashboard" className="primary-cta">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/home" className="landing-brand footer-brand">
          <span className="brand-icon"><Recycle size={22} /></span>
          <span>Smart<span className="brand-green">Bin</span></span>
        </Link>
        <p>Smarter waste management. Cleaner futures.</p>
        <span className="footer-copyright">© {new Date().getFullYear()} SmartBin</span>
      </footer>
    </div>
  );
}

export default LandingPage;

