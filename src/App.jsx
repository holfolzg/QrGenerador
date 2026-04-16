import { useState, useRef } from "react";
import "./App.css";
import QRCode from "qrcode";

function App() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);

  const generateQR = async () => {
    if (!url) return;
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });

      if (!logo) {
        setQr(qrDataUrl);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((res) => (qrImg.onload = res));
      ctx.drawImage(qrImg, 0, 0, 512, 512);

      const logoImg = new Image();
      logoImg.src = logo;
      await new Promise((res) => (logoImg.onload = res));

      const logoSize = 90;
      const padding = 10;
      const x = (512 - logoSize) / 2;
      const y = (512 - logoSize) / 2;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 12);
      ctx.fill();
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);

      setQr(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    fileInputRef.current.value = "";
  };

  return (
    <div id="root">
      <div className="card">
        <div className="header">
          <div className="badge">Generador de QR Sin Adds</div>
          <h1>Generate <span>QR</span></h1>
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

        <div className="input-group">
          <label className="input-label">Logo (opcional)</label>
          <div className="logo-upload-wrapper">
            <label className={`logo-upload-btn${logo ? " loaded" : ""}`}>
              {logo ? "✓ Logo cargado" : "↑ Subir logo"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: "none" }}
              />
            </label>
            {logo && (
              <button className="logo-remove-btn" onClick={removeLogo}>
                × Quitar
              </button>
            )}
            {logo && <img src={logo} alt="preview" className="logo-preview" />}
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
          <span>PNG · 512px</span>
        </div>
      </div>
    </div>
  );
}

export default App;