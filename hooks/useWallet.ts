import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function useWallet(token: string) {
  const queryClient = useQueryClient();

  const { mutate: updateWalletAddress, isPending } = useMutation({
    mutationFn: async (walletAddress: string) => {
      const res = await fetch(`${API_BASE_URL}/api/wallet/address`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token }),
        },
        body: JSON.stringify({ walletAddress }),
      });
      if (!res.ok) throw new Error("Failed to update wallet address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return { updateWalletAddress, isPending };
}
