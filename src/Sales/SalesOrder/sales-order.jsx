import { useState, useEffect,useMemo } from 'react';
import itemData from "../../Data/itemDetails.json";
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { notifyInfo, notifySuccess, notifyWarning } from '../../NotificationService/notify.jsx';
import GreenDatePicker from '../../UI-Components/date-picker-custome.jsx';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function SalesOrder() {
    /* ---------------- CONSTANTS ---------------- */
    const GST_RATE = 0.18;
    const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
    /* ---------------- STATES ---------------- */
    const [customer, setCustomer] = useState({ name: '' });
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([]);
    const [activeSearch, setActiveSearch] = useState({ rowId: null, results: [] });
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        setHighlightIndex(-1);
    }, [activeSearch]);

    /* ---------------- CALCULATIONS ---------------- */
    const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.qty * i.price, 0),
    [items]
  );
    const tax = useMemo(() => round(subtotal * GST_RATE), [subtotal]);
  const grandTotal = useMemo(() => round(subtotal + tax), [subtotal, tax]);
  const balanceAmount = Math.max(grandTotal - advanceAmount, 0);

    /* ---------------- ITEMS ---------------- */
    const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", qty: 0, price: 0 },
    ]);
  };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
            notifyInfo("Item removed from the order!");
        }
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                updated.total = updated.qty * updated.price;
                return updated;
            }
            return item;
        });
        setItems(updatedItems);

        if (field === "name" && value.length > 1) {
            const filtered = itemData.filter(p =>
                p.productName.toLowerCase().includes(value.toLowerCase())
            );
            setActiveSearch({ rowId: id, results: filtered });
        } else if (field === "name") {
            setActiveSearch({ rowId: null, results: [] });
        }
    };

    const selectProduct = (rowId, product) => {
        setItems(items.map(item =>
            item.id === rowId
                ? { ...item, name: product.productName, price: product.productPrice, total: item.qty * product.productPrice }
                : item
        ));
        setActiveSearch({ rowId: null, results: [] });
    };

    const hasEmptyItemName = items.some(item => !item.name.trim());

    /* ---------------- WHATSAPP ---------------- */
    const generateWhatsAppMessage = () => {
        let msg = `👋 Hello ${customer.name},\n\n`; // Friendly greeting

        msg += `🏢 *K.G.N. Auto Parts*\n`; // Company name bold
        msg += `🧾 *Sales Order Confirmation*\n`;
        msg += `📅 Delivery Date: ${deliveryDate}\n\n`;

        msg += `🛒 *Order Summary*\n`;
        msg += `--------------------------------\n`;

        items.forEach((item, i) => {
            msg += `*${i + 1}. ${item.name}*\n`;
            msg += `   Qty: ${item.qty} × ₹${item.price} = ₹${item.total}\n`;
            msg += `--------------------------------\n`;
        });

        msg += `💰 *Subtotal:* ₹${subtotal}\n`;
        msg += `🧾 *GST (18%):* ₹${tax}\n`;
        msg += `💵 *Advance Paid:* ₹${advanceAmount}\n`;
        msg += `🔔 *Balance Due:* ₹${balanceAmount}\n\n`;

        msg += `📎 *Please find the Sales Order PDF attached.*\n\n`;

        msg += `🙏 Thank you for choosing *[Your Company Name]*! We appreciate your business.`;

        return encodeURIComponent(msg);
    };

    const handleSubmit = () => {
        if (!isConfirmed) {
            notifyWarning("Please confirm before sending the order!");
            return;
        }

        if (!items.length) return;

        const message = generateWhatsAppMessage();
        const phoneNumber =validatePhoneNumber (phone); 
        // if (!phoneNumber) {
        //     notifyWarning("Please enter a valid phone number.");
        //     return;
        // }
        if(customer.name.trim()===""){
            notifyWarning("Please enter customer name.");
            return;
        }
        if(deliveryDate.trim()===""){
            notifyWarning("Please select delivery date.");
            return;
        }
        if(balanceAmount<=0){
            notifyWarning("Balance amount should be greater than zero.");
            return;
        }
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappURL, "_blank");
    };

    function validatePhoneNumber(phone){
        const phoneNumber = phone.replace(/\D/g, ""); // remove +, spaces
        const phoneRegex = /^[1-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);

    }

    /* ---------------- UI ---------------- */
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Sales Order</h1>

            {/* CUSTOMER INFO */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Customer Name</label>
                    <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ name: e.target.value })}
                        className="w-full input p-3"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Contact</label>
                    <PhoneInput defaultCountry="in" value={phone} onChange={setPhone} />
                </div>

                <div>
                    <GreenDatePicker selectedDate={deliveryDate} onDateChange={setDeliveryDate} lable={'DeliveryDate'} />
                </div>
            </div>
            <div className='grid grid-cols-1'>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                    <textarea
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({ name: e.target.value })}
                        className="w-full input p-3" rows={2}
                    ></textarea>
                </div>
            </div>
            {/* TABLE */}
            <div >
                <table className="w-full text-left rounded-xl text-sm table-auto">
                    <thead className='main-table-header'>
                        <tr>
                            <th className="p-4 text-left rounded-tl-lg font-semibold">Product</th>
                            <th className="p-4 text-center font-semibold w-28">Qty</th>
                            <th className="p-4 text-right font-semibold w-44">Unit Price (₹)</th>
                            <th className="p-4 text-right font-semibold w-44">Total (₹)</th>
                            <th className="p-4 text-center rounded-tr-lg w-16"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-green-50/30 transition">
                                <td className="p-3 relative">
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        className="w-full p-2 border border-transparent focus:border-green-500 focus:bg-white rounded outline-none"
                                        placeholder="Search items..."
                                        value={item.name}
                                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                        onKeyDown={(e) => {
                                            if (activeSearch.rowId !== item.id) return;
                                            if (e.key === "ArrowDown") {
                                                e.preventDefault();
                                                setHighlightIndex(prev => prev < activeSearch.results.length - 1 ? prev + 1 : 0);
                                            }
                                            if (e.key === "ArrowUp") {
                                                e.preventDefault();
                                                setHighlightIndex(prev => prev > 0 ? prev - 1 : activeSearch.results.length - 1);
                                            }
                                            if (e.key === "Enter" && highlightIndex >= 0) {
                                                e.preventDefault();
                                                selectProduct(item.id, activeSearch.results[highlightIndex]);
                                            }
                                            if (e.key === "Escape") setHighlightIndex(-1);
                                        }}
                                    />

                                    {activeSearch.rowId === item.id && activeSearch.results.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-1 bg-white z-50 max-h-60 overflow-y-auto border border-gray-200 rounded">
                                            {activeSearch.results.map((p, i) => (
                                                <div
                                                    key={p.productid}
                                                    className={`p-3 cursor-pointer flex justify-between ${highlightIndex === i ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"}`}
                                                    onMouseEnter={() => setHighlightIndex(i)}
                                                    onClick={() => selectProduct(item.id, p)}
                                                >
                                                    <span>{p.productName}</span>
                                                    <span className="text-xs">₹{p.productPrice}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                <td className="p-3">
                                    <input type="number" className="w-full p-2 text-center border border-gray-200 rounded" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} />
                                </td>

                                <td className="p-3">
                                    <input type="number" className="w-full p-2 text-right border border-gray-200 rounded font-mono" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                                </td>

                                <td className="p-3 text-right font-bold text-gray-700 font-mono">₹{item.total}</td>

                                <td className="p-3 text-center">
                                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition p-2"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD ITEM */}
            <button
                onClick={addItem}
                disabled={hasEmptyItemName}
                className={`flex items-center gap-2 font-bold transition mb-12 group p-2 mt-5 ${hasEmptyItemName ? "text-gray-400 cursor-not-allowed" : "primary-button hover:shadow-lg"}`}
            >
                <FaPlus size={12} className='text-white' /> Add New Product
            </button>

            {/* SUMMARY */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t pt-8">
                <div className="w-full md:w-1/4">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Advance Amount</label>
                    <input
                        type="number"
                        min={0}
                        max={grandTotal}
                        value={advanceAmount}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (val > grandTotal) notifyWarning("Advance cannot exceed total");
                            else setAdvanceAmount(val);
                        }}
                        className="w-full input p-2"
                        placeholder="Enter advance amount"
                    />
                </div>

                <div className="w-full md:w-1/3 space-y-4">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>GST (18%)</span>
                        <span className="font-mono">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Advance Paid</span>
                        <span className="font-mono">₹{advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-green-900 border-t border-green-200 pt-4">
                        <span>Balance Due</span>
                        <span>₹{balanceAmount.toLocaleString()}</span>
                    </div>

                    {/* ✅ Confirmation Checkbox */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="confirmSend"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            className="w-4 h-4 accent-green-600"
                        />
                        <label htmlFor="confirmSend" className="text-sm text-gray-700">
                            I confirm the order details and want to send via WhatsApp
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isConfirmed || items.length === 0}
                        className={`w-full bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 
        hover:bg-green-800 transition shadow-xl mt-4 ${!isConfirmed ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        <FaSave /> Confirm & Submit
                    </button>
                </div>

            </div>
        </div>
    );
}
