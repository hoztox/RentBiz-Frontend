import React, { useState, useEffect } from "react";
import "./documentview.css";
import { BASE_URL } from "../../../../../utils/config";

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
      const fileName = file.split("/").pop() || "Unknown File";
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
    switch (type) {
      case "pdf":
        return <span className="text-blue-500">📕</span>;
      case "image":
        return <span className="text-blue-500">🖼️</span>;
      default:
        return <span className="text-blue-500">📄</span>;
    }
  };

  const getFileSource = (file) => {
    if (!file || (typeof file === "string" && file.includes("The submitted data was not a file"))) {
      console.warn("Invalid file data:", file);
      return null;
    }
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof file === "string") {
      const url = file.startsWith("http") ? file : `${BASE_URL}${file.startsWith("/") ? "" : "/"}${file}`;
      return url;
    }
    console.warn("Unexpected file type:", file);
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

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      visibleDocuments.forEach((doc) => {
        const file = Array.isArray(doc.upload_file) ? doc.upload_file[0] : doc.upload_file;
        if (file instanceof File) {
          const url = getFileSource(file);
          if (url) URL.revokeObjectURL(url);
        }
      });
    };
  }, [visibleDocuments]);

  console.log("DocumentsView: Visible documents:", visibleDocuments.map(doc => ({
    ...doc,
    upload_file: doc.upload_file,
    fileSrc: getFileSource(Array.isArray(doc.upload_file) ? doc.upload_file[0] : doc.upload_file),
    fileType: getDocumentInfo(Array.isArray(doc.upload_file) ? doc.upload_file[0] : doc.upload_file).type
  })));

  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden">
      {safeDocuments.length === 0 ? (
        <p className="text-gray-500">No documents uploaded.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 min-[480px]:!grid-cols-5 gap-0.5 min-[480px]:gap-4">
            {visibleDocuments.map((doc, index) => {
              const file = Array.isArray(doc.upload_file) ? doc.upload_file[0] : doc.upload_file;
              const { type, name } = file
                ? getDocumentInfo(file)
                : {
                    type: "unknown",
                    name: doc.number || `Document ${index + 1}`,
                  };
              const fileSrc = getFileSource(file);

              return (
                <div
                  key={doc.id || index}
                  className="flex flex-col w-full max-w-[150px] min-[480px]:max-w-none mx-auto min-[480px]:mx-0"
                >
                  <div className="bg-gray-100 rounded-md overflow-hidden cursor-pointer box-border relative">
                    <div className="relative bg-white">
                      {type === "image" && fileSrc ? (
                        <img
                          src={fileSrc}
                          alt={name}
                          className="object-cover h-[162px] w-full"
                          onLoad={(e) => {
                            if (file instanceof File) {
                              URL.revokeObjectURL(e.target.src);
                            }
                          }}
                          onError={(e) => {
                            console.error("Failed to load image:", name, fileSrc);
                            e.target.style.display = "none";
                            e.target.parentNode.innerHTML = `
                              <div class="w-full h-[220px] flex items-center justify-center bg-[#1458A2]">
                                <span className="text-blue-500">🖼️</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-auto max-h-[120px] min-[480px]:h-[220px] min-[480px]:max-h-[220px] aspect-[4/3] flex items-center justify-center bg-[#1458A2]">
                          {fileSrc ? getDocumentIcon(type) : <span className="text-blue-500">📄</span>}
                        </div>
                      )}
                    </div>
                    <div className="p-2 min-[480px]:p-2 min-[480px]:px-3 bg-[#1458A2] text-start">
                      <p className="document-name text-white text-xs min-[480px]:text-base truncate">
                        {getDocTypeName(doc.doc_type)} - {name}
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