// Typed as `object` to avoid version-specific Clerk type imports.
// All valid Clerk appearance keys are accepted at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clerkAppearance: Record<string, any> = {
  variables: {
    colorPrimary: '#c9a84c',
    colorBackground: '#1a2e1a',
    colorInputBackground: '#0f1a0f',
    colorInputText: '#e8dcc8',
    colorText: '#e8dcc8',
    colorTextSecondary: '#9a8a6a',
    colorNeutral: '#9a8a6a',
    colorSuccess: '#4a7c59',
    colorDanger: '#c0392b',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '15px',
  },
  elements: {
    card: {
      background: '#1a2e1a',
      border: '1px solid rgba(201, 168, 76, 0.15)',
      boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
    },
    headerTitle: {
      color: '#e8dcc8',
    },
    headerSubtitle: {
      color: '#9a8a6a',
    },
    socialButtonsBlockButton: {
      background: '#0f1a0f',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      color: '#e8dcc8',
    },
    dividerLine: {
      background: 'rgba(201, 168, 76, 0.15)',
    },
    dividerText: {
      color: '#9a8a6a',
    },
    formFieldInput: {
      background: '#0f1a0f',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      color: '#e8dcc8',
    },
    formButtonPrimary: {
      background: '#c9a84c',
      color: '#0f1a0f',
      fontWeight: 600,
    },
    footerActionLink: {
      color: '#c9a84c',
    },
    identityPreviewText: {
      color: '#e8dcc8',
    },
    identityPreviewEditButton: {
      color: '#c9a84c',
    },
  },
};
