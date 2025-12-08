import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Archive, MapPin, CreditCard, ShoppingBag, Package, Lock, Mail, Phone } from 'lucide-react';
import { getOrders, clearOrders } from '../services/orderService';
import { Order } from '../types';
import Button from './Button';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Authorization State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && isAuthorized) {
      fetchOrders();
    }
    
    // Reset auth if modal is closed long enough? 
    // For now, let's keep auth session valid until refresh or maybe reset on close
    if(!isOpen) {
        // Optional: Reset auth on close to be stricter
        // setIsAuthorized(false); 
        // setPin('');
    }
  }, [isOpen, isAuthorized]);

  const handleClear = async () => {
      if(window.confirm('Are you sure you want to delete all order history?')) {
          await clearOrders();
          fetchOrders();
      }
  };

  const handleAuth = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple hardcoded PIN for demonstration
      if (pin === '1234') {
          setIsAuthorized(true);
          setAuthError(false);
      } else {
          setAuthError(true);
          setPin('');
      }
  };

  if (!isOpen) return null;

  // --- UNAUTHORIZED VIEW ---
  if (!isAuthorized) {
      return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-600">
                    <Lock size={32} />
                </div>
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">Restricted Access</h2>
                <p className="text-sm text-stone-500 mb-6 text-center">Please enter your merchant PIN to access the order dashboard.</p>
                
                <form onSubmit={handleAuth} className="w-full space-y-4">
                    <input 
                        type="password" 
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter PIN (1234)"
                        autoFocus
                        className="w-full text-center tracking-[0.5em] text-2xl p-3 border border-stone-300 rounded focus:ring-2 focus:ring-emerald-900 outline-none"
                    />
                    {authError && <p className="text-red-600 text-xs text-center font-bold">Incorrect PIN</p>}
                    <Button type="submit" className="w-full">Unlock Dashboard</Button>
                </form>
                <button onClick={onClose} className="mt-4 text-stone-400 hover:text-stone-600 text-sm">Cancel</button>
            </div>
        </div>
      );
  }

  // --- AUTHORIZED DASHBOARD ---
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-stone-50 rounded-xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-stone-200 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-900 text-white rounded">
                    <Archive size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900">Merchant Dashboard</h2>
                    <p className="text-sm text-stone-500">View collected orders and shipping details</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={fetchOrders} className="p-2 hover:bg-stone-100 rounded-full text-stone-600" title="Refresh">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-600">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
                <div className="h-full flex items-center justify-center text-stone-400">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400">
                    <Package size={48} className="mb-4 opacity-50" />
                    <p>No orders collected yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                            <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center font-bold font-mono text-xs">
                                        {order.id.split('-')[1]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-900">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</h3>
                                        <p className="text-xs text-stone-500">{new Date(order.date).toLocaleString()}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentMethod === 'card' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                            {order.paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-serif font-bold text-lg">€{order.total.toFixed(2)}</span>
                                    <span className="text-stone-400 text-sm">{expandedOrderId === order.id ? 'Collapse' : 'Details'}</span>
                                </div>
                            </div>

                            {expandedOrderId === order.id && (
                                <div className="p-6 border-t border-stone-100 bg-stone-50 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                                    {/* Shipping Info */}
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
                                            <MapPin size={16} /> Shipping Details
                                        </h4>
                                        <div className="bg-white p-4 rounded border border-stone-200 text-sm space-y-2 text-stone-600">
                                            <p><span className="font-bold">Name:</span> {order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                            <p className="flex items-center gap-2"><Mail size={12} className="text-stone-400"/> {order.shippingDetails.email}</p>
                                            <p className="flex items-center gap-2"><Phone size={12} className="text-stone-400"/> {order.shippingDetails.phone}</p>
                                            <div className="h-px bg-stone-100 my-2"></div>
                                            <p><span className="font-bold">Address:</span> {order.shippingDetails.address}</p>
                                            <p><span className="font-bold">Location:</span> {order.shippingDetails.city}, {order.shippingDetails.postalCode}</p>
                                            <p><span className="font-bold">Country:</span> {order.shippingDetails.country}</p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
                                            <ShoppingBag size={16} /> Items ({order.items.length})
                                        </h4>
                                        <div className="bg-white p-4 rounded border border-stone-200 text-sm space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center border-b border-stone-100 last:border-0 pb-2 last:pb-0">
                                                    <div className="flex gap-2 items-center">
                                                        <span className="font-bold text-stone-400">{item.quantity}x</span>
                                                        <span className="text-stone-700">{item.name}</span>
                                                    </div>
                                                    <span className="text-stone-900 font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                            <div className="pt-2 flex justify-between font-bold text-stone-900">
                                                <span>Total Paid</span>
                                                <span>€{order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex justify-between items-center">
            <span className="text-xs text-stone-500">Simulating Backend Storage (LocalStorage)</span>
            <button onClick={handleClear} className="text-red-600 text-sm hover:text-red-800 font-medium">Clear History</button>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;