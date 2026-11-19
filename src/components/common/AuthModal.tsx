import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { useUserStore } from '../../stores/useUserStore';
import { Building2, Sparkles, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, setAuthModal, updateProfile } = useUserStore();
  const [email, setEmail] = useState('marcus.vance@studio-arch.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Marcus Vance');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authModalMode === 'signin') {
        toast.success(`Signed in as ${email}`);
        setAuthModal(false);
      } else if (authModalMode === 'signup') {
        updateProfile({ name, email });
        toast.success('Account created successfully!');
        setAuthModal(false);
      } else {
        toast.success(`Password reset link sent to ${email}`);
        setAuthModal(true, 'signin');
      }
    }, 600);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setAuthModal(false)}
      maxWidth="sm"
      showCloseButton={true}
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto w-12 h-12 bg-forma-50 border border-forma-200 rounded-xl flex items-center justify-center text-forma-600">
          <Building2 className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {authModalMode === 'signin'
              ? 'Sign in to FORMA'
              : authModalMode === 'signup'
              ? 'Create your FORMA account'
              : 'Reset your password'}
          </h2>
          <p className="text-xs text-muted mt-1">
            {authModalMode === 'signin'
              ? 'Access your architectural designs and AI copilot'
              : authModalMode === 'signup'
              ? 'Start generating 2D floor plans & 3D houses'
              : 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {authModalMode === 'signup' && (
            <Input
              label="Full Name"
              icon={<User className="w-4 h-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marcus Vance"
              required
            />
          )}

          <Input
            label="Work Email"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="architect@studio.com"
            required
          />

          {authModalMode !== 'forgot' && (
            <Input
              label="Password"
              type="password"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          )}

          {authModalMode === 'signin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAuthModal(true, 'forgot')}
                className="text-xs text-forma-600 hover:text-forma-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {authModalMode === 'signin'
              ? 'Sign In'
              : authModalMode === 'signup'
              ? 'Get Started'
              : 'Send Reset Link'}
          </Button>
        </form>

        <div className="border-t border-border pt-4 text-xs text-muted">
          {authModalMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModal(true, 'signup')}
                className="font-medium text-forma-600 hover:text-forma-700 hover:underline"
              >
                Create free account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setAuthModal(true, 'signin')}
                className="font-medium text-forma-600 hover:text-forma-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
