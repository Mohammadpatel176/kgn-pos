import React from 'react';

function ItemCard({ name, price, image, onAdd }) {
  return (
    <div className="group bg-white w-full rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-200 transition-all">
      <div className="h-32 w-full overflow-hidden rounded-lg bg-gray-50">
          <img src={image} alt={name} className="w-full h-full object-contain group-hover:scale-110 transition-transform"/>
      </div>
      <h3 className="mt-3 font-semibold text-sm h-10 overflow-hidden">{name}</h3>
      <p className="text-lg font-bold text-gray-900">₹{price}</p>
      
      {/* Trigger the onAdd function here */}
      <button 
        onClick={onAdd}
        className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
      >
        + Add to Bill
      </button>
    </div>
  );
}
export default ItemCard;