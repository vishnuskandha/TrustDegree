import { QRCodeSVG } from "qrcode.react";

interface QRGeneratorProps {
  url: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
}

export default function QRGenerator({
  url,
  size = 200,
  level = "H",
  includeMargin = true,
}: QRGeneratorProps) {
  return (
    <div className="flex justify-center p-4 bg-white border rounded-lg">
      <QRCodeSVG value={url} size={size} level={level} includeMargin={includeMargin} />
    </div>
  );
}
