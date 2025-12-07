import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import Button from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-parchment shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
              <ShoppingBag size={20} />
              Your Collection
            </h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center text-stone-500 mt-10">
                <p>Your cart is empty.</p>
                <p className="text-sm mt-2">Discover the treasures of Abyssinia.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-medium text-stone-900">{item.name}</h3>
                    <p className="text-stone-600 text-sm">{item.currency}{item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 rounded-full hover:bg-stone-200 text-stone-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 rounded-full hover:bg-stone-200 text-stone-600"
                      >
                        <Plus size={14} />
                      </button>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-stone-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-stone-600">Subtotal</span>
              <span className="font-serif text-xl font-bold text-stone-900">€{total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-stone-500 mb-4">Shipping calculated at checkout. Ships directly from Addis Ababa.</p>
            <Button className="w-full" disabled={items.length === 0} onClick={() => alert("Checkout flow would start here!")}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;