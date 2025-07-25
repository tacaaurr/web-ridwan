// src/app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js'; // Import tipe User dari Supabase SDK

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any = null;

    const checkUserAndRedirect = async () => {
      setErrorMessage(null);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || profileData?.role !== 'admin') {
        console.error("User is not an admin or profile not found:", profileError || "No profile data or role is not admin.");
        setErrorMessage("You are not authorized to access this dashboard. Logging out...");
        await supabase.auth.signOut();
        router.push('/admin/login');
        setLoading(false);
        return;
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUserAndRedirect();

    // Perubahan besar di sini: Menggunakan async/await di dalam callback onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => { // <-- Buat callback async
      if (!session) {
        router.push('/admin/login');
      } else {
        try { // <-- Tambahkan try-catch block
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError || profileData?.role !== 'admin') {
            console.error("User role check failed on state change:", profileError || "No profile data or role is not admin.");
            setErrorMessage("Your authorization status changed. Logging out...");
            await supabase.auth.signOut();
            router.push('/admin/login');
          } else {
            setUser(session.user);
          }
        } catch (err: any) { // <-- Catch block untuk error Promise
          console.error("Error during auth state change profile check:", err);
          setErrorMessage("An unexpected error occurred during authorization check.");
          await supabase.auth.signOut(); // Pastikan async/await di sini juga
          router.push('/admin/login');
        }
      }
    });

    subscription = authListener.subscription;

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
          <p className="mt-2 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return children;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/admin" className={`block py-2 px-4 rounded ${pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link href="/admin/projects" className={`block py-2 px-4 rounded ${pathname.startsWith('/admin/projects') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                Manage Projects
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          {user && <p className="text-sm text-gray-400 mb-4">Logged in as: {user.email}</p>}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}