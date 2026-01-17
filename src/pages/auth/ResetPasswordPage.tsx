import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormInput } from '../../components/auth/FormInput';
import styles from './ResetPasswordPage.module.css';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual password reset logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Password reset request for:', email);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="Password reset instructions sent"
      >
        <div className={styles.successMessage}>
          <p>We've sent password reset instructions to <strong>{email}</strong></p>
          <p>Didn't receive the email? Check your spam folder or <Link to="/reset-password" onClick={() => setIsSuccess(false)}>try again</Link>.</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" className={styles.backLink}>
            <span className={styles.backArrow}>←</span>
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
      footer={
        <>
          Remember your password?{' '}
          <Link to="/login">Sign in</Link>
        </>
      }
    >
      <Link to="/login" className={styles.backLink}>
        <span className={styles.backArrow}>←</span>
        Back to Sign In
      </Link>
      
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
          required
          autoComplete="email"
        />
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  );
}
