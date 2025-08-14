# Employee Performance Dashboard

A comprehensive HR analytics dashboard built with Next.js, React, and Recharts. This web-based version replicates Power BI functionality and provides real-time employee performance insights.

## 🌟 Features

- **Real-time HR Analytics**: Comprehensive employee performance metrics
- **Interactive Charts**: Stacked bar charts, pie charts, vertical bar charts
- **Theme System**: Light, dark, and system preference modes
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Department Analysis**: Performance breakdown by department
- **Top Performers**: Curated list with salary and engagement data
- **Employee Insights**: Tenure analysis, engagement metrics
- **Modern UI**: Clean, professional design with Tailwind CSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📊 Dashboard Features

### KPI Cards
- Total Employees (311)
- Active Employees
- Average Performance Score (4.13/5.0)
- Turnover Rate
- Average Tenure
- Employee Engagement

### Visualizations
- **Performance by Department**: Stacked bar chart showing performance distribution
- **Performance Distribution**: Pie chart with 4 performance categories
- **Employees by Department**: Vertical bar chart with department counts
- **Tenure vs Performance**: Bar chart analysis
- **Top 5 Performers**: Table with salary, engagement, and performance data
- **Department Overview**: Summary cards with key metrics

## 🎨 Theme System

- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Easy on the eyes for low-light environments
- **System Mode**: Automatically follows your OS preference
- **Persistent**: Remembers your choice across sessions

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: Real HR analytics sample dataset

## 📦 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build for Production
```bash
npm run build
npm run start
```

## 📋 Data Insights

**Top 5 Performers:**
1. Zamora, Jennifer (IT/IS) - $220,450
2. Foss, Jason (IT/IS) - $178,000
3. Corleone, Vito (Production) - $170,500
4. Dougall, Eric (IT/IS) - $138,888
5. Patronick, Lucas (Software Engineering) - $108,987

**Department Breakdown:**
- Production: 209 employees (27 exceed, 159 fully meet, 15 need improvement, 8 PIP)
- IT/IS: 50 employees (6 exceed, 42 fully meet, 1 needs improvement, 1 PIP)
- Sales: 31 employees (2 exceed, 24 fully meet, 1 needs improvement, 4 PIP)
- Software Engineering: 11 employees (2 exceed, 8 fully meet, 1 needs improvement)
- Admin Offices: 9 employees (all fully meet expectations)
- Executive Office: 1 employee (fully meets expectations)

## 📱 Mobile Ready

Fully responsive design with:
- Mobile-first approach
- Touch-optimized interactions
- Adaptive chart layouts
- Theme-aware components

## 🔗 Live Demo

View the live dashboard: [employee-distribution-dashboard-ebon.vercel.app](https://employee-performance-dashboard-ebon.vercel.app)

Built with ❤️ for better HR analytics and portfolio showcasing
