import React from "react";
import itemData from "../Data/itemDetails.json";
import {
  PencilIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
export default function ItemMasterList() {
    const [items] = React.useState(
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
    const [searchTerm, setSearchTerm] = React.useState("");
    const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

          <button className="flex items-center gap-1 px-2 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-500">
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add  Item</span>
        </button>
        </div>
        </div>
        {/* Table Container (Scrollable 50vh) */}
        <div className="overflow-y-auto" style={{ maxHeight: "67vh" }}>
        <table className="w-full text-left rounded-xl text-sm table-auto">
            <thead className="sticky top-0 bg-green-500 z-10 rounded-xl">
            <tr className="bg-green-700 text-white rounded-t-lg">
                <th className="px-4 py-3">Item Code</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Price (₹)</th>
                <th className="px-4 py-3 text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredItems.map((item) => (
                <tr key={item.productId + "-" + index} className="last:border-none hover:bg-green-100">

                <td className="px-4 py-3 text-gray-700">{item.productCode}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                    {item.productName}
                </td>
                <td className="px-4 py-3 text-gray-700">{item.category}</td>
                <td className="px-4 py-3 text-gray-700">{item.unit}</td>
                <td className="px-4 py-3 text-gray-700">{item.productPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm">
                    <PencilIcon className="h-4 w-4" />
                    Edit
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
}