# Quiet Hours Scheduler

A modern study session scheduler built with Next.js, MongoDB, and Supabase that sends email reminders 10 minutes before each study block.

## Features

- 🔐 **User Authentication** with Supabase
- 📚 **Study Block Management** - Create, edit, delete study sessions
- 📧 **Email Reminders** - Automatic emails 10 minutes before sessions
- ⏰ **CRON Job Scheduling** - Prevents duplicate reminders
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Production Ready** - Deployed on Vercel

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Authentication:** Supabase
- **Email:** Nodemailer with SMTP
- **Deployment:** Vercel
- **Database:** MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Supabase account
- Gmail account (for email service)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd quiet-hours-scheduler
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

Deploy to Vercel with one click:

```bash
vercel --prod
```