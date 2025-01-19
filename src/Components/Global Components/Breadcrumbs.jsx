import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm font-poppins text-gray-500 mb-2 pt-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <FaChevronRight className="mx-2 text-gray-400" />}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-auralblue transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 