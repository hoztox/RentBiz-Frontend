import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    title: "",
    data: null,
  });

  const [refreshCounter, setRefreshCounter] = useState(0);

  const openModal = (type, title = "", data = null) => {
    setModalState({ type, isOpen: true, title: String(title), data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, title: "", data: null });
  };

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
        refreshCounter,
        triggerRefresh,
        updateModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
