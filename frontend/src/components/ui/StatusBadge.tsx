import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/magic";

export type DegreeStatus = "valid" | "revoked" | "pending" | "expired";

interface StatusBadgeProps {
  status: DegreeStatus;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  DegreeStatus,
  { variant: BadgeVariant; icon: React.ReactNode; label: string }
> = {
  valid: {
    variant: "success",
    icon: <CheckCircle className="h-3 w-3" />,
    label: "Valid",
  },
  revoked: {
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
    label: "Revoked",
  },
  pending: {
    variant: "warning",
    icon: <Clock className="h-3 w-3" />,
    label: "Pending",
  },
  expired: {
    variant: "error",
    icon: <AlertTriangle className="h-3 w-3" />,
    label: "Expired",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export const StatusBadge = ({
  status,
  className,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      dot={showIcon}
      className={cn(sizeClasses[size], className)}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};

StatusBadge.displayName = "StatusBadge";
