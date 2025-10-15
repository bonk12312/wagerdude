import { TrendingUp, LayoutGrid } from 'lucide-react';

type SidebarProps = {
  onAllClick: () => void;
  onTrendingClick: () => void;
  activeView: 'all' | 'trending';
};

export const Sidebar = ({ onAllClick, onTrendingClick, activeView }: SidebarProps) => {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="p-4 space-y-1">
        <button
          onClick={onAllClick}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm ${
            activeView === 'all'
              ? 'text-white bg-gray-800 shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="font-medium text-xs">All</span>
        </button>

        <button
          onClick={onTrendingClick}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm ${
            activeView === 'trending'
              ? 'text-white bg-gray-800 shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium text-xs">Trending</span>
        </button>
      </div>
    </aside>
  );
};
