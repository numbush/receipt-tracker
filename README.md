# Receipt Tracker

A modern web application for tracking and managing receipts with camera capture, image upload, and MongoDB storage.

## Features

- 📸 Camera capture for receipt photos
- 📱 Progressive Web App (PWA) support
- 💾 MongoDB database integration
- 🎨 Modern UI with Tailwind CSS
- 📊 Receipt management and categorization
- 🔍 Search and filter receipts
- 💰 Expense tracking and summaries

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Image Handling**: Sharp, Vercel Blob
- **Camera**: React Webcam
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd receipt-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Push to GitHub

1. Add all files to git:
```bash
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin https://github.com/yourusername/receipt-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)

5. Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for authentication | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |

## Project Structure

```
receipt-tracker/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── receipts/          # Receipt pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── camera/           # Camera-related components
│   ├── receipt/          # Receipt management
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
├── models/               # Database models
├── store/                # State management
├── types/                # TypeScript types
└── public/               # Static assets
```

## API Endpoints

- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt
- `GET /api/receipts/[id]` - Get specific receipt
- `PUT /api/receipts/[id]` - Update receipt
- `DELETE /api/receipts/[id]` - Delete receipt
- `POST /api/upload` - Upload receipt image

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
