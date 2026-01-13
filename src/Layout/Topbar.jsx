import { useState } from "react";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 bg-green-700 border-b flex justify-between items-center px-6">
      {/* Left */}
      <h1 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* Right */}
      <div className="relative">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full cursor-pointer border"
        />

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-200">
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
              My Profile
            </button>
            <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
