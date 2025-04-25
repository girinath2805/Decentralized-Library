// ConnectWalletButton.tsx
import { Button } from './ui/button';
import { useWallet } from '@/context/WalletContext';

const ConnectWalletButton = () => {
  const { isConnected, isConnecting, account, connect, disconnect } = useWallet();

  return (
    <Button 
      className='absolute right-4 md:right-9 top-5 md:top-10'
      onClick={isConnected ? disconnect : connect}
      disabled={isConnecting}
    >
      {isConnecting 
        ? 'Connecting...' 
        : isConnected 
          ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}`
          : 'Connect Wallet'
      }
    </Button>
  );
};

export default ConnectWalletButton;