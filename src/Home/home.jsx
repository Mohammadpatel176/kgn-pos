import {
  FaShoppingCart,
  FaFileInvoice,
  FaBoxOpen,
  FaWarehouse,
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your business activities
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Today's Sales"
          value="₹ 1,25,000"
          icon={<FaShoppingCart />}
          color="bg-green-600"
        />

        <DashboardCard
          title="Invoices"
          value="145"
          icon={<FaFileInvoice />}
          color="bg-black"
        />

        <DashboardCard
          title="Inventory Stock"
          value="8,540"
          icon={<FaWarehouse />}
          color="bg-green-700"
        />

        <DashboardCard
          title="Pending Orders"
          value="23"
          icon={<FaBoxOpen />}
          color="bg-black"
        />

      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* SALES SUMMARY */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">
            Sales Summary
          </h2>

          <div className="h-56 flex items-center justify-center text-gray-400">
            📊 Chart placeholder (connect Recharts / Chart.js)
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="bg-white rounded-lg shadow p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">
            Quick Stats
          </h2>

          <StatRow label="Today's Orders" value="32" />
          <StatRow label="Purchase Orders" value="18" />
          <StatRow label="Low Stock Items" value="7" danger />
          <StatRow label="Returns" value="3" />
        </div>

      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-4">
          Recent Transactions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Invoice No</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>

              <TransactionRow
                invoice="INV-1001"
                customer="ABC Traders"
                date="02 Jan 2026"
                amount="₹ 12,500"
                status="Paid"
              />

              <TransactionRow
                invoice="INV-1002"
                customer="XYZ Enterprises"
                date="02 Jan 2026"
                amount="₹ 8,200"
                status="Pending"
              />

              <TransactionRow
                invoice="INV-1003"
                customer="Global Stores"
                date="01 Jan 2026"
                amount="₹ 15,900"
                status="Paid"
              />

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
      <div
        className={`w-12 h-12 rounded-full text-white flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}

function StatRow({ label, value, danger }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-semibold ${
          danger ? "text-red-600" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TransactionRow({ invoice, customer, date, amount, status }) {
  const isPaid = status === "Paid";

  return (
    <tr className="border-b last:border-0">
      <td className="p-3">{invoice}</td>
      <td className="p-3">{customer}</td>
      <td className="p-3">{date}</td>
      <td className="p-3 text-right">{amount}</td>
      <td className="p-3 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${isPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
