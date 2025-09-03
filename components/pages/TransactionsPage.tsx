"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import TocoTokenAbi from "../../abis/TocoToken.json";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

const TOCO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOCO_CONTRACT_ADDRESS || '';
const EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || 'https://sepolia.etherscan.io';

type Transaction = {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  blockNumber: number;
  timestamp?: number;
  type: "incoming" | "outgoing";
};

export default function TransactionsPage() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      if (!window.ethereum) {
        setError("MetaMask is not available");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          TOCO_CONTRACT_ADDRESS,
          TocoTokenAbi.abi,
          provider
        );

        const filterFrom = contract.filters.Transfer(address, null);
        const filterTo = contract.filters.Transfer(null, address);

        const [sent, received] = await Promise.all([
          contract.queryFilter(filterFrom, 0, "latest"),
          contract.queryFilter(filterTo, 0, "latest"),
        ]);

        const all = [...sent, ...received].sort(
          (a, b) => b.blockNumber - a.blockNumber
        );

        const mapped: Transaction[] = await Promise.all(
          all.map(async (ev) => {
            // @ts-expect-error ethers v6 event args
            const type = ev.args[0].toLowerCase() === address.toLowerCase() 
              ? "outgoing" 
              : "incoming";

            let timestamp: number | undefined;
            try {
              const block = await provider.getBlock(ev.blockNumber);
              timestamp = block?.timestamp;
            } catch (err) {
              console.warn("Could not fetch block timestamp:", err);
            }

            return {
              txHash: ev.transactionHash,
              // @ts-expect-error ethers v6 event args
              from: ev.args[0],
              // @ts-expect-error ethers v6 event args
              to: ev.args[1],
              // @ts-expect-error ethers v6 event args
              amount: ethers.formatUnits(ev.args[2], 18),
              blockNumber: ev.blockNumber,
              timestamp,
              type,
            };
          })
        );

        setTransactions(mapped);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();

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
          if (from.toLowerCase() === address.toLowerCase() || 
              to.toLowerCase() === address.toLowerCase()) {
            fetchTransactions();
          }
        };

        contract.on("Transfer", onTransfer);

        return () => {
          contract.removeAllListeners("Transfer");
        };
      } catch (err) {
        console.error("Error setting up event listeners:", err);
      }
    };

    const cleanup = setupEventListeners();

    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [address]);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toFixed(4);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading your transactions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          {transactions.length > 0 
            ? `Showing ${transactions.length} transactions` 
            : "No transactions found"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {transactions.length === 0 && !error ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No transactions yet.</p>
            <p className="text-sm mt-2">Your transaction history will appear here.</p>
          </div>
        ) : (
          <Table>
            <TableCaption>Your TOCO token transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge 
                      variant={tx.type === "incoming" ? "default" : "secondary"}
                      className={tx.type === "incoming" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                    >
                      {tx.type === "incoming" ? "Received" : "Sent"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {formatAmount(tx.amount)} TOCO
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {shortenAddress(tx.from)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {shortenAddress(tx.to)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    #{tx.blockNumber}
                  </TableCell>
                  <TableCell className="text-sm">
                    {tx.timestamp ? formatDate(tx.timestamp) : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`${EXPLORER_URL}/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}