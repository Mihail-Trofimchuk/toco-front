interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: (...args: any[]) => Promise<any>;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: (eventName: string, callback: (...args: any[]) => void) => void;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }