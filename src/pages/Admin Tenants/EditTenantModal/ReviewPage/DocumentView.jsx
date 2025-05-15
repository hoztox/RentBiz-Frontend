import React from "react";
import "./documentview.css";
import { File, FileText, Image } from "lucide-react";
import img1 from "../../../../assets/Images/Admin Tenants/img1.jpg";
import img2 from "../../../../assets/Images/Admin Tenants/img2.jpg";
import img3 from "../../../../assets/Images/Admin Tenants/img3.jpg";
import img4 from "../../../../assets/Images/Admin Tenants/img4.jpg";
import img5 from "../../../../assets/Images/Admin Tenants/img5.jpg";

const DocumentView = ({ documents = [] }) => {
  const [currentPage] = useState(0);
  const documentsPerPage = 5;
  const startIndex = currentPage * documentsPerPage;
  const visibleDocuments = documents.slice(
    startIndex,
    startIndex + documentsPerPage
  );

  // Determine which icon to use based on document type
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

  return (
    <div className="flex flex-col w-full">
      <h1 className="documents-head pb-5">Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {visibleDocuments.map((doc, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-gray-100 rounded-md overflow-hidden cursor-pointer">
              <div className="relative bg-white ">
                {doc.thumbnail ? (
                  <img
                    src={doc.thumbnail}
                    alt={doc.name}
                    className="object-cover h-[220px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1458A2]">
                    {getDocumentIcon(doc.type)}
                  </div>
                )}
              </div>
              <div className="p-2 px-3 bg-[#1458A2] text-start">
                <p className="document-name text-white truncate">{doc.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage with dynamic state
const DemoComponent = () => {
  const [sampleDocuments] = useState([
    {
      name: "Img 802017a12",
      type: "image",
      thumbnail: img1,
    },
    {
      name: "Pdf 20271890",
      type: "pdf",
      thumbnail: img2,
    },
    {
      name: "Img 802017a12",
      type: "image",
      thumbnail: img3,
    },
    {
      name: "Img 802017a12",
      type: "image",
      thumbnail: img4,
    },
    {
      name: "Img 802017a12",
      type: "image",
      thumbnail: img5,
    },
  ]);

  return (
    <div className="pt-5">
      <DocumentView documents={sampleDocuments} />
    </div>
  );
};

export default DemoComponent;
