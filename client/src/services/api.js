import { API_CONFIG } from '../config/api.config';

const makeRequest = async (endpoint) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

export const api = {
  getAllCountries: () => makeRequest(API_CONFIG.endpoints.ALL_COUNTRIES),
  
  getCountryByName: (name) => makeRequest(API_CONFIG.endpoints.COUNTRY_BY_NAME(name)),
  
  getCountriesByRegion: (region) => makeRequest(API_CONFIG.endpoints.COUNTRIES_BY_REGION(region)),
  
  getCountryByCode: (code) => {
    // If it's a comma-separated list, use the codes endpoint
    if (code.includes(',')) {
      return makeRequest(`/alpha?codes=${code}`);
    }
    // For single country code
    return makeRequest(`/alpha/${code}`);
  },
}; 