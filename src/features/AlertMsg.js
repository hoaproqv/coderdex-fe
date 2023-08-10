import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export const AlertMsg = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};
