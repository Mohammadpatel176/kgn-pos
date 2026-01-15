import { Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import Dashboard from "./Home/home";
import POSScreen from "./POS/pos-screen";
import PurchaseOrder from "./Purchase/purchase-order";
import InventoryUpdate from "./Inventory/inventory-update";
import ItemMasterList from "./Masters/ItemMaster/ItemMasterList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="sales/pos" element={<POSScreen />} />
        <Route path="master/itemMaster" element={<ItemMasterList />} />
        <Route path="sales/order" element={<div>Sales Order</div>} />
        <Route path="sales/invoice" element={<div>Sales Invoice</div>} />
        <Route path="purchase/order" element={<PurchaseOrder/>} />
        <Route path="inventory/update" element={<InventoryUpdate />} />
        
      </Route>
    </Routes>
    <ToastContainer />
    </>
  );
}