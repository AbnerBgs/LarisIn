// components/PopUp.tsx
import { RiCloseCircleLine } from '@remixicon/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';

type PleasePopStyle = "hard-shadow" | "receipt-edge"

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  style?: PleasePopStyle;
}

export default function PleasePop({ isOpen, onClose, children, title, style = "hard-shadow" }: PopUpProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // Tutup saat tombol Escape ditekan.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const popupStyle = style === "hard-shadow" 
    ? "rounded-2xl border border-black hard-shadow-static" 
    : "receipt-edge pb-8";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto ${popupStyle} transition-all duration-200 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center gap-4">
          {title && <h2 className="text-xl font-bold leading-snug">{title}</h2>}
          <button
            onClick={handleClose}
            aria-label="Tutup"
            className="ml-auto shrink-0 w-8 h-8 flex items-center justify-center leading-none font-bold cursor-pointer hover:scale-110 transition-transform"
          >
            <RiCloseCircleLine className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}