import React, { createContext, useContext, useState } from "react";

   const ModalContext = createContext();

   export const ModalProvider = ({ children }) => {
     const [modalState, setModalState] = useState({
       type: null, // e.g., "user-create", "user-update"
       isOpen: false,
       data: null, // For passing user data
     });

     const openModal = (type, data = null) => {
       setModalState({ type, isOpen: true, data });
     };

     const closeModal = () => {
       setModalState({ type: null, isOpen: false, data: null });
     };

     return (
       <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
         {children}
       </ModalContext.Provider>
     );
   };

   export const useModal = () => useContext(ModalContext);