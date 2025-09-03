"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useEnsName, useConnect, useDisconnect } from "wagmi";
import TocoTokenAbi from "../../abis/TocoToken.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, LogOut, Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
// import { useToast } from "@/components/ui/use-toast";

const TOCO_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TOCO_CONTRACT_ADDRESS || "";

export default function WalletPage({ token }: { token: string }) {
  const { updateWalletAddress } = useWallet(token || "");
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  //   const { toast } = useToast();

  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!address) {
      setBalance("0");
      setIsLoading(false);
      return;
    }

    const fetchBalance = async () => {
      if (!window.ethereum) {
        setIsLoading(false);
        return;
      }

      try {
        setIsRefreshing(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          TOCO_CONTRACT_ADDRESS,
          TocoTokenAbi.abi,
          provider
        );

        const bal = await contract.balanceOf(address);
        setBalance(ethers.formatUnits(bal, 18));
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchBalance();

    const setupEventListeners = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          TOCO_CONTRACT_ADDRESS,
          TocoTokenAbi.abi,
          provider
        );

        const onTransfer = (from: string, to: string) => {
          if (
            from.toLowerCase() === address.toLowerCase() ||
            to.toLowerCase() === address.toLowerCase()
          ) {
            fetchBalance();
          }
        };

        contract.on("Transfer", onTransfer);

        return () => {
          contract.removeAllListeners("Transfer");
        };
      } catch (error) {
        console.error("Error setting up event listeners:", error);
      }
    };

    const cleanup = setupEventListeners();

    return () => {
      if (cleanup) {
        cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
      }
    };
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });

      if (address) {
        await updateWalletAddress(address);
        console.log("Wallet connected and saved:", address);
      }
      //   toast({
      //     title: "Connected",
      //     description: "Wallet connected successfully",
      //   });
    } catch (error) {
      console.error("Connection error:", error);
      //   toast({
      //     title: "Connection failed",
      //     description: "Failed to connect wallet",
      //     variant: "destructive",
      //   });
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      //   toast({
      //     title: "Disconnected",
      //     description: "Wallet disconnected successfully",
      //   });
    } catch (error) {
      console.error("Disconnection error:", error);
      //   toast({
      //     title: "Disconnection failed",
      //     description: "Failed to disconnect wallet",
      //     variant: "destructive",
      //   });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // toast({
    //   title: "Copied",
    //   description: "Address copied to clipboard",
    // });
  };

  const refreshBalance = async () => {
    if (!address) return;

    setIsRefreshing(true);
    try {
      // @ts-expect-error ethers v6 event args
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        TOCO_CONTRACT_ADDRESS,
        TocoTokenAbi.abi,
        provider
      );

      const bal = await contract.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 18));

      //   toast({
      //     title: "Refreshed",
      //     description: "Balance updated successfully",
      //   });
    } catch (error) {
      console.error("Error refreshing balance:", error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to refresh balance",
      //     variant: "destructive",
      //   });
    } finally {
      setIsRefreshing(false);
    }
  };

  const shortenAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  useEffect(() => {
    if (address) {
      updateWalletAddress(address);
    }
  }, [address, updateWalletAddress]);

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            Wallet Dashboard
          </CardTitle>
          <CardDescription>
            Manage your TOCO tokens and wallet connection
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {isConnected && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Online
              </Badge>
            )}
          </div>

          {isConnected && address && (
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Wallet Address
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {ensName || shortenAddress(address)}
                  </span>
                  {ensName && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {shortenAddress(address)}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(address)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              TOCO Balance
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {formatBalance(balance)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    TOCO tokens
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshBalance}
                  disabled={isRefreshing || !isConnected}
                  className="gap-2"
                >
                  {isRefreshing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Refreshing...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {isConnected ? (
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full gap-2 text-white"
                size="lg"
              >
                <LogOut className="h-4 w-4" />
                Disconnect Wallet
              </Button>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to view your balance
                </p>
                <div className="grid gap-3">
                  {connectors.map((connector) => (
                    <Button
                      key={connector.id}
                      onClick={() => handleConnect(connector)}
                      variant="outline"
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect {connector.name}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isConnected && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Contract: {shortenAddress(TOCO_CONTRACT_ADDRESS)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
