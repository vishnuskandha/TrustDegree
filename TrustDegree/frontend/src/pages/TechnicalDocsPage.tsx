import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Database,
  Globe,
  Server,
  Shield,
  FileCode
} from "lucide-react";
import { Section, Card, CardContent, CardHeader, CardTitle, Button } from "@/components";

export default function TechnicalDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("architecture");

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Sample smart contract code (simplified for documentation)
  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustDegree is ERC721, Ownable {
    struct Degree {
        string studentName;
        string university;
        string degreeType;
        uint256 issueDate;
        string ipfsHash;
    }

    mapping(uint256 => Degree) public degrees;
    uint256 private _tokenIds;

    event DegreeIssued(
        uint256 indexed tokenId,
        address indexed owner,
        string studentName,
        string university
    );

    constructor() ERC721("TrustDegreeCredential", "TDCRED") {}

    function issueDegree(
        address to,
        string memory studentName,
        string memory degreeType,
        string memory ipfsHash
    ) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(to, newTokenId);

        degrees[newTokenId] = Degree({
            studentName: studentName,
            university: "TrustDegree University",
            degreeType: degreeType,
            issueDate: block.timestamp,
            ipfsHash: ipfsHash
        });

        emit DegreeIssued(newTokenId, to, studentName, "TrustDegree University");
        return newTokenId;
    }

    function getDegree(uint256 tokenId)
        external
        view
        returns (
            string memory studentName,
            string memory university,
            string memory degreeType,
            uint256 issueDate,
            string memory ipfsHash
        )
    {
        Degree memory d = degrees[tokenId];
        return (
            d.studentName,
            d.university,
            d.degreeType,
            d.issueDate,
            d.ipfsHash
        );
    }
}`;

  const endpoints = [
    { method: "POST", path: "/api/v1/credentials/issue", desc: "Issue new credential" },
    { method: "GET", path: "/api/v1/credentials/:id", desc: "Get credential details" },
    { method: "POST", path: "/api/v1/credentials/verify", desc: "Verify credential validity" },
    { method: "GET", path: "/api/v1/student/:address", desc: "List student's credentials" },
    { method: "GET", path: "/api/v1/health", desc: "Health check endpoint" }
  ];

  const glossary = [
    {
      term: "Smart Contract",
      definition: "A self-executing program stored on the blockchain that automatically enforces rules. Think of it as a digital vending machine - you put in credentials, it gives out verifiable tokens."
    },
    {
      term: "Soulbound Token (SBT)",
      definition: "A special type of digital token that is permanently bound to one person and cannot be sold or transferred. Perfect for diplomas, certifications, and achievements."
    },
    {
      term: "IPFS",
      definition: "InterPlanetary File System - a decentralized storage network. We store credential documents here so they're permanent and can't be lost or censored."
    },
    {
      term: "Polygon Mumbai",
      definition: "A test blockchain network where we deploy our smart contracts. It's like a practice blockchain that uses fake money for testing."
    },
    {
      term: "QR Code",
      definition: "A scannable image that contains a link to verify a credential. Employers can scan it with any smartphone to instantly check authenticity."
    },
    {
      term: "Minting",
      definition: "The process of creating a new token on the blockchain. When a university issues a degree, we 'mint' a new soulbound token for the student."
    }
  ];

  return (
    <div className="page-shell bg-transparent">
      {/* Warning Banner */}
      <Section spacing="sm" className="page-content">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-amber-100 rounded-lg border border-amber-300"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-1">
                Technical Documentation for Developers
              </h3>
              <p className="text-sm text-amber-800">
                This page contains detailed technical information for developers and
                system integrators. For a simple, non-technical explanation of how
                TrustDegree works, see{" "}
                <Link to="/how-it-works" className="underline font-semibold hover:text-amber-900">
                  How It Works
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Hero */}
      <Section spacing="xl" className="text-center page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pro-hero px-6 py-12 md:px-10 md:py-14 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileCode className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Technical Documentation
            </h1>
          </div>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">
            Implementation details, API specifications, and architecture diagrams
            for developers integrating with TrustDegree.
          </p>
        </motion.div>
      </Section>

      {/* Navigation Tabs */}
      <Section spacing="md" className="page-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              { id: "architecture", label: "Architecture", icon: <Globe className="w-4 h-4" /> },
              { id: "contract", label: "Smart Contract", icon: <Code2 className="w-4 h-4" /> },
              { id: "api", label: "Backend API", icon: <Server className="w-4 h-4" /> },
              { id: "frontend", label: "Frontend", icon: <Database className="w-4 h-4" /> },
              { id: "blockchain", label: "Blockchain", icon: <Shield className="w-4 h-4" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => toggleSection(item.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all min-h-[44px] ${
                  expandedSection === item.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {expandedSection === item.id ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Architecture Section */}
          {expandedSection === "architecture" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="pro-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-primary-600" />
                    System Architecture Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-slate-700 mb-6">
                      TrustDegree uses a decentralized architecture with clear
                      separation of concerns across four main layers:
                    </p>

                    {/* Architecture Diagram */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 font-mono text-sm overflow-x-auto">
                      <div className="text-center mb-4">
                        <strong className="text-primary-600">TrustDegree Architecture</strong>
                      </div>
                      <pre className="text-xs">
{`┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
│  ┌─────────────┐              ┌─────────────┐              │
│  │  Web App     │              │ Admin Panel  │              │
│  │ (React/Next) │              │  (Protected) │              │
│  └─────────────┘              └─────────────┘              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           TrustDegree Backend (Express.js)           │  │
│  │  • Authentication  • Validation  • Business Logic   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Blockchain Layer (Polygon Mumbai)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Smart Contract (ERC-721 SBT)              │  │
│  │  • Mint credentials  • Verify ownership  • Get data │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Decentralized Storage (IPFS)                 │
│          Credential documents & metadata storage          │
└─────────────────────────────────────────────────────────────┘`}
                      </pre>
                    </div>

                    <h4 className="font-semibold text-slate-900 mb-2">
                      Component Breakdown:
                    </h4>
                    <ol className="list-decimal list-inside space-y-3 text-slate-700 mb-6">
                      <li>
                        <strong>Frontend Application (React)</strong>: Responsive web
                        app with public pages (Home, Verify) and admin-only dashboard
                      </li>
                      <li>
                        <strong>Backend API (Express.js)</strong>: REST API handling
                        authentication, data validation, and blockchain interactions
                      </li>
                      <li>
                        <strong>Smart Contract (Solidity)</strong>: Deployed on Polygon
                        Mumbai, manages credential minting and verification
                      </li>
                      <li>
                        <strong>IPFS Storage</strong>: Stores actual credential files
                        (PDFs, images) with content-addressed hashes
                      </li>
                      <li>
                        <strong>PostgreSQL Database</strong>: Caches frequently accessed
                        data and stores user sessions
                      </li>
                    </ol>

                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                      <p className="text-sm text-primary-800">
                        <strong>Key Design Principle:</strong> All trust anchors live on
                        the public blockchain. Even if our servers go down, credentials
                        remain verifiable through the blockchain and IPFS.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Smart Contract Section */}
          {expandedSection === "contract" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="pro-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-6 h-6 text-primary-600" />
                    Smart Contract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-slate-700 mb-4">
                      The core of TrustDegree is an ERC-721 smart contract deployed on
                      Polygon Mumbai. It implements soulbound token functionality
                      (non-transferable NFTs) for academic credentials.
                    </p>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Key Functions:
                    </h4>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <code className="text-sm bg-white px-2 py-1 rounded border text-primary-700 font-mono">
                          issueDegree(address to, string studentName, string degreeType, string ipfsHash)
                        </code>
                        <span className="text-slate-600">
                          Called by university admin (onlyOwner) to mint a new credential
                        </span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <code className="text-sm bg-white px-2 py-1 rounded border text-primary-700 font-mono">
                          getDegree(uint256 tokenId)
                        </code>
                        <span className="text-slate-600">
                          Public view function to retrieve credential metadata
                        </span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <code className="text-sm bg-white px-2 py-1 rounded border text-primary-700 font-mono">
                          ownedBy(address owner)
                        </code>
                        <span className="text-slate-600">
                          Inherited from ERC721 - used to verify token ownership
                        </span>
                      </div>
                    </div>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Full Contract Code:
                    </h4>
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                        onClick={() => copyToClipboard(contractCode, "contract")}
                      >
                        {copiedId === "contract" ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="ml-2">
                          {copiedId === "contract" ? "Copied!" : "Copy"}
                        </span>
                      </Button>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed shadow-lg">
                        {contractCode}
                      </pre>
                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                      <strong>Note:</strong> This is a simplified example. Production
                      contract includes additional access control, events, and security
                      measures.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Backend API Section */}
          {expandedSection === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="pro-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-6 h-6 text-primary-600" />
                    Backend API Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-slate-700 mb-6">
                      The REST API is built with Express.js and provides endpoints for
                      credential management, verification, and user authentication.
                    </p>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Endpoint Reference:
                    </h4>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-900">
                              Method
                            </th>
                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-900">
                              Endpoint
                            </th>
                            <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-900">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoints.map((ep, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="border border-slate-200 px-4 py-3">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                    ep.method === "GET"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {ep.method}
                                </span>
                              </td>
                              <td className="border border-slate-200 px-4 py-3 font-mono text-sm">
                                {ep.path}
                              </td>
                              <td className="border border-slate-200 px-4 py-3 text-slate-600">
                                {ep.desc}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Authentication:
                    </h4>
                    <p className="text-slate-700 mb-4">
                      Admin endpoints require JWT Bearer token in Authorization header:
                    </p>
                    <div className="relative group mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                        onClick={() =>
                          copyToClipboard(
                            "Authorization: Bearer <your-jwt-token>",
                            "auth"
                          )
                        }
                      >
                        {copiedId === "auth" ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="ml-2">
                          {copiedId === "auth" ? "Copied!" : "Copy"}
                        </span>
                      </Button>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                        Authorization: Bearer &lt;your-jwt-token&gt;
                      </pre>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Base URL:</strong>{" "}
                        {import.meta.env.VITE_API_URL || "http://localhost:3001"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Frontend Section */}
          {expandedSection === "frontend" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary-600" />
                    Frontend Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-slate-700 mb-4">
                      Built with React 18, TypeScript, Tailwind CSS, and Framer Motion.
                      Uses a component library based on Radix UI patterns.
                    </p>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Tech Stack:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
                      <li>React 18 with TypeScript for type safety</li>
                      <li>Vite for fast development and optimized builds</li>
                      <li>React Router v6 for navigation</li>
                      <li>Framer Motion for smooth animations</li>
                      <li>Tailwind CSS for utility-first styling</li>
                      <li>Radix UI primitives for accessibility</li>
                      <li>Lucide React for consistent iconography</li>
                    </ul>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Project Structure:
                    </h4>
                    <div className="relative group mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                        onClick={() =>
                          copyToClipboard(
                            `src/
