import { Search, Wallet, Twitter } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const { walletAddress, connecting, connected, connect, disconnect } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-white font-bold text-lg tracking-tight">Wagerings</h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 text-white text-xs pl-9 pr-4 py-2 rounded-lg border border-gray-800 focus:border-gray-700 focus:outline-none w-[350px] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/wager_sol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>

            <button
              onClick={connected ? disconnect : connect}
              disabled={connecting}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all border border-gray-700"
            >
              <Wallet className="w-3.5 h-3.5" />
              {connecting ? 'Connecting...' : connected && walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
