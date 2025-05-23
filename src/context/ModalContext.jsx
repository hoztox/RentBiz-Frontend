import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    type: null, // e.g., "user-create", "user-update"
    isOpen: false,
    data: null, // For passing user data
  });
  
  // Add refresh counter state
  const [refreshCounter, setRefreshCounter] = useState(0);

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  // Add refresh function
  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <ModalContext.Provider 
      value={{ 
        modalState, 
        openModal, 
        closeModal,
        refreshCounter,  // Expose the counter
        triggerRefresh   // Expose the refresh function
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);