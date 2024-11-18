import React, { createContext, useState } from "react";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [selectedAddress, setSelectedAdress] = useState(null);

  return (
    <AddressContext.Provider value={{ selectedAddress, setSelectedAdress }}>
      {children}
    </AddressContext.Provider>
  );
};
