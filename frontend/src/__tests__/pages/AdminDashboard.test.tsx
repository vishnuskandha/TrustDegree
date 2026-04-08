import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const getChallengeMock = vi.fn();
const loginMock = vi.fn();
const issueMock = vi.fn();

vi.mock("../../services/api", () => ({
  authAPI: {
    getChallenge: (...args: unknown[]) => getChallengeMock(...args),
    login: (...args: unknown[]) => loginMock(...args),
  },
  issueAPI: {
    issue: (...args: unknown[]) => issueMock(...args),
  },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("qrcode.react", () => ({
  QRCodeSVG: () => <div data-testid="qr-code" />,
}));

vi.mock("../../components/BrandMark", () => ({
  default: () => <div data-testid="brand-mark" />,
}));

vi.mock("lucide-react", () => ({
  LogOut: () => <span />,
  Award: () => <span />,
  Link: () => <span />,
  Download: () => <span />,
  LayoutDashboard: () => <span />,
  ScanLine: () => <span />,
}));

const renderAdminDashboard = async (contractAddress: string) => {
  vi.resetModules();
  vi.stubEnv("VITE_CONTRACT_ADDRESS", contractAddress);

  const module = await import("../../pages/AdminDashboard");
  const AdminDashboard = module.default;

  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
};

describe("AdminDashboard login guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    sessionStorage.clear();
  });

  it("blocks login when entered wallet matches deployed contract address", async () => {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    await renderAdminDashboard(contractAddress);

    fireEvent.change(screen.getByPlaceholderText("0x..."), {
      target: { value: contractAddress },
    });
    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));

    expect(
      await screen.findByText(/TrustDegree contract address/i)
    ).toBeInTheDocument();
    expect(getChallengeMock).not.toHaveBeenCalled();
  });

  it("maps backend contract-address rejection to user-friendly error", async () => {
    const contractAddress = "0x1111111111111111111111111111111111111111";
    const walletAddress = "0x2222222222222222222222222222222222222222";

    getChallengeMock.mockRejectedValue({
      response: {
        status: 400,
        data: {
          error: "Wallet address cannot be the deployed contract address. Use a MetaMask wallet account address.",
        },
      },
    });

    await renderAdminDashboard(contractAddress);

    fireEvent.change(screen.getByPlaceholderText("0x..."), {
      target: { value: walletAddress },
    });
    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));

    expect(
      await screen.findByText(/deployed contract address, not a wallet/i)
    ).toBeInTheDocument();
    expect(getChallengeMock).toHaveBeenCalledWith(walletAddress);
  });
});
