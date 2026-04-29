'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function LoginPage({ params }: { params: { slug: string } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('Email ou senha incorretos.'); setLoading(false); }
    else router.push(`/${params.slug}/dashboard`);
  }

  return (
    <div className='min-h-screen bg-gray-950 flex items-center justify-center p-4'>
      <div className='bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md'>
        <h1 className='text-2xl font-bold text-white text-center mb-6'>Entrar na Plataforma</h1>
        {error && <div className='bg-red-900/30 border border-red-800 text-red-400 rounded-lg p-3 mb-4 text-sm'>{error}</div>}
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} required
              placeholder='seu@email.com'
              className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Senha</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required
              placeholder='••••••••'
              className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500' />
          </div>
          <button type='submit' disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors'>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}