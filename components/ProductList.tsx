import React from 'react';
import { Product } from '../types';
import Button from './Button';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductClick, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col"
        >
          <div 
            className="relative aspect-square overflow-hidden cursor-pointer"
            onClick={() => onProductClick(product)}
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-stone-900 text-white px-3 py-1 text-sm font-medium uppercase tracking-wider">Sold Out</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="text-white text-sm font-medium">View Details</span>
            </div>
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            <div onClick={() => onProductClick(product)} className="cursor-pointer mb-2">
               <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                 {product.name}
               </h3>
               <p className="text-stone-500 text-sm line-clamp-2 mt-1">{product.description}</p>
            </div>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
              <span className="font-serif text-lg text-stone-800">{product.currency}{product.price}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;