import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaFilePdf, FaFileExcel, FaSave, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';

export default function GreenDatePicker({ selectedDate, onDateChange }) {
  const [show, setShow] = useState(false);
  const [viewDate, setViewDate] = useState(moment());
  const [grid, setGrid] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    const start = moment(viewDate).startOf('month').startOf('week');
    const end = moment(viewDate).endOf('month').endOf('week');
    const day = start.clone().subtract(1, 'day');
    const _grid = [];
    while (day.isBefore(end, 'day')) {
      _grid.push(Array(7).fill(0).map(() => day.add(1, 'day').clone()));
    }
    setGrid(_grid);
  }, [viewDate]);

  return (
    <div className="relative w-full" ref={calendarRef}>
      <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Delivery Date</label>
      <div 
        onClick={() => setShow(!show)}
        className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2 bg-white cursor-pointer hover:border-green-500 transition-all focus-within:ring-2 focus-within:ring-green-200"
      >
        <span className="text-gray-800">{moment(selectedDate).format('DD MMM, YYYY')}</span>
        <FaCalendarAlt className="text-green-600" />
      </div>

      {show && (
        <div className="absolute z-[100] mt-2 left-0 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 p-4 animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setViewDate(viewDate.clone().subtract(1, 'month'))} className="p-1 hover:bg-green-50 rounded text-green-700"><FaChevronLeft /></button>
            <h3 className="font-bold text-gray-800 text-sm">{viewDate.format('MMMM YYYY')}</h3>
            <button onClick={() => setViewDate(viewDate.clone().add(1, 'month'))} className="p-1 hover:bg-green-50 rounded text-green-700"><FaChevronRight /></button>
          </div>
          <div className="grid grid-cols-7 mb-2 text-center text-[10px] font-bold text-gray-400 uppercase">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="space-y-1">
            {grid.map((week, i) => (
              <div key={i} className="grid grid-cols-7">
                {week.map((date, j) => {
                  const isSel = date.format('YYYY-MM-DD') === selectedDate;
                  const isCurr = date.isSame(viewDate, 'month');
                  return (
                    <button
                      key={j}
                      onClick={() => { onDateChange(date.format('YYYY-MM-DD')); setShow(false); }}
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs transition-all
                        ${!isCurr ? "text-gray-200" : "text-gray-700 hover:bg-green-100"}
                        ${isSel ? "bg-green-600 text-white shadow-md scale-110" : ""}
                      `}
                    >
                      {date.date()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}