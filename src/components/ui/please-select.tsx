'use client'

import { useState, useRef, useEffect } from 'react';
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PleaseSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Pilih...',
  className = '' 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-black hard-shadow bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {displayLabel}
        </span>
        <RiArrowDownSLine className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-black hard-shadow-static bg-white py-2 max-h-60 overflow-y-auto shadow-lg">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              Tidak ada data
            </div>
          ) : (
            options.map((option) => {
              const isSelected = value === option.value;
              return (
                <div
                  key={option.value}
                  className={`px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <RiCheckLine className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}