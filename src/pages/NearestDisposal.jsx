import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Search,
  Recycle,
  LocateFixed,
  ExternalLink,
  Phone,
  Trash2,
  Leaf,
} from "lucide-react";
import "../styles/nearest-disposal.css";

export default function NearestDisposal() {
  const [location, setLocation] = useState("");
  const [wasteType, setWasteType] = useState("All waste types");
  const [currentCoordinates, setCurrentCoordinates] = useState("");
  const [message, setMessage] = useState("");

  const area = location.trim() || "Bengaluru";

  const mapsSearchUrl = (query) =>
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(query);

  const centreSearch =
    "BBMP " +
    (wasteType === "All waste types" ? "waste collection centre" : wasteType + " collection centre") +
    " near " +
    area;

  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&origin=" +
    encodeURIComponent(currentCoordinates || area) +
    "&destination=" +
    encodeURIComponent(centreSearch) +
    "&travelmode=driving";

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location. Enter your area manually.");
      return;
    }

    setMessage("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords =
          position.coords.latitude + "," + position.coords.longitude;

        setCurrentCoordinates(coords);
        setLocation(coords);
        setMessage("Location detected. You can now search nearby centres.");
      },
      () => {
        setMessage("Unable to access location. Please enter your area manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleSearch(event) {
    event.preventDefault();
    window.open(mapsSearchUrl(centreSearch), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="nearest-page">
      <header className="nearest-topbar">
        <Link to="/dashboard" className="nearest-back">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="nearest-brand">
          <span className="nearest-brand-icon">
            <Recycle size={23} />
          </span>
          <span>
            <strong>SmartBin AI</strong>
            <small>Smart Waste Management</small>
          </span>
        </div>
      </header>

      <main className="nearest-content">
        <section className="nearest-heading">
          <span className="nearest-eyebrow">SMART DISPOSAL GUIDE</span>
          <h1>Find a Nearby BBMP Centre</h1>
          <p>
            Find waste collection locations around Bengaluru and open
            directions to help dispose of waste responsibly.
          </p>
        </section>

        <section className="nearest-search-card">
          <div className="nearest-section-title">
            <span className="nearest-title-icon">
              <MapPin size={21} />
            </span>
            <div>
              <h2>Search your location</h2>
              <p>Enter your area and choose the type of waste.</p>
            </div>
          </div>

          <form className="nearest-search-form" onSubmit={handleSearch}>
            <label className="nearest-field">
              <span>Your area</span>
              <div className="nearest-input-wrap">
                <MapPin size={18} />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Whitefield, Jayanagar"
                  aria-label="Your area"
                />
              </div>
            </label>

            <label className="nearest-field">
              <span>Waste category</span>
              <select
                value={wasteType}
                onChange={(event) => setWasteType(event.target.value)}
              >
                <option>All waste types</option>
                <option>Dry waste</option>
                <option>Plastic waste</option>
                <option>Paper waste</option>
                <option>Glass waste</option>
                <option>Electronic waste</option>
                <option>Organic waste</option>
              </select>
            </label>

            <button type="submit" className="nearest-search-btn">
              <Search size={18} />
              Find Centres
            </button>
          </form>

          <button
            type="button"
            className="nearest-location-btn"
            onClick={useMyLocation}
          >
            <LocateFixed size={17} />
            Use my current location
          </button>

          {message && (
            <p className="nearest-message" role="status">
              {message}
            </p>
          )}
        </section>

        <section className="nearest-results-grid">
          <article className="nearest-map-card">
            <div className="nearest-map-art">
              <div className="nearest-map-grid" />
              <div className="nearest-map-road nearest-road-one" />
              <div className="nearest-map-road nearest-road-two" />
              <div className="nearest-map-road nearest-road-three" />

              <div className="nearest-map-park">
                <Recycle size={27} />
                <span>Waste management</span>
              </div>

              <div className="nearest-map-pin">
                <MapPin size={25} />
              </div>

              <div className="nearest-map-label">
                <MapPin size={15} />
                {area}
              </div>
            </div>

            <div className="nearest-map-caption">
              <div>
                <h3>Explore nearby centres</h3>
                <p>
                  Search map listings to check locations near your area.
                </p>
              </div>
              <a
                href={mapsSearchUrl(centreSearch)}
                target="_blank"
                rel="noreferrer"
                className="nearest-icon-link"
                aria-label="Open centres in Google Maps"
              >
                <ExternalLink size={19} />
              </a>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="nearest-directions-btn"
            >
              <Navigation size={18} />
              Get Directions
            </a>
          </article>

          <article className="nearest-centre-card">
            <div className="nearest-section-title">
              <span className="nearest-title-icon">
                <Recycle size={21} />
              </span>
              <div>
                <h2>Official waste centres</h2>
                <p>Use official listings to check available facilities.</p>
              </div>
            </div>

            <div className="nearest-centre-placeholder">
              <span className="nearest-placeholder-icon">
                <Search size={25} />
              </span>
              <h3>Find centres near you</h3>
              <p>
                Search nearby waste facilities on Google Maps or check the
                official BBMP dry waste collection centre locator.
              </p>

              <a
                href={mapsSearchUrl(centreSearch)}
                target="_blank"
                rel="noreferrer"
                className="nearest-outline-btn"
              >
                <MapPin size={17} />
                Search Nearby Centres
              </a>

              <a
                href="https://apps.bbmp.gov.in/SWM/Home/Forms/swmplan.aspx?Page=Dry"
                target="_blank"
                rel="noreferrer"
                className="nearest-official-link"
              >
                Official BBMP Dry Waste Locator
                <ExternalLink size={14} />
              </a>
            </div>
          </article>
        </section>

        <section className="nearest-tips">
          <div className="nearest-tip-icon">
            <Leaf size={22} />
          </div>
          <div>
            <h3>Before disposing of your waste</h3>
            <p>
              Separate wet and dry waste. Check which materials the centre
              accepts and confirm operating hours before travelling.
            </p>
          </div>
        </section>

        <section className="nearest-help">
          <div>
            <span className="nearest-eyebrow">NEED HELP?</span>
            <h2>BBMP Waste Management Support</h2>
            <p>
              Open the official waste management contact page for public
              contact information.
            </p>
          </div>

          <a
            href="https://apps.bbmp.gov.in/SWM/Home/Forms/Publicaboutus.aspx?Page=Contact"
            target="_blank"
            rel="noreferrer"
            className="nearest-contact-btn"
          >
            <Phone size={17} />
            BBMP Contacts
            <ExternalLink size={14} />
          </a>
        </section>

        <footer className="nearest-footer">
          <Trash2 size={17} />
          SmartBin AI · Keep Bengaluru clean.
        </footer>
      </main>
    </div>
  );
}
