import { Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout';
import Dashboard from "./Home/home";
import POSScreen from "./POS/pos-screen";
import PurchaseOrder from "./Purchase/purchase-order";
import InventoryUpdate from "./Inventory/inventory-update";
import ItemMasterList from "./Masters/ItemMaster/ItemMasterList";
import CustomerMasterList from "./Masters/CustomerMaster/customer-master-list";
import CategoryMasterList from "./Masters/CategoryMaster/category-master-list";
import SalesOrder from "./Sales/SalesOrder/sales-order";
import SalesInvoice from "./Sales/SalesInvoice/sales-invoice";
// Administrator Imports
import MyProfile from "./Administrator/my-profile";
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
        <Route path="sales/order" element={<SalesOrder />} />
        <Route path="sales/invoice" element={<SalesInvoice />} />
        <Route path="purchase/order" element={<PurchaseOrder/>} />
        <Route path="inventory/update" element={<InventoryUpdate />} />
        <Route path="master/customerMaster" element={<CustomerMasterList />} />
        <Route path="master/categoryMaster" element={<CategoryMasterList />} />
        <Route path="administrator/myProfile" element={<MyProfile />} />
      </Route>
    </Routes>
    <ToastContainer />
    </>
  );
}