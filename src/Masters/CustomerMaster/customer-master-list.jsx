import React, { useState, useEffect } from "react";
import { getCustomers } from "../../APIServices/jsonDataCall";
import { Tooltip } from "react-tooltip";
import {
  PencilIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "../../NotificationService/notify.jsx";

import AddUpdateModalCustomer from "./add-update-customer.jsx";

export default function CustomerMasterList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- FETCH CUSTOMERS ---------------- */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data || []);
      } catch {
        notifyError("Failed to fetch customers.");
      }
    };
    fetchCustomers();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredCustomers = customers.filter((customer) =>
    (customer.customerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ---------------- DATE FORMAT ---------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ---------------- MODAL ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setCustomers((prev) =>
      prev.filter((c) => c.customerId !== item.customerId)
    );
    notifyInfo(`${item.customerName} deleted`);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = (newItem) => {
    setCustomers((prev) => {
      const exists = prev.some(
        (c) => c.customerId === newItem.customerId
      );

      return exists
        ? prev.map((c) =>
            c.customerId === newItem.customerId ? newItem : c
          )
        : [...prev, newItem];
    });

    notifySuccess(
      `${newItem.customerName || "Customer"} saved successfully!`
    );
    closeModal();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full rounded-xl bg-white shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-green-800">
          Customer Master
        </h2>

        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              className="w-64 rounded-lg border border-gray-300 px-10 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center gap-1 px-2 py-2 primary-button"
            onClick={handleAddClick}
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-y-auto" style={{ maxHeight: "67vh" }}>
        <table className="w-full text-sm table-auto">
          <thead className="sticky top-0 bg-green-700 z-10 text-white">
            <tr>
              <th className="px-4 py-3">Customer Code</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Customer Type</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer, index) => {
              const rowId = `${customer.customerId}-${index}`;

              return (
                <tr
                  key={rowId}
                  className="hover:bg-green-100"
                >
                  <td className="px-4 py-3">{customer.customerCode}</td>
                  <td className="px-4 py-3 font-medium">
                    {customer.customerName}
                  </td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.customerType}</td>
                  <td className="px-4 py-3">
                    {customer.isActive ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(customer.updatedAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        id={`edit-${rowId}`}
                        onClick={() => handleEditClick(customer)}
                        className="secondary-button p-2"
                      >
                        <PencilIcon className="h-4 w-4 text-white" />
                      </button>
                      <Tooltip
                        anchorId={`edit-${rowId}`}
                        content="Edit"
                      />

                      <button
                        id={`delete-${rowId}`}
                        onClick={() => handleDeleteClick(customer)}
                        className="clear-button p-2"
                      >
                        <TrashIcon className="h-4 w-4 text-white" />
                      </button>
                      <Tooltip
                        anchorId={`delete-${rowId}`}
                        content="Delete"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddUpdateModalCustomer
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        customer={selectedItem}
      />
    </div>
  );
}