├── components/
│   ├── layout/     (Section, PageHeader, etc.)
│   ├── magic/      (Design system: Card, Button, Input)
│   └── ...         (Feature components)
├── pages/
│   ├── Home.tsx
│   ├── Verify.tsx
│   ├── HowItWorksPage.tsx
│   ├── TechnicalDocsPage.tsx
│   ├── AdminDashboard.tsx
│   └── ...
└── App.tsx (router config)`,
                            "structure"
                          )
                        }
                      >
                        {copiedId === "structure" ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="ml-2">
                          {copiedId === "structure" ? "Copied!" : "Copy"}
                        </span>
                      </Button>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`src/
├── components/
│   ├── layout/     (Section, PageHeader, etc.)
│   ├── magic/      (Design system: Card, Button, Input)
│   └── ...         (Feature components)
├── pages/
│   ├── Home.tsx
│   ├── Verify.tsx
│   ├── HowItWorksPage.tsx
│   ├── TechnicalDocsPage.tsx
│   ├── AdminDashboard.tsx
│   └── ...
└── App.tsx (router config)`}
                      </pre>
                    </div>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Key Components:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <strong className="text-primary-600">Section</strong>
                        <p className="text-slate-600 mt-1">
                          Animated container with scroll-triggered reveal using Framer Motion.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <strong className="text-primary-600">Card</strong>
                        <p className="text-slate-600 mt-1">
                          Flexible container with optional hover effects and variants.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <strong className="text-primary-600">Button</strong>
                        <strong>Component with multiple variants (primary, secondary, etc.)</strong>
                        <p className="text-slate-600 mt-1">
                          Supports loading states and icon positions.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <strong className="text-primary-600">AnimatedRoutes</strong>
                        <p className="text-slate-600 mt-1">
                          Page transition wrapper with smooth route animations.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Blockchain Section */}
          {expandedSection === "blockchain" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary-600" />
                    Blockchain Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-slate-700 mb-4">
                      TrustDegree uses the Polygon network (testnet for development,
                      mainnet for production) for its public, decentralized ledger.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <Card className="border-2 border-primary-200">
                        <CardContent className="pt-6">
                          <h4 className="font-semibold text-primary-900 mb-3">
                            Testnet (Current)
                          </h4>
                          <ul className="space-y-2 text-sm text-slate-700">
                            <li>
                              <strong>Network:</strong> Polygon Mumbai
                            </li>
                            <li>
                              <strong>Chain ID:</strong> 80001
                            </li>
                            <li>
                              <strong>RPC URL:</strong>{" "}
                              {import.meta.env.VITE_POLYGON_MUMBAI_RPC ||
                                "https://rpc-mumbai.maticvigil.com"}
                            </li>
                            <li>
                              <strong>Explorer:</strong>{" "}
                              <a
                                href="https://mumbai.polygonscan.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline flex items-center gap-1"
                              >
                                polygonscan.com
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-emerald-200">
                        <CardContent className="pt-6">
                          <h4 className="font-semibold text-emerald-900 mb-3">
                            Production (Planned)
                          </h4>
                          <ul className="space-y-2 text-sm text-slate-700">
                            <li>
                              <strong>Network:</strong> Polygon Mainnet
                            </li>
                            <li>
                              <strong>Chain ID:</strong> 137
                            </li>
                            <li>
                              <strong>Gas:</strong> ~0.001 MATX per transaction
                            </li>
                            <li>
                              <strong>Explorer:</strong>{" "}
                              <a
                                href="https://polygonscan.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:underline flex items-center gap-1"
                              >
                                polygonscan.com
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <h4 className="font-semibold text-slate-900 mb-3">
                      Deployed Contract Address:
                    </h4>
                    <div className="relative group mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                        onClick={() =>
                          copyToClipboard(
                            "0x1234567890123456789012345678901234567890",
                            "address"
                          )
                        }
                      >
                        {copiedId === "address" ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="ml-2">
                          {copiedId === "address" ? "Copied!" : "Copy"}
                        </span>
                      </Button>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                        0x1234567890123456789012345678901234567890 (Mumbai)
                      </pre>
                    </div>

                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                      <p className="text-sm text-emerald-800">
                        <strong>Why Polygon?</strong> Low transaction fees, fast
                        confirmation (~2 seconds), and Ethereum compatibility make Polygon
                        ideal for credential verification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </Section>

      {/* Glossary */}
      <Section spacing="xl" className="bg-slate-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Glossary
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {glossary.map((item, idx) => (
                <Card key={idx} className="h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-primary-700 text-lg mb-2">
                      {item.term}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.definition}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Footer CTA */}
      <Section spacing="lg" className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-600 mb-4">
            Need more technical details or want to contribute?
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://github.com/your-org/trustdegree"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Source Code
            </a>
            <a
              href="https://docs.trustdegree.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Full API Reference
            </a>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
