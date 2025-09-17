import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Spinner } from '../ui/Spinner';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage and cookie
        localStorage.setItem('auth-token', data.token);
        document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        // Update auth context
        if (signIn) {
          signIn(data.user, data.token);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600">Welcome back to your study scheduler</p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.email || !formData.password}
        className="w-full"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size="sm" />
            <span className="ml-2">Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/signup')}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push('/auth/forgot-password')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
}