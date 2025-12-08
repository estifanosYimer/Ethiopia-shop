import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Building, Copy, Loader2, Mail, Phone } from 'lucide-react';
import Button from './Button';
import { CartItem, ShippingDetails, Order } from '../types';
import ImageWithFallback from './ImageWithFallback';
import { saveOrder } from '../services/orderService';

// --- MERCHANT BANK DETAILS ---
const MERCHANT_BANK_DETAILS = {
    bankName: "Commercial Bank of Ethiopia",
    accountName: "Abyssinia Direct Exports",
    accountNumber: "1000012345678", 
    swiftCode: "CBETETAA", 
    iban: "ET00CBET1000012345678"
};

const EU_COUNTRIES = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", 
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", 
    "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", 
    "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onComplete: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';
type PaymentMethod = 'card' | 'bank_transfer';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onComplete }) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingDetails | null>(null);
  const [orderRef, setOrderRef] = useState('');

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep('shipping');
      setPaymentMethod('card');
      setIsProcessing(false);
    } else {
        // Generate a new reference for the session
        setOrderRef(`ETH-${Math.floor(Math.random() * 100000)}`);
    }
  }, [isOpen]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 25.00;
  const importDuties = 12.50;
  const total = subtotal + shippingCost + importDuties;

  if (!isOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setShippingData({
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
    });
    
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData) return;

    setIsProcessing(true);
    
    const newOrder: Order = {
        id: orderRef,
        date: new Date().toISOString(),
        items: cart,
        subtotal,
        shippingCost,
        duties: importDuties,
        total,
        shippingDetails: shippingData,
        paymentMethod: paymentMethod,
        status: 'pending'
    };

    try {
        await saveOrder(newOrder);
        setIsProcessing(false);
        setStep('confirmation');
        onComplete(); // Clears cart in parent
    } catch (error) {
        console.error("Payment failed", error);
        setIsProcessing(false);
        alert("There was an issue processing your order. Please try again.");
    }
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
                  <ImageWithFallback 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fallbackTerm={item.name}
                    className="w-full h-full object-cover" 
                  />
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
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping (Ethiopian Airlines Cargo)</span>
              <span>€{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Import Duties</span>
              <span>€{importDuties.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-4 mt-4 flex justify-between items-center">
            <span className="font-serif font-bold text-lg text-stone-900">Total</span>
            <span className="font-serif font-bold text-xl text-emerald-900">€{total.toFixed(2)}</span>
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
               <form className="space-y-4" onSubmit={handleShippingSubmit}>
                 {/* Contact Info */}
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1"><Mail size={12}/> Email Address</label>
                     <input required name="email" defaultValue={shippingData?.email} type="email" placeholder="you@example.com" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1"><Phone size={12}/> Phone Number</label>
                     <input required name="phone" defaultValue={shippingData?.phone} type="tel" placeholder="+32 ..." className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                 </div>

                 {/* Name */}
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">First Name</label>
                     <input required name="firstName" defaultValue={shippingData?.firstName} type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">Last Name</label>
                     <input required name="lastName" defaultValue={shippingData?.lastName} type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                 </div>

                 {/* Address */}
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-500 uppercase">Address</label>
                   <input required name="address" defaultValue={shippingData?.address} type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">City</label>
                     <input required name="city" defaultValue={shippingData?.city} type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-stone-500 uppercase">Postal Code</label>
                     <input required name="postalCode" defaultValue={shippingData?.postalCode} type="text" className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none transition-all" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-500 uppercase">Country (EU)</label>
                   <select name="country" defaultValue={shippingData?.country || 'Germany'} className="w-full border border-stone-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-800 outline-none bg-white">
                     {EU_COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                     ))}
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
                
                <div className="flex gap-4 mb-8">
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 border-2 rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-emerald-900 bg-emerald-50' : 'border-stone-200 hover:border-emerald-200'}`}
                  >
                    <CreditCard size={20} className={paymentMethod === 'card' ? "text-emerald-900" : "text-stone-500"} />
                    <span className={`font-bold ${paymentMethod === 'card' ? "text-emerald-900" : "text-stone-600"}`}>Card</span>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex-1 border-2 rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-emerald-900 bg-emerald-50' : 'border-stone-200 hover:border-emerald-200'}`}
                  >
                     <Building size={20} className={paymentMethod === 'bank_transfer' ? "text-emerald-900" : "text-stone-500"} />
                     <span className={`font-bold ${paymentMethod === 'bank_transfer' ? "text-emerald-900" : "text-stone-600"}`}>Bank Transfer</span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handlePaymentSubmit}>
                  {paymentMethod === 'card' ? (
                      <>
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
                      </>
                  ) : (
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-4">
                          <p className="text-sm text-stone-600 mb-2">Please transfer the total amount to the following account. Your order will be shipped once funds are cleared.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                  <span className="block text-xs font-bold text-stone-400 uppercase">Bank Name</span>
                                  <span className="font-medium text-stone-900">{MERCHANT_BANK_DETAILS.bankName}</span>
                              </div>
                              <div>
                                  <span className="block text-xs font-bold text-stone-400 uppercase">Account Name</span>
                                  <span className="font-medium text-stone-900">{MERCHANT_BANK_DETAILS.accountName}</span>
                              </div>
                              <div>
                                  <span className="block text-xs font-bold text-stone-400 uppercase">IBAN</span>
                                  <div className="flex items-center gap-2">
                                      <span className="font-mono text-stone-900 bg-white px-2 py-1 rounded border border-stone-200">{MERCHANT_BANK_DETAILS.iban}</span>
                                      <Copy size={14} className="text-stone-400 cursor-pointer hover:text-emerald-800" />
                                  </div>
                              </div>
                              <div>
                                  <span className="block text-xs font-bold text-stone-400 uppercase">Swift/BIC</span>
                                  <span className="font-mono text-stone-900 bg-white px-2 py-1 rounded border border-stone-200 inline-block">{MERCHANT_BANK_DETAILS.swiftCode}</span>
                              </div>
                          </div>
                          
                          <div className="bg-emerald-50 text-emerald-900 text-xs p-3 rounded mt-2 font-medium">
                              Reference Message: <span className="font-mono font-bold select-all">ORDER {orderRef}</span>
                          </div>
                      </div>
                  )}

                  <div className="bg-stone-50 p-4 rounded text-xs text-stone-500 flex gap-2 items-start mt-4">
                    <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                    <p>Payments are securely processed by AbyssiniaPay. Your financial data is encrypted and never stored on our servers.</p>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <button type="button" onClick={() => setStep('shipping')} className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-sm font-medium">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <Button type="submit" disabled={isProcessing} className="w-2/3 flex items-center justify-center gap-2">
                      {isProcessing ? <><Loader2 size={16} className="animate-spin"/> Processing...</> : (paymentMethod === 'card' ? `Pay €${total.toFixed(2)}` : 'Confirm Order')}
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
                  <p className="text-sm text-stone-500 mb-2">Order Reference: <span className="text-stone-900 font-mono">#{orderRef}</span></p>
                  <p className="text-sm text-stone-500">
                    {paymentMethod === 'bank_transfer' 
                        ? "Please complete your bank transfer using the reference number above. We will ship your items as soon as the funds clear."
                        : "A confirmation email has been sent to you. Your package will depart Addis Ababa within 24 hours."
                    }
                  </p>
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