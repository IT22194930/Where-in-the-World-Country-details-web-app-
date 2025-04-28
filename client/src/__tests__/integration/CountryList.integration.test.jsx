import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryList from '../../components/CountryList';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  api: {
    getAllCountries: jest.fn()
  }
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Sample countries data for testing
const mockCountries = [
  {
    name: { common: 'Finland' },
    population: 5530719,
    region: 'Europe',
    capital: ['Helsinki'],
    flags: { svg: 'finland-flag.svg', png: 'finland-flag.png' },
    languages: { fin: 'Finnish', swe: 'Swedish' },
    cca3: 'FIN'
  },
  {
    name: { common: 'Germany' },
    population: 83240000,
    region: 'Europe',
    capital: ['Berlin'],
    flags: { svg: 'germany-flag.svg', png: 'germany-flag.png' },
    languages: { deu: 'German' },
    cca3: 'DEU'
  },
  {
    name: { common: 'Japan' },
    population: 126300000,
    region: 'Asia',
    capital: ['Tokyo'],
    flags: { svg: 'japan-flag.svg', png: 'japan-flag.png' },
    languages: { jpn: 'Japanese' },
    cca3: 'JPN'
  }
];

describe('CountryList Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Mock the API response
    api.getAllCountries.mockResolvedValue(mockCountries);
  });

  test('renders country list and allows filtering by region', async () => {
    const authContextValue = {
      user: null,
      isFavorite: (countryCode) => false,
      toggleFavorite: jest.fn()
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <CountryList />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Verify loading state is shown initially
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for the countries to load
    await waitFor(() => {
      expect(screen.getByText('All Countries')).toBeInTheDocument();
    });

    // Check if all countries are displayed
    expect(screen.getByText('Finland')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();

    // Filter by Europe region
    const regionSelect = screen.getByDisplayValue('Filter by Region');
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });

    // Japan should not be displayed anymore
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();

    // Finland and Germany should still be displayed
    expect(screen.getByText('Finland')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  test('allows searching for countries by name', async () => {
    const authContextValue = {
      user: null,
      isFavorite: (countryCode) => false,
      toggleFavorite: jest.fn()
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <CountryList />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('All Countries')).toBeInTheDocument();
    });

    // Search for "Finland"
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'Fin' } });

    // Only Finland should be displayed
    expect(screen.getByText('Finland')).toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
  });

  test('allows filtering by language', async () => {
    const authContextValue = {
      user: null,
      isFavorite: (countryCode) => false,
      toggleFavorite: jest.fn()
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <CountryList />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('All Countries')).toBeInTheDocument();
    });

    // Filter by Japanese language
    const languageSelect = screen.getByDisplayValue('Filter by Language');
    fireEvent.change(languageSelect, { target: { value: 'Japanese' } });

    // Only Japan should be displayed
    expect(screen.queryByText('Finland')).not.toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  test('navigates to country detail page when a country is clicked', async () => {
    const authContextValue = {
      user: null,
      isFavorite: (countryCode) => false,
      toggleFavorite: jest.fn()
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <CountryList />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('All Countries')).toBeInTheDocument();
    });

    // Click on Finland
    const finlandCard = screen.getByText('Finland');
    fireEvent.click(finlandCard);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/country/FIN');
  });

  test('displays favorites button when user is logged in', async () => {
    const authContextValue = {
      user: { uid: 'test-user-id', name: 'Test User' },
      isFavorite: (countryCode) => false,
      toggleFavorite: jest.fn()
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <CountryList />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('All Countries')).toBeInTheDocument();
    });

    // Check if favorites button is displayed
    const favoritesButton = screen.getByText('My Favorites');
    expect(favoritesButton).toBeInTheDocument();

    // Click on favorites button
    fireEvent.click(favoritesButton);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/favorites');
  });
});