import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { getCustomerById } from "../../APIServices/jsonDataCall";
import { notifyError } from "../../NotificationService/notify";

export default function AddUpdateCustomer({ isOpen, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    phone: "",
    email: "",
    customerType: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    address: "",
    gstin: "",
    notes: "",
    creditLimit: "",
    isActive: true,
    description: "",
    customerPhoto: null,
  });

  const [errorFormData, setErrorFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  /* ---------------- FETCH CUSTOMER ---------------- */
  useEffect(() => {
    if (customer?.customerId) {
      (async () => {
        try {
          const data = await getCustomerById(customer.customerId);
          setFormData(data);
          setImagePreview(data.customerPhoto || null);
        } catch (err) {
          console.error("Failed to fetch customer:", err);
          notifyError("Failed to fetch customer details.");
        }
      })();
    }
    else{
        setFormData({
        customerId: "",
        customerName: "",
        phone: "",
        email: "",
        customerType: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        address: "",
        gstin: "",
        notes: "",
        creditLimit: "",
        isActive: true,
        description: "",
        customerPhoto: null,
      });
      setImagePreview(null);
    }
  }, [customer]);

  if (!isOpen) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, customerPhoto: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const handleSubmit = () => {
    if (!formData.customerName.trim()) {
      setErrorFormData({ customerName: "Customer name is required" });
      return;
    }
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      setErrorFormData({ phone: "Invalid phone number format" });
      return;
    }

    setErrorFormData({});
    onSave(formData);
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-green-700 text-white rounded-t-xl">
          <h2 className="text-lg font-semibold">
            {customer ? "Update Customer" : "Add New Customer"}
          </h2>
          <button onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ["customerId", "Customer Code"],
              ["customerName", "Customer Name"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["customerType", "Customer Type"],
              ["city", "City"],
              ["state", "State"],
              ["country", "Country"],
              ["zipCode", "Zip Code"],
              ["address", "Address"],
              ["gstin", "GST Number"],
              ["notes", "Note"],
              ["creditLimit", "Credit Limit"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col gap-1">
                <label className="text-sm font-medium">{label}</label>
                <input
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="input"
                />
                {errorFormData[name] && (
                  <span className="text-xs text-red-600">
                    {errorFormData[name]}
                  </span>
                )}
              </div>
            ))}

            {/* Active */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Active</label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[90px]"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <label className="text-sm font-medium">Customer Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg object-cover border"
                />
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-white rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 clear-button">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 primary-button px-4 py-2"
          >
            <Save className="h-4 w-4" />
            {customer ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
