import React, { useContext } from "react";
import { HeartIcon } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
const CountryCard = ({ country, onClick }) => {
  const { user, toggleFavorite, isFavorite } = useContext(AuthContext);
  const favorite = user ? isFavorite(country.cca3) : false;
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(country.cca3);
    }
  };
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            {country.name.common}
          </h3>
          {user && (
            <button
              onClick={handleFavoriteClick}
              className={`p-1 rounded-full ${
                favorite ? "text-red-500" : "text-gray-400 dark:text-gray-500"
              }`}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <HeartIcon size={18} fill={favorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        <div className="space-y-1 text-sm dark:text-gray-300">
          <p>
            <span className="font-medium">Population:</span>{" "}
            {country.population.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Region:</span> {country.region}
          </p>
          <p>
            <span className="font-medium">Capital:</span>{" "}
            {country.capital?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-medium">Languages:</span>{" "}
            {country.languages
              ? Object.values(country.languages).join(", ")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default CountryCard;
