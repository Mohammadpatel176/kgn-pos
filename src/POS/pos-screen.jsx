import React, { useState } from "react";
import itemData from "../Data/itemDetails.json";
import ItemCard from "./item-card-pos";
import CheckoutModal from "./checkout-popup";
import { generateInvoice } from "./generateInvoice";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
} from "../NotificationService/notify";

function POSScreen() {
  const [items] = useState(itemData);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [discountType, setDiscountType] = useState("amount");
  const [discountValue, setDiscountValue] = useState(0);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    isVehicle: false,
    driverName: "",
    vehicleNumber: "",
    driverPhone: "",
  });

  const filteredItems = items.filter((i) =>
    i.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.productid === product.productid);
      if (found) {
        return prev.map((p) =>
          p.productid === product.productid
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    notifySuccess(`${product.productName} added to cart!`);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((p) =>
        p.productid === id && p.quantity + delta > 0
          ? { ...p, quantity: p.quantity + delta }
          : p
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.productid !== id));
    notifyInfo("Item removed from cart!");
  };

  const subtotal = cart.reduce(
    (s, i) => s + i.productPrice * i.quantity,
    0
  );

  const discountAmount =
    discountType === "percent"
      ? (subtotal * discountValue) / 100
      : discountValue;

  const taxable = Math.max(subtotal - discountAmount, 0);
  const gst = taxable * 0.18;
  const grandTotal = taxable + gst;

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    await generateInvoice(
      formData,
      cart,
      subtotal,
      discountAmount,
      gst,
      grandTotal
    );
    setCart([]);
    setDiscountValue(0);
    setIsModalOpen(false);
    notifySuccess("Invoice generated successfully!");
  };

  return (
    <div className="grid grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-[1fr_380px] h-screen bg-gray-100 overflow-hidden">
      
      {/* LEFT : PRODUCTS */}
      <div className="p-4 md:p-6 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-black text-green-700 mb-2">
          KGN MOTORS
        </h1>

        <input
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          placeholder="Search auto parts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.productid}
              name={item.productName}
              price={item.productPrice}
              image={item.productImageUrl}
              onAdd={() => addToCart(item)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT : CART */}
      <div className="grid grid-rows-[auto_1fr_auto] bg-white shadow-xl border-t md:border-t-0">
        {/* Cart Header */}
        <div className="bg-green-700 text-white p-4 font-bold">
          CART ({cart.reduce((a, b) => a + b.quantity, 0)})
        </div>

        {/* Cart Items */}
        <div className="p-3 md:p-4 space-y-3 overflow-y-auto bg-gray-50">
          {cart.map((item) => (
            <div key={item.productid} className="bg-white p-3 rounded border">
              <div className="flex justify-between">
                <span className="font-bold text-xs">
                  {item.productName}
                </span>
                <button
                  onClick={() => removeFromCart(item.productid)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-between mt-2 items-center">
                <div className="flex gap-3 items-center">
                  <button onClick={() => updateQuantity(item.productid, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productid, 1)}>
                    +
                  </button>
                </div>
                <span className="font-bold">
                  ₹{item.productPrice * item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t space-y-2 bg-white">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <select
              className="border px-2"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="amount">₹</option>
              <option value="percent">%</option>
            </select>

            <input
              type="number"
              className="border flex-1 px-2"
              placeholder="Discount"
              value={discountValue}
              onChange={(e) => setDiscountValue(+e.target.value)}
            />
          </div>

          <div className="flex justify-between text-red-600 font-bold">
            <span>Discount</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xl font-black">
            <span>TOTAL</span>
            <span className="text-green-700">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!cart.length}
            className="w-full mt-4 bg-green-700 text-white py-3 rounded-lg font-bold"
          >
            PRINT INVOICE
          </button>
        </div>
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
}

export default POSScreen;
