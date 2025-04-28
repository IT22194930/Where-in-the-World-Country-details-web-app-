import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HeartIcon, ExternalLinkIcon, RefreshCwIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const CountryDetail = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite } = useContext(AuthContext);
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const favorite = user && country ? isFavorite(country.cca3) : false;
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchCountryDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getCountryByCode(countryCode);
      setCountry(data[0]);
      
      if (data[0].borders?.length > 0) {
        const borderData = await api.getCountryByCode(data[0].borders.join(','));
        setBorderCountries(borderData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchCountryDetails();
    }
  }, [countryCode]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFavoriteClick = () => {
    if (user && country) {
      toggleFavorite(country.cca3);
    }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        {retryCount > 0 && <p className="text-sm text-gray-600 dark:text-gray-400">
            Retrying... (Attempt {retryCount} of {maxRetries})
          </p>}
      </div>;
  }
  if (error || !country) {
    return <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
          <p className="mb-4">{error || 'Country not found'}</p>
          <button onClick={() => {
          setRetryCount(0);
          setError(null);
          setLoading(true);
          fetchCountryDetails();
        }} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            <RefreshCwIcon size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>;
  }
  const languages = country.languages ? Object.values(country.languages) : [];
  const currencies = country.currencies ? Object.values(country.currencies).map(currency => `${currency.name} (${currency.symbol || ''})`).join(', ') : 'N/A';
  return <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={handleGoBack} className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white">
          <ArrowLeftIcon size={16} className="text-gray-800 dark:text-white" />
          <span>Back</span>
        </button>
        {user && <button onClick={handleFavoriteClick} className={`flex items-center space-x-2 px-4 py-2 rounded-md ${favorite ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 'bg-white dark:bg-gray-500 dark:text-white'}`}>
            <HeartIcon size={16} fill={favorite ? 'currentColor' : 'none'} />
            <span>
              {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </span>
          </button>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="shadow-md rounded-md overflow-hidden">
          <img src={country.flags.svg || country.flags.png} alt={`Flag of ${country.name.common}`} className="w-full h-auto object-cover" />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold dark:text-white">
            {country.name.common}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="dark:text-gray-300">
                <span className="font-semibold">Native Name:</span>{' '}
                {country.name.nativeName ? Object.values(country.name.nativeName)[0].common : country.name.common}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">Population:</span>{' '}
                {country.population.toLocaleString()}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">Region:</span> {country.region}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">Sub Region:</span>{' '}
                {country.subregion || 'N/A'}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">Capital:</span>{' '}
                {country.capital?.join(', ') || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="dark:text-gray-300">
                <span className="font-semibold">Top Level Domain:</span>{' '}
                {country.tld?.join(', ') || 'N/A'}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">Currencies:</span> {currencies}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">Languages:</span>{' '}
                {languages.join(', ') || 'N/A'}
              </p>
            </div>
          </div>
          {country.maps?.googleMaps && <div>
              <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline">
                <span>View on Google Maps</span>
                <ExternalLinkIcon size={16} />
              </a>
            </div>}
          {borderCountries.length > 0 && <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                Border Countries:
              </h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map(border => <button key={border.cca3} onClick={() => navigate(`/country/${border.cca3}`)} className="px-4 py-1 bg-gray-200 shadow-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700  dark:bg-gray-600 dark:text-white transition-colors text-sm">
                    {border.name.common}
                  </button>)}
              </div>
            </div>}
        </div>
      </div>
    </div>;
};

export default CountryDetail;