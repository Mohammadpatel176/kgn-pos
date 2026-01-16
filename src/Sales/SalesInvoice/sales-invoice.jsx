import { useState, useEffect,useMemo } from 'react';
import itemData from "../../Data/itemDetails.json";
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { notifyInfo, notifySuccess, notifyWarning } from '../../NotificationService/notify.jsx';
import GreenDatePicker from '../../UI-Components/date-picker-custome.jsx';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function SalesInvoice() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome to Sales Invoice</h1>
        </div>
    );
}