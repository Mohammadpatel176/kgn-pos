import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <Topbar />

        {/* ONLY THIS AREA SCROLLS */}
        <main className="flex-1 p-4 overflow-y-auto overflow-x-auto green-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
