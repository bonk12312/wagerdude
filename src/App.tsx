import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MarketCard } from './components/MarketCard';
import { WalletProvider } from './contexts/WalletContext';
import { supabase, Market } from './lib/supabase';

function App() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'all' | 'trending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('resolved', false)
        .order('total_volume', { ascending: false });

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllClick = () => {
    setActiveView('all');
  };

  const handleTrendingClick = () => {
    setActiveView('trending');
  };

  const filteredMarkets = markets.filter(market =>
    market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMarkets = activeView === 'trending'
    ? filteredMarkets.slice(0, 10)
    : filteredMarkets;

  return (
    <WalletProvider>
      <div className="min-h-screen bg-black">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex">
          <Sidebar onAllClick={handleAllClick} onTrendingClick={handleTrendingClick} activeView={activeView} />

          <main className="flex-1">
            <div className="max-w-[1200px] mx-auto p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">MARKET</span>
                  <span className="text-gray-400 font-medium">({displayedMarkets.length})</span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-gray-500 text-sm">Loading markets...</div>
                </div>
              ) : displayedMarkets.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-gray-500 text-sm">No markets available</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedMarkets.map((market, index) => (
                    <div key={market.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                      <MarketCard market={market} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
