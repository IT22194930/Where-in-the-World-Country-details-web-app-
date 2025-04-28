# Where in the World - Country Information App

A responsive web application that provides detailed information about countries around the world. Users can search, filter, and explore countries, view detailed information, and save their favorite countries.

## Features

- **Browse Countries**: View all countries with essential information
- **Search & Filter**: Search by country name, filter by region or language
- **Detailed Country Information**: View comprehensive details including:
  - Flag
  - Population
  - Capital
  - Region and subregion
  - Languages
  - Currencies
  - Border countries (with navigation links)
  - Google Maps link
- **User Authentication**: Sign up and log in to save favorite countries
- **Favorite Countries**: Save and manage your favorite countries
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Toggle between dark and light themes

## Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (for storing user favorites)
- **API**: REST Countries API
- **State Management**: React Context API
- **Testing**: Jest and React Testing Library

## Setup and Installation

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn package manager

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/IT22194930/Where-in-the-World-Country-details-web-app-
   cd af-2-IT22194930
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal)

## Testing

Run the test suite:

```bash
npm test
```

## API Usage

This application uses the [REST Countries API](https://restcountries.com/) (v3.1) to fetch country data. The API is free to use and does not require authentication.

### API Endpoints Used:

- `/all` - Get all countries
- `/name/{name}` - Search by country name
- `/region/{region}` - Filter by region
- `/alpha/{code}` - Get country by code
- `/alpha?codes={codes}` - Get multiple countries by codes

## Authentication and Data Storage

Firebase is used for:
- User authentication (email/password)
- Storing user favorite countries in Firestore

## Technical Report

### API Selection and Integration

**REST Countries API**: We chose this API for its comprehensive country data, ease of use, and reliability. The API provides all the necessary information including flags, population, languages, currencies, and more without requiring authentication.

**Firebase**: For user authentication and data storage, Firebase was selected due to its ease of integration with React applications and robust security features.

### Key Technical Challenges and Solutions

1. **API Rate Limiting and Error Handling**
   - **Challenge**: Handling API failures
   - **Solution**: Implemented exponential backoff retry logic with max retries to handle temporary failures gracefully

2. **State Management for Filters**
   - **Challenge**: Managing multiple filters (search, region, language) efficiently
   - **Solution**: Used React's useEffect with dependency arrays to appropriately update filtered results when any filter changes

3. **Responsive Design for Various Devices**
   - **Challenge**: Creating a seamless experience across all device sizes
   - **Solution**: Utilized Tailwind CSS's responsive utilities and created adaptive layouts for different screen sizes

4. **Performance Optimization**
   - **Challenge**: Optimizing the application for handling large datasets
   - **Solution**: Implemented efficient filtering algorithms and pagination where necessary

5. **Testing Complex Components**
   - **Challenge**: Writing effective tests for components with external dependencies
   - **Solution**: Used mocking strategies to isolate components and test specific behaviors