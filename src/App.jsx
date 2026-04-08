import { useState } from "react";
import "./App.css";
import QRCode from "qrcode";

function App() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");

  const generateQR = async () => {
    if (!url) return;
    try {
      const qrCode = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2, 
        errorCorrectionLevel: "H", 
        color: {
          dark: "#000000", 
          light: "#ffffff",
        },
      });
      setQr(qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div id="root">
      <div className="card">
        <div className="header">
          <div className="badge">Generador de QR Sin Adds</div>
          <h1>
            Generate <span>QR</span>
          </h1>
          <p className="subtitle">Pega cualquier URL y obtén un código QR instantáneo</p>
        </div>

        <div className="input-group">
          <label className="input-label">URL de destino</label>
          <div className="input-wrapper">
            <span className="input-icon">⌘</span>
            <input
              type="text"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
              placeholder="https://google.com/..."
            />
          </div>
        </div>

        <button onClick={generateQR} disabled={!url}>
          Genera tu Codigo QR GRATIS
        </button>

        {qr && (
          <div className="qr-result">
            <div className="qr-frame">
              <img src={qr} alt="QR Code" />
            </div>
            <div className="qr-meta">
              <p>Tu QR está listo</p>
              <a href={qr} download="qrcode.png" className="download-btn">
                ↓ Download PNG
              </a>
            </div>
          </div>
        )}

        <div className="footer">
          <span>Powered by qrcode.js</span>
          <div className="footer-dot" />
          <span>PNG · 256px</span>
        </div>
      </div>
    </div>
  );
}

export default App;
