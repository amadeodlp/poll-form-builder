# Poll and Form Builder

A simple web application to create and respond to polls and forms, built with Nuxt 3, TypeScript, Tailwind CSS, and Pinia for state management.

## Features

### Polls
- Create single-question polls with multiple-choice options
- Respond to polls by selecting an option
- View poll results with visual representation
- Delete polls as needed

### Forms
- Create forms with multiple questions of various types:
  - Short-answer (text input)
  - Long-answer (textarea)
  - Number (numeric input)
  - Radio (single-choice)
- Mark questions as required or optional
- Set optional placeholders for form questions
- Respond to forms by answering questions
- View form responses in an organized way

### General
- Dark mode support with theme persistence
- Responsive design for all device sizes
- Clean, modern UI with intuitive navigation
- Local storage persistence for all data

## Setup and Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technical Implementation

### State Management
- Used Pinia for state management with dedicated stores for:
  - Polls
  - Forms
  - Theme (light/dark mode)

### Component Design
- Created reusable UI components following component-based architecture
- Implemented form validation for all inputs
- Used Vue's Composition API for reactive state handling

### Styling
- Applied Tailwind CSS for utility-first styling
- Custom design system with consistent spacing, colors, and typography
- Responsive layout with mobile-first approach
- Dark mode support with theme toggle

2025, Amadeo de la Peña
All Rights Reserved