import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import './ScanModal.css';

const ScanModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }
      );

      qrScanner.render(
        (decodedText) => {
          // Handle success
          if (onScanSuccess) {
            onScanSuccess(decodedText);
          }
          qrScanner.clear();
          onClose();
        },
        (error) => {
          // Ignore errors, they're usually just "QR code not found in frame"
          console.debug("QR Scan error:", error);
        }
      );

      setScanner(qrScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="scan-modal-overlay">
      <div className="scan-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Scan QR Code</h2>
        <div id="qr-reader"></div>
        <p className="scan-instructions">Position the QR code within the frame to scan</p>
      </div>
    </div>
  );
};

export default ScanModal; 