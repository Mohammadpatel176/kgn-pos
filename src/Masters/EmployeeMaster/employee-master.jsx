import React, { useState, useEffect } from "react";
import EmployeeData from '../../Data/employeeData.json';
import { MagnifyingGlassIcon, PlusCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setEmployees(EmployeeData);
  }, []);

  const filteredItems = employees.filter((item) =>
    item.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.empName}?`)) {
      setEmployees(employees.filter(e => e.employeeId !== item.employeeId));
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const handleSave = (item) => {
    // Implement save logic here
    closeModal();
  };

  return (
    <div className="w-full rounded-xl bg-white shadow-md border border-gray-100">
      {/* Card Header */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between ">
        <h2 className="text-xl font-semibold text-gray-800">Employee List</h2>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              className="w-64 rounded-lg border border-gray-300 px-10 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Search employee..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-1 px-2 py-2 primary-button">
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-y-auto green-scrollbar" style={{ maxHeight: "67vh" }}>
        <table className="w-full text-left rounded-xl text-sm table-auto">
          <thead className="sticky top-0 bg-green-700 z-10 text-white">
            <tr>
              <th className="px-4 py-3">Employee Code</th>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Joining Date</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Is Manager</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item.employeeId + "-" + index} className="last:border-none hover:bg-green-100">
                <td className="px-4 py-3 text-gray-700">{item.employeeCode}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{item.empName+' '+item.empLastName}</td>
                <td className="px-4 py-3 text-gray-700">{item.JoiningDate}</td>
                <td className="px-4 py-3 text-gray-700">{item.phoneNo}</td>
                <td className="px-4 py-3 text-gray-700">{item.email}</td>
                <td className={`px-4 py-3 ${item.IsManager ? 'text-green-600' : 'text-red-600'}`}>
                  {item.IsManager ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <div className="relative group">
                      <button
                        id={`edit-btn-${item.employeeId}`}
                        onClick={() => handleEditClick(item)}
                        className="inline-flex items-center justify-center rounded-md p-2 secondary-button"
                        aria-label="Edit item"
                      >
                        <PencilIcon className="h-4 w-4 text-white" />
                      </button>
                      <Tooltip anchorId={`edit-btn-${item.employeeId}`} content="Edit" place="top" />
                    </div>

                    <div className="relative group">
                      <button
                        id={`delete-btn-${item.employeeId}`}
                        onClick={() => handleDeleteClick(item)}
                        className="inline-flex items-center justify-center clear-button p-2"
                        aria-label="Delete item"
                      >
                        <TrashIcon className="h-4 w-4 text-white" />
                      </button>
                      <Tooltip anchorId={`delete-btn-${item.employeeId}`} content="Delete" place="top" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <AddUpdateModalEmployee
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        item={selectedItem}
      /> */}
    </div>
  );
}
