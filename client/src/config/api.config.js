export const API_CONFIG = {
  BASE_URL: 'https://restcountries.com/v3.1',
  endpoints: {
    ALL_COUNTRIES: '/all',
    COUNTRY_BY_NAME: (name) => `/name/${name}`,
    COUNTRIES_BY_REGION: (region) => `/region/${region}`,
    COUNTRY_BY_CODE: (code) => `/alpha/${code}`,
    COUNTRIES_BY_CODES: (codes) => `/alpha?codes=${codes}`,
  }
}; 