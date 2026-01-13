import { useState, useEffect } from "preact/hooks";
import { Plus, Minus, Save, X } from "lucide-react";

export default function InventoryUpdateDialog({
  product,
  onClose,
  onSave
}) {
  const [adjustmentQty, setAdjustmentQty] = useState(0);

  useEffect(() => {
    if (product) setAdjustmentQty(0);
  }, [product]);

  if (!product) return null;

  const newStock = Math.max(0, product.stock + adjustmentQty);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white">
        {/* Header */}
        <div className="flex justify-between px-5 py-4">
          <h3 className="font-bold text-lg">
            Adjust Stock – {product.productName}
          </h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-5 py-4">
          <div className="bg-green-700 hover:bg-green-500 p-4 rounded-lg">
            <p className="text-sm text-white">Current Stock</p>
            <p className="text-2xl font-bold text-white">
              {product.stock} {product.unit}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-green-500 hover:text-black" onClick={() => setAdjustmentQty((q) => q - 1)}>
              <Minus />
            </button>

            <input
              type="number"
              value={adjustmentQty}
              onInput={(e) => setAdjustmentQty(+e.target.value)}
              className="w-24 rounded-lg  text-center p-2 border border-gray-300 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />

            <button className="text-green-500 hover:text-black" onClick={() => setAdjustmentQty((q) => q + 1)}>
              <Plus />
            </button>
          </div>

          <p className="text-sm">
            New Stock: <strong>{newStock}</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4">
          <button className="bg-red-700 text-white hover:bg-red-500 px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSave(product.productid, newStock)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
