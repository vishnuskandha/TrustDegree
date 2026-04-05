import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (errorMessage: string) => void;
  removable?: boolean;
  className?: string;
}

export default function QRScanner({ onScan, onError, removable = true, className }: QRScannerProps) {
  // removable is currently unused but kept for API compatibility
  void removable;

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const elementIdRef = useRef<string>(`qr-scanner-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const elementId = elementIdRef.current;

    // Calculate responsive qrbox size (90% of viewport width, capped at 300px)
    const qrboxSize = Math.min(250, window.innerWidth * 0.9);

    const scanner = new Html5QrcodeScanner(
      elementId,
      { fps: 10, qrbox: qrboxSize },
      false
    );

    scanner.render(
      (decodedText) => onScan(decodedText),
      (errorMessage) => onError?.(errorMessage)
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, [onScan, onError]);

  // The removable prop is kept for API compatibility but not used,
  // as Html5QrcodeScanner always provides UI.
  return <div id={elementIdRef.current} style={{ width: "100%" }} className={className} />;
}
