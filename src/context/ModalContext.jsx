import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    type: null, // e.g., "user-create", "user-update"
    isOpen: false,
    title: null,
    data: null,
    // For passing user data
  });

  // Add refresh counter state
  const [refreshCounter, setRefreshCounter] = useState(0);

  const openModal = (type, title, data = null) => {
    setModalState({ type, isOpen: true, title, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, title: null, data: null });
  };

  // Add refresh function
  const triggerRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const updateModal = (updates) => {
    setModalState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ModalContext.Provider
      value={{
        modalState,
        openModal,
        closeModal,
        refreshCounter, // Expose the counter
        triggerRefresh, // Expose the refresh function
        updateModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
