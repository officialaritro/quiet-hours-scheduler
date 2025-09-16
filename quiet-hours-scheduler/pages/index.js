import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/auth/AuthForm';
import Dashboard from '../components/dashboard/Dashboard';
import { Clock } from 'lucide-react';

export default function Home() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Clock className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} />;
  }

  return <Dashboard user={user} onSignOut={signOut} />;
}