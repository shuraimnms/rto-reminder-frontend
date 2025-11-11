import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Phone, Mail, Car, CreditCard } from 'lucide-react'; // Added CreditCard for Customer ID
import { customersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme

const AddCustomerModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { currentTheme } = useTheme();
  const isNeuralTheme = currentTheme === 'neural';

  const onSubmit = async (data) => {
    setLoading(true);
    console.log('Sending customer data:', data); // Log the data being sent
    try {
      await customersAPI.create(data);
      toast.success('Customer added successfully!');
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add customer';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isNeuralTheme ? 'neural-modal-overlay' : ''}`}>
      <div className={`max-w-md w-full max-h-[90vh] overflow-y-auto ${isNeuralTheme ? 'neural-card neural-modal-content' : 'bg-white rounded-lg'}`}>
        <div className={`flex items-center justify-between p-6 border-b ${isNeuralTheme ? 'border-neural-border-color' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Add New Customer</h3>
          <button
            onClick={onClose}
            className={`hover:text-gray-600 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-400'}`}
          >
            <X className={`h-6 w-6 ${isNeuralTheme ? 'neural-icon' : ''}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Auto-generated Customer ID (Placeholder) */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
              Customer ID
            </label>
            <div className="relative">
              <input
                type="text"
                className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                value="Auto-generated on save"
                readOnly
                disabled
              />
              <CreditCard className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
              Full Name *
            </label>
            <div className="relative">
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                placeholder="Enter customer name"
              />
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
              Mobile Number *
            </label>
            <div className="relative">
              <input
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^\+\d{10,15}$/,
                    message: 'Mobile must be in E.164 format (e.g., +919876543210)'
                  }
                })}
                type="text"
                className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                placeholder="+919876543210"
              />
              <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            </div>
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
              Email (Optional)
            </label>
            <div className="relative">
              <input
                {...register('email', {
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                placeholder="customer@example.com"
              />
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
              Vehicle Number *
            </label>
            <div className="relative">
              <input
                {...register('vehicle_number', { required: 'Vehicle number is required' })}
                type="text"
                className={`pl-10 uppercase ${isNeuralTheme ? 'neural-input' : 'input'}`}
                placeholder="TS09AB1234"
              />
              <Car className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            </div>
            {errors.vehicle_number && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicle_number.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={isNeuralTheme ? "neural-button" : "btn btn-secondary"}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={isNeuralTheme ? "neural-button" : "btn btn-primary"}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
