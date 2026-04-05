import * as React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/magic";
import { useToast } from "@/components/magic/Toast";

interface AddressDisplayProps {
  address: string;
  truncateLength?: number;
  className?: string;
  showCopyButton?: boolean;
  copyButtonSize?: "sm" | "md" | "lg";
}

export const AddressDisplay = ({
  address,
  truncateLength = 12,
  className,
  showCopyButton = true,
  copyButtonSize = "sm",
}: AddressDisplayProps) => {
  const [copied, setCopied] = React.useState(false);
  const toast = useToast();

  const truncateAddress = (addr: string, length: number) => {
    if (!addr) return "";
    if (addr.length <= length) return addr;
    return `${addr.slice(0, length / 2)}...${addr.slice(-length / 2)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.addToast({
        title: "Copied!",
        description: "Address copied to clipboard",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.addToast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard",
        variant: "error",
        duration: 3000,
      });
    }
  };

  const displayAddress = truncateAddress(address, truncateLength);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <code className="rounded bg-muted px-2 py-1 text-sm font-mono text-foreground">
        {displayAddress}
      </code>
      {showCopyButton && (
        <Button
          variant="ghost"
          size={copyButtonSize}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy address"}
          className="h-6 w-6 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

AddressDisplay.displayName = "AddressDisplay";
