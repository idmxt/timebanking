import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full" style={{ backgroundColor: '#F5E6D3' }}>
            <Icon size={48} style={{ color: '#8B9D77' }} />
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2" style={{ color: '#2F5233' }}>
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
