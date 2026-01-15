import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaFilePdf, FaFileExcel, FaSave, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import itemData from "../Data/itemDetails.json";
import { notifySuccess,notifyError,notifyInfo,notifyWarning } from '../NotificationService/notify';
import GreenDatePicker from '../UI-Components/date-picker-custome.jsx';
// --- MAIN PURCHASE ORDER COMPONENT ---
export default function PurchaseOrder() {
  const [vendor, setVendor] = useState({ 
    name: '', 
    date: moment().format('YYYY-MM-DD'), 
    poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}` 
  });

  const [items, setItems] = useState([{ id: 1, name: '', qty: 1, price: 0, total: 0 }]);
  const [activeSearch, setActiveSearch] = useState({ rowId: null, results: [] });

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  const addItem = () =>{
   setItems([...items, { id: Date.now(), name: '', qty: 1, price: 0, total: 0 }]);
    notifySuccess('New item added to the order!');
  };
  const removeItem = (id) =>{

  items.length > 1 && setItems(items.filter(item => item.id !== id));
    notifyInfo("Item removed from the order!");
  };
  const updateItem = (id, field, value) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.total = updated.qty * updated.price;
        return updated;
      }
      return item;
    });
    setItems(newItems);

    if (field === 'name') {
      if (value.length > 1) {
        const filtered = itemData.filter(p => p.productName.toLowerCase().includes(value.toLowerCase()));
        setActiveSearch({ rowId: id, results: filtered });
      } else {
        setActiveSearch({ rowId: null, results: [] });
      }
    }
  };

  const selectProduct = (rowId, product) => {
    setItems(items.map(item => item.id === rowId ? {
      ...item, name: product.productName, price: product.productPrice, total: item.qty * product.productPrice
    } : item));
    setActiveSearch({ rowId: null, results: [] });
  };

// --- EXPORT TO EXCEL WITH HEADERS ---
const exportToExcel = () => {
  // 1. Prepare Metadata rows (Company Info)
  const headerData = [
    ["KGN AUTO PARTS - PURCHASE ORDER"],
    [`PO Number: ${vendor.poNumber}`],
    [`Vendor: ${vendor.name || 'N/A'}`],
    [`Date: ${vendor.date}`],
    [""], // Spacer
    ["Product Description", "Quantity", "Unit Price (INR)", "Total (INR)"] // Table Headers
  ];

  // 2. Prepare Item rows
  const itemRows = items.map(i => [i.name, i.qty, i.price, i.total]);

  // 3. Prepare Summary rows
  const summaryRows = [
    ["", "", "Subtotal", subtotal],
    ["", "", "GST (18%)", tax],
    ["", "", "Grand Total", grandTotal]
  ];

  // Combine all data
  const finalData = [...headerData, ...itemRows, [""], ...summaryRows];

  const ws = XLSX.utils.aoa_to_sheet(finalData); // Use aoa_to_sheet for custom layout
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchase Order");
  XLSX.writeFile(wb, `${vendor.poNumber}.xlsx`);
};

// --- EXPORT TO PDF WITH THEME COLORS & PROPER LAYOUT ---
const exportToPDF = () => {
    const doc = new jsPDF();
    const themeColor = [22, 163, 74]; // Emerald Green

    // 1. Compact Top Green Section
    doc.setFillColor(...themeColor);
    doc.rect(0, 0, 210, 25, 'F'); // Height reduced from 40 to 25
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14); // Smaller font
    doc.text("KGN AUTO PARTS", 14, 12);
    doc.setFontSize(8);
    doc.text("Purchase Order Document", 14, 18);
    
    doc.setFontSize(12);
    doc.text("PURCHASE ORDER", 150, 15);

    // 2. Details Section (Smaller Fonts)
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("BILL TO:", 14, 35);
    doc.setFont(undefined, 'normal');
    doc.text("KGN Auto Parts, Ahmedabad, GJ", 14, 40);

    doc.setFont(undefined, 'bold');
    doc.text("ORDER DETAILS:", 130, 35);
    doc.setFont(undefined, 'normal');
    doc.text(`Vendor: ${vendor.name || 'N/A'}`, 130, 40);
    doc.text(`PO Number: ${vendor.poNumber}`, 130, 45);
    doc.text(`Date: ${vendor.date}`, 130, 50);

    // 3. Grid Table with Green Header
    autoTable(doc, {
      startY: 55,
      head: [["Description", "Qty", "Price", "Total"]],
      body: items.map(i => [
        i.name, 
        i.qty, 
        i.price.toFixed(2), 
        i.total.toFixed(2)
      ]),
      theme: 'grid', // Grid theme as requested
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { 
        fillColor: themeColor, 
        textColor: [255, 255, 255],
        halign: 'center' 
      },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    // 4. Compact Summary Section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(`Subtotal:`, 140, finalY);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 185, finalY, { align: 'right' });
    
    doc.text(`GST (18%):`, 140, finalY + 5);
    doc.text(`Rs. ${tax.toFixed(2)}`, 185, finalY + 5, { align: 'right' });
    
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...themeColor);
    doc.text(`GRAND TOTAL:`, 140, finalY + 12);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, 185, finalY + 12, { align: 'right' });

    doc.save(`${vendor.poNumber}.pdf`);
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase Order</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md"><FaFileExcel /> Excel</button>
            <button onClick={exportToPDF} className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 transition font-semibold shadow-md"><FaFilePdf /> PDF</button>
          </div>
        </div>

        {/* TOP INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Vendor Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Supplier name..." value={vendor.name} onChange={(e) => setVendor({...vendor, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">PO Number</label>
            <input type="text" readOnly className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-600 font-mono" value={vendor.poNumber} />
          </div>
          <div className="space-y-1">
            <GreenDatePicker selectedDate={vendor.date} onDateChange={(d) => setVendor({...vendor, date: d})} />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-visible mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-4 text-left rounded-tl-lg font-semibold">Product Description</th>
                <th className="p-4 text-center font-semibold w-28">Qty</th>
                <th className="p-4 text-right font-semibold w-44">Unit Price (₹)</th>
                <th className="p-4 text-right font-semibold w-44">Total (₹)</th>
                <th className="p-4 text-center rounded-tr-lg w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-green-50/30 transition">
                  <td className="p-3 relative">
                    <input autoComplete="off" type="text" className="w-full p-2 border border-transparent focus:border-green-500 focus:bg-white rounded outline-none" placeholder="Search items..." value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                    {activeSearch.rowId === item.id && activeSearch.results.length > 0 && (
                      <div className="absolute z-50 left-2 right-2 mt-1 bg-white border border-gray-300 rounded-xl shadow-2xl max-h-56 overflow-y-auto ring-2 ring-green-500 ring-opacity-20">
                        {activeSearch.results.map((product) => (
                          <div key={product.productid} className="p-3 hover:bg-green-600 hover:text-white cursor-pointer flex justify-between items-center transition" onClick={() => selectProduct(item.id, product)}>
                            <span className="font-semibold">{product.productName}</span>
                            <span className="text-xs opacity-80 font-mono">₹{product.productPrice}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-3"><input type="number" className="w-full p-2 text-center border border-gray-200 rounded" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} /></td>
                  <td className="p-3"><input type="number" className="w-full p-2 text-right border border-gray-200 rounded font-mono" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} /></td>
                  <td className="p-3 text-right font-bold text-gray-700 font-mono">₹{item.total.toLocaleString()}</td>
                  <td className="p-3 text-center"><button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition p-2"><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addItem} className="flex items-center gap-2 text-green-700 font-bold hover:text-green-900 transition mb-12 group">
          <span className="bg-green-100 p-1 rounded-full group-hover:bg-green-200"><FaPlus size={12} /></span> Add New Product
        </button>

        {/* SUMMARY */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t pt-8">
          <div className="w-full md:w-1/2">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Terms & Conditions</label>
            <textarea className="w-full border border-gray-200 rounded-lg p-3 text-sm h-24 text-gray-600 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Enter notes or terms here..."></textarea>
          </div>
          <div className="w-full md:w-1/3 bg-green-50/50 p-6 rounded-xl border border-green-100 space-y-4">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-mono">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span className="font-mono">₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-2xl font-black text-green-900 border-t border-green-200 pt-4"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
            <button className="w-full bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-green-800 transition shadow-xl mt-4"><FaSave /> Confirm & Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}