/**
 * Component Library Test Page
 *
 * This page showcases all TrustDegree UI components.
 * To view: navigate to /test in the app or import into your router.
 */

import React from "react";
import {
  // Magic Components
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Badge,
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  Avatar,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  QRCode,
  ToastProvider,
} from "@/components";
import {
  // Custom UI Primitives
  StatusBadge,
  AddressDisplay,
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardTitle,
  AnimatedCardDescription,
  AnimatedCardContent,
  EmptyState,
} from "@/components";
import {
  // Layout Components
  PageHeader,
  ContentContainer,
  Section,
} from "@/components";
import {
  // Icons
  Award,
  Plus,
  ArrowRight,
  Search,
} from "lucide-react";

export default function ComponentLibraryTest() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("account");

  // Sample data for table
  const tableData = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive" },
  ];

  // Sample select options
  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <PageHeader
          title="Component Library"
          description="A showcase of all TrustDegree UI components"
          icon={<Award className="h-6 w-6" />}
          action={
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Open Modal
            </Button>
          }
        />

        <ContentContainer size="lg" className="space-y-12">
          {/* Buttons Section */}
          <Section title="Buttons">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button leftIcon={<Plus />}>With Left Icon</Button>
              <Button rightIcon={<ArrowRight />}>With Right Icon</Button>
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Section>

          {/* Cards Section */}
          <Section title="Cards">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>A simple card with title and description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This is the card content area. It can contain any elements.
                  </p>
                </CardContent>
              </Card>

              <AnimatedCard hoverLift>
                <AnimatedCardHeader>
                  <AnimatedCardTitle>Animated Card</AnimatedCardTitle>
                  <AnimatedCardDescription>
                    Hover me to see lift effect
                  </AnimatedCardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <p>This card has a built-in hover animation using Framer Motion.</p>
                </AnimatedCardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">Action</Button>
                </CardFooter>
              </AnimatedCard>
            </div>
          </Section>

          {/* Inputs Section */}
          <Section title="Inputs">
            <div className="grid max-w-2xl gap-6">
              <Input label="Standard Input" placeholder="Enter text..." />
              <Input
                label="With Helper Text"
                placeholder="Email address"
                type="email"
                helperText="We'll never share your email"
              />
              <Input
                label="With Error"
                placeholder="Password"
                type="password"
                error="Password must be at least 8 characters"
              />
              <Input
                label="Search"
                placeholder="Search..."
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </Section>

          {/* Badges Section */}
          <Section title="Badges">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="success" dot>With Dot</Badge>
              <Badge variant="error" dismissible>Dismissible</Badge>
            </div>
          </Section>

          {/* Status Badges (Domain Specific) */}
          <Section title="Status Badges">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="valid" />
              <StatusBadge status="revoked" />
              <StatusBadge status="pending" />
              <StatusBadge status="expired" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusBadge status="valid" size="sm" />
              <StatusBadge status="valid" size="lg" showIcon={false} />
            </div>
          </Section>

          {/* Skeleton Loading States */}
          <Section title="Skeleton Loading States">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold">Text Skeleton</h4>
                <SkeletonText lines={4} />
              </div>
              <div>
                <h4 className="mb-3 font-semibold">Avatar Skeleton</h4>
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size="sm" />
                  <SkeletonAvatar size="md" />
                  <SkeletonAvatar size="lg" />
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="mb-3 font-semibold">Card Skeleton</h4>
                <SkeletonCard header content footer />
              </div>
            </div>
          </Section>

          {/* Avatars */}
          <Section title="Avatars">
            <div className="flex items-center gap-4">
              <Avatar size="sm" fallback="AB" />
              <Avatar size="md" fallback="CD" />
              <Avatar size="lg" fallback="EF" />
              <Avatar size="xl" fallback="GH" />
            </div>
          </Section>

          {/* Address Display */}
          <Section title="Address Display">
            <div className="space-y-4">
              <AddressDisplay
                address="0x742d35Cc6634C0532925a3b844Bc9e7595f32145"
                truncateLength={12}
              />
              <AddressDisplay
                address="0x1234567890abcdef1234567890abcdef12345678"
                truncateLength={16}
                showCopyButton={false}
              />
            </div>
          </Section>

          {/* Select */}
          <Section title="Select Dropdown">
            <div className="max-w-sm">
              <Select
                label="Choose an option"
                options={selectOptions}
                placeholder="Select..."
                helperText="Select your preferred option"
              />
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="account" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <div className="mt-4 rounded-lg border border-border p-4">
                <TabsContent value="account">
                  <h3 className="font-semibold">Account Settings</h3>
                  <p className="text-muted-foreground">Manage your account preferences.</p>
                </TabsContent>
                <TabsContent value="password">
                  <h3 className="font-semibold">Password</h3>
                  <p className="text-muted-foreground">Change your password.</p>
                </TabsContent>
                <TabsContent value="settings">
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-muted-foreground">Configure application settings.</p>
                </TabsContent>
              </div>
            </Tabs>
          </Section>

          {/* Table */}
          <Section title="Table">
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Badge variant="info">{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">{tableData.length}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Section>

          {/* QR Code */}
          <Section title="QR Code">
            <div className="flex items-center gap-4">
              <QRCode value="https://trustdegree.example.com/verify/123" size={150} />
              <QRCode
                value="0x742d35Cc6634C0532925a3b844Bc9e7595f32145"
                size={100}
                fgColor="#0369A1"
              />
            </div>
          </Section>

          {/* Empty State */}
          <Section title="Empty State">
            <EmptyState
              icon={<Search className="h-12 w-12 text-muted-foreground" />}
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={
                <Button variant="primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              }
            />
          </Section>

          {/* Modal */}
          <Section title="Modal">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="Example Modal"
              description="This is a modal dialog with various content"
              size="md"
            >
              <div className="space-y-4">
                <p>
                  This modal demonstrates the Magic Modal component with proper
                  accessibility attributes and backdrop handling.
                </p>
                <Input label="Example Input" placeholder="Type something..." />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>
                    Confirm
                  </Button>
                </div>
              </div>
            </Modal>
          </Section>

          {/* Design Tokens Preview */}
          <Section title="Design Tokens">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>
                  TrustDegree brand colors from design tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-24 rounded-md bg-primary" />
                    <div>
                      <p className="font-semibold">Primary</p>
                      <p className="text-sm text-muted-foreground">#0369A1 (Trust Blue)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-24 rounded-md bg-secondary" />
                    <div>
                      <p className="font-semibold">Secondary</p>
                      <p className="text-sm text-muted-foreground">#0EA5E9 (Sky Blue)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-24 rounded-md bg-accent" />
                    <div>
                      <p className="font-semibold">Accent</p>
                      <p className="text-sm text-muted-foreground">#A16207 (Achievement Gold)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>
        </ContentContainer>
      </div>
    </ToastProvider>
  );
}
