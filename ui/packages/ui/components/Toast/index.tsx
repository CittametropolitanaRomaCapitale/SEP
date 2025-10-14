import { FCC } from '@cmrc/types/FCC';
import {
  ToastContainer as ToastifyContainer,
  toast as toastify
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ToastOptions = {
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  duration?: number;
  autoClose?: boolean;
};

const defaultOptions: ToastOptions = {
  position: 'bottom-left',
  duration: 5000,
  autoClose: false
};

export const ToastContainer: FCC<ToastOptions> = ({ ...props }) => (
  <ToastifyContainer
    position={props?.position}
    autoClose={props?.autoClose ? false : props?.duration}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    draggable={false}
    pauseOnFocusLoss
    pauseOnHover
    theme="colored"
  />
);

const success = (
  message: string | JSX.Element,
  options: ToastOptions = defaultOptions
) => {
  toastify.success(message, {
    position: options?.position,
    autoClose: options?.autoClose ? false : options?.duration,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined
  });
};

const error = (
  message: string | JSX.Element,
  options: ToastOptions = defaultOptions
) => {
  toastify.error(message, {
    position: options?.position,
    autoClose: options?.autoClose ? false : options?.duration,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined
  });
};

const warn = (
  message: string | JSX.Element,
  options: ToastOptions = defaultOptions
) => {
  toastify.warn(message, {
    position: options?.position,
    autoClose: options?.autoClose ? false : options?.duration,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined
  });
};

const toast = {
  success,
  error,
  warn
};

export default toast;
