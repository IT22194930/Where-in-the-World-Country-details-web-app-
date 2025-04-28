import React, { useEffect, useState, createContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Format user data
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email
        };
        
        setUser(userData);
        
        // Get user's favorites from Firestore
        await fetchUserFavorites(currentUser.uid);
      } else {
        setUser(null);
        setFavorites([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user favorites from Firestore
  const fetchUserFavorites = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists() && docSnap.data().favorites) {
        setFavorites(docSnap.data().favorites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Register new user
  const register = async (name, email, password) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Update profile to add display name
      await updateProfile(newUser, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        name,
        email,
        favorites: [],
        createdAt: new Date().toISOString()
      });

      return {
        uid: newUser.uid,
        email: newUser.email,
        name
      };
    } catch (error) {
      let errorMessage = "Registration failed";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already registered";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format";
      }
      
      throw new Error(errorMessage);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      
      return {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        name: loggedInUser.displayName || loggedInUser.email
      };
    } catch (error) {
      let errorMessage = "Login failed";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFavorites([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Toggle favorite country
  const toggleFavorite = async (countryCode) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // Check if the document exists first
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        // Create the user document if it doesn't exist
        await setDoc(userDocRef, {
          name: user.name || '',
          email: user.email || '',
          favorites: [countryCode],
          createdAt: new Date().toISOString()
        });
        
        setFavorites([countryCode]);
      } else {
        // Document exists, update as before
        if (favorites.includes(countryCode)) {
          // Remove from favorites
          await updateDoc(userDocRef, {
            favorites: arrayRemove(countryCode)
          });
          
          setFavorites(favorites.filter(code => code !== countryCode));
        } else {
          // Add to favorites
          await updateDoc(userDocRef, {
            favorites: arrayUnion(countryCode)
          });
          
          setFavorites([...favorites, countryCode]);
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const isFavorite = countryCode => {
    return favorites.includes(countryCode);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        register,
        logout,
        toggleFavorite,
        isFavorite,
        favorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};