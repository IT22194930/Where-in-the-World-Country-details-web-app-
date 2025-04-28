import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import CountryCard from './CountryCard';

const FavoriteCountries = () => {
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, favorites } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavoriteCountries = async () => {
      if (!favorites || favorites.length === 0) {
        setFavoriteCountries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allCountries = await api.getAllCountries();
        const userFavorites = allCountries.filter(country => 
          favorites.includes(country.cca3)
        );
        setFavoriteCountries(userFavorites);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching favorite countries:', err);
        setError('Failed to load favorite countries. Please try again later.');
        setLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, [user, favorites, navigate]);

  const handleCountryClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Back to countries list"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white flex items-center">
            <Heart className="mr-2" /> My Favorite Countries
          </h1>
        </div>
      </div>

      {favoriteCountries.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't added any countries to your favorites yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Explore Countries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteCountries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
              onClick={() => handleCountryClick(country.cca3)}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteCountries;