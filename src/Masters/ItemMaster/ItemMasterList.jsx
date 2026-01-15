import React, { useEffect, useState } from "react";
import itemData from "../../Data/itemDetails.json";
import AddUpdateModalItem from "./add-update-modal-item";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  PencilIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
export default function ItemMasterList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const formattedItems = (itemData ?? []).map((item) => ({
      productid: Number(item?.productid ?? 0),
      productCode: "PRD00" + String(item?.productid ?? ""),
      productName: item?.productName ?? "Unknown Product",
      stock: Number(item?.stock ?? 0),
      unit: item?.unit ?? "",
      productPrice: Number(item?.productPrice ?? 0),
      category: item?.category ?? "",
      description: item?.description ?? "",
      productImageUrl: item?.productImageUrl ?? "",
    }));

    setItems(formattedItems);
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Modal Logic Here
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  // Handle Add Button Click
  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  }
  // Handle Edit Button Click
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (newItem) => {
    // Logic to save the new item
    setItems(prevItems => [...prevItems, newItem]);
    closeModal();
  };

  const formatPrice = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  };

  return (
    <div className="w-full rounded-xl bg-white shadow-md border border-gray-100">
      {/* Card Header */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between ">
        <h2 className="text-xl font-semibold text-gray-800">
          Item List
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              className="w-64 rounded-lg border border-gray-300 px-10 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Search product..."
              onInput={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-1 px-2 py-2 primary-button"
            onClick={() => handleAddClick()}>
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add  Item</span>
          </button>
        </div>
      </div>
      {/* Table Container (Scrollable 50vh) */}
      <div className="overflow-y-auto" style={{ maxHeight: "67vh" }}>
        <table className="w-full text-left rounded-xl text-sm table-auto">
          <thead className="sticky top-0 bg-green-700 z-10 rounded text-white">
            <tr>
              <th className="px-4 py-3">Item Code</th>
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Price (₹)</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item.productId + "-" + index} className="last:border-none hover:bg-green-100">

                <td className="px-4 py-3 text-gray-700">{item.productCode}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {item.productName}
                </td>
                <td className="px-4 py-3 text-gray-700">{item.category}</td>
                <td className="px-4 py-3 text-gray-700">{item.unit}</td>
                <td className="px-4 py-3 text-gray-700">{formatPrice(item.productPrice)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">

                    {/* Edit Button */}
                    <div className="relative group">
                      <button
                        id={`edit-btn-${item.productId_index}`}
                        onClick={() => handleEditClick(item)}
                        className="inline-flex items-center justify-center rounded-md p-2 secondary-button"
                        aria-label="Edit item"
                      >
                        <PencilIcon className="h-4 w-4 text-white" />
                      </button>

                      {/* Tooltip */}
                      <Tooltip anchorId={`edit-btn-${item.productId_index}`} content="Edit" place="top" />
                    </div>

                    {/* Delete Button */}
                    <div className="relative group">
                      <button
                        id={`delete-btn-${item.productId_index}`}
                        onClick={() => handleDeleteClick(item)}
                        className="inline-flex items-center justify-center clear-button p-2"
                        aria-label="Delete item"
                      >
                        <TrashIcon className="h-4 w-4 text-white" />
                      </button>

                      {/* Tooltip */}
                       <Tooltip anchorId={`delete-btn-${item.productId_index}`} content="Delete" place="top" />
                    </div>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddUpdateModalItem
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        item={selectedItem}
      />
    </div>
  );
}