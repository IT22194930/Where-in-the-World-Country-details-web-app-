import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, FilterIcon, RefreshCwIcon, Heart } from "lucide-react";
import CountryCard from "./CountryCard";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [regions, setRegions] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCountries = async (attempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      setIsRetrying(attempt > 0);
      const data = await api.getAllCountries();
      setCountries(data);
      setFilteredCountries(data);
      const uniqueRegions = [
        ...new Set(data.map((country) => country.region)),
      ].filter(Boolean);
      setRegions(uniqueRegions.sort());
      const allLanguages = [];
      data.forEach((country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((lang) => {
            if (!allLanguages.includes(lang)) {
              allLanguages.push(lang);
            }
          });
        }
      });
      setLanguages(allLanguages.sort());
      setLoading(false);
      setIsRetrying(false);
      setRetryCount(0);
    } catch (err) {
      console.error("Fetch error:", err);
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        setTimeout(() => {
          setRetryCount(attempt + 1);
          fetchCountries(attempt + 1);
        }, delay);
      } else {
        setError(
          "Unable to load countries. Please check your connection and try again."
        );
        setLoading(false);
        setIsRetrying(false);
      }
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    let result = countries;
    if (searchTerm) {
      result = result.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (regionFilter) {
      result = result.filter((country) => country.region === regionFilter);
    }
    if (languageFilter && languageFilter !== "") {
      result = result.filter((country) => {
        if (!country.languages) return false;
        return Object.values(country.languages).some(
          (lang) => lang.toLowerCase() === languageFilter.toLowerCase()
        );
      });
    }
    setFilteredCountries(
      result.sort((a, b) => a.name.common.localeCompare(b.name.common))
    );
  }, [countries, searchTerm, regionFilter, languageFilter]);

  const handleCountryClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        {isRetrying && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Retrying... (Attempt {retryCount} of {maxRetries})
          </p>
        )}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              setError(null);
              setLoading(true);
              fetchCountries();
            }}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCwIcon size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Title and Favorites Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">All Countries</h1>
        {user && (
          <button
            onClick={() => navigate('/favorites')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Heart size={18} />
            <span>My Favorites</span>
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for a country..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Filter by Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FilterIcon className="text-gray-400" size={16} />
            </div>
          </div>
          <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Filter by Language</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FilterIcon className="text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>
      {filteredCountries.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            No countries found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
              onClick={() => handleCountryClick(country.cca3)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryList;
