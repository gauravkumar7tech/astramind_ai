

# AstraMind — Autonomous Business Intelligence AI

## Product Vision
An AI-powered business intelligence platform that transforms raw company data into actionable insights, predictions, and recommendations through natural conversation. Designed for managers and founders who need data analyst capabilities without technical expertise.

---

## Phase 1: Core Platform (Initial Build)

### 1. Authentication & Onboarding
- **Multi-user authentication** with email/password and optional Google sign-in
- **Workspace creation** flow for organizations
- **Role-based access** (Admin, Analyst, Viewer)
- **Dark-themed onboarding wizard** to guide first-time users

### 2. Data Manager Module
- **CSV/Excel upload** with drag-and-drop interface
- **SQL database connector** (PostgreSQL, MySQL) with connection wizard
- **Google Sheets integration** for live data sync
- **Automatic schema detection** — AI identifies column types (dates, currency, categories, metrics)
- **Data preview table** with column statistics and sample values
- **Dataset library** showing all connected sources with status indicators

### 3. Chat Analyst (Core AI Feature)
- **Conversational interface** with persistent chat history
- **Natural language to SQL** — user asks "What were our sales last quarter?" → AI generates query
- **Transparent query display** — show the generated SQL for trust and learning
- **Rich response formatting** — tables, inline charts, highlighted metrics in responses
- **Context-aware follow-ups** — "Now break that down by region" builds on previous query
- **AI reasoning** — every answer includes explanation of methodology and data sources used

### 4. Analytics Dashboard
- **KPI cards** displaying key metrics (revenue, profit margin, growth rate, customer count)
- **Auto-generated insights** — AI surfaces notable patterns without prompting
- **Top/bottom performers** — products, regions, sales reps automatically ranked
- **Time-series charts** with period comparison (this week vs last week)
- **Filter controls** for date ranges and dimensions

---

## Phase 2: Intelligence Layer (Next Iteration)

### 5. Forecasting Engine
- **Revenue predictions** for 7, 30, and 90-day horizons
- **Trend visualization** with confidence intervals
- **Seasonality detection** — AI explains cyclical patterns
- **Scenario comparisons** — "What if growth continues at this rate?"

### 6. Decision Engine
- **AI-generated recommendations** based on data patterns
- **Action cards** with specific suggestions (pricing changes, inventory alerts, expansion opportunities)
- **Impact estimates** — each recommendation includes expected % impact
- **Priority ranking** — most impactful actions surfaced first
- **Accept/dismiss workflow** to track which recommendations were acted upon

### 7. Risk Alerts System
- **Anomaly detection** — sudden drops, unusual spikes, outliers flagged automatically
- **Alert notifications** — real-time badges and optional email alerts
- **Severity classification** — critical, warning, informational
- **Root cause suggestions** — AI attempts to explain why anomalies occurred

---

## User Interface Design

### Visual Identity
- **Dark mode focused** — deep charcoal backgrounds (#0D1117) with high-contrast accents
- **Professional enterprise aesthetic** — inspired by GitHub, Figma, and Linear
- **Accent color** — electric blue or teal for primary actions and data highlights
- **Typography** — clean sans-serif (Inter or similar) for readability
- **Subtle animations** — smooth transitions, loading states with skeleton screens

### Navigation Structure
**Collapsible sidebar with:**
- 🏠 Overview (dashboard home)
- 💬 Chat Analyst
- 📊 Analytics
- 🔮 Predictions
- 💡 Recommendations
- ⚠️ Alerts
- 📁 Data Manager
- ⚙️ Settings

### Key UI Patterns
- **Command palette** (Cmd+K) for quick navigation
- **Persistent AI chat** accessible from any screen
- **Cards and panels** with subtle borders, not heavy shadows
- **Data tables** with sorting, filtering, and inline actions
- **Empty states** that guide users to next steps

---

## Technical Architecture

### Backend (External Supabase)
- **PostgreSQL database** for storing datasets, conversations, insights
- **Row-Level Security** ensuring users only see their workspace data
- **Edge Functions** for AI processing and external API calls
- **Storage buckets** for uploaded CSV/Excel files

### AI Integration
- **AstraMind AI Gateway** (Gemini) for natural language processing
- **SQL generation** — AI converts questions to database queries
- **Insight generation** — pattern detection and explanation
- **Forecasting** — trend analysis and prediction

### Data Connectors
- CSV/Excel file parser with validation
- PostgreSQL/MySQL connection manager
- Google Sheets API integration (connector setup required)

---

## What This Will Look & Feel Like

When a user logs in, they see a dark, polished dashboard with their key metrics at a glance. Clicking into "Chat Analyst" opens a full-screen conversational interface where they can ask questions like:

> "Why did revenue drop last month?"

The AI responds with:
- The generated SQL query (expandable)
- A formatted table of relevant data
- A clear explanation: *"Revenue decreased 12% in March primarily due to a 45% discount promotion in the Northeast region. This region accounted for 67% of the total revenue decline."*

The interface feels like talking to a senior data analyst who happens to have instant access to all company data.

---

## Success Metrics
- Users can upload data and get their first insight within 5 minutes
- AI responses include reasoning, not just numbers
- Dashboard looks production-ready from day one
- Interface is responsive and works on tablet/desktop

