Build a modern, responsive web application called "AI Workplace Productivity Assistant" using React, Tailwind CSS, and Lucide React icons. Focus on a clean, minimal SaaS UI with a dark/light mode professional aesthetic, sidebar navigation, and fluid interactive states.

### Layout & Navigation
- Create a persistent Sidebar navigation that collapses on mobile. 
- Navigation Links: Dashboard, Email Generator, Meeting Summarizer, Task Planner, Research Assistant, AI Chat.
- Top Header: Profile avatar, notifications, global "New Task" button, and a persistent dark mode toggle.
- Footer/Bottom Bar Disclaimer: "AI-generated content may require human review." (Muted, small text).

### Core Features & Interactive Logic
Implement a mock AI processing state (1.5-second skeleton loader or spinner) for each tool before displaying the high-quality structured outputs below.

1. **Dashboard (Overview)**
   - Grid layout showing quick metric cards: "Tasks Automated (24)", "Time Saved (5.2h)", "Active Projects (3)".
   - A "Recent Activity" feed and a quick-launch grid for the 5 core tools.

2. **Smart Email Generator**
   - Inputs: Form fields for "Recipient/Audience" (dropdown: Executive, Client, Team), "Tone" (dropdown: Professional, Casual, Urgent), and "Key Points to Include" (textarea).
   - Interaction: Clicking "Generate Email" triggers a loading state, then outputs a structured email with a Subject Line and Body copy, plus a "Copy to Clipboard" button.

3. **Meeting Notes Summarizer**
   - Inputs: "Paste Transcript" (large textarea) and "Meeting Type" (dropdown).
   - Interaction: Clicking "Summarize" outputs an organized Markdown-style layout with three distinct cards: "🎯 Key Takeaways", "✅ Action Items (with assignees)", and "📅 Deadlines".

4. **AI Task Planner**
   - Inputs: "Task Description" (input) and "Estimated Time" (dropdown).
   - Interaction: Clicking "Analyze & Prioritize" adds the task to a visual Eisenhower Matrix grid (Urgent/Important, Urgent/Not Important, etc.) with automated priority tags (High/Medium/Low).

5. **AI Research Assistant**
   - Inputs: "Research Topic/URL" (input) and "Output Depth" (dropdown: Quick Summary, Deep Dive).
   - Interaction: Clicking "Generate Insights" outputs structured cards: "Executive Summary", "Key Trends", and "Counter-Arguments/Risks".

6. **AI Chatbot Interface**
   - Layout: Scrollable chat window with pre-set prompt chips at the top (e.g., "Draft a resignation letter", "Explain blockchain simply").
   - Interaction: Fully functional chat UI where the user can type a message, hit send, see a "typing..." indicator, and receive a smart, contextual professional response.

### UI/UX Requirements
- Use a professional color palette (e.g., Slate, Indigo, and Emerald for success states).
- Ensure all cards have subtle hover transitions.
- Every tool must have an explicit "Copy" or "Export" button.
- Make the entire application stateful so switching tabs doesn't lose the current view's generated data.
