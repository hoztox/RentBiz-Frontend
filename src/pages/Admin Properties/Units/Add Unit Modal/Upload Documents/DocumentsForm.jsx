import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import documentIcon from '../../../../../assets/Images/Admin Units/document-icon.svg';
import calendarIcon from '../../../../../assets/Images/Admin Units/calendar-icon.svg';
import closeIcon from '../../../../../assets/Images/Admin Units/close-icon-white.svg';
import plusIcon from '../../../../../assets/Images/Admin Units/plus-icon-black.svg';
import './documents.css'

const DocumentsForm = ({ onNext }) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "Permit",
      number: "0123456789",
      issueDate: "19/01/2024",
      expiryDate: "19/01/2024",
      files: ["Attach Files"]
    },
    {
      id: 2,
      type: "Permit",
      number: "0123456789",
      issueDate: "19/01/2024",
      expiryDate: "19/01/2024",
      files: ["Attach Files"]
    },
    {
      id: 3,
      type: "Permit",
      number: "",
      issueDate: "",
      expiryDate: "",
      files: ["Attach Files"]
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ documentsUploaded: true });
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      type: "Permit",
      number: "",
      issueDate: "",
      expiryDate: "",
      files: []
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="w-full flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {/* Document List */}
          <div>
            {documents.map((doc, index) => (
              <div key={doc.id} className="border-b">
                <div className="grid grid-cols-12 gap-x-4 gap-y-6 px-6 py-6">
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-2">Doc.Type</label>
                    <div className="relative">
                      <select 
                        className="text-sm text-gray-700 appearance-none bg-white doctype-input" 
                        defaultValue={doc.type}
                      >
                        <option value="Permit">Permit</option>
                        <option value="License">License</option>
                        <option value="Certificate">Certificate</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-2">Number</label>
                    <input
                      type="text"
                      className="p-2 text-sm phone-input"
                      defaultValue={doc.number}
                      placeholder="0123456789"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-2">Issue Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2 text-sm date-input"
                        defaultValue={doc.issueDate}
                        placeholder="19/01/2024"
                      />
                      <img src={calendarIcon} alt="" className="absolute right-2 top-2 h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-2">Expiry Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2 text-sm date-input"
                        defaultValue={doc.expiryDate}
                        placeholder="19/01/2024"
                      />
                      <img src={calendarIcon} alt="" className="absolute right-2 top-2 h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-2">Upload Files</label>
                    <button 
                      type="button" 
                      className="flex items-center justify-between text-sm text-gray-700 bg-white attachfile-button"
                    >
                      <span>{doc.files.length ? doc.files[0] : "Upload"}</span>
                      <img src={documentIcon} alt="" className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="col-span-1 flex items-end justify-end">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="p-2 bg-[#E44747] hover:bg-[#d43939] remove-btn"
                    >
                      <img src={closeIcon} className="h-5 w-5 ml-[2px]" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Document Button */}
          <div className="px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddDocument}
              className="inline-flex justify-center items-center px-5 py-5 text-[#201D1E] bg-white hover:bg-gray-100 add-button"
            > 
              Add
              <img src={plusIcon} className='ml-1 h-5 w-5' alt="" />
            </button>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 p-6 border-t mt-auto">
          <button
            type="button"
            className="text-[#201D1E] hover:bg-gray-100 back-button"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[#2892CE] text-white  hover:bg-[#1f709e] next-button"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentsForm;