import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import CountryList from '../components/CountryList';
import CountryDetail from '../components/CountryDetail';
import Login from '../components/Login';
import Register from '../components/Register';
import FavoriteCountries from '../components/FavoriteCountries';
import AppLayout from '../components/AppLayout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <CountryList />,
        },
        {
          path: 'country/:countryCode',
          element: <CountryDetail />,
        },
        {
          path: 'favorites',
          element: <FavoriteCountries />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
      ],
    },
  ],
);
