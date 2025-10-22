import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Car, User, AlertTriangle } from 'lucide-react';
import { remindersAPI, customersAPI, billingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import InsufficientBalancePopup from './InsufficientBalancePopup';

const CreateReminderModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showBalancePopup, setShowBalancePopup] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user } = useAuth();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

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

  const checkWalletBalance = async () => {
    try {
      const response = await billingAPI.getWalletBalance();
      const balance = response.data.balance || 0;
      setWalletBalance(balance);
      return balance;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      return 0;
    }
  };

  const onSubmit = async (data) => {
    // Check wallet balance before creating reminder
    const balance = await checkWalletBalance();
    const messageCost = user?.settings?.per_message_cost || 1.0;

    if (balance < messageCost) {
      setShowBalancePopup(true);
      return;
    }

    setLoading(true);
    try {
      const reminderData = {
        ...data,
        expiry_date: new Date(data.expiry_date).toISOString(),
        lead_times: [30, 7, 3, 1] // Default lead times
      };

      await remindersAPI.create(reminderData);
      toast.success('Reminder created successfully!');
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create reminder';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    setShowBalancePopup(false);
    // Navigate to billing page
    window.location.href = '/billing';
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Create New Reminder</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Customer *
              </label>
              <div className="relative">
                <select
                  {...register('customer', { required: 'Please select a customer' })}
                  className="input pl-10"
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.customer && (
                <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Type *
              </label>
              <div className="relative">
                <select
                  {...register('reminder_type', { required: 'Please select reminder type' })}
                  className="input pl-10"
                >
                  <option value="">Select reminder type</option>
                  {reminderTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.reminder_type && (
                <p className="mt-1 text-sm text-red-600">{errors.reminder_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <div className="relative">
                <input
                  {...register('expiry_date', { required: 'Expiry date is required' })}
                  type="date"
                  className="input pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-600">{errors.expiry_date.message}</p>
              )}
            </div>

            {selectedCustomer && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Details</h4>
                <div className="text-sm text-gray-600 space-y-1">
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
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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

      <InsufficientBalancePopup
        isOpen={showBalancePopup}
        onClose={() => setShowBalancePopup(false)}
        currentBalance={walletBalance}
        requiredBalance={user?.settings?.per_message_cost || 1.0}
        onTopUp={handleTopUp}
      />
    </>
  );
};

export default CreateReminderModal;
