import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const inputClassName = [
      styles.input,
      error ? styles.inputError : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={inputClassName}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <span id={`${props.id}-error`} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
