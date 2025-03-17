import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-text/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-medium transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    type === 'warning' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                  }`}>
                    {type === 'warning' ? <FiAlertCircle size={24} /> : <FiCheck size={24} />}
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-display font-semibold text-text">
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-text-light">
                      {message}
                    </Dialog.Description>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-text-light hover:bg-accent/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      type === 'warning' 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    Confirmar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}