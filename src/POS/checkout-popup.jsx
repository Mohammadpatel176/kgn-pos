import React from 'react';

const CheckoutModal = ({ isOpen, onClose, formData, setFormData, onConfirm }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-green-700 text-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-wide">Customer Billing Details</h2>
                        <p className="text-xs text-green-100">KGN Motors Official POS</p>
                    </div>
                    <button onClick={onClose} className="text-3xl hover:text-gray-200">&times;</button>
                </div>

                <form className="p-6 space-y-6" onSubmit={onConfirm}>
                    {/* Customer Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Customer / Party Name *</label>
                            <input name="customerName" type="text" required value={formData.customerName} onChange={handleChange}
                                className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-green-600 outline-none" placeholder="Full Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                            <input name="customerPhone" type="tel" required value={formData.customerPhone} onChange={handleChange}
                                className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-green-600 outline-none" placeholder="Contact No." />
                        </div>
                    </div>

                    {/* Business Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Supplier Name</label>
                            <input name="supplierName" type="text" value={formData.supplierName} onChange={handleChange}
                                className="w-full border border-gray-200 p-2 rounded-lg" placeholder="Optional" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">GST Number</label>
                            <input name="gstNumber" type="text" value={formData.gstNumber} onChange={handleChange}
                                className="w-full border border-gray-200 p-2 rounded-lg" placeholder="22AAAAA0000A1Z5" />
                        </div>
                    </div>

                    {/* Vehicle Checkbox */}
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                        <input name="isVehicle" type="checkbox" id="vehicle" checked={formData.isVehicle} onChange={handleChange}
                            className="w-6 h-6 accent-green-700 cursor-pointer" />
                        <label htmlFor="vehicle" className="font-bold text-gray-700 cursor-pointer">Include Vehicle & Driver Details?</label>
                    </div>

                    {/* Conditional Vehicle Fields */}
                    {formData.isVehicle && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-xl border border-green-200 transition-all">
                            <div>
                                <label className="block text-xs font-bold text-green-800 mb-1">Driver Name *</label>
                                <input name="driverName" type="text" required={formData.isVehicle} value={formData.driverName} onChange={handleChange}
                                    className="w-full border border-green-300 p-2 rounded-lg bg-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-green-800 mb-1">Vehicle No. *</label>
                                <input name="vehicleNumber" type="text" required={formData.isVehicle} value={formData.vehicleNumber} onChange={handleChange}
                                    className="w-full border border-green-300 p-2 rounded-lg bg-white" placeholder="GJ-XX-0000" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-green-800 mb-1">Driver Phone *</label>
                                <input name="driverPhone" type="tel" required={formData.isVehicle} value={formData.driverPhone} onChange={handleChange}
                                    className="w-full border border-green-300 p-2 rounded-lg bg-white" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Additional Business Details</label>
                        <textarea name="businessDetails" value={formData.businessDetails} onChange={handleChange}
                            className="w-full border border-gray-200 p-2 rounded-lg" rows="2" placeholder="Address or special notes..."></textarea>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} 
                            className="flex-1 px-6 py-3 rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                        <button type="submit" 
                            className="flex-1 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg">
                            Confirm & Generate Bill
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;