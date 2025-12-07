import React, { useState } from 'react';
import { X, Lock, CheckCircle, CreditCard, Truck, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from './Button';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onComplete: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onComplete }) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('confirmation');
    onComplete(); // Clears cart in parent
  };

  const Steps = () => (
    <div className="flex items-center justify-center mb-8 text-sm">
      <div className={`flex items-center ${step === 'shipping' ? 'text-emerald-900 font-bold' : 'text-emerald-900'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'shipping' ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-900'}`}>1</div>
        Shipping
      </div>
      <div className="w-12 h-px bg-stone-300 mx-4"></div>
      <div className={`flex items-center ${step === 'payment' ? 'text-emerald-900 font-bold' : step === 'confirmation' ? 'text-emerald-900' : 'text-stone-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'payment' ? 'bg-emerald-900 text-white' : step === 'confirmation' ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-400'}`}>2</div>
        Payment
      </div>
      <div className="w-12 h-px bg-stone-300 mx-4"></div>
      <div className={`flex items-center ${step === 'confirmation' ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'confirmation' ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-400'}`}>3</div>
        Done
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-parchment rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-auto">
        
        {/* Left Panel: Summary */}
        <div className="w-full md:w-1/3 bg-stone-100 p-6 md:p-8 border-r border-stone-200 overflow-y-auto">
          <h3 className="font-serif font-bold text-xl text-stone-900 mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 rounded bg-white border border-stone-200 overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-0 right-0 bg-stone-600 text-white text-[10px] px-1.5 py-0.5 rounded-bl">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-stone-900 truncate">{item.name}</p>
                  <p className="text-stone-500 text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping (Ethiopian Airlines Cargo)</span>
              <span>€25.00</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Import Duties</span>
              <span>€12.50</span>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-4 mt-4 flex justify-between items-center">
            <span className="font-serif font-bold text-lg text-stone-900">Total</span>
            <span className="font-serif font-bold text-xl text-emerald-900">€{(total + 37.50).toFixed(2)}</span>
          </div>
        </div>

        {/* Right Panel: Checkout Form */}
        <div className="w-full md:w-2/3 p-6 md:p-8 bg-white flex flex-col h-full overflow-y-auto relative">
           <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800">
             <X size={24} />
           </button>

           <div className="mb-6 flex items-center gap-2 text-emerald-800">
             <Lock size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Secure Checkout 256-bit SSL</span>
           </div>

           <Steps />

           {step === 'shipping' && (
             <div className="animate-fade-in">
               <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Shipping Address</h2>
               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('payment'); }}>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">First Name</label>
                     <input required type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">Last Name</label>
                     <input required type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-500 uppercase">Address</label>
                   <input required type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">City</label>
                     <input required type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">Postal Code</label>
                     <input required type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-500 uppercase">Country</label>
                   <select className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none bg-white">
                     <option>France</option>
                     <option>Germany</option>
                     <option>Belgium</option>
                     <option>Netherlands</option>
                     <option>United Kingdom</option>
                   </select>
                 </div>
                 <div className="pt-6 flex justify-end">
                   <Button type="submit" className="flex items-center gap-2">
                     Continue to Payment <ArrowRight size={18} />
                   </Button>
                 </div>
               </form>
             </div>
           )}

           {step === 'payment' && (
             <div className="animate-fade-in">
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Payment Method</h2>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 border-2 border-emerald-900 bg-emerald-50 rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer">
                    <CreditCard size={20} className="text-emerald-900" />
                    <span className="font-bold text-emerald-900">Card</span>
                  </div>
                  <div className="flex-1 border border-stone-200 rounded-lg p-4 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                     <span className="font-bold text-stone-500">PayPal</span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handlePaymentSubmit}>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">Card Number</label>
                     <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border border-stone-300 rounded px-3 py-2 pl-10 focus:ring-2 focus:ring-emerald-800 outline-none transition-all font-mono" />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" size={14} />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase">Expiry</label>
                        <input required type="text" placeholder="MM/YY" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all text-center" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase">CVC</label>
                        <input required type="text" placeholder="123" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all text-center" />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">Cardholder Name</label>
                     <input required type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                  </div>

                  <div className="bg-stone-50 p-4 rounded text-xs text-stone-500 flex gap-2 items-start mt-4">
                    <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                    <p>Payments are securely processed by AbyssiniaPay. Your financial data is encrypted and never stored on our servers.</p>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <button type="button" onClick={() => setStep('shipping')} className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-sm font-medium">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <Button type="submit" disabled={isProcessing} className="w-2/3">
                      {isProcessing ? 'Processing...' : `Pay €${(total + 37.50).toFixed(2)}`}
                    </Button>
                  </div>
                </form>
             </div>
           )}

           {step === 'confirmation' && (
             <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full py-10">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-800">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Ameseginalehu!</h2>
                <p className="text-lg text-stone-600 mb-8">Thank you for your order.</p>
                
                <div className="bg-stone-50 p-6 rounded-lg max-w-sm w-full mb-8 text-left border border-stone-100">
                  <p className="text-sm text-stone-500 mb-2">Order Reference: <span className="text-stone-900 font-mono">#ETH-{Math.floor(Math.random() * 10000)}</span></p>
                  <p className="text-sm text-stone-500">A confirmation email has been sent to you. Your package will depart Addis Ababa within 24 hours.</p>
                </div>

                <Button onClick={onClose}>Return to Shop</Button>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;