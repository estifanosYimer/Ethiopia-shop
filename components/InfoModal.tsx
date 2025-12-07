import React, { useState } from 'react';
import { X, Truck, ShieldCheck, RefreshCw, Search } from 'lucide-react';
import Button from './Button';

export type InfoModalType = 'shipping' | 'authenticity' | 'returns' | 'tracking' | null;

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: InfoModalType;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen || !type) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setIsSearching(true);
    setTrackingResult(null);

    // Simulate API lookup
    setTimeout(() => {
        setIsSearching(false);
        setTrackingResult({
        status: 'In Transit',
        location: 'Frankfurt, Germany',
        carrier: 'Ethiopian Airlines Cargo',
        estimatedDelivery: '2 days'
        });
    }, 1500);
  };

  const renderContent = () => {
    switch (type) {
      case 'shipping':
        return (
          <>
            <div className="flex items-center gap-3 mb-6 text-emerald-900 border-b border-stone-200 pb-4">
               <Truck size={28} />
               <h2 className="text-2xl font-serif font-bold">Shipping Policy (EU)</h2>
            </div>
            <div className="prose prose-stone text-sm leading-relaxed text-stone-600">
               <p className="mb-4">We partner exclusively with <strong>Ethiopian Airlines Cargo</strong> to ensure swift and secure delivery from Addis Ababa Bole International Airport directly to major European hubs (Frankfurt, Brussels, Paris, London).</p>
               
               <h3 className="font-bold text-stone-900 text-base mt-4 mb-2">Delivery Times</h3>
               <ul className="list-disc pl-5 space-y-2 mb-4">
                 <li><strong>Express Air:</strong> 3-5 business days.</li>
                 <li><strong>Standard:</strong> 7-10 business days.</li>
               </ul>

               <h3 className="font-bold text-stone-900 text-base mt-4 mb-2">Customs & Duties</h3>
               <p>For customers within the European Union, we offer a DDP (Delivered Duty Paid) service. All import VAT and duties are calculated at checkout, so you won't face surprise fees upon delivery.</p>
            </div>
          </>
        );
      case 'authenticity':
        return (
          <>
            <div className="flex items-center gap-3 mb-6 text-emerald-900 border-b border-stone-200 pb-4">
               <ShieldCheck size={28} />
               <h2 className="text-2xl font-serif font-bold">Authenticity Guarantee</h2>
            </div>
             <div className="prose prose-stone text-sm leading-relaxed text-stone-600">
               <p className="mb-4">Every item on Abyssinia Direct is verified by our on-ground curators in Addis Ababa. We take pride in preserving our heritage.</p>
               
               <h3 className="font-bold text-stone-900 text-base mt-4 mb-2">Our Promise</h3>
               <ul className="list-disc pl-5 space-y-2 mb-4">
                 <li><strong>Handmade:</strong> We visit the weavers in Dorze and the potters in Jimma personally.</li>
                 <li><strong>Materials:</strong> We guarantee the use of genuine materials (100% cotton Shemma, pure silver, organic leather).</li>
                 <li><strong>Provenance:</strong> Antique items come with a Certificate of Origin approved by the Ethiopian Ministry of Tourism & Antiquities.</li>
               </ul>
            </div>
          </>
        );
      case 'returns':
         return (
          <>
            <div className="flex items-center gap-3 mb-6 text-emerald-900 border-b border-stone-200 pb-4">
               <RefreshCw size={28} />
               <h2 className="text-2xl font-serif font-bold">Returns & Exchanges</h2>
            </div>
             <div className="prose prose-stone text-sm leading-relaxed text-stone-600">
               <p className="mb-4">We adhere to strict EU consumer protection laws to ensure your peace of mind.</p>
               
               <h3 className="font-bold text-stone-900 text-base mt-4 mb-2">Policy</h3>
               <ul className="list-disc pl-5 space-y-2 mb-4">
                 <li>You have <strong>14 days</strong> from receiving your item to request a return.</li>
                 <li>Items must be unused and in original packaging.</li>
                 <li>Due to hygiene reasons, earrings and certain textiles cannot be returned if the seal is broken.</li>
               </ul>

               <h3 className="font-bold text-stone-900 text-base mt-4 mb-2">Process</h3>
               <p>To initiate a return, contact our support team. You will be provided with a return address in Brussels, Belgium (so you do not need to ship back to Ethiopia).</p>
            </div>
          </>
        );
      case 'tracking':
         return (
          <>
            <div className="flex items-center gap-3 mb-6 text-emerald-900 border-b border-stone-200 pb-4">
               <Search size={28} />
               <h2 className="text-2xl font-serif font-bold">Track Your Order</h2>
            </div>
             <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
               <form onSubmit={handleTrack} className="flex gap-2 mb-4">
                 <input 
                    type="text" 
                    placeholder="Enter Order # (e.g., ETH-1234)" 
                    className="flex-1 p-3 border border-stone-300 rounded focus:ring-2 focus:ring-emerald-900 outline-none"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                 />
                 <Button type="submit" disabled={isSearching}>
                    {isSearching ? '...' : 'Track'}
                 </Button>
               </form>

               {trackingResult && (
                 <div className="mt-6 animate-fade-in bg-white p-4 rounded border border-stone-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-stone-900 text-lg">{trackingResult.status}</span>
                    </div>
                    <div className="space-y-1 text-sm text-stone-600">
                        <p><span className="font-bold text-stone-800">Carrier:</span> {trackingResult.carrier}</p>
                        <p><span className="font-bold text-stone-800">Current Location:</span> {trackingResult.location}</p>
                        <p><span className="font-bold text-stone-800">Est. Delivery:</span> {trackingResult.estimatedDelivery}</p>
                    </div>
                 </div>
               )}
             </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors">
             <X size={24} />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoModal;