import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  className?: string;
  title?: string;
}

const QRCode = ({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "M",
  includeMargin = true,
  className,
  title,
}: QRCodeProps) => {
  return (
    <div className={cn("inline-block", className)} title={title}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export { QRCode };
