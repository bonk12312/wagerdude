import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Market = {
  id: string;
  question: string;
  description: string;
  icon: string;
  category: string;
  yes_volume: number;
  no_volume: number;
  total_volume: number;
  liquidity: number;
  end_date: string;
  outcome: 'likely' | 'unlikely' | 'even';
  resolved: boolean;
  winning_side: string | null;
  created_at: string;
  updated_at: string;
};

export type Bet = {
  id: string;
  market_id: string;
  wallet_address: string;
  side: 'yes' | 'no';
  amount: number;
  potential_return: number;
  odds: number;
  created_at: string;
};
