import { ReactNode, useState } from "react";

type CardCollapseProps = {
    children: ReactNode,
    title: string | ReactNode
}
export const CardCollapse = ( { title, children } : CardCollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full mx-auto mt-1">
      {/* Card Collapse */}
      <div className="border rounded-lg shadow-md">
        {/* Header */}
        <button
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={toggleCollapse}
        >
          <span className="font-semibold text-gray-700">{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Content */}
        {isOpen && (
          <div className="px-4 py-3 text-gray-600">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
