import { useState } from "preact/hooks";
import itemData from "../Data/itemDetails.json";
import { notifyError,notifySuccess,notifyWarning,notifyInfo } from "../NotificationService/notify.jsx";
import {
  PencilIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

import InventoryUpdateDialog from "./inventory-update-modal.jsx";
export default function InventoryUpdate() {
const [items, setItems] = useState(
    (itemData ?? []).map((item) => ({
      productid: Number(item?.productid ?? 0),
      productCode: 'PRD00' + String(item?.productid ?? ""),
      productName: String(item?.productName ?? "Unknown Product"),
      stock: Number(item?.stock ?? 0),
      unit: String(item?.unit ?? ""),
      productPrice: Number(item?.productPrice ?? 0),
      category: String(item?.category ?? ""),
      description: String(item?.description ?? ""),
      productImageUrl: String(item?.productImageUrl ?? ""),
    }))
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleSaveStock = (productId, newStock) => {
  let updatedName = ""; 

  setItems((prev) =>
    prev.map((item) => {
      if (item.productid === productId) {
        updatedName = item.productName; 
        return { ...item, stock: newStock };
      }
      return item;
    })
  );
  // API call to set updated stock in the DB 
  if (updatedName) {
    notifySuccess(`${updatedName} \n stock updated successfully!`);
  }

  setSelectedProduct(null);
};


  return (
    <div className="w-full rounded-xl bg-white shadow-md border border-gray-100">
      {/* Card Header */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between ">
        <h2 className="text-xl font-semibold text-gray-800">
          Inventory Update
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

          <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      {/* Table Container (Scrollable 50vh) */}
      <div className="overflow-y-auto" style={{ maxHeight: "67vh" }}>
        <table className="w-full text-left rounded-xl text-sm table-auto">
          <thead className="sticky top-0 bg-green-500 z-10 rounded-xl">
            <tr className="bg-green-700 text-white rounded-t-lg">
              <th className="p-4 font-medium text-white">Code</th>
              <th className="p-4 font-medium text-white">Product</th>
              <th className="p-4 font-medium text-white">Stock</th>
              <th className="p-4 font-medium text-white">Price</th>
              <th className="p-4 font-medium text-white">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item,index) => (
              <tr
                key={item.productId + "-" + index}
                className="last:border-none hover:bg-green-100"
              >
                <td className="p-4 text-gray-700">
                  {item.productCode}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="h-9 w-9 rounded-full object-cover border"
                    />
                    <span className="font-medium text-gray-800">
                      {item.productName}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      item.stock > 20
                        ? "bg-green-100 text-green-700"
                        : item.stock > 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.stock} {item.unit}
                  </span>
                </td>

                <td className="p-4 text-gray-700">
                  {item.productPrice}
                </td>

                <td className="p-4">
                  <button
                    className="rounded-md p-2 text-green-600 hover:bg-green-500/100 hover:text-white"
                    title="Update Stock"  onClick={() => setSelectedProduct(item)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Dialog */}
        <InventoryUpdateDialog
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSave={handleSaveStock}
        />
      </div>
    </div>
  );
}
