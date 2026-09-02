'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AlertCircle, Loader2, LockKeyhole, Mail } from 'lucide-react';
import SwiraManager from '../swira_manager';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function AuthGate() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setCheckingSession(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get('email') || '').trim(),
      password: String(form.get('password') || ''),
    });

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'El correo o la contraseña no son correctos.'
        : 'No se pudo iniciar sesión. Inténtalo de nuevo.');
    }
    setSubmitting(false);
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#efebe6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1b5b3b]" aria-label="Cargando sesión" />
      </main>
    );
  }

  if (user) return <SwiraManager currentUser={user} />;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#efebe6] px-4 py-10">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#26d966]/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#1b5b3b]/15 blur-3xl" />
      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/10">
        <div className="bg-black px-8 pb-7 pt-8">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/branding/swira-logo.png`}
            alt="Swira"
            width={180}
            height={67}
            className="h-12 w-auto object-contain"
            priority
          />
          <p className="mt-4 text-sm font-medium text-white/60">Acceso interno al CRM</p>
        </div>

        <form onSubmit={signIn} className="space-y-5 p-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-slate-500">Introduce tu cuenta corporativa de Swira.</p>
          </div>

          {error && (
            <div role="alert" className="flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle className="mr-2 h-4 w-4 shrink-0" />{error}
            </div>
          )}

          {!isSupabaseConfigured && (
            <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              El acceso no está configurado en este entorno.
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Correo electrónico</span>
            <span className="relative block">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input name="email" type="email" autoComplete="email" required placeholder="nombre@swira.es" className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#26d966] focus:ring-2 focus:ring-[#26d966]/20" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Contraseña</span>
            <span className="relative block">
              <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input name="password" type="password" autoComplete="current-password" required placeholder="Tu contraseña" className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#26d966] focus:ring-2 focus:ring-[#26d966]/20" />
            </span>
          </label>

          <button type="submit" disabled={submitting || !isSupabaseConfigured} className="flex w-full items-center justify-center rounded-xl bg-[#26d966] px-5 py-3.5 font-black text-black shadow-sm transition hover:bg-[#1b5b3b] hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {submitting ? 'Entrando…' : 'Entrar al CRM'}
          </button>
        </form>
      </section>
    </main>
  );
}
