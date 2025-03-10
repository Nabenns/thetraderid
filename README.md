# The Trader ID

A professional trading signals and education platform with integrated payment system using Midtrans.

## Features

- Secure payment processing with Midtrans
- Discord/Telegram community integration
- Automated email notifications
- Discord webhook notifications
- Responsive modern UI
- Real-time payment status updates

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Midtrans Payment Gateway
- Nodemailer for emails
- Discord Webhook Integration

## Environment Variables

Create `.env.local` for development and set these variables:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=465
SMTP_USER=your_email
SMTP_PASSWORD=your_password

# Discord Webhook
DISCORD_WEBHOOK_URL=your_webhook_url
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Nabenns/thetraderid.git
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

The project is configured for deployment on Vercel with custom domain support.

## License

MIT License - see LICENSE file for details
