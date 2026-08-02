-- ===================================================
-- UNIPAY SUPABASE DATABASE SCHEMA (PostgreSQL)
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'accountant', 'master_distributor', 'distributor', 'retailer')),
  parent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  wallet_balance NUMERIC(14, 2) DEFAULT 0.00 CHECK (wallet_balance >= 0.00),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  shop_name VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  address TEXT,
  bank_account_no VARCHAR(100),
  bank_ifsc VARCHAR(50),
  bank_name VARCHAR(100),
  bank_account_holder VARCHAR(255),
  firebase_uid VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  txn_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('recharge', 'bill_payment', 'money_transfer', 'aeps', 'pan_card', 'dth', 'other')),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  commission NUMERIC(14, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('success', 'pending', 'failed', 'refunded')),
  balance_before NUMERIC(14, 2),
  balance_after NUMERIC(14, 2),
  service_operator VARCHAR(100),
  service_mobile VARCHAR(20),
  service_account_no VARCHAR(100),
  service_plan_amount NUMERIC(14, 2),
  api_txn_id VARCHAR(100),
  service_name VARCHAR(100),
  retailer_commission NUMERIC(14, 2) DEFAULT 0.00,
  distributor_commission NUMERIC(14, 2) DEFAULT 0.00,
  master_distributor_commission NUMERIC(14, 2) DEFAULT 0.00,
  admin_commission NUMERIC(14, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. WALLET LOGS (AUDIT LEDGER) TABLE
CREATE TABLE IF NOT EXISTS public.wallet_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  balance_before NUMERIC(14, 2) NOT NULL,
  balance_after NUMERIC(14, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_id VARCHAR(100),
  performed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FUND REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.fund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  payment_mode VARCHAR(50) NOT NULL CHECK (payment_mode IN ('IMPS', 'NEFT', 'RTGS', 'UPI', 'Cash Deposit')),
  reference_no VARCHAR(100) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  remarks TEXT,
  rejection_reason TEXT,
  approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMMISSION SLABS TABLE
CREATE TABLE IF NOT EXISTS public.commission_slabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type VARCHAR(50) NOT NULL,
  operator VARCHAR(100) NOT NULL,
  min_amount NUMERIC(14, 2) DEFAULT 0.00,
  max_amount NUMERIC(14, 2) DEFAULT 100000.00,
  retailer_comm NUMERIC(5, 2) DEFAULT 0.00,
  distributor_comm NUMERIC(5, 2) DEFAULT 0.00,
  master_distributor_comm NUMERIC(5, 2) DEFAULT 0.00,
  admin_comm NUMERIC(5, 2) DEFAULT 0.00,
  comm_type VARCHAR(10) DEFAULT 'percentage' CHECK (comm_type IN ('percentage', 'flat')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  txn_id VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR FAST QUERIES
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_txn_id ON public.transactions(txn_id);
CREATE INDEX IF NOT EXISTS idx_wallet_logs_user_id ON public.wallet_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_fund_requests_user_id ON public.fund_requests(user_id);

-- TRIGGER FOR UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_transactions_timestamp
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_requests ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (Backend Server operations)
CREATE POLICY "Service Role Full Access Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Txns" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Logs" ON public.wallet_logs FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Fund" ON public.fund_requests FOR ALL USING (true);
