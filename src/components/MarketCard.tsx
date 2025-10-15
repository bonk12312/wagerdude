import { TrendingUp, TrendingDown, DollarSign, Clock, Bitcoin } from 'lucide-react';
import { Market } from '../lib/supabase';
import { useState } from 'react';
import { BettingModal } from './BettingModal';

type MarketCardProps = {
  market: Market;
};

const getCryptoIcon = (icon: string) => {
  const iconClass = "w-5 h-5 text-white";

  switch (icon) {
    case 'bitcoin':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
        </svg>
      );
    case 'ethereum':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
        </svg>
      );
    case 'solana':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.03 4.95l-3.08 3.08a.75.75 0 0 0 0 1.06l3.08 3.08a.75.75 0 0 0 1.06 0l3.08-3.08a.75.75 0 0 0 0-1.06l-3.08-3.08a.75.75 0 0 0-1.06 0zm9.44 6.91l-3.08 3.08a.75.75 0 0 0 0 1.06l3.08 3.08a.75.75 0 0 0 1.06 0l3.08-3.08a.75.75 0 0 0 0-1.06l-3.08-3.08a.75.75 0 0 0-1.06 0zM3.95 16.47a.75.75 0 0 1 1.06 0l3.08 3.08a.75.75 0 0 1 0 1.06l-3.08 3.08a.75.75 0 0 1-1.06 0l-3.08-3.08a.75.75 0 0 1 0-1.06l3.08-3.08z"/>
        </svg>
      );
    default:
      return <Bitcoin className={iconClass} />;
  }
};

const formatVolume = (volume: number) => {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toFixed(1);
};

const formatLiquidity = (liquidity: number) => {
  if (liquidity >= 1000000) return `$${(liquidity / 1000000).toFixed(1)}M`;
  if (liquidity >= 1000) return `$${(liquidity / 1000).toFixed(1)}K`;
  return `$${liquidity.toFixed(0)}`;
};

const getTimeRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo`;
  if (days > 0) return `${days}d`;
  return '< 1d';
};

export const MarketCard = ({ market }: MarketCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalVotes = market.yes_volume + market.no_volume;
  const yesProb = totalVotes > 0 ? market.yes_volume / totalVotes : 0.5;
  const noProb = totalVotes > 0 ? market.no_volume / totalVotes : 0.5;

  const yesPercent = (yesProb * 100).toFixed(1);
  const noPercent = (noProb * 100).toFixed(1);

  const getOutcomeBadge = () => {
    if (market.outcome === 'likely') {
      return <span className="bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-medium">Likely</span>;
    } else if (market.outcome === 'unlikely') {
      return <span className="bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded text-[10px] font-medium">Unlikely</span>;
    }
    return <span className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-[10px] font-medium">Even</span>;
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer group transform hover:-translate-y-0.5"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-gray-800 p-2 rounded-lg shrink-0">
                  {getCryptoIcon(market.icon)}
                </div>
                <h3 className="text-white font-medium text-[13px] leading-tight group-hover:text-gray-300 transition-colors">
                  {market.question}
                </h3>
              </div>
              {getOutcomeBadge()}
            </div>

            <p className="text-gray-500 text-xs mb-3 line-clamp-2 ml-11">
              {market.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-400 font-medium text-xs">{yesPercent}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-red-400 font-medium text-xs">{noPercent}%</span>
                </div>
              </div>

              <div className="h-4 w-px bg-gray-800"></div>

              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{formatVolume(market.total_volume)} SOL</span>
              </div>

              <div className="h-4 w-px bg-gray-800"></div>

              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-400">↑{formatVolume(market.yes_volume)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                <span className="text-red-400">↓{formatVolume(market.no_volume)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">
                  LIQUIDITY: <span className="text-gray-400 font-medium">{formatLiquidity(market.liquidity)}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Clock className="w-3 h-3" />
                <span>{getTimeRemaining(market.end_date)}</span>
              </div>
            </div>

            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div
                  className="bg-green-600 transition-all"
                  style={{ width: `${yesPercent}%` }}
                ></div>
                <div
                  className="bg-red-600 transition-all"
                  style={{ width: `${noPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BettingModal
        market={market}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
