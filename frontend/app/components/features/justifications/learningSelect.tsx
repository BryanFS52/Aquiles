import { useState } from 'react';

export default function LearningSelect() {
  const [selectedValue, setSelectedValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: '', label: 'Selecciona una opción' },
  ];

interface Option {
    value: string;
    label: string;
}

const handleSelect = (value: string): void => {
    setSelectedValue(value);
    setIsOpen(false);
};

  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  return (
    <div className="relative w-64">
      <select
        value={selectedValue}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full px-3 py-1.5 text-left bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption.label}</span>
      </select>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(option => (
            <div
              key={option.value}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                selectedValue === option.value
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}