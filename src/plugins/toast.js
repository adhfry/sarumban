import { createToastInterface } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options = {
  position: "top-center",
  timeout: 5000,
  closeOnClick: false,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__slideBlurred",
  maxToasts: 20,
  newestOnTop: true
};

const toast = createToastInterface(options);

export default toast;
