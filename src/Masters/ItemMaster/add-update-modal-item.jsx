import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

export default function AddUpdateModalItem({ isOpen, onClose, onSave, item }) {
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    category: "",
    unit: "",
    productPrice: "",
    stock: "",
    description: "",
    productImage: null,
  });

  const [errorFormData, setErrorFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        productCode: item.productCode || "",
        productName: item.productName || "",
        category: item.category || "",
        unit: item.unit || "",
        productPrice: item.productPrice || "",
        stock: item.stock || "",
        description: item.description || "",
        productImage: null,
      });
      setImagePreview(item.productImageUrl || null);
    } else {
      setFormData({
        productCode: "",
        productName: "",
        category: "",
        unit: "",
        productPrice: "",
        description: "",
        productImage: null,
      });
      setImagePreview(null);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, productImage: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.productCode) errors.productCode = "Required";
    if (!formData.productName) errors.productName = "Required";
    if (!formData.category) errors.category = "Required";
    if (!formData.unit) errors.unit = "Required";
    if (!formData.productPrice) errors.productPrice = "Required";

    setErrorFormData(errors);
    if (Object.keys(errors).length) return;

    onSave({ ...formData, id: item?.productid });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-green-700 text-white rounded-t-xl">
          <h2 id="modal-title" className="text-lg font-semibold">
            {item ? "Update Item" : "Add New Item"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="hover:text-green-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[
              ["productCode", "Product Code"],
              ["productName", "Product Name"],
              ["category", "Category"],
              ["unit", "Unit"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col gap-1">
                <label htmlFor={name} className="text-sm font-medium">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  value={formData[name]}
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

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Price (₹)</label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                className="input"
              />
              {errorFormData.productPrice && (
                <span className="text-xs text-red-600">
                  {errorFormData.productPrice}
                </span>
              )}
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
              <label className="text-sm font-medium">Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-32 w-32 rounded-lg object-cover border"
                />
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-white rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 clear-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 primary-button px-4 py-2"
          >
            <Save className="h-4 w-4" />
            {item ? "Update" : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
