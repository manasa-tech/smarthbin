import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle, ArrowRight, Leaf, Brain, Truck, Activity,
  Users, Menu, X, Mail, MapPin, CheckCircle2, Sprout,
  Trash2, Route, ChevronRight
} from "lucide-react";
import "./landing-page-new.css";

export default function LandingPageNew() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="sbl">
      <header className="sbl-header">
        <a className="sbl-brand" href="#sbl-home" onClick={closeMenu}>
          <span className="sbl-logo"><Recycle size={30}/></span>
          <span><strong>SmartBin</strong><small>Smart Waste Management</small></span>
        </a>

        <button className="sbl-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X/> : <Menu/>}
        </button>

        <nav className={`sbl-nav ${menuOpen ? "sbl-nav-open" : ""}`}>
          <a href="#sbl-home" onClick={closeMenu}>Home</a>
          <a href="#sbl-features" onClick={closeMenu}>Features</a>
          <a href="#sbl-about" onClick={closeMenu}>About</a>
          <a href="#sbl-how" onClick={closeMenu}>How It Works</a>
          <a href="#sbl-contact" onClick={closeMenu}>Contact</a>
          <Link className="sbl-nav-cta" to="/auth" onClick={closeMenu}>Get Started <ArrowRight size={15}/></Link>
        </nav>
      </header>

      <main>
        <section className="sbl-hero" id="sbl-home">
          <div className="sbl-hero-copy">
            <div className="sbl-eyebrow"><Leaf size={15}/> SMARTER CITIES. GREENER FUTURE.</div>
            <h1>Smart Waste Management for a <span>Cleaner Tomorrow.</span></h1>
            <p>SmartBin combines AI-powered waste monitoring, overflow prediction, and optimized collection routes to help build cleaner, greener, and healthier cities.</p>
            <div className="sbl-hero-buttons">
              <Link className="sbl-button" to="/auth">Get Started <ArrowRight size={17}/></Link>
              <a className="sbl-button sbl-button-light" href="#sbl-about">Learn More <ChevronRight size={17}/></a>
            </div>
            <div className="sbl-benefits">
              <div><span><CheckCircle2/></span><b>Reduce<br/>Overflow</b></div>
              <div><span><Truck/></span><b>Optimize<br/>Routes</b></div>
              <div><span><Sprout/></span><b>Greener<br/>Communities</b></div>
            </div>
          </div>

          <div className="sbl-hero-art">
            <div className="sbl-art-circle sbl-circle-one"/>
            <div className="sbl-art-circle sbl-circle-two"/>
            <div className="sbl-bin-illustration">
              <div className="sbl-bin-lid"/>
              <div className="sbl-bin-body"><Recycle size={77}/></div>
              <div className="sbl-bin-wheels"><i/><i/></div>
            </div>
            <div className="sbl-floating sbl-monitor-card">
              <span className="sbl-float-icon"><Activity/></span>
              <div><strong>Smart Monitoring</strong><small>Bin status overview</small><div className="sbl-mini-progress"><i/></div></div>
            </div>
            <div className="sbl-floating sbl-ai-card">
              <span className="sbl-float-icon"><Brain/></span>
              <div><strong>AI-Powered</strong><small>Smarter predictions</small></div>
            </div>
            <div className="sbl-floating sbl-route-card">
              <span className="sbl-route-dot"/><div><strong>Efficient Collection</strong><small>Optimized collection routes</small></div>
            </div>
            <Leaf className="sbl-decor-leaf sbl-leaf-a"/>
            <Leaf className="sbl-decor-leaf sbl-leaf-b"/>
          </div>
        </section>

        <section className="sbl-stats">
          <div><span><Trash2/></span><section><strong>Smart</strong><small>Bin Monitoring</small></section></div>
          <div><span><Brain/></span><section><strong>AI-Powered</strong><small>Waste Insights</small></section></div>
          <div><span><Route/></span><section><strong>Optimized</strong><small>Collection Routes</small></section></div>
          <div><span><Leaf/></span><section><strong>Sustainable</strong><small>Urban Communities</small></section></div>
        </section>

        <section className="sbl-section" id="sbl-features">
          <div className="sbl-section-heading">
            <span className="sbl-kicker">OUR SMART SOLUTIONS</span>
            <h2>Everything for a <span>cleaner city.</span></h2>
            <p>Powerful tools to make waste collection more intelligent, efficient, and sustainable.</p>
          </div>
          <div className="sbl-feature-grid">
            <article className="sbl-feature-card">
              <span className="sbl-feature-icon green"><Activity/></span>
              <h3>Real-Time Monitoring</h3>
              <p>Monitor bin fill levels and identify collection needs through a unified dashboard.</p>
              <a href="#sbl-how">Explore feature <ArrowRight size={14}/></a>
            </article>
            <article className="sbl-feature-card">
              <span className="sbl-feature-icon purple"><Brain/></span>
              <h3>AI Waste Intelligence</h3>
              <p>Use AI-assisted insights to classify waste and predict potential overflow.</p>
              <a href="#sbl-how">Explore feature <ArrowRight size={14}/></a>
            </article>
            <article className="sbl-feature-card">
              <span className="sbl-feature-icon orange"><Truck/></span>
              <h3>Route Optimization</h3>
              <p>Plan practical collection routes that help save time and operational resources.</p>
              <a href="#sbl-how">Explore feature <ArrowRight size={14}/></a>
            </article>
            <article className="sbl-feature-card">
              <span className="sbl-feature-icon blue"><Users/></span>
              <h3>Citizen Engagement</h3>
              <p>Help citizens report waste problems and support cleaner neighbourhoods.</p>
              <a href="#sbl-contact">Explore feature <ArrowRight size={14}/></a>
            </article>
          </div>
        </section>

        <section className="sbl-about" id="sbl-about">
          <div className="sbl-about-visual">
            <div className="sbl-about-graphic"><Sprout size={95}/><Recycle size={48}/></div>
            <div className="sbl-about-badge"><Leaf size={19}/><span><strong>A Greener Future</strong><small>One smart step at a time</small></span></div>
          </div>
          <div className="sbl-about-copy">
            <span className="sbl-kicker">ABOUT SMARTBIN</span>
            <h2>Technology for a <span>cleaner tomorrow.</span></h2>
            <p>SmartBin is an intelligent waste management platform that brings monitoring, AI-powered analysis, and collection planning into one simple experience.</p>
            <p>Our goal is to help waste managers respond faster, reduce overflowing bins, improve collection efficiency, and encourage responsible waste disposal.</p>
            <ul>
              <li><CheckCircle2/> Smarter waste monitoring</li>
              <li><CheckCircle2/> Data-driven collection planning</li>
              <li><CheckCircle2/> Cleaner and healthier communities</li>
            </ul>
            <Link className="sbl-button" to="/auth">Explore SmartBin <ArrowRight size={16}/></Link>
          </div>
        </section>

        <section className="sbl-how" id="sbl-how">
          <div className="sbl-section-heading">
            <span className="sbl-kicker">HOW IT WORKS</span>
            <h2>Four steps to <span>smarter waste management.</span></h2>
            <p>From monitoring to action, SmartBin helps connect the waste collection workflow.</p>
          </div>
          <div className="sbl-steps">
            <article><span className="sbl-step-number">01</span><div className="sbl-step-icon"><Activity/></div><h3>Monitor</h3><p>Check bin status and available fill-level information.</p></article>
            <article><span className="sbl-step-number">02</span><div className="sbl-step-icon"><Brain/></div><h3>Predict</h3><p>Identify bins that may need attention using AI insights.</p></article>
            <article><span className="sbl-step-number">03</span><div className="sbl-step-icon"><Truck/></div><h3>Optimize</h3><p>Plan collection routes based on operational needs.</p></article>
            <article><span className="sbl-step-number">04</span><div className="sbl-step-icon"><Sprout/></div><h3>Improve</h3><p>Work towards cleaner streets and sustainable cities.</p></article>
          </div>
        </section>

        <section className="sbl-contact" id="sbl-contact">
          <div className="sbl-contact-copy">
            <span className="sbl-kicker">GET IN TOUCH</span>
            <h2>Let's create a <span>cleaner future together.</span></h2>
            <p>Have a question, suggestion, or collaboration idea? We'd love to hear from you.</p>
            <div className="sbl-contact-detail"><span><Mail/></span><div><small>Email us</small><strong>smartbin@example.com</strong></div></div>
            <div className="sbl-contact-detail"><span><MapPin/></span><div><small>Location</small><strong>Bengaluru, Karnataka, India</strong></div></div>
          </div>
          <form className="sbl-contact-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <h3>Send us a message</h3>
            <p>Fill in the details below to share your message.</p>
            <label>Your Name<input required placeholder="Enter your name"/></label>
            <label>Email Address<input required type="email" placeholder="you@example.com"/></label>
            <label>Message<textarea required rows={4} placeholder="Write your message here..."/></label>
            <button className="sbl-button" type="submit">Send Message <ArrowRight size={16}/></button>
            {submitted && <p className="sbl-form-notice">Form validated. Connect a backend to deliver your message.</p>}
          </form>
        </section>
      </main>

      <footer className="sbl-footer">
        <a className="sbl-brand" href="#sbl-home"><span className="sbl-logo"><Recycle size={27}/></span><span><strong>SmartBin</strong><small>Smart Waste Management</small></span></a>
        <p>Smarter waste management for a greener tomorrow.</p>
        <div><a href="#sbl-features">Features</a><a href="#sbl-about">About</a><a href="#sbl-contact">Contact</a></div>
        <small>© 2026 SmartBin. All rights reserved.</small>
      </footer>
    </div>
  );
}

