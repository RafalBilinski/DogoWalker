import { toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = (
  message: string,
  type: ToastType & {} = "info",
  options: ToastOptions & {} = {}
) => {
  return toast[type](message, {
    ...defaultOptions,
    ...options,
  });
};
