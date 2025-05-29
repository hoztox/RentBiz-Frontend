import React, { useState } from "react";
import { BASE_URL } from "../../../../../utils/config";
import "./documentsview.css";

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

  const getDocTypeName = (docType) => {
    if (!docTypes.length) return docType || "N/A";
    const type = docTypes.find((t) => t.id === parseInt(docType));
    return type ? type.title : docType || "N/A";
  };

  const getDocumentInfo = (file) => {
    if (!file || (typeof file === "string" && file.includes("The submitted data was not a file"))) {
      return { type: "unknown", name: "Invalid File" };
    }

    let extension, name;
    if (typeof file === "string") {
      const fileName = file.split("/").pop();
      extension = fileName.split(".").pop()?.toLowerCase() || "";
      name = fileName;
    } else if (file instanceof File) {
      extension = file.name.split(".").pop()?.toLowerCase() || "";
      name = file.name;
    } else {
      return { type: "unknown", name: "Unknown File" };
    }

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
    try {
      switch (type) {
        case "pdf":
          return <FileText className="text-blue-500" size={24} />;
        case "image":
          return <Image className="text-blue-500" size={24} />;
        default:
          return <File className="text-blue-500" size={24} />;
      }
    } catch (error) {
      console.error("Failed to render lucide-react icon:", error);
      return <span className="text-blue-500">📄</span>;
    }
  };

  const getFileSource = (file) => {
    if (!file || (typeof file === "string" && file.includes("The submitted data was not a file"))) {
      return null;
    }
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof file === "string") {
      return file.startsWith("http") ? file : `${BASE_URL}${file.startsWith("/") ? "" : "/"}${file}`;
    }
    return null;
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

  console.log("DocumentsView: Visible documents:", visibleDocuments);

  return (
    <div className="flex flex-col w-full">
      <h1 className="documents-head pb-5">Documents</h1>
      {safeDocuments.length === 0 ? (
        <p className="text-gray-500">No documents uploaded.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:!grid-cols-5 gap-4 mb-4">
            {visibleDocuments.map((doc, index) => {
              const file = Array.isArray(doc.upload_file)
                ? doc.upload_file[0]
                : doc.upload_file || (Array.isArray(doc.existing_files) && doc.existing_files.length > 0 ? doc.existing_files[0] : null);
              const { type, name } = file
                ? getDocumentInfo(file)
                : {
                    type: "unknown",
                    name: doc.number || `Document ${index + 1}`,
                  };
              const fileSrc = getFileSource(file);

              return (
                <div key={index} className="flex flex-col">
                  <div className="bg-gray-100 rounded-md overflow-hidden cursor-pointer">
                    <div className="relative bg-white">
                      {type === "image" && fileSrc ? (
                        <img
                          src={fileSrc}
                          alt={name}
                          className="object-cover h-[220px] w-full"
                          onLoad={(e) => {
                            if (file instanceof File) {
                              URL.revokeObjectURL(e.target.src);
                            }
                          }}
                          onError={(e) => {
                            console.error("Failed to load image:", name);
                            e.target.style.display = "none";
                            e.target.parentNode.innerHTML = `
                              <div class="w-full h-[220px] flex items-center justify-center bg-[#1458A2]">
                                <span className="text-blue-500">📄</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-[220px] flex items-center justify-center bg-[#1458A2]">
                          {getDocumentIcon(type)}
                        </div>
                      )}
                    </div>
                    <div className="p-2 px-3 bg-[#1458A2] text-start">
                      <p className="document-name text-white truncate">
                        {getDocTypeName(doc.doc_type)}: {name}
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