import { Link } from "react-router-dom";
import {
  Leaf, ArrowRight, Recycle, MapPinned, BrainCircuit,
  BarChart3, CheckCircle2, Sprout, Menu
} from "lucide-react";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span className="landing-logo-icon"><Leaf size={25} /></span>
          <span>SmartBin<span className="landing-logo-ai"> AI</span><small>SMART WASTE MANAGEMENT</small></span>
        </Link>

        <nav className="landing-nav">
          <a href="#home" className="landing-nav-active">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#impact">Our impact</a>
          <a href="#about">About</a>
        </nav>

        <div className="landing-actions">
          <Link to="/login" className="landing-login">Log in</Link>
          <Link to="/signup" className="landing-signup">Get started <ArrowRight size={17} /></Link>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow"><Leaf size={15} /> CLEANER CITIES. BRIGHTER TOMORROWS.</div>
            <h1>Waste less.<br /><span>Live greener.</span><br />Think smarter.</h1>
            <p className="landing-description">
              Meet a smarter way to manage waste. SmartBin AI helps communities
              monitor bins, plan collections and make better environmental decisions.
            </p>
            <div className="landing-hero-actions">
              <Link to="/signup" className="landing-primary-button">Get started for free <ArrowRight size={18} /></Link>
              <a href="#how-it-works" className="landing-secondary-button">Discover how it works <span>↗</span></a>
            </div>
            <div className="landing-trust-row">
              <span><CheckCircle2 size={16} /> Smarter collection</span>
              <span><CheckCircle2 size={16} /> Cleaner communities</span>
            </div>
          </div>

          <div className="landing-visual" aria-label="Illustration of a cleaner smart city">
            <div className="landing-visual-top"><span><i /> SMART CITY, BETTER TOMORROW</span><Leaf size={19} /></div>
            <div className="landing-sun" />
            <div className="landing-cloud cloud-one" />
            <div className="landing-cloud cloud-two" />
            <div className="landing-city">
              <div className="landing-building building-a"><i /><i /><i /><i /><i /><i /></div>
              <div className="landing-building building-b"><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <div className="landing-building building-c"><i /><i /><i /><i /></div>
              <div className="landing-building building-d"><i /><i /><i /><i /><i /><i /></div>
            </div>
            <div className="landing-green-hill hill-back" />
            <div className="landing-green-hill hill-front" />
            <div className="landing-tree tree-one"><span /></div>
            <div className="landing-tree tree-two"><span /></div>
            <div className="landing-smart-bin"><div className="landing-bin-lid" /><Recycle size={43} /><b>SMART<br />BIN AI</b><small>WASTE • SORT • REPEAT</small></div>
            <div className="landing-floating-card card-status"><span><CheckCircle2 size={17} /></span><div><b>Smarter collections</b><small>Less waste on the streets</small></div></div>
            <div className="landing-floating-card card-leaf"><Sprout size={21} /><span><b>Think green</b><small>Make every action count</small></span></div>
            <div className="landing-visual-caption">A cleaner future starts with one smart choice.</div>
          </div>

          <div className="landing-scroll-cue"><span /> SCROLL TO EXPLORE</div>
        </section>

        <section className="landing-intro" id="about">
          <div><span className="landing-section-label">A SMARTER APPROACH</span><h2>Waste management,<br /><span>reimagined.</span></h2></div>
          <p>From overflowing bins to inefficient collection routes, waste creates challenges for every community. SmartBin AI brings useful data and intelligent tools together to help make waste management more organised, efficient and sustainable.</p>
        </section>

        <section className="landing-features" id="features">
          <div className="landing-section-heading"><span className="landing-section-label">MADE FOR A GREENER WORLD</span><h2>Small changes. <span>Real impact.</span></h2><p>Tools to help you understand waste and manage it smarter.</p></div>
          <div className="landing-feature-grid">
            <article className="landing-feature-card"><span className="feature-icon mint"><MapPinned size={24} /></span><h3>Know where waste is</h3><p>Visualise bin locations and identify areas that may need attention.</p><a href="#how-it-works">Explore mapping ↗</a></article>
            <article className="landing-feature-card"><span className="feature-icon yellow"><BrainCircuit size={24} /></span><h3>Make smarter decisions</h3><p>Use intelligent insights to help prioritise collections and reduce overflow.</p><a href="#how-it-works">Explore AI insights ↗</a></article>
            <article className="landing-feature-card"><span className="feature-icon blue"><BarChart3 size={24} /></span><h3>Understand your impact</h3><p>Track waste patterns and learn where better habits can make a difference.</p><a href="#impact">Explore analytics ↗</a></article>
          </div>
        </section>

        <section className="landing-how" id="how-it-works">
          <div className="landing-section-heading"><span className="landing-section-label">SIMPLE BY DESIGN</span><h2>Better waste management<br /><span>in three steps.</span></h2></div>
          <div className="landing-steps">
            <article><span>01</span><h3>Connect</h3><p>Bring your waste-management information into one organised workspace.</p></article>
            <article><span>02</span><h3>Understand</h3><p>Review bin status, waste trends and collection priorities.</p></article>
            <article><span>03</span><h3>Improve</h3><p>Use what you learn to plan smarter and work towards cleaner surroundings.</p></article>
          </div>
        </section>

        <section className="landing-impact" id="impact">
          <div><span className="landing-section-label">OUR SHARED GOAL</span><h2>A cleaner planet<br />is a <span>team effort.</span></h2><p>Every correctly sorted item, every timely collection and every thoughtful decision can contribute to a more sustainable community.</p><Link to="/signup" className="landing-primary-button">Be part of the change <ArrowRight size={18} /></Link></div>
          <div className="landing-impact-art"><div className="impact-circle"><Leaf size={80} /><span>THINK<br />GREEN</span></div><Sprout className="impact-sprout" size={100} /></div>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/" className="landing-logo"><span className="landing-logo-icon"><Leaf size={22} /></span><span>SmartBin<span className="landing-logo-ai"> AI</span><small>SMART WASTE MANAGEMENT</small></span></Link>
        <p>Building cleaner communities, one smart choice at a time.</p>
        <div><Link to="/login">Log in</Link><Link to="/signup">Create account</Link></div>
        <small>© {new Date().getFullYear()} SmartBin AI</small>
      </footer>
    </div>
  );
}
