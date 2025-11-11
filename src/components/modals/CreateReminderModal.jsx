import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Car, User, AlertTriangle } from 'lucide-react';
import { remindersAPI, customersAPI } from '../../services/api'; // Removed payAPI as it's not directly used here
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import InsufficientBalancePopup from './InsufficientBalancePopup';
import { useTheme } from '../../contexts/ThemeContext';

const CreateReminderModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false); // New state for popup
  const { user, refreshUser } = useAuth(); // Get user and refreshUser from AuthContext
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const { currentTheme } = useTheme();
  const isNeuralTheme = currentTheme === 'neural';

  const reminderTypes = [
    { value: 'vehicle_insurance_reminder', label: 'Vehicle Insurance' },
    { value: 'puc_certificate_reminder', label: 'PUC Certificate' },
    { value: 'fitness_certificate_reminder', label: 'Fitness Certificate' },
    { value: 'driving_license_reminder', label: 'Driving License' },
    { value: 'road_tax_reminder', label: 'Road Tax' },
    { value: 'noc_hypothecation_reminder', label: 'NOC/Hypothecation' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await customersAPI.getAll({ limit: 100 });
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const selectedCustomerId = watch('customer');
  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Check wallet balance before proceeding
    const perMessageCost = user?.settings?.per_message_cost || 1.0;
    if (user?.wallet_balance < perMessageCost) {
      setShowInsufficientBalancePopup(true);
      setLoading(false);
      return; // Stop the submission
    }

    try {
      // Remove reminder_time from data if it exists, as it's no longer needed
      const { reminder_time, ...restOfData } = data; 
      const reminderData = {
        ...restOfData,
        expiry_date: new Date(data.expiry_date).toISOString(),
        lead_times: [30, 7, 3, 1]
      };
      console.log('Sending reminder data:', reminderData);

      await remindersAPI.create(reminderData);
      toast.success('Reminder created successfully!');
      reset();
      onClose();
      if (onSuccess) onSuccess();
      refreshUser(); // Refresh user data to update wallet balance
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create reminder';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isNeuralTheme ? 'neural-modal-overlay' : ''}`}>
        <div className={`max-w-lg w-full max-h-[90vh] overflow-y-auto ${isNeuralTheme ? 'neural-card neural-modal-content' : 'bg-white rounded-lg'}`}>
          <div className={`flex items-center justify-between p-6 border-b ${isNeuralTheme ? 'border-neural-border-color' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900 themed-heading'}`}>Create New Reminder</h3>
            <button
              onClick={onClose}
              className={`hover:text-gray-600 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-400'}`}
            >
              <X className={`h-6 w-6 ${isNeuralTheme ? 'neural-icon' : ''}`} />
            </button>
          </div>

          {user && user.wallet_balance < (user.settings?.per_message_cost || 1.0) && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p className="font-bold">Insufficient Balance!</p>
              <p>Your current wallet balance is {user.wallet_balance}. A minimum of {user.settings?.per_message_cost || 1.0} is required to create a reminder.</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
                Select Customer *
              </label>
              <div className="relative">
                <select
                  {...register('customer', { required: 'Please select a customer' })}
                  className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                  disabled={loadingCustomers}
                >
                  <option value="">
                    {loadingCustomers ? 'Loading customers...' : 'Select a customer'}
                  </option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.vehicle_number}
                    </option>
                  ))}
                </select>
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
              </div>
              {errors.customer && (
                <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
                Reminder Type *
              </label>
              <div className="relative">
                <select
                  {...register('reminder_type', { required: 'Please select reminder type' })}
                  className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                >
                  <option value="">Select reminder type</option>
                  {reminderTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <Car className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
              </div>
              {errors.reminder_type && (
                <p className="mt-1 text-sm text-red-600">{errors.reminder_type.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
                Expiry Date *
              </label>
              <div className="relative">
                <input
                  {...register('expiry_date', { required: 'Expiry date is required' })}
                  type="date"
                  className={`pl-10 ${isNeuralTheme ? 'neural-input' : 'input'}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
              </div>
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-600">{errors.expiry_date.message}</p>
              )}
            </div>


            {selectedCustomer && (
              <div className={`p-4 rounded-lg ${isNeuralTheme ? 'bg-neural-card-background border border-neural-border-color' : 'bg-gray-50'}`}>
                <h4 className={`text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900 themed-heading'}`}>Customer Details</h4>
                <div className={`text-sm space-y-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>
                  <p><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p><strong>Mobile:</strong> {selectedCustomer.mobile}</p>
                  <p><strong>Vehicle:</strong> {selectedCustomer.vehicle_number}</p>
                  {selectedCustomer.email && <p><strong>Email:</strong> {selectedCustomer.email}</p>}
                </div>
              </div>
            )}

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
                  'Create Reminder'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showInsufficientBalancePopup && (
        <InsufficientBalancePopup
          isOpen={showInsufficientBalancePopup}
          onClose={() => setShowInsufficientBalancePopup(false)}
          currentBalance={user?.wallet_balance || 0}
          requiredBalance={user?.settings?.per_message_cost || 1.0}
        />
      )}
    </>
  );
};

export default CreateReminderModal;
