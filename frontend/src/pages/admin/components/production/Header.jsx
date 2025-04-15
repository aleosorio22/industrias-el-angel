import React from 'react';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header = ({ dateFilter, setDateFilter, handleGeneratePDF, generatingPDF, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Consolidado de Producción</h1>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleGeneratePDF}
          disabled={generatingPDF || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {generatingPDF ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"/>
          ) : (
            <>
              <FiDownload size={16} />
              <span>Descargar PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;