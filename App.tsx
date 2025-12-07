import React, { useState, useMemo } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowLeft, ChevronRight, Globe, Coffee, Palette, Shirt } from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Category } from './types';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import CuratorChat from './components/CuratorChat';
import Button from './components/Button';

const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Computed
  const filteredProducts = useMemo(() => {
    return selectedCategory === Category.ALL 
      ? MOCK_PRODUCTS 
      : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const navigateToShop = (category: Category = Category.ALL) => {
    setSelectedCategory(category);
    setCurrentView('shop');
    window.scrollTo(0, 0);
  };

  // Components (Inline for layout simplicity within file constraints)
  
  const Header = () => (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex flex-col cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">ABYSSINIA <span className="text-emerald-800">DIRECT</span></h1>
            <span className="text-xs text-stone-500 uppercase tracking-widest hidden sm:block">Addis Ababa • Paris • Berlin</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigateToShop(Category.ALL)} className={`text-sm font-medium uppercase tracking-wide hover:text-emerald-800 ${currentView === 'shop' && selectedCategory === Category.ALL ? 'text-emerald-800 underline underline-offset-4' : 'text-stone-600'}`}>Shop All</button>
            <button onClick={() => navigateToShop(Category.FASHION)} className="text-sm font-medium uppercase tracking-wide text-stone-600 hover:text-emerald-800">Fashion</button>
            <button onClick={() => navigateToShop(Category.ART)} className="text-sm font-medium uppercase tracking-wide text-stone-600 hover:text-emerald-800">Art</button>
            <button onClick={() => navigateToShop(Category.HOME)} className="text-sm font-medium uppercase tracking-wide text-stone-600 hover:text-emerald-800">Home</button>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-stone-600 hover:text-stone-900 hidden sm:block">
              <Search size={20} />
            </button>
            <div className="relative">
              <button 
                className="text-stone-600 hover:text-emerald-800 transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-800 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
            <button 
              className="md:hidden text-stone-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 py-4 px-4 space-y-4">
           <button onClick={() => {navigateToShop(Category.ALL); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-medium text-stone-800">Shop All</button>
           <button onClick={() => {navigateToShop(Category.FASHION); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-medium text-stone-800">Fashion</button>
           <button onClick={() => {navigateToShop(Category.ART); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-medium text-stone-800">Art</button>
           <button onClick={() => {navigateToShop(Category.HOME); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-medium text-stone-800">Home & Coffee</button>
        </div>
      )}
    </header>
  );

  const Hero = () => (
    <div className="relative bg-stone-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/id/1015/1600/900" 
          alt="Ethiopian Landscape" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/60 to-transparent"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h2 className="text-gold-accent font-medium tracking-widest uppercase mb-4">Authentic Heritage</h2>
        <h1 className="text-5xl sm:text-7xl font-serif font-bold mb-6 leading-tight">
          Ethiopia to Europe,<br/> Direct.
        </h1>
        <p className="text-xl text-stone-200 max-w-2xl mb-10 font-light">
          Experience the cradle of humanity through curated fashion, ancient art, and ceremonial coffee artifacts. Ethically sourced, delivered to your door in Brussels, London, or Paris.
        </p>
        <div className="flex gap-4">
          <Button size="lg" onClick={() => navigateToShop()}>Explore Collection</Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-stone-900">
            Our Story
          </Button>
        </div>
      </div>
    </div>
  );

  const CategorySection = () => (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Curated Categories</h2>
          <div className="w-24 h-1 bg-gold-accent mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shirt, label: 'Traditional Fashion', cat: Category.FASHION, desc: 'Handwoven Tibeb & Modern Cuts' },
            { icon: Palette, label: 'Fine Art & Icons', cat: Category.ART, desc: 'Coptic Art & Contemporary Canvas' },
            { icon: Coffee, label: 'Coffee Ceremony', cat: Category.HOME, desc: 'Jebena, Sini & Incense' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => navigateToShop(item.cat)}
              className="bg-parchment p-8 rounded-xl border border-stone-100 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-900 group-hover:text-white transition-colors">
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2 text-stone-900">{item.label}</h3>
              <p className="text-stone-600">{item.desc}</p>
              <div className="mt-6 flex items-center text-emerald-800 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Shop Now <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductDetailView = ({ product }: { product: Product }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => setCurrentView('shop')}
        className="flex items-center text-stone-500 hover:text-stone-900 mb-8"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-emerald-800 font-medium tracking-wide uppercase text-sm mb-2">{product.category}</span>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">{product.name}</h1>
          <p className="text-2xl text-stone-800 font-light mb-8">{product.currency}{product.price}</p>
          
          <div className="prose prose-stone mb-8">
            <p>{product.description}</p>
            <h3 className="font-serif text-lg mt-6 mb-2">Heritage & Craft</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{product.detailedHistory}</p>
          </div>

          <div className="flex gap-4 mb-8">
            <Button size="lg" className="flex-1" onClick={() => handleAddToCart(product)} disabled={!product.inStock}>
              {product.inStock ? 'Add to Collection' : 'Out of Stock'}
            </Button>
          </div>

          <div className="bg-parchment p-4 rounded-lg border border-stone-200">
            <div className="flex items-start gap-3">
              <Globe size={20} className="text-emerald-800 mt-1" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm">International Shipping</h4>
                <p className="text-xs text-stone-600">Express delivery to EU via Ethiopian Airlines Cargo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Header />
      
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <CategorySection />
            <div className="py-20 bg-stone-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-serif font-bold">Featured Arrivals</h2>
                    <button onClick={() => navigateToShop()} className="text-emerald-800 font-medium hover:underline">View All</button>
                 </div>
                 <ProductList 
                    products={MOCK_PRODUCTS.slice(0, 3)} 
                    onProductClick={navigateToProduct}
                    onAddToCart={handleAddToCart}
                 />
              </div>
            </div>
          </>
        )}

        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h1 className="text-4xl font-serif font-bold mb-4 md:mb-0">
                {selectedCategory === Category.ALL ? 'Full Collection' : selectedCategory}
              </h1>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                {Object.values(Category).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <ProductList 
              products={filteredProducts} 
              onProductClick={navigateToProduct}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetailView product={selectedProduct} />
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <h2 className="text-white text-xl font-serif font-bold mb-4">ABYSSINIA DIRECT</h2>
             <p className="max-w-sm text-sm">Connecting the Horn of Africa to the world. We specialize in ethically sourced, high-quality cultural artifacts, textiles, and coffee from Ethiopia.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Shipping Policy (EU)</li>
              <li className="hover:text-white cursor-pointer">Authenticity Guarantee</li>
              <li className="hover:text-white cursor-pointer">Returns</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>support@abyssiniadirect.com</li>
              <li>+32 2 555 0199 (Brussels HQ)</li>
              <li>Bole Road, Addis Ababa</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-xs text-center">
          © 2024 Abyssinia Direct. All Rights Reserved.
        </div>
      </footer>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={handleRemoveFromCart}
      />

      <CuratorChat activeProduct={currentView === 'product' ? selectedProduct : undefined} />
    </div>
  );
};

export default App;