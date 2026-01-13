import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notifySuccess = (message) => {
  toast.success(message, options);
};

export const notifyError = (message) => {
  toast.error(message, options);
};

export const notifyWarning = (message) => {
  toast.warn(message, options);
};

export const notifyInfo = (message) => {
  toast.info(message, options);
};
