-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  plan TEXT DEFAULT 'Free',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bots table
CREATE TABLE bots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'Draft',
  faq_count INT DEFAULT 0,
  conversations_count INT DEFAULT 0,
  primary_color TEXT DEFAULT '#6366f1',
  welcome_message TEXT,
  chat_window_title TEXT,
  website TEXT,
  tone TEXT DEFAULT 'Friendly',
  fallback_message TEXT,
  chat_position TEXT DEFAULT 'Right',
  launcher_icon TEXT DEFAULT 'Chat Bubble',
  max_response_length TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create logs table
CREATE TABLE logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  bot_name TEXT,
  session_id TEXT,
  message_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id UUID REFERENCES logs(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('bot', 'user')),
  text TEXT NOT NULL,
  time TEXT,
  matched BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Row Level Security)

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users: Users can only view/edit their own user record
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Bots: Users can only see/edit their own bots
CREATE POLICY "Users can view own bots" ON bots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bots" ON bots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bots" ON bots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bots" ON bots FOR DELETE USING (auth.uid() = user_id);

-- FAQs: Users can only see/edit FAQs for their own bots
CREATE POLICY "Users can view FAQs of own bots" ON faqs FOR SELECT 
USING (EXISTS (SELECT 1 FROM bots WHERE bots.id = faqs.bot_id AND bots.user_id = auth.uid()));

-- PUBLIC ACCESS for Chat Widget
CREATE POLICY "Public can view active bots" ON bots FOR SELECT 
USING (status = 'Active');

CREATE POLICY "Public can view FAQs for active bots" ON faqs FOR SELECT 
USING (EXISTS (SELECT 1 FROM bots WHERE bots.id = faqs.bot_id AND bots.status = 'Active'));

-- Logging (Public can insert, users can view)
CREATE POLICY "Public can insert logs" ON logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view logs of own bots" ON logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM bots WHERE bots.id = logs.bot_id AND bots.user_id = auth.uid()));
