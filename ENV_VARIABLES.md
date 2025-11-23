# Environment Variables for Vercel Deployment

This document lists all the environment variables required for the AI Edu News platform to function correctly on Vercel.

**⚠️ IMPORTANT:** Never commit the actual values of secrets (like private keys or API keys) to GitHub. Add them to Vercel Project Settings > Environment Variables.

## Firebase Client SDK (Public)
These variables are safe to be exposed to the browser.

| Variable Name | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID |

## Firebase Admin SDK (Secret - Server Only)
These variables MUST be kept secret and are only available on the server side (API routes, Server Actions).

| Variable Name | Description | Value Format |
|---|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Project ID | `masteroflearning-a06c6` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service Account Email | `firebase-adminsdk-fbsvc@masteroflearning-a06c6.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service Account Private Key | The entire private key string starting with `-----BEGIN PRIVATE KEY-----` and ending with `-----END PRIVATE KEY-----`. **Note:** When adding to Vercel, you can paste the value directly. If you encounter issues with newlines, try replacing `\n` with actual newlines or ensure the code handles `\n` replacement (which it does). |

## AI & Email Services (Secret - Server Only)

| Variable Name | Description |
|---|---|
| `XAI_API_KEY` | xAI Grok API Key |
| `RESEND_API_KEY` | Resend API Key for sending emails |
| `RESEND_FROM_EMAIL` | Sender email address (e.g., `newsletter@yourdomain.com`) |

## Application Settings

| Variable Name | Description |
|---|---|
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email address of the admin user (for frontend permission checks) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., `https://your-project.vercel.app`) |
