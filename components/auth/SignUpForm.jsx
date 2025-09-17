import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Spinner } from '../ui/Spinner';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const result = await signUp(formData);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
        <p className="text-gray-600">Create your account to get started</p>
      </div>

      {errors.general && (
        <Alert variant="error">
          {errors.general}
        </Alert>
      )}

      <div>
        <Input
          type="text"
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Choose a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size="sm" />
            <span className="ml-2">Creating account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/signin')}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}