import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface Option {
  value: string;
  label: string;
}

export default function LearningSelect() {
  const [selectedValue, setSelectedValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const options: Option[] = [
    { value: '', label: 'Selecciona una opción' },
  ];

  const handleSelect = (value: string): void => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 text-left bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="truncate">{selectedOption.label}</span>
        <FaChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Hidden select for form submission */}
      <select
        value={selectedValue}
        onChange={(e) => handleSelect(e.target.value)}
        className="hidden"
        name="learningSelect"
        aria-label="Learning Select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown Menu */}
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

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}