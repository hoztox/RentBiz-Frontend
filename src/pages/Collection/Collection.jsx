import React from "react";
import { BASE_URL } from "../../utils/config";
import plusicon from "../../assets/Images/Collection/plus-icon.svg";
import downloadicon from "../../assets/Images/Collection/download-icon.svg";
import editicon from "../../assets/Images/Collection/edit-icon.svg";
import downloadactionicon from "../../assets/Images/Collection/download-action-icon.svg";
import downarrow from "../../assets/Images/Collection/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import GenericTable from "../../components/ui/GenericTable";
import "./Collection.css";

const Collection = () => {
  const { openModal } = useModal();

  const paymentMethodOptions = [
    { value: "", label: "All Payments" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "cheque", label: "Cheque" },
    { value: "online_payment", label: "Online Payment" },
  ];

  const upcomingPaymentsOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Upcoming" },
  ];

  const formatPaymentMethod = (method) =>
    method
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const formatInvoiceStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-[15px] py-[5px] rounded-[4px] w-[100px] h-[28px] bg-[#FFE1E1] text-[#C72828]">
            Pending
          </span>
        );
      case "paid":
        return (
          <span className="px-[15px] py-[5px] rounded-[4px] w-[100px] h-[28px] bg-[#28C76F29] text-[#28C76F]">
            Paid
          </span>
        );
      default:
        return (
          <span className="px-[15px] py-[5px] rounded-[4px] w-[100px] h-[28px] bg-[#FFF7E9] text-[#FBAD27]">
            Partially Paid
          </span>
        );
    }
  };

  const handleEditClick = (id) => {
    openModal("update-collection", "Update Collection", { id });
  };

  return (
    <GenericTable
      title="Collection"
      apiEndpoint={() => `${BASE_URL}/finance/collections/`}
      downloadEndpoint={() => `${BASE_URL}/finance/collections/download/`}
      dataKey="id"
      filterOptions={[
        {
          key: "tenancy_id",
          type: "dropdown",
          options: (data) => [
            { label: "All Tenancies", value: "" },
            ...[...new Set(data.map((item) => item.tenancy_id))].map((tid) => ({
              label: tid,
              value: tid,
            })),
          ],
        },
        {
          key: "tenant_name",
          type: "dropdown",
          options: (data) => [
            { label: "All Tenants", value: "" },
            ...[...new Set(data.map((item) => item.tenant_name))].map((name) => ({
              label: name,
              value: name,
            })),
          ],
        },
        {
          key: "payment_method",
          type: "dropdown",
          options: () => paymentMethodOptions,
        },
        {
          key: "upcoming_payments",
          type: "dropdown",
          options: () => upcomingPaymentsOptions,
        },
        {
          key: "date_range",
          type: "date",
        },
      ]}
      columns={{
        main: [
          {
            key: "id",
            label: "ID",
            className: "text-left collection-data",
          },
          {
            key: "collection_date",
            label: "DATE",
            className: "text-left collection-data",
          },
          {
            key: "tenant_name",
            label: "TENANT NAME",
            className: "text-left collection-data pl-5",
          },
          {
            key: "amount",
            label: "AMOUNT",
            className: "text-left collection-data",
          },
          {
            key: "collection_mode",
            label: "PAYMENT METHOD",
            className: "text-left collection-data",
            render: (item) => formatPaymentMethod(item.collection_mode),
          },
          {
            key: "invoice_status",
            label: "INVOICE STATUS",
            className: "text-left collection-data",
            render: (item) => formatInvoiceStatus(item.invoice_status),
          },
          {
            key: "action",
            label: "ACTION",
            className: "text-right collection-data w-[100px]",
            render: (item) => (
              <div className="flex gap-[23px] items-center justify-end h-[57px]">
                <button onClick={() => handleEditClick(item.id)}>
                  <img
                    src={editicon}
                    alt="Edit"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
                <button>
                  <img
                    src={downloadactionicon}
                    alt="Download"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
              </div>
            ),
          },
        ],
        mobile: [
          {
            key: "id",
            label: "ID",
            className: "text-left collection-data collection-id-column",
          },
          {
            key: "tenant_name",
            label: "TENANT NAME",
            className: "text-left collection-data collection-date-column",
          },
          {
            key: "dropdown",
            label: "",
            className: "text-right",
          },
        ],
      }}
      modalConfig={{
        create: {
          id: "create-collection",
          title: "Create Collection",
          label: "Add Collection",
          icon: plusicon,
          onClick: () => openModal("create-collection", "Create Collection"),
        },
      }}
      customMobileRow={(item, { handleDeleteClick, openModal }) => (
        <div className="collection-dropdown-content">
          <div className="collection-dropdown-grid">
            <div className="collection-dropdown-item w-[50%]">
              <div className="collection-dropdown-label">TENANCY ID</div>
              <div className="collection-dropdown-value">{item.tenancy_id}</div>
            </div>
            <div className="collection-dropdown-item w-[50%]">
              <div className="collection-dropdown-label">DATE</div>
              <div className="collection-dropdown-value">{item.collection_date}</div>
            </div>
          </div>
          <div className="collection-dropdown-grid">
            <div className="collection-dropdown-item w-[50%]">
              <div className="collection-dropdown-label">AMOUNT</div>
              <div className="collection-dropdown-value">{item.amount}</div>
            </div>
            <div className="collection-dropdown-item w-[50%]">
              <div className="collection-dropdown-label">PAYMENT METHOD</div>
              <div className="collection-dropdown-value">
                {formatPaymentMethod(item.collection_mode)}
              </div>
            </div>
          </div>
          <div className="collection-dropdown-grid">
            <div className="collection-dropdown-item w-[50%]">
              <div className="collection-dropdown-label">INVOICE STATUS</div>
              <div className="collection-dropdown-value">
                {formatInvoiceStatus(item.invoice_status)}
              </div>
            </div>
            <div className="collection-dropdown-item w-[50%]">
              <div className="collection-dropdown-label">ACTION</div>
              <div className="collection-dropdown-value flex items-center gap-4 mt-2">
                <button onClick={() => openModal("update-collection", "Update Collection", { id: item.id })}>
                  <img
                    src={editicon}
                    alt="Edit"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
                <button>
                  <img
                    src={downloadactionicon}
                    alt="Download"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      customStyles={{
        container: "collection-table",
        header: "collection-table-header",
        search: "collection-search",
        filterContainer: "collection-desktop-only",
        filterButton: "filter-btn",
        clearButton: "clear-btn",
        addButton: "add-collection",
        downloadButton: "collection-download-btn",
        downloadImage: "download-img",
        thead: "collection-thead",
        data: "collection-data",
        pagination: "collection-pagination-text",
        paginationContainer: "collection-pagination-container",
        paginationButtons: "collection-pagination-buttons",
        mobileRowHead: "collection-table-row-head",
        mobileNoBorder: "collection-mobile-no-border",
        mobileWithBorder: "collection-mobile-with-border",
        dropdownField: "collection-dropdown-field",
        dropdownImage: "collection-dropdown-img",
        dropdownContent: "collection-dropdown-content",
      }}
    />
  );
};

export default Collection;