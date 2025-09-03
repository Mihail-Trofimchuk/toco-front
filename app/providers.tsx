"use client";

import { ReactNode } from "react";
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";

export const config = createConfig({
  ssr: true,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/e1a8e570ffe3449e8d75abcb3068def2"),
  },
});


const queryClient =  new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiProvider config={config}>
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  </WagmiProvider>
);
