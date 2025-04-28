import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CountryCard from '../../components/CountryCard';
import { AuthContext } from '../../context/AuthContext';

// Mock country data
const mockCountry = {
  name: { common: 'Finland' },
  population: 5530719,
  region: 'Europe',
  capital: ['Helsinki'],
  flags: { svg: 'finland-flag.svg', png: 'finland-flag.png' },
  languages: { fin: 'Finnish', swe: 'Swedish' },
  cca3: 'FIN'
};

describe('CountryCard Component', () => {
  // Test rendering with no user (not logged in)
  test('renders country information correctly when not logged in', () => {
    const mockOnClick = jest.fn();
    const authContextValue = {
      user: null,
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn()
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <CountryCard country={mockCountry} onClick={mockOnClick} />
      </AuthContext.Provider>
    );

    // Check if country name is displayed
    expect(screen.getByText('Finland')).toBeInTheDocument();
    
    // Check if population is displayed
    expect(screen.getByText(/5,530,719/)).toBeInTheDocument();
    
    // Check if region is displayed
    expect(screen.getByText(/Europe/)).toBeInTheDocument();
    
    // Check if capital is displayed
    expect(screen.getByText(/Helsinki/)).toBeInTheDocument();
    
    // Check if languages are displayed
    expect(screen.getByText(/Finnish, Swedish/)).toBeInTheDocument();
    
    // Favorite button should not be visible when not logged in
    expect(screen.queryByRole('button', { name: /Add to favorites|Remove from favorites/ })).not.toBeInTheDocument();
    
    // Test click on card
    fireEvent.click(screen.getByText('Finland'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // Test rendering with a logged-in user and country not in favorites
  test('renders favorite button correctly when logged in and not favorited', () => {
    const mockOnClick = jest.fn();
    const mockToggleFavorite = jest.fn();
    const authContextValue = {
      user: { uid: 'test-user-id' },
      toggleFavorite: mockToggleFavorite,
      isFavorite: () => false
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <CountryCard country={mockCountry} onClick={mockOnClick} />
      </AuthContext.Provider>
    );

    // Favorite button should be visible when logged in
    const favoriteButton = screen.getByRole('button', { name: 'Add to favorites' });
    expect(favoriteButton).toBeInTheDocument();
    
    // Test favorite button click
    fireEvent.click(favoriteButton);
    expect(mockToggleFavorite).toHaveBeenCalledWith('FIN');
    expect(mockOnClick).not.toHaveBeenCalled(); // Card onClick should not trigger
  });

  // Test rendering with a logged-in user and country in favorites
  test('renders favorite button correctly when logged in and favorited', () => {
    const mockOnClick = jest.fn();
    const authContextValue = {
      user: { uid: 'test-user-id' },
      toggleFavorite: jest.fn(),
      isFavorite: () => true
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <CountryCard country={mockCountry} onClick={mockOnClick} />
      </AuthContext.Provider>
    );

    // Favorite button should be visible and show as favorited
    const favoriteButton = screen.getByRole('button', { name: 'Remove from favorites' });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass('text-red-500');
  });
});