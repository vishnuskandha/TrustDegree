// Magic UI Components
// A wrapper library around 21st.dev-inspired components with TrustDegree design tokens

// Value exports
export { Button } from "./Button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./Card";
export { Input } from "./Input";
export { Badge } from "./Badge";
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from "./Skeleton";
export { Modal } from "./Modal";
export { ToastProvider, useToast } from "./Toast";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table";
export { Avatar } from "./Avatar";
export { Select } from "./Select";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
export { QRCode } from "./QRCode";

// Type exports
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./Button";
export type { CardProps } from "./Card";
export type { InputProps } from "./Input";
export type { BadgeProps, BadgeVariant } from "./Badge";
export type { Toast as ToastType, ToastVariant } from "./Toast";
export type { TableProps } from "./Table";
export type { AvatarProps } from "./Avatar";
export type { SelectProps, SelectOption } from "./Select";
export type { QRCodeProps } from "./QRCode";
