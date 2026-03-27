import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: {
    background: 'var(--color-gold)',
    color: '#0f1a0f',
    border: 'none',
  },
  secondary: {
    background: 'var(--color-bg-card)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-muted)',
    border: 'none',
  },
  danger: {
    background: 'rgba(220,50,50,0.15)',
    color: '#f87171',
    border: '1px solid rgba(220,50,50,0.3)',
  },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: '6px' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: '8px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '10px' },
};

export function Button({ variant = 'primary', size = 'md', children, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...variants[variant],
        ...sizes[size],
        fontWeight: 600,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        minHeight: '44px',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
