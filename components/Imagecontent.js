// ImageContext.js

import React, { createContext, useState, useContext } from 'react';

const ImageContext = createContext();

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(require('../assets/PROF.jpg'));

  return (
    <ImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ImageContext.Provider>
  );
};
