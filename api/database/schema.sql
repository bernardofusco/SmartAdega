-- Criar tabela wines se nao existir
CREATE TABLE IF NOT EXISTS wines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grape TEXT NOT NULL,
  region TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  rating REAL NOT NULL CHECK (rating >= 0 AND rating <= 5),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar indice para melhorar performance das consultas por user_id
CREATE INDEX IF NOT EXISTS idx_wines_user_id ON wines(user_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;

-- Politica para permitir usuarios verem apenas seus proprios vinhos
CREATE POLICY IF NOT EXISTS "Users can view their own wines"
  ON wines FOR SELECT
  USING (auth.uid() = user_id);

-- Politica para permitir usuarios inserirem seus proprios vinhos
CREATE POLICY IF NOT EXISTS "Users can insert their own wines"
  ON wines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politica para permitir usuarios atualizarem seus proprios vinhos
CREATE POLICY IF NOT EXISTS "Users can update their own wines"
  ON wines FOR UPDATE
  USING (auth.uid() = user_id);

-- Politica para permitir usuarios deletarem seus proprios vinhos
CREATE POLICY IF NOT EXISTS "Users can delete their own wines"
  ON wines FOR DELETE
  USING (auth.uid() = user_id);

-- Service role bypassa RLS automaticamente, entao a API funcionara normalmente
