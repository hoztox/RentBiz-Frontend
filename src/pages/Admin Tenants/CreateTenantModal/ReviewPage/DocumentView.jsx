import React, { useState } from "react";
import { File, FileText, Image } from "lucide-react";
import "./DocumentView.css";

const DocumentsView = ({ documents = [], docTypes = [] }) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [currentPage, setCurrentPage] = useState(0);
  const documentsPerPage = 5;
  const startIndex = currentPage * documentsPerPage;
  const visibleDocuments = safeDocuments.slice(
    startIndex,
    startIndex + documentsPerPage
  );
  const totalPages = Math.ceil(safeDocuments.length / documentsPerPage);

  const getDocTypeName = (docTypeId) => {
    const type = docTypes.find((t) => t.id === parseInt(docTypeId));
    return type ? type.title : docTypeId || "N/A";
  };

  const getDocumentInfo = (file) => {
    if (!file) return { type: "unknown", name: "Unknown File" };
    const extension = file.name.split(".").pop().toLowerCase();
    const name = file.name;
    let type;
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      type = "image";
    } else if (extension === "pdf") {
      type = "pdf";
    } else {
      type = "file";
    }
    return { type, name };
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="text-blue-500" size={24} />;
      case "image":
        return <Image className="text-blue-500" size={24} />;
      default:
        return <File className="text-blue-500" size={24} />;
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden">
      <h1 className="documents-head pb-5">Documents</h1>
      {safeDocuments.length === 0 ? (
        <p className="text-gray-500">No documents uploaded.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 min-[480px]:!grid-cols-5 gap-0.5 min-[480px]:gap-4">
            {visibleDocuments.map((doc, index) => {
              const file = Array.isArray(doc.upload_file)
                ? doc.upload_file[0]
                : null;
              const { type, name } = file
                ? getDocumentInfo(file)
                : {
                    type: "unknown",
                    name: doc.number || `Document ${index + 1}`,
                  };
              return (
                <div key={index} className="flex flex-col w-full max-w-[150px] min-[480px]:max-w-none mx-auto min-[480px]:mx-0">
                  <div className="bg-gray-100 rounded-md overflow-hidden cursor-pointer box-border">
                    <div className="relative bg-white">
                      {type === "image" && file ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={name}
                          className="object-cover h-[162px] w-full"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        />
                      ) : (
                        <div className="w-full h-auto max-h-[120px] min-[480px]:h-[220px] min-[480px]:max-h-[220px] aspect-[4/3] flex items-center justify-center bg-[#1458A2]">
                          {getDocumentIcon(type)}
                        </div>
                      )}
                    </div>
                    <div className="p-2 min-[480px]:p-2 min-[480px]:px-3 bg-[#1458A2] text-start">
                      <p className="document-name text-white text-xs min-[480px]:text-base truncate">
                        {getDocTypeName} {name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="self-center">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentsView;