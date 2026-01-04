import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCogs,
  FaUserShield,
  FaShoppingCart,
  FaBox,
} from "react-icons/fa";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`bg-green-600 text-white h-full transition-all duration-300
        ${open ? "w-64" : "w-16"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-2 bg-green-700">
        <Link to="/"> <img
          src="/KGNNewLOGO.png"
          alt="Company Logo"
          className="w-10 h-10 rounded-full object-contain"
        /></Link>
        {open && (
          <span className="font-semibold whitespace-nowrap">
            KGN Auto Parts
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-2">

        <MenuGroup open={open} icon={<FaCogs />} title="Master">
          <MenuLink to="/master/general">General Master</MenuLink>
          <MenuLink to="/master/other">Other Masters</MenuLink>
        </MenuGroup>

        <MenuItem open={open} icon={<FaUserShield />} title="Administrator" />

        <MenuGroup open={open} icon={<FaShoppingCart />} title="Sales">
          <MenuLink to="/sales/order">Sales Order</MenuLink>
          <MenuLink to="/sales/invoice">Sales Invoice</MenuLink>
          <MenuLink to="/sales/open-orders">Open Order List</MenuLink>

          {/* ✅ REAL POS PAGE LINK */}
          <MenuLink to="/sales/pos">POS</MenuLink>
        </MenuGroup>

        <MenuGroup open={open} icon={<FaBox />} title="Purchase">
          <MenuLink to="/purchase/order">Purchase Order</MenuLink>
        </MenuGroup>

        <MenuGroup open={open} icon={<FaBox />} title="Inventory">
          <MenuLink to="/inventory/update">Inventory Update</MenuLink>
        </MenuGroup>

      </nav>
    </aside>
  );
}

/* Components */

function MenuItem({ icon, title, open }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-green-700 cursor-pointer">
      {icon}
      {open && <span>{title}</span>}
    </div>
  );
}

function MenuGroup({ icon, title, open, children }) {
  return (
    <div>
      <div className="flex items-center gap-4 px-5 py-3 hover:bg-green-700 cursor-pointer">
        {icon}
        {open && <span>{title}</span>}
      </div>
      {open && (
        <div className="ml-12 text-sm text-gray-200 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block py-1 hover:text-black transition"
    >
      {children}
    </Link>
  );
}
