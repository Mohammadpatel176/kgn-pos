import React, { useRef, useState } from "react";
import {
    CheckIcon,
    XMarkIcon,
    LockClosedIcon,
    ClipboardIcon,
    AtSymbolIcon,
    MapPinIcon,
    CameraIcon,
} from "@heroicons/react/24/outline";
import GreenDatePicker from "../UI-Components/date-picker-custome.jsx";


export default function MyProfile() {
    const fileInputRef = useRef(null);

    // Controlled state for employee info
    const [employee, setEmployee] = useState({
        firstName: "Amelia",
        lastName: "Harper",
        department: "UI/UX",
        position: "Designer",
        employeeID: "EMP001",
        email: "amelia.harper@example.com",
        phone: "+1234567890",
        address: "123 Main Street, City, Country",
        hiredDate: new Date().toISOString().split("T")[0],
        birthDate: new Date().toISOString().split("T")[0],
    });

    const [imageSrc, setImageSrc] = useState("https://via.placeholder.com/80");

    // Handle image file selection
    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG, and PNG files are allowed.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
    };

    // Handle form change
    const handleChange = (field, value) => {
        setEmployee((prev) => ({ ...prev, [field]: value }));
    };

    const baseInputClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none";
    const flatInputClass =
        "w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none";

    let [isModelOpen, setIsModalOpen] = useState(false);

    const openChangePasswordModal = () => setIsModalOpen(true);
    const closeChangePasswordModal = () => setIsModalOpen(false);

    function ChangePasswordModal() {
        return (
            <div>
                {isModelOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur">
                        {/* Modal box */}
                        <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg w-96 p-6 border border-white/20">
                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">Current Password</label>
                                    <input type="password" className={baseInputClass} />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">New Password</label>
                                    <input type="password" className={baseInputClass} />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">Confirm New Password</label>
                                    <input type="password" className={baseInputClass} />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={closeChangePasswordModal}
                                        className="px-4 py-2 clear-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 secondary-button"
                                        onClick={closeChangePasswordModal}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );


    }
    return (
        <div className="w-full min-h-screen p-6 bg-gray-50">
            {/* ================= HEADER ================= */}
            <div className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm rounded mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
                <div className="flex gap-3">
                    <button className="primary-button flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                        <CheckIcon className="h-5 w-5" />
                        Save
                    </button>
                    <button className="clear-button flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
                        <XMarkIcon className="h-5 w-5" />
                        Clear
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* ================= BASIC INFO ================= */}
                <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-base font-medium text-gray-800">Basic Info</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Profile Row */}
                        <div className="flex items-center gap-6">
                            {/* Profile Image */}
                            <div
                                className="relative w-20 h-20 rounded-full border overflow-hidden cursor-pointer group"
                                onClick={handleCameraClick}
                            >
                                <img src={imageSrc} alt="User" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition">
                                    <CameraIcon className="h-8 w-8 text-white" />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="flex-1">
                                <p className="font-medium text-gray-900 text-lg">
                                    {employee.firstName} {employee.lastName}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>ID: {employee.employeeID}</span>
                                    <ClipboardIcon className="h-4 w-4 cursor-pointer" />
                                </div>

                                <button className="mt-3 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                    onClick={openChangePasswordModal}>
                                    <LockClosedIcon className="h-4 w-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block mb-1 text-sm text-gray-600">First Name</label>
                                <input
                                    type="text"
                                    value={employee.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    className={baseInputClass}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-600">Last Name</label>
                                <input
                                    type="text"
                                    value={employee.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    className={baseInputClass}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-600">Department</label>
                                <select
                                    value={employee.department}
                                    onChange={(e) => handleChange("department", e.target.value)}
                                    className={baseInputClass}
                                >
                                    <option>UI/UX</option>
                                    <option>Engineering</option>
                                    <option>Marketing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-600">Position</label>
                                <select
                                    value={employee.position}
                                    onChange={(e) => handleChange("position", e.target.value)}
                                    className={baseInputClass}
                                >
                                    <option>Designer</option>
                                    <option>Developer</option>
                                    <option>Manager</option>
                                </select>
                            </div>

                            <GreenDatePicker
                                selectedDate={employee.hiredDate}
                                onDateChange={(date) => handleChange("hiredDate", date)}
                                label="Hired Date"
                            />
                            <GreenDatePicker
                                selectedDate={employee.birthDate}
                                onDateChange={(date) => handleChange("birthDate", date)}
                                label="Birth Date"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= CONTACT + ADDRESS ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* CONTACTS */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-medium text-gray-800">Contacts</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AtSymbolIcon className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{employee.phone}</p>
                                    <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    className={flatInputClass}
                                    placeholder="Phone"
                                    value={employee.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                />
                                <input
                                    className={flatInputClass}
                                    placeholder="Email"
                                    value={employee.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                                <input className={`${flatInputClass} md:col-span-2`} placeholder="Domain Username" />
                                <select className={flatInputClass}>
                                    <option>🟢 Salaried</option>
                                    <option>Contract</option>
                                </select>
                                <select className={flatInputClass}>
                                    <option>Sam Adamson</option>
                                    <option>Jane Doe</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-medium text-gray-800">Address</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <MapPinIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <p className="font-medium text-gray-900">{employee.address}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className={flatInputClass} placeholder="Country" />
                                <input className={flatInputClass} placeholder="City" />
                                <input className={`${flatInputClass} md:col-span-2`} placeholder="State" />
                                <input
                                    className={`${flatInputClass} md:col-span-2`}
                                    placeholder="Address"
                                    value={employee.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />
                                <input className={flatInputClass} placeholder="Zip Code" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChangePasswordModal />
        </div>

    );
}
