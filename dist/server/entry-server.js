import renderToString from "preact-render-to-string";
import { StaticRouter } from "react-router-dom/server.mjs";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import { useState, useRef, useEffect } from "preact/compat";
import { FaCogs, FaUserShield, FaShoppingCart, FaBox, FaFileInvoice, FaWarehouse, FaBoxOpen, FaFileExcel, FaFilePdf, FaTrash, FaPlus, FaSave, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { jsxs, jsx } from "preact/jsx-runtime";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import * as XLSX from "xlsx";
function Sidebar() {
  const [open, setOpen] = useState(false);
  return jsxs("aside", {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    className: `bg-green-600 text-white h-full transition-all duration-300
        ${open ? "w-64" : "w-16"}`,
    children: [jsxs("div", {
      className: "flex items-center gap-3 p-2 bg-green-700",
      children: [jsxs(Link, {
        to: "/",
        children: [" ", jsx("img", {
          src: "/KGNNewLOGO.png",
          alt: "Company Logo",
          className: "w-10 h-10 rounded-full object-contain"
        })]
      }), open && jsx("span", {
        className: "font-semibold whitespace-nowrap",
        children: "KGN Auto Parts"
      })]
    }), jsxs("nav", {
      className: "mt-4 space-y-2",
      children: [jsxs(MenuGroup, {
        open,
        icon: jsx(FaCogs, {}),
        title: "Master",
        children: [jsx(MenuLink, {
          to: "/master/general",
          children: "General Master"
        }), jsx(MenuLink, {
          to: "/master/other",
          children: "Other Masters"
        })]
      }), jsx(MenuItem, {
        open,
        icon: jsx(FaUserShield, {}),
        title: "Administrator"
      }), jsxs(MenuGroup, {
        open,
        icon: jsx(FaShoppingCart, {}),
        title: "Sales",
        children: [jsx(MenuLink, {
          to: "/sales/order",
          children: "Sales Order"
        }), jsx(MenuLink, {
          to: "/sales/invoice",
          children: "Sales Invoice"
        }), jsx(MenuLink, {
          to: "/sales/open-orders",
          children: "Open Order List"
        }), jsx(MenuLink, {
          to: "/sales/pos",
          children: "POS"
        })]
      }), jsx(MenuGroup, {
        open,
        icon: jsx(FaBox, {}),
        title: "Purchase",
        children: jsx(MenuLink, {
          to: "/purchase/order",
          children: "Purchase Order"
        })
      }), jsx(MenuGroup, {
        open,
        icon: jsx(FaBox, {}),
        title: "Inventory",
        children: jsx(MenuLink, {
          to: "/inventory/update",
          children: "Inventory Update"
        })
      })]
    })]
  });
}
function MenuItem({
  icon,
  title,
  open
}) {
  return jsxs("div", {
    className: "flex items-center gap-4 px-5 py-3 hover:bg-green-700 cursor-pointer",
    children: [icon, open && jsx("span", {
      children: title
    })]
  });
}
function MenuGroup({
  icon,
  title,
  open,
  children
}) {
  return jsxs("div", {
    children: [jsxs("div", {
      className: "flex items-center gap-4 px-5 py-3 hover:bg-green-700 cursor-pointer",
      children: [icon, open && jsx("span", {
        children: title
      })]
    }), open && jsx("div", {
      className: "ml-12 text-sm text-gray-200 space-y-1",
      children
    })]
  });
}
function MenuLink({
  to,
  children
}) {
  return jsx(Link, {
    to,
    className: "block py-1 hover:text-black transition",
    children
  });
}
function Topbar() {
  const [open, setOpen] = useState(false);
  return jsxs("header", {
    className: "h-14 bg-green-700 border-b flex justify-between items-center px-6",
    children: [jsx("h1", {
      className: "text-lg font-semibold text-gray-800",
      children: "Dashboard"
    }), jsxs("div", {
      className: "relative",
      children: [jsx("img", {
        src: "https://i.pravatar.cc/40",
        alt: "user",
        onClick: () => setOpen(!open),
        className: "w-9 h-9 rounded-full cursor-pointer border"
      }), open && jsxs("div", {
        className: "absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md",
        children: [jsx("button", {
          className: "block w-full px-4 py-2 text-left hover:bg-gray-100",
          children: "My Profile"
        }), jsx("button", {
          className: "block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100",
          children: "Logout"
        })]
      })]
    })]
  });
}
function Layout() {
  return jsxs("div", {
    className: "flex h-screen bg-gray-100",
    children: [jsx(Sidebar, {}), jsxs("div", {
      className: "flex flex-col flex-1",
      children: [jsx(Topbar, {}), jsx("main", {
        className: "p-4 overflow-y-auto",
        children: jsx(Outlet, {})
      })]
    })]
  });
}
function Dashboard() {
  return jsxs("div", {
    className: "space-y-6",
    children: [jsxs("div", {
      children: [jsx("h1", {
        className: "text-2xl font-semibold text-gray-800",
        children: "Dashboard"
      }), jsx("p", {
        className: "text-sm text-gray-500",
        children: "Overview of your business activities"
      })]
    }), jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
      children: [jsx(DashboardCard, {
        title: "Today's Sales",
        value: "₹ 1,25,000",
        icon: jsx(FaShoppingCart, {}),
        color: "bg-green-600"
      }), jsx(DashboardCard, {
        title: "Invoices",
        value: "145",
        icon: jsx(FaFileInvoice, {}),
        color: "bg-black"
      }), jsx(DashboardCard, {
        title: "Inventory Stock",
        value: "8,540",
        icon: jsx(FaWarehouse, {}),
        color: "bg-green-700"
      }), jsx(DashboardCard, {
        title: "Pending Orders",
        value: "23",
        icon: jsx(FaBoxOpen, {}),
        color: "bg-black"
      })]
    }), jsxs("div", {
      className: "grid grid-cols-1 xl:grid-cols-3 gap-6",
      children: [jsxs("div", {
        className: "xl:col-span-2 bg-white rounded-lg shadow p-5",
        children: [jsx("h2", {
          className: "font-semibold text-gray-700 mb-4",
          children: "Sales Summary"
        }), jsx("div", {
          className: "h-56 flex items-center justify-center text-gray-400",
          children: "📊 Chart placeholder (connect Recharts / Chart.js)"
        })]
      }), jsxs("div", {
        className: "bg-white rounded-lg shadow p-5 space-y-4",
        children: [jsx("h2", {
          className: "font-semibold text-gray-700",
          children: "Quick Stats"
        }), jsx(StatRow, {
          label: "Today's Orders",
          value: "32"
        }), jsx(StatRow, {
          label: "Purchase Orders",
          value: "18"
        }), jsx(StatRow, {
          label: "Low Stock Items",
          value: "7",
          danger: true
        }), jsx(StatRow, {
          label: "Returns",
          value: "3"
        })]
      })]
    }), jsxs("div", {
      className: "bg-white rounded-lg shadow p-5",
      children: [jsx("h2", {
        className: "font-semibold text-gray-700 mb-4",
        children: "Recent Transactions"
      }), jsx("div", {
        className: "overflow-x-auto",
        children: jsxs("table", {
          className: "w-full text-sm",
          children: [jsx("thead", {
            className: "bg-gray-100 text-gray-600",
            children: jsxs("tr", {
              children: [jsx("th", {
                className: "p-3 text-left",
                children: "Invoice No"
              }), jsx("th", {
                className: "p-3 text-left",
                children: "Customer"
              }), jsx("th", {
                className: "p-3 text-left",
                children: "Date"
              }), jsx("th", {
                className: "p-3 text-right",
                children: "Amount"
              }), jsx("th", {
                className: "p-3 text-center",
                children: "Status"
              })]
            })
          }), jsxs("tbody", {
            children: [jsx(TransactionRow, {
              invoice: "INV-1001",
              customer: "ABC Traders",
              date: "02 Jan 2026",
              amount: "₹ 12,500",
              status: "Paid"
            }), jsx(TransactionRow, {
              invoice: "INV-1002",
              customer: "XYZ Enterprises",
              date: "02 Jan 2026",
              amount: "₹ 8,200",
              status: "Pending"
            }), jsx(TransactionRow, {
              invoice: "INV-1003",
              customer: "Global Stores",
              date: "01 Jan 2026",
              amount: "₹ 15,900",
              status: "Paid"
            })]
          })]
        })
      })]
    })]
  });
}
function DashboardCard({
  title,
  value,
  icon,
  color
}) {
  return jsxs("div", {
    className: "bg-white rounded-lg shadow p-5 flex justify-between items-center",
    children: [jsxs("div", {
      children: [jsx("p", {
        className: "text-sm text-gray-500",
        children: title
      }), jsx("h3", {
        className: "text-xl font-bold text-gray-800",
        children: value
      })]
    }), jsx("div", {
      className: `w-12 h-12 rounded-full text-white flex items-center justify-center ${color}`,
      children: icon
    })]
  });
}
function StatRow({
  label,
  value,
  danger
}) {
  return jsxs("div", {
    className: "flex justify-between text-sm",
    children: [jsx("span", {
      className: "text-gray-600",
      children: label
    }), jsx("span", {
      className: `font-semibold ${danger ? "text-red-600" : "text-gray-800"}`,
      children: value
    })]
  });
}
function TransactionRow({
  invoice,
  customer,
  date,
  amount,
  status
}) {
  const isPaid = status === "Paid";
  return jsxs("tr", {
    className: "border-b last:border-0",
    children: [jsx("td", {
      className: "p-3",
      children: invoice
    }), jsx("td", {
      className: "p-3",
      children: customer
    }), jsx("td", {
      className: "p-3",
      children: date
    }), jsx("td", {
      className: "p-3 text-right",
      children: amount
    }), jsx("td", {
      className: "p-3 text-center",
      children: jsx("span", {
        className: `px-3 py-1 rounded-full text-xs font-medium
            ${isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`,
        children: status
      })
    })]
  });
}
const itemData = /* @__PURE__ */ JSON.parse('[{"productid":1,"productName":"Compact Frame","productPrice":1350,"productImageUrl":"/Images/Compect_Fram_Final.png","productDescription":"High-quality compact frame for auto rickshaws."},{"productid":2,"productName":"Back Door","productPrice":950,"productImageUrl":"/Images/Dore_Final.png","productDescription":"Durable metal back door for cargo space."},{"productid":3,"productName":"Compact Floor 18","productPrice":1200,"productImageUrl":"/Images/Flooring_14.png","productDescription":"18-gauge heavy-duty flooring sheet."},{"productid":4,"productName":"Compact Floor 14","productPrice":1350,"productImageUrl":"/Images/flooring_18.png","productDescription":"14-gauge premium flooring sheet."},{"productid":5,"productName":"Half Star","productPrice":100,"productImageUrl":"/Images/Samosa_final.png","productDescription":"Samosa style bracket support."},{"productid":6,"productName":"Alfa Floor","productPrice":1300,"productImageUrl":"/Images/side darvaja.png","productDescription":"Specialized flooring for Alfa models."},{"productid":1,"productName":"Y Support","productPrice":250,"productImageUrl":"/Images/test_new.png","productDescription":"Reinforced Y-shaped structural support."},{"productid":1,"productName":"Compact Frame","productPrice":1350,"productImageUrl":"/Images/Compect_Fram_Final.png","productDescription":"High-quality compact frame for auto rickshaws."},{"productid":2,"productName":"Back Door","productPrice":950,"productImageUrl":"/Images/Dore_Final.png","productDescription":"Durable metal back door for cargo space."},{"productid":3,"productName":"Compact Floor 18","productPrice":1200,"productImageUrl":"/Images/Flooring_14.png","productDescription":"18-gauge heavy-duty flooring sheet."},{"productid":4,"productName":"Compact Floor 14","productPrice":1350,"productImageUrl":"/Images/flooring_18.png","productDescription":"14-gauge premium flooring sheet."},{"productid":5,"productName":"Half Star","productPrice":100,"productImageUrl":"/Images/Samosa_final.png","productDescription":"Samosa style bracket support."},{"productid":6,"productName":"Alfa Floor","productPrice":1300,"productImageUrl":"/Images/side_darvaja.png","productDescription":"Specialized flooring for Alfa models."},{"productid":7,"productName":"Y Support","productPrice":250,"productImageUrl":"/Images/test_new.png","productDescription":"Reinforced Y-shaped structural support."},{"productid":8,"productName":"GLASS FRAME PASSENGER","productPrice":0,"productImageUrl":"/Images/GlassFrame_Pecenger.png","productDescription":"Glass frame for passenger auto rickshaw."},{"productid":9,"productName":"GLASS FRAME LOADING","productPrice":0,"productImageUrl":"/Images/Glass_frame_loading.png","productDescription":"Glass frame for loading auto rickshaw."},{"productid":10,"productName":"FRONT FLOORING","productPrice":0,"productImageUrl":"/Images/FrontFlooring.png","productDescription":"Front flooring sheet."},{"productid":11,"productName":"FRONT DERA","productPrice":0,"productImageUrl":"/Images/FrontDera.png","productDescription":"Front dera body component."},{"productid":12,"productName":"BODY PASSENGER OLD","productPrice":0,"productImageUrl":"/Images/BodyPacengerOld.png","productDescription":"Old model passenger body."},{"productid":13,"productName":"DELUX PASSENGER BODY","productPrice":0,"productImageUrl":"/Images/DeluxPacengerBody.png","productDescription":"Deluxe passenger body."},{"productid":14,"productName":"COMPLETE TROLLEY O/M","productPrice":0,"productImageUrl":"/Images/CompleteTrolyOM.png","productDescription":"Complete trolley old model."},{"productid":15,"productName":"X.L.D TROLLEY GREEN","productPrice":0,"productImageUrl":"/Images/XLDTrollyGreen.png","productDescription":"XLD trolley painted green."},{"productid":16,"productName":"X.L.D TROLLEY YELLOW","productPrice":0,"productImageUrl":"/Images/XLDTrollyYellow.png","productDescription":"XLD trolley painted yellow."},{"productid":17,"productName":"X.L.D TROLLEY RED","productPrice":0,"productImageUrl":"/Images/XLDTrollyRed.png","productDescription":"XLD trolley painted red."},{"productid":18,"productName":"TROLLEY X.L.D N/M","productPrice":0,"productImageUrl":"/Images/XLDTrollyXM.png","productDescription":"XLD trolley new model."},{"productid":19,"productName":"CITY GLASS FRAME","productPrice":0,"productImageUrl":"/Images/ApeCityGlassFrame.png","productDescription":"City model glass frame."},{"productid":20,"productName":"TROLLEY FLOORING WITH CHANNEL","productPrice":0,"productImageUrl":"/Images/TrollyFlooringWithChenal.png","productDescription":"Trolley flooring with support channel."},{"productid":21,"productName":"TROLLEY FLOORING","productPrice":0,"productImageUrl":"/Images/TrollyFlooring.png","productDescription":"Standard trolley flooring."},{"productid":22,"productName":"LD TROLLEY FLOORING","productPrice":0,"productImageUrl":"/Images/LDTrollyFlooring.png","productDescription":"Loading trolley flooring."},{"productid":23,"productName":"PASSENGER CENTER FLOORING","productPrice":0,"productImageUrl":"/Images/PessCenterFlooring.png","productDescription":"Passenger center flooring."},{"productid":24,"productName":"ENGINE BONNET","productPrice":0,"productImageUrl":"/Images/EngenBonnat.png","productDescription":"Engine bonnet cover."},{"productid":25,"productName":"REAR TAILGATE PASSENGER","productPrice":0,"productImageUrl":"/Images/RtelgetPec.png","productDescription":"Passenger rear tailgate."},{"productid":26,"productName":"DRIVER PARTITION (TAKA)","productPrice":0,"productImageUrl":"/Images/DrivPartation.png","productDescription":"Driver partition panel."},{"productid":27,"productName":"FRONT FALKA LOADING","productPrice":0,"productImageUrl":"/Images/FrntFalkaLod.png","productDescription":"Front falka for loading body."},{"productid":28,"productName":"SIDE FALKA LOADING","productPrice":0,"productImageUrl":"/Images/SideFalkaLod.png","productDescription":"Side falka for loading body."},{"productid":29,"productName":"SIDE PANEL PASSENGER","productPrice":0,"productImageUrl":"/Images/SidePanelPecg.png","productDescription":"Passenger side panel."},{"productid":30,"productName":"TOP","productPrice":0,"productImageUrl":"/Images/Top.png","productDescription":"Vehicle top body part."},{"productid":31,"productName":"DIESEL TANK PATARA","productPrice":0,"productImageUrl":"/Images/DesialTankPatra.png","productDescription":"Diesel tank protection patara."},{"productid":32,"productName":"FRONT CONA BIG PASSENGER","productPrice":0,"productImageUrl":"/Images/FrontConeBigPecg.png","productDescription":"Front big cona passenger."},{"productid":33,"productName":"REAR CONA SMALL PASSENGER","productPrice":0,"productImageUrl":"/Images/RearConeSmallPecg.png","productDescription":"Rear small cona passenger."},{"productid":34,"productName":"FOOT REST","productPrice":0,"productImageUrl":"/Images/FootRest.png","productDescription":"Foot rest support."},{"productid":35,"productName":"TEKA","productPrice":0,"productImageUrl":"/Images/Teka.png","productDescription":"Structural teka support."},{"productid":36,"productName":"COMPLETE DOOR","productPrice":0,"productImageUrl":"/Images/CompectDore.png","productDescription":"Complete side door."},{"productid":37,"productName":"FRONT MUDGUARD","productPrice":0,"productImageUrl":"/Images/FrontMudgart.png","productDescription":"Front mudguard."},{"productid":38,"productName":"FRONT FLOORING CORNER SAMOSA","productPrice":0,"productImageUrl":"/Images/FrontFloringRearCorner.png","productDescription":"Front flooring corner samosa."},{"productid":39,"productName":"FRONT FLOORING REAR CONA","productPrice":0,"productImageUrl":"/Images/FrontFloringRearCorner.png","productDescription":"Front flooring rear cona."},{"productid":40,"productName":"TEKA PILLAR","productPrice":0,"productImageUrl":"/Images/TekaPiller.png","productDescription":"Teka pillar support."},{"productid":41,"productName":"DERA SUPPORT","productPrice":0,"productImageUrl":"/Images/DearSupport.png","productDescription":"Dera body support."},{"productid":42,"productName":"MIRROR CLAMP","productPrice":0,"productImageUrl":"/Images/MirrorClamp.png","productDescription":"Mirror clamp holder."},{"productid":43,"productName":"SIDE MUDGUARD","productPrice":0,"productImageUrl":"/Images/SideMudgard.png","productDescription":"Side mudguard."},{"productid":44,"productName":"HOOD PIPE","productPrice":0,"productImageUrl":"/Images/HoodPipe.png","productDescription":"Hood pipe support."},{"productid":45,"productName":"REAR GUARD","productPrice":0,"productImageUrl":"/Images/RearGuard.png","productDescription":"Rear safety guard."}]');
function ItemCard({
  name,
  price,
  image,
  onAdd
}) {
  return jsxs("div", {
    className: "group bg-white w-full rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-200 transition-all",
    children: [jsx("div", {
      className: "h-32 w-full overflow-hidden rounded-lg bg-gray-50",
      children: jsx("img", {
        src: image,
        alt: name,
        className: "w-full h-full object-contain group-hover:scale-110 transition-transform"
      })
    }), jsx("h3", {
      className: "mt-3 font-semibold text-sm h-10 overflow-hidden",
      children: name
    }), jsxs("p", {
      className: "text-lg font-bold text-gray-900",
      children: ["₹", price]
    }), jsx("button", {
      onClick: onAdd,
      className: "w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors",
      children: "+ Add to Bill"
    })]
  });
}
const CheckoutModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onConfirm
}) => {
  if (!isOpen) return null;
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  return jsx("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4",
    children: jsxs("div", {
      className: "bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl",
      children: [jsxs("div", {
        className: "p-6 border-b flex justify-between items-center bg-green-700 text-white sticky top-0 z-10",
        children: [jsxs("div", {
          children: [jsx("h2", {
            className: "text-xl font-bold uppercase tracking-wide",
            children: "Customer Billing Details"
          }), jsx("p", {
            className: "text-xs text-green-100",
            children: "KGN Motors Official POS"
          })]
        }), jsx("button", {
          onClick: onClose,
          className: "text-3xl hover:text-gray-200",
          children: "×"
        })]
      }), jsxs("form", {
        className: "p-6 space-y-6",
        onSubmit: onConfirm,
        children: [jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [jsxs("div", {
            children: [jsx("label", {
              className: "block text-sm font-bold text-gray-700 mb-1",
              children: "Customer / Party Name *"
            }), jsx("input", {
              name: "customerName",
              type: "text",
              required: true,
              value: formData.customerName,
              onChange: handleChange,
              className: "w-full border-2 border-gray-200 p-2 rounded-lg focus:border-green-600 outline-none",
              placeholder: "Full Name"
            })]
          }), jsxs("div", {
            children: [jsx("label", {
              className: "block text-sm font-bold text-gray-700 mb-1",
              children: "Phone Number *"
            }), jsx("input", {
              name: "customerPhone",
              type: "tel",
              required: true,
              value: formData.customerPhone,
              onChange: handleChange,
              className: "w-full border-2 border-gray-200 p-2 rounded-lg focus:border-green-600 outline-none",
              placeholder: "Contact No."
            })]
          })]
        }), jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [jsxs("div", {
            children: [jsx("label", {
              className: "block text-sm font-bold text-gray-700 mb-1",
              children: "Supplier Name"
            }), jsx("input", {
              name: "supplierName",
              type: "text",
              value: formData.supplierName,
              onChange: handleChange,
              className: "w-full border border-gray-200 p-2 rounded-lg",
              placeholder: "Optional"
            })]
          }), jsxs("div", {
            children: [jsx("label", {
              className: "block text-sm font-bold text-gray-700 mb-1",
              children: "GST Number"
            }), jsx("input", {
              name: "gstNumber",
              type: "text",
              value: formData.gstNumber,
              onChange: handleChange,
              className: "w-full border border-gray-200 p-2 rounded-lg",
              placeholder: "22AAAAA0000A1Z5"
            })]
          })]
        }), jsxs("div", {
          className: "flex items-center gap-3 bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200",
          children: [jsx("input", {
            name: "isVehicle",
            type: "checkbox",
            id: "vehicle",
            checked: formData.isVehicle,
            onChange: handleChange,
            className: "w-6 h-6 accent-green-700 cursor-pointer"
          }), jsx("label", {
            htmlFor: "vehicle",
            className: "font-bold text-gray-700 cursor-pointer",
            children: "Include Vehicle & Driver Details?"
          })]
        }), formData.isVehicle && jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-xl border border-green-200 transition-all",
          children: [jsxs("div", {
            children: [jsx("label", {
              className: "block text-xs font-bold text-green-800 mb-1",
              children: "Driver Name *"
            }), jsx("input", {
              name: "driverName",
              type: "text",
              required: formData.isVehicle,
              value: formData.driverName,
              onChange: handleChange,
              className: "w-full border border-green-300 p-2 rounded-lg bg-white"
            })]
          }), jsxs("div", {
            children: [jsx("label", {
              className: "block text-xs font-bold text-green-800 mb-1",
              children: "Vehicle No. *"
            }), jsx("input", {
              name: "vehicleNumber",
              type: "text",
              required: formData.isVehicle,
              value: formData.vehicleNumber,
              onChange: handleChange,
              className: "w-full border border-green-300 p-2 rounded-lg bg-white",
              placeholder: "GJ-XX-0000"
            })]
          }), jsxs("div", {
            children: [jsx("label", {
              className: "block text-xs font-bold text-green-800 mb-1",
              children: "Driver Phone *"
            }), jsx("input", {
              name: "driverPhone",
              type: "tel",
              required: formData.isVehicle,
              value: formData.driverPhone,
              onChange: handleChange,
              className: "w-full border border-green-300 p-2 rounded-lg bg-white"
            })]
          })]
        }), jsxs("div", {
          children: [jsx("label", {
            className: "block text-sm font-bold text-gray-700 mb-1",
            children: "Additional Business Details"
          }), jsx("textarea", {
            name: "businessDetails",
            value: formData.businessDetails,
            onChange: handleChange,
            className: "w-full border border-gray-200 p-2 rounded-lg",
            rows: "2",
            placeholder: "Address or special notes..."
          })]
        }), jsxs("div", {
          className: "flex gap-4 pt-4 sticky bottom-0 bg-white",
          children: [jsx("button", {
            type: "button",
            onClick: onClose,
            className: "flex-1 px-6 py-3 rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-50 transition-all",
            children: "Cancel"
          }), jsx("button", {
            type: "submit",
            className: "flex-1 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg",
            children: "Confirm & Generate Bill"
          })]
        })]
      })]
    })
  });
};
const getLocalImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};
const generateInvoice = async (formData, cart, subtotal, gst, grandTotal) => {
  const doc = new jsPDF("p", "mm", "a4");
  const halfGstTotal = (gst / 2).toFixed(2);
  const logoUrl = "/KGNNewLOGO.png";
  try {
    const logoImg = await getLocalImage(logoUrl);
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({
      opacity: 0.05
    }));
    doc.addImage(logoImg, "PNG", 55, 100, 100, 100);
    doc.restoreGraphicsState();
    doc.addImage(logoImg, "PNG", 14, 10, 22, 22);
    doc.setTextColor(0, 100, 0);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("KGN MOTORS", 40, 18);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text("Shop No. 12, Auto Plaza, Near Railway Crossing,", 40, 23);
    doc.text("Sarkhej Road, Juhapura, Ahmedabad - 380055", 40, 27);
    doc.text("GSTIN: 24ABCCE1234F1Z5 | State: Gujarat (24)", 40, 31);
    doc.text("Email: kgnmotors.abd@gmail.com | Mob: +91 99721 XXXXX", 40, 35);
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("TAX INVOICE", 150, 18);
    doc.setFontSize(9);
    const invNo = `KGN/25-26/${Math.floor(1e3 + Math.random() * 9e3)}`;
    doc.text(`Invoice No: ${invNo}`, 150, 24);
    doc.text(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`, 150, 29);
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 46);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.customerName.toUpperCase()}`, 14, 51);
    doc.text(`Phone: +91 ${formData.customerPhone}`, 14, 56);
    if (formData.isVehicle) {
      doc.setFont("helvetica", "bold");
      doc.text("VEHICLE:", 120, 46);
      doc.setFont("helvetica", "normal");
      doc.text(`No: ${formData.vehicleNumber.toUpperCase()}`, 120, 51);
      doc.text(`Driver: ${formData.driverName}`, 120, 56);
    }
    autoTable(doc, {
      startY: 65,
      head: [["SR.", "ITEM DESCRIPTION", "QTY", "RATE", "CGST(9%)", "SGST(9%)", "AMOUNT"]],
      body: cart.map((item, i) => {
        const itemTotal = item.productPrice * item.quantity;
        const itemGst = (itemTotal * 0.09).toFixed(2);
        return [i + 1, item.productName.toUpperCase(), item.quantity, item.productPrice.toFixed(2), itemGst, itemGst, (itemTotal + parseFloat(itemGst) * 2).toFixed(2)];
      }),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [0, 0, 0]
      },
      // Pure black text for readability
      headStyles: {
        fillColor: [0, 100, 0],
        halign: "center"
      },
      columnStyles: {
        0: {
          halign: "center",
          cellWidth: 10
        },
        1: {
          cellWidth: 55
        },
        2: {
          halign: "center"
        },
        3: {
          halign: "right"
        },
        4: {
          halign: "right"
        },
        5: {
          halign: "right"
        },
        6: {
          halign: "right",
          fontStyle: "bold"
        }
      }
    });
    let finalY = doc.lastAutoTable.finalY + 10;
    const rightX = 140;
    const valX = 196;
    doc.setFontSize(10);
    doc.text("Taxable Value:", rightX, finalY);
    doc.text(`${subtotal.toFixed(2)}`, valX, finalY, {
      align: "right"
    });
    doc.text("Total CGST:", rightX, finalY + 5);
    doc.text(`${halfGstTotal}`, valX, finalY + 5, {
      align: "right"
    });
    doc.text("Total SGST:", rightX, finalY + 10);
    doc.text(`${halfGstTotal}`, valX, finalY + 10, {
      align: "right"
    });
    doc.setLineDash([1, 1], 0);
    doc.line(rightX, finalY + 13, 196, finalY + 13);
    doc.setFont(void 0, "bold");
    doc.setFontSize(12);
    doc.text("GRAND TOTAL:", rightX, finalY + 20);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, valX, finalY + 20, {
      align: "right"
    });
    const footerY = 270;
    doc.setFontSize(9);
    doc.text("For, KGN MOTORS", 150, footerY - 15);
    doc.setLineDash([1, 1], 0);
    doc.rect(148, footerY - 13, 45, 15);
    doc.text("Authorised Signatory", 153, footerY + 6);
    window.open(doc.output("bloburl"), "_blank");
    doc.save(`KGN_INV_${Date.now()}.pdf`);
  } catch (error) {
    console.error("PDF Generation failed", error);
  }
};
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
    driverPhone: ""
  });
  const filteredItems = items.filter((i) => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.productid === product.productid);
      if (found) {
        return prev.map((p) => p.productid === product.productid ? {
          ...p,
          quantity: p.quantity + 1
        } : p);
      }
      return [...prev, {
        ...product,
        quantity: 1
      }];
    });
  };
  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.map((p) => p.productid === id && p.quantity + delta > 0 ? {
      ...p,
      quantity: p.quantity + delta
    } : p));
  };
  const removeFromCart = (id) => setCart(cart.filter((p) => p.productid !== id));
  const subtotal = cart.reduce((s, i) => s + i.productPrice * i.quantity, 0);
  const discountAmount = discountType === "percent" ? subtotal * discountValue / 100 : discountValue;
  const taxable = Math.max(subtotal - discountAmount, 0);
  const gst = taxable * 0.18;
  const grandTotal = taxable + gst;
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    await generateInvoice(formData, cart, subtotal, discountAmount, gst);
    setCart([]);
    setDiscountValue(0);
    setIsModalOpen(false);
  };
  return jsxs("div", {
    className: "flex w-full h-full bg-gray-100 overflow-hidden",
    children: [jsxs("div", {
      className: "flex-1 p-6 overflow-y-auto",
      children: [jsx("h1", {
        className: "text-3xl font-black text-green-700 mb-2",
        children: "KGN MOTORS"
      }), jsx("input", {
        className: "w-full mb-4 px-4 py-2 border rounded-lg",
        placeholder: "Search auto parts...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value)
      }), jsx("div", {
        className: "grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4",
        children: filteredItems.map((item) => jsx(ItemCard, {
          name: item.productName,
          price: item.productPrice,
          image: item.productImageUrl,
          onAdd: () => addToCart(item)
        }, item.productid))
      })]
    }), jsxs("div", {
      className: "w-[380px] bg-white shadow-xl flex flex-col",
      children: [jsxs("div", {
        className: "bg-green-700 text-white p-4 font-bold",
        children: ["CART (", cart.reduce((a, b) => a + b.quantity, 0), ")"]
      }), jsx("div", {
        className: "flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50",
        children: cart.map((item) => jsxs("div", {
          className: "bg-white p-3 rounded border",
          children: [jsxs("div", {
            className: "flex justify-between",
            children: [jsx("span", {
              className: "font-bold text-xs",
              children: item.productName
            }), jsx("button", {
              onClick: () => removeFromCart(item.productid),
              className: "text-red-500",
              children: "✕"
            })]
          }), jsxs("div", {
            className: "flex justify-between mt-2 items-center",
            children: [jsxs("div", {
              className: "flex gap-3",
              children: [jsx("button", {
                onClick: () => updateQuantity(item.productid, -1),
                children: "-"
              }), jsx("span", {
                children: item.quantity
              }), jsx("button", {
                onClick: () => updateQuantity(item.productid, 1),
                children: "+"
              })]
            }), jsxs("span", {
              className: "font-bold",
              children: ["₹", item.productPrice * item.quantity]
            })]
          })]
        }, item.productid))
      }), jsxs("div", {
        className: "p-4 border-t space-y-2",
        children: [jsxs("div", {
          className: "flex justify-between",
          children: [jsx("span", {
            children: "Subtotal"
          }), jsxs("span", {
            children: ["₹", subtotal.toFixed(2)]
          })]
        }), jsxs("div", {
          className: "flex gap-2",
          children: [jsxs("select", {
            className: "border px-2",
            value: discountType,
            onChange: (e) => setDiscountType(e.target.value),
            children: [jsx("option", {
              value: "amount",
              children: "₹"
            }), jsx("option", {
              value: "percent",
              children: "%"
            })]
          }), jsx("input", {
            type: "number",
            className: "border flex-1 px-2",
            placeholder: "Discount",
            value: discountValue,
            onChange: (e) => setDiscountValue(+e.target.value)
          })]
        }), jsxs("div", {
          className: "flex justify-between text-red-600 font-bold",
          children: [jsx("span", {
            children: "Discount"
          }), jsxs("span", {
            children: ["-₹", discountAmount.toFixed(2)]
          })]
        }), jsxs("div", {
          className: "flex justify-between",
          children: [jsx("span", {
            children: "GST (18%)"
          }), jsxs("span", {
            children: ["₹", gst.toFixed(2)]
          })]
        }), jsxs("div", {
          className: "flex justify-between text-xl font-black",
          children: [jsx("span", {
            children: "TOTAL"
          }), jsxs("span", {
            className: "text-green-700",
            children: ["₹", grandTotal.toFixed(2)]
          })]
        }), jsx("button", {
          onClick: () => setIsModalOpen(true),
          disabled: !cart.length,
          className: "w-full mt-4 bg-green-700 text-white py-3 rounded-lg font-bold",
          children: "PRINT INVOICE"
        })]
      })]
    }), jsx(CheckoutModal, {
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false),
      formData,
      setFormData,
      onConfirm: handleConfirmOrder
    })]
  });
}
function GreenDatePicker({
  selectedDate,
  onDateChange
}) {
  const [show, setShow] = useState(false);
  const [viewDate, setViewDate] = useState(moment());
  const [grid, setGrid] = useState([]);
  const calendarRef = useRef(null);
  useEffect(() => {
    const start = moment(viewDate).startOf("month").startOf("week");
    const end = moment(viewDate).endOf("month").endOf("week");
    const day = start.clone().subtract(1, "day");
    const _grid = [];
    while (day.isBefore(end, "day")) {
      _grid.push(Array(7).fill(0).map(() => day.add(1, "day").clone()));
    }
    setGrid(_grid);
  }, [viewDate]);
  return jsxs("div", {
    className: "relative w-full",
    ref: calendarRef,
    children: [jsx("label", {
      className: "text-xs font-bold text-gray-500 uppercase block mb-1",
      children: "Delivery Date"
    }), jsxs("div", {
      onClick: () => setShow(!show),
      className: "flex items-center justify-between w-full border border-gray-300 rounded-lg p-3 bg-white cursor-pointer hover:border-green-500 transition-all focus-within:ring-2 focus-within:ring-green-200",
      children: [jsx("span", {
        className: "text-gray-800",
        children: moment(selectedDate).format("DD MMM, YYYY")
      }), jsx(FaCalendarAlt, {
        className: "text-green-600"
      })]
    }), show && jsxs("div", {
      className: "absolute z-[100] mt-2 left-0 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 p-4 animate-in fade-in zoom-in duration-200",
      children: [jsxs("div", {
        className: "flex justify-between items-center mb-4",
        children: [jsx("button", {
          onClick: () => setViewDate(viewDate.clone().subtract(1, "month")),
          className: "p-1 hover:bg-green-50 rounded text-green-700",
          children: jsx(FaChevronLeft, {})
        }), jsx("h3", {
          className: "font-bold text-gray-800 text-sm",
          children: viewDate.format("MMMM YYYY")
        }), jsx("button", {
          onClick: () => setViewDate(viewDate.clone().add(1, "month")),
          className: "p-1 hover:bg-green-50 rounded text-green-700",
          children: jsx(FaChevronRight, {})
        })]
      }), jsx("div", {
        className: "grid grid-cols-7 mb-2 text-center text-[10px] font-bold text-gray-400 uppercase",
        children: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => jsx("div", {
          children: d
        }, d))
      }), jsx("div", {
        className: "space-y-1",
        children: grid.map((week, i) => jsx("div", {
          className: "grid grid-cols-7",
          children: week.map((date, j) => {
            const isSel = date.format("YYYY-MM-DD") === selectedDate;
            const isCurr = date.isSame(viewDate, "month");
            return jsx("button", {
              onClick: () => {
                onDateChange(date.format("YYYY-MM-DD"));
                setShow(false);
              },
              className: `h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs transition-all
                        ${!isCurr ? "text-gray-200" : "text-gray-700 hover:bg-green-100"}
                        ${isSel ? "bg-green-600 text-white shadow-md scale-110" : ""}
                      `,
              children: date.date()
            }, j);
          })
        }, i))
      })]
    })]
  });
}
function PurchaseOrder() {
  const [vendor, setVendor] = useState({
    name: "",
    date: moment().format("YYYY-MM-DD"),
    poNumber: `PO-${Math.floor(1e3 + Math.random() * 9e3)}`
  });
  const [items, setItems] = useState([{
    id: 1,
    name: "",
    qty: 1,
    price: 0,
    total: 0
  }]);
  const [activeSearch, setActiveSearch] = useState({
    rowId: null,
    results: []
  });
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;
  const addItem = () => setItems([...items, {
    id: Date.now(),
    name: "",
    qty: 1,
    price: 0,
    total: 0
  }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter((item) => item.id !== id));
  const updateItem = (id, field, value) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updated = {
          ...item,
          [field]: value
        };
        updated.total = updated.qty * updated.price;
        return updated;
      }
      return item;
    });
    setItems(newItems);
    if (field === "name") {
      if (value.length > 1) {
        const filtered = itemData.filter((p) => p.productName.toLowerCase().includes(value.toLowerCase()));
        setActiveSearch({
          rowId: id,
          results: filtered
        });
      } else {
        setActiveSearch({
          rowId: null,
          results: []
        });
      }
    }
  };
  const selectProduct = (rowId, product) => {
    setItems(items.map((item) => item.id === rowId ? {
      ...item,
      name: product.productName,
      price: product.productPrice,
      total: item.qty * product.productPrice
    } : item));
    setActiveSearch({
      rowId: null,
      results: []
    });
  };
  const exportToExcel = () => {
    const headerData = [
      ["KGN AUTO PARTS - PURCHASE ORDER"],
      [`PO Number: ${vendor.poNumber}`],
      [`Vendor: ${vendor.name || "N/A"}`],
      [`Date: ${vendor.date}`],
      [""],
      // Spacer
      ["Product Description", "Quantity", "Unit Price (INR)", "Total (INR)"]
      // Table Headers
    ];
    const itemRows = items.map((i) => [i.name, i.qty, i.price, i.total]);
    const summaryRows = [["", "", "Subtotal", subtotal], ["", "", "GST (18%)", tax], ["", "", "Grand Total", grandTotal]];
    const finalData = [...headerData, ...itemRows, [""], ...summaryRows];
    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Order");
    XLSX.writeFile(wb, `${vendor.poNumber}.xlsx`);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    const themeColor = [22, 163, 74];
    doc.setFillColor(...themeColor);
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("KGN AUTO PARTS", 14, 12);
    doc.setFontSize(8);
    doc.text("Purchase Order Document", 14, 18);
    doc.setFontSize(12);
    doc.text("PURCHASE ORDER", 150, 15);
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont(void 0, "bold");
    doc.text("BILL TO:", 14, 35);
    doc.setFont(void 0, "normal");
    doc.text("KGN Auto Parts, Ahmedabad, GJ", 14, 40);
    doc.setFont(void 0, "bold");
    doc.text("ORDER DETAILS:", 130, 35);
    doc.setFont(void 0, "normal");
    doc.text(`Vendor: ${vendor.name || "N/A"}`, 130, 40);
    doc.text(`PO Number: ${vendor.poNumber}`, 130, 45);
    doc.text(`Date: ${vendor.date}`, 130, 50);
    autoTable(doc, {
      startY: 55,
      head: [["Description", "Qty", "Price", "Total"]],
      body: items.map((i) => [i.name, i.qty, i.price.toFixed(2), i.total.toFixed(2)]),
      theme: "grid",
      // Grid theme as requested
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: themeColor,
        textColor: [255, 255, 255],
        halign: "center"
      },
      columnStyles: {
        1: {
          halign: "center"
        },
        2: {
          halign: "right"
        },
        3: {
          halign: "right"
        }
      }
    });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(`Subtotal:`, 140, finalY);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 185, finalY, {
      align: "right"
    });
    doc.text(`GST (18%):`, 140, finalY + 5);
    doc.text(`Rs. ${tax.toFixed(2)}`, 185, finalY + 5, {
      align: "right"
    });
    doc.setFont(void 0, "bold");
    doc.setTextColor(...themeColor);
    doc.text(`GRAND TOTAL:`, 140, finalY + 12);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, 185, finalY + 12, {
      align: "right"
    });
    doc.save(`${vendor.poNumber}.pdf`);
  };
  return jsx("div", {
    className: "p-3 bg-gray-50 min-h-screen",
    children: jsxs("div", {
      className: "mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8",
      children: [jsxs("div", {
        className: "flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6 gap-4",
        children: [jsx("div", {
          children: jsx("h1", {
            className: "text-3xl font-extrabold text-gray-900 tracking-tight",
            children: "Purchase Order"
          })
        }), jsxs("div", {
          className: "flex gap-3",
          children: [jsxs("button", {
            onClick: exportToExcel,
            className: "flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md",
            children: [jsx(FaFileExcel, {}), " Excel"]
          }), jsxs("button", {
            onClick: exportToPDF,
            className: "flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 transition font-semibold shadow-md",
            children: [jsx(FaFilePdf, {}), " PDF"]
          })]
        })]
      }), jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-10",
        children: [jsxs("div", {
          className: "space-y-1",
          children: [jsx("label", {
            className: "text-xs font-bold text-gray-500 uppercase",
            children: "Vendor Name"
          }), jsx("input", {
            type: "text",
            className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none",
            placeholder: "Supplier name...",
            value: vendor.name,
            onChange: (e) => setVendor({
              ...vendor,
              name: e.target.value
            })
          })]
        }), jsxs("div", {
          className: "space-y-1",
          children: [jsx("label", {
            className: "text-xs font-bold text-gray-500 uppercase",
            children: "PO Number"
          }), jsx("input", {
            type: "text",
            readOnly: true,
            className: "w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-600 font-mono",
            value: vendor.poNumber
          })]
        }), jsx("div", {
          className: "space-y-1",
          children: jsx(GreenDatePicker, {
            selectedDate: vendor.date,
            onDateChange: (d) => setVendor({
              ...vendor,
              date: d
            })
          })
        })]
      }), jsx("div", {
        className: "overflow-visible mb-6",
        children: jsxs("table", {
          className: "w-full border-collapse",
          children: [jsx("thead", {
            children: jsxs("tr", {
              className: "bg-green-700 text-white",
              children: [jsx("th", {
                className: "p-4 text-left rounded-tl-lg font-semibold",
                children: "Product Description"
              }), jsx("th", {
                className: "p-4 text-center font-semibold w-28",
                children: "Qty"
              }), jsx("th", {
                className: "p-4 text-right font-semibold w-44",
                children: "Unit Price (₹)"
              }), jsx("th", {
                className: "p-4 text-right font-semibold w-44",
                children: "Total (₹)"
              }), jsx("th", {
                className: "p-4 text-center rounded-tr-lg w-16"
              })]
            })
          }), jsx("tbody", {
            className: "divide-y divide-gray-200",
            children: items.map((item) => jsxs("tr", {
              className: "hover:bg-green-50/30 transition",
              children: [jsxs("td", {
                className: "p-3 relative",
                children: [jsx("input", {
                  autoComplete: "off",
                  type: "text",
                  className: "w-full p-2 border border-transparent focus:border-green-500 focus:bg-white rounded outline-none",
                  placeholder: "Search items...",
                  value: item.name,
                  onChange: (e) => updateItem(item.id, "name", e.target.value)
                }), activeSearch.rowId === item.id && activeSearch.results.length > 0 && jsx("div", {
                  className: "absolute z-50 left-2 right-2 mt-1 bg-white border border-gray-300 rounded-xl shadow-2xl max-h-56 overflow-y-auto ring-2 ring-green-500 ring-opacity-20",
                  children: activeSearch.results.map((product) => jsxs("div", {
                    className: "p-3 hover:bg-green-600 hover:text-white cursor-pointer flex justify-between items-center transition",
                    onClick: () => selectProduct(item.id, product),
                    children: [jsx("span", {
                      className: "font-semibold",
                      children: product.productName
                    }), jsxs("span", {
                      className: "text-xs opacity-80 font-mono",
                      children: ["₹", product.productPrice]
                    })]
                  }, product.productid))
                })]
              }), jsx("td", {
                className: "p-3",
                children: jsx("input", {
                  type: "number",
                  className: "w-full p-2 text-center border border-gray-200 rounded",
                  value: item.qty,
                  onChange: (e) => updateItem(item.id, "qty", parseInt(e.target.value) || 0)
                })
              }), jsx("td", {
                className: "p-3",
                children: jsx("input", {
                  type: "number",
                  className: "w-full p-2 text-right border border-gray-200 rounded font-mono",
                  value: item.price,
                  onChange: (e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)
                })
              }), jsxs("td", {
                className: "p-3 text-right font-bold text-gray-700 font-mono",
                children: ["₹", item.total.toLocaleString()]
              }), jsx("td", {
                className: "p-3 text-center",
                children: jsx("button", {
                  onClick: () => removeItem(item.id),
                  className: "text-gray-400 hover:text-red-600 transition p-2",
                  children: jsx(FaTrash, {})
                })
              })]
            }, item.id))
          })]
        })
      }), jsxs("button", {
        onClick: addItem,
        className: "flex items-center gap-2 text-green-700 font-bold hover:text-green-900 transition mb-12 group",
        children: [jsx("span", {
          className: "bg-green-100 p-1 rounded-full group-hover:bg-green-200",
          children: jsx(FaPlus, {
            size: 12
          })
        }), " Add New Product"]
      }), jsxs("div", {
        className: "flex flex-col md:flex-row justify-between items-start gap-8 border-t pt-8",
        children: [jsxs("div", {
          className: "w-full md:w-1/2",
          children: [jsx("label", {
            className: "text-xs font-bold text-gray-500 uppercase block mb-2",
            children: "Terms & Conditions"
          }), jsx("textarea", {
            className: "w-full border border-gray-200 rounded-lg p-3 text-sm h-24 text-gray-600 focus:ring-2 focus:ring-green-500 outline-none",
            placeholder: "Enter notes or terms here..."
          })]
        }), jsxs("div", {
          className: "w-full md:w-1/3 bg-green-50/50 p-6 rounded-xl border border-green-100 space-y-4",
          children: [jsxs("div", {
            className: "flex justify-between text-gray-600",
            children: [jsx("span", {
              children: "Subtotal"
            }), jsxs("span", {
              className: "font-mono",
              children: ["₹", subtotal.toLocaleString()]
            })]
          }), jsxs("div", {
            className: "flex justify-between text-gray-600",
            children: [jsx("span", {
              children: "GST (18%)"
            }), jsxs("span", {
              className: "font-mono",
              children: ["₹", tax.toLocaleString()]
            })]
          }), jsxs("div", {
            className: "flex justify-between text-2xl font-black text-green-900 border-t border-green-200 pt-4",
            children: [jsx("span", {
              children: "Total"
            }), jsxs("span", {
              children: ["₹", grandTotal.toLocaleString()]
            })]
          }), jsxs("button", {
            className: "w-full bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-green-800 transition shadow-xl mt-4",
            children: [jsx(FaSave, {}), " Confirm & Submit"]
          })]
        })]
      })]
    })
  });
}
function App() {
  return jsx(Routes, {
    children: jsxs(Route, {
      path: "/",
      element: jsx(Layout, {}),
      children: [jsx(Route, {
        index: true,
        element: jsx(Dashboard, {})
      }), jsx(Route, {
        path: "sales/pos",
        element: jsx(POSScreen, {})
      }), jsx(Route, {
        path: "sales/order",
        element: jsx("div", {
          children: "Sales Order"
        })
      }), jsx(Route, {
        path: "sales/invoice",
        element: jsx("div", {
          children: "Sales Invoice"
        })
      }), jsx(Route, {
        path: "purchase/order",
        element: jsx(PurchaseOrder, {})
      }), jsx(Route, {
        path: "inventory/update",
        element: jsx("div", {
          children: "Inventory Update"
        })
      })]
    })
  });
}
function render(url) {
  const html = renderToString(jsx(StaticRouter, {
    location: url,
    children: jsx(App, {})
  }));
  return {
    html
  };
}
export {
  render
};
