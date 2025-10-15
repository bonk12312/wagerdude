import { X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Market } from '../lib/supabase';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

type BettingModalProps = {
  market: Market;
  isOpen: boolean;
  onClose: () => void;
};

export const BettingModal = ({ market, isOpen, onClose }: BettingModalProps) => {
  const { walletAddress, connected, connect } = useWallet();
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('');
  const [betting, setBetting] = useState(false);

  if (!isOpen) return null;

  const totalVotes = market.yes_volume + market.no_volume;
  const yesProb = totalVotes > 0 ? market.yes_volume / totalVotes : 0.5;
  const noProb = totalVotes > 0 ? market.no_volume / totalVotes : 0.5;

  const currentProb = side === 'yes' ? yesProb : noProb;
  const odds = currentProb > 0 ? 1 / currentProb : 2;

  const betAmount = parseFloat(amount) || 0;
  const potentialReturn = betAmount * odds;
  const potentialProfit = potentialReturn - betAmount;

  const handleBet = async () => {
    if (!connected) {
      await connect();
      return;
    }

    if (betAmount <= 0) return;

    setBetting(true);

    setTimeout(() => {
      alert(`Bet placed! ${betAmount} SOL on ${side.toUpperCase()}`);
      setBetting(false);
      setAmount('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-gray-900/50 transform transition-all duration-300">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-start justify-between">
          <div className="flex-1 pr-8">
            <h2 className="text-xl font-bold text-white mb-2">{market.question}</h2>
            <p className="text-gray-400 text-sm">{market.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-5">
            <div className="text-sm text-gray-400 mb-3">Current Odds</div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-medium">YES</span>
                  <span className="text-white font-bold text-lg">{(yesProb * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${yesProb * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 font-medium">NO</span>
                  <span className="text-white font-bold text-lg">{(noProb * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${noProb * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-3">Choose Your Side</div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSide('yes')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  side === 'yes'
                    ? 'border-green-600 bg-green-900/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold text-lg">YES</span>
                </div>
                <div className="text-green-400 text-sm">
                  {side === 'yes' ? `${odds.toFixed(2)}x payout` : `${(1 / noProb).toFixed(2)}x payout`}
                </div>
              </button>

              <button
                onClick={() => setSide('no')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  side === 'no'
                    ? 'border-red-600 bg-red-900/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold text-lg">NO</span>
                </div>
                <div className="text-red-400 text-sm">
                  {side === 'no' ? `${odds.toFixed(2)}x payout` : `${(1 / yesProb).toFixed(2)}x payout`}
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-3 block">Bet Amount (SOL)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.1"
              min="0"
              className="w-full bg-gray-800 text-white text-lg px-4 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
            />
          </div>

          {betAmount > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bet Amount</span>
                <span className="text-white font-medium">{betAmount.toFixed(2)} SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Odds</span>
                <span className="text-white font-medium">{odds.toFixed(2)}x</span>
              </div>
              <div className="h-px bg-gray-700"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Potential Return</span>
                <span className="text-white font-bold">{potentialReturn.toFixed(2)} SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Potential Profit</span>
                <span className={`font-bold ${potentialProfit > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                  +{potentialProfit.toFixed(2)} SOL
                </span>
              </div>
            </div>
          )}

          {!connected && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                Connect your Phantom wallet to place bets
              </div>
            </div>
          )}

          <button
            onClick={handleBet}
            disabled={betting || (connected && betAmount <= 0)}
            className={`w-full py-3.5 rounded-lg font-semibold text-lg transition-all ${
              side === 'yes'
                ? 'bg-green-700 hover:bg-green-800'
                : 'bg-red-700 hover:bg-red-800'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {betting ? 'Processing...' : connected ? `Bet ${betAmount.toFixed(2)} SOL on ${side.toUpperCase()}` : 'Connect Wallet to Bet'}
          </button>
        </div>
      </div>
    </div>
  );
};
