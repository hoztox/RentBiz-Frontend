// DocumentsForm.jsx
import React from 'react';

const DocumentsForm = ({ onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ documentsUploaded: true });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop files here, or click to select files
            </p>
          </div>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            multiple
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => document.getElementById('file-upload').click()}
          >
            Select files
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Uploaded Documents</h3>
          <p className="text-gray-500 text-sm">No documents uploaded yet</p>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default DocumentsForm;