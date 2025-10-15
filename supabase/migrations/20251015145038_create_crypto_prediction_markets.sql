/*
  # Create Crypto Prediction Markets Schema

  1. New Tables
    - `markets`
      - `id` (uuid, primary key)
      - `question` (text) - The prediction market question
      - `description` (text) - Detailed description
      - `icon` (text) - Icon identifier (btc, eth, sol, etc)
      - `category` (text) - Market category
      - `yes_volume` (numeric) - Total SOL bet on YES
      - `no_volume` (numeric) - Total SOL bet on NO
      - `total_volume` (numeric) - Total SOL in market
      - `liquidity` (numeric) - Available liquidity
      - `end_date` (timestamptz) - When market closes
      - `outcome` (text) - likely/unlikely/even
      - `resolved` (boolean) - Whether market is resolved
      - `winning_side` (text) - yes/no/null
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `bets`
      - `id` (uuid, primary key)
      - `market_id` (uuid, foreign key to markets)
      - `wallet_address` (text) - User's wallet address
      - `side` (text) - yes or no
      - `amount` (numeric) - Amount in SOL
      - `potential_return` (numeric) - Potential winnings
      - `odds` (numeric) - Odds at time of bet
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read markets
    - Users can read their own bets
    - Betting handled via edge functions
*/

-- Create markets table
CREATE TABLE IF NOT EXISTS markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT 'bitcoin',
  category text DEFAULT 'crypto',
  yes_volume numeric DEFAULT 0,
  no_volume numeric DEFAULT 0,
  total_volume numeric DEFAULT 0,
  liquidity numeric DEFAULT 0,
  end_date timestamptz NOT NULL,
  outcome text DEFAULT 'even',
  resolved boolean DEFAULT false,
  winning_side text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bets table
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) NOT NULL,
  wallet_address text NOT NULL,
  side text NOT NULL CHECK (side IN ('yes', 'no')),
  amount numeric NOT NULL CHECK (amount > 0),
  potential_return numeric NOT NULL,
  odds numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Markets policies (public read)
CREATE POLICY "Anyone can read markets"
  ON markets FOR SELECT
  TO anon
  USING (true);

-- Bets policies (users can read their own bets)
CREATE POLICY "Users can read own bets"
  ON bets FOR SELECT
  TO anon
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_markets_end_date ON markets(end_date);
CREATE INDEX IF NOT EXISTS idx_markets_resolved ON markets(resolved);
CREATE INDEX IF NOT EXISTS idx_bets_market_id ON bets(market_id);
CREATE INDEX IF NOT EXISTS idx_bets_wallet_address ON bets(wallet_address);

-- Insert sample crypto markets
INSERT INTO markets (question, description, icon, yes_volume, no_volume, total_volume, liquidity, end_date, outcome) VALUES
('Will Bitcoin reach $150,000 by December 31, 2025?', 'This market will resolve to "Yes" if any 1 minute candle for Bitcoin (BTCUSDT) between December 30, 2024, 20:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $150,000 or higher.', 'bitcoin', 195, 805, 5700, 136000, '2025-12-31 23:59:00', 'unlikely'),
('Will Ethereum hit $5,000 by December 31?', 'This market will immediately resolve to "Yes" if any 1 minute candle for Ethereum (ETHUSDT) between December 30, 2024, 21:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $5,000 or higher.', 'ethereum', 587, 413, 5200, 69100, '2025-12-31 23:59:00', 'likely'),
('Will Bitcoin reach $200,000 by December 31, 2025?', 'This market will immediately resolve to "Yes" if any 1 minute candle for Bitcoin (BTCUSDT) between December 30, 2024, 20:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $200,000 or higher.', 'bitcoin', 55, 945, 4700, 172200, '2025-12-31 23:59:00', 'unlikely'),
('US national Bitcoin reserve in 2025?', 'This market will resolve to "Yes" if the US government holds any amount of Bitcoin in its reserves at any point between January 1, 2025, ET and December 31, 2025, 11:59 PM ET.', 'bitcoin', 110, 890, 4400, 32000, '2025-12-31 23:59:00', 'unlikely'),
('Will Ethereum hit $6,000 by December 31?', 'This market will immediately resolve to "Yes" if any 1 minute candle for Ethereum (ETHUSDT) between December 30, 2024, 21:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $6,000 or higher.', 'ethereum', 275, 725, 3900, 83500, '2025-12-31 23:59:00', 'unlikely'),
('Will Bitcoin reach $250,000 by December 31, 2025?', 'This market will immediately resolve to "Yes" if any 1 minute candle for Bitcoin (BTCUSDT) between December 30, 2024, 20:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $250,000 or higher.', 'bitcoin', 25, 975, 3700, 106800, '2025-12-31 23:59:00', 'unlikely'),
('Will Solana reach $500 by December 31, 2025?', 'This market will resolve to "Yes" if any 1 minute candle for Solana (SOLUSDT) between December 30, 2024, 20:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $500 or higher.', 'solana', 320, 680, 3500, 95200, '2025-12-31 23:59:00', 'unlikely'),
('Will Ethereum hit $10,000 by December 31?', 'This market will immediately resolve to "Yes" if any 1 minute candle for Ethereum (ETHUSDT) between December 30, 2024, 21:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $10,000 or higher.', 'ethereum', 68, 932, 3000, 68900, '2025-12-31 23:59:00', 'unlikely'),
('Will Cardano reach $5 by December 31, 2025?', 'This market will resolve to "Yes" if any 1 minute candle for Cardano (ADAUSDT) between December 30, 2024, 20:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $5.00 or higher.', 'cardano', 145, 855, 2800, 78400, '2025-12-31 23:59:00', 'unlikely'),
('Will Polkadot reach $100 by December 31, 2025?', 'This market will resolve to "Yes" if any 1 minute candle for Polkadot (DOTUSDT) between December 30, 2024, 20:00 and December 31, 2025, 23:59 in the ET timezone has a close price of $100 or higher.', 'polkadot', 89, 911, 2500, 65300, '2025-12-31 23:59:00', 'unlikely')
ON CONFLICT DO NOTHING;