import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowLeft, ChevronRight, Globe, Coffee, Palette, Shirt, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Category } from './types';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import CuratorChat from './components/CuratorChat';
import CheckoutModal from './components/CheckoutModal';
import InfoModal, { InfoModalType } from './components/InfoModal';
import OrdersModal from './components/OrdersModal';
import Button from './components/Button';
import ImageWithFallback from './components/ImageWithFallback';

const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Shift + A (for Admin)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOrdersOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Computed
  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS;

    // Filter by category if not All AND not searching (search usually overrides category, or we can combine)
    // Let's allow searching within a category if a category is specifically selected, otherwise search all.
    if (selectedCategory !== Category.ALL) {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    
    return products;
  }, [selectedCategory, searchQuery]);

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

  const handleStartCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    // Modal will be closed by the user clicking "Return to Shop" which calls onClose
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const navigateToShop = (category: Category = Category.ALL) => {
    setSelectedCategory(category);
    setCurrentView('shop');
    setSearchQuery(''); // Reset search when clicking nav
    setIsSearchActive(false);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Automatically switch to shop view if typing
    if (currentView !== 'shop') {
      setCurrentView('shop');
      // If we are on home, maybe we want to search ALL categories by default
      if (currentView === 'home') setSelectedCategory(Category.ALL);
    }
  };

  const toggleSearch = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
    } else {
      setIsSearchActive(true);
      // Focus logic would ideally go here with a ref
    }
  };

  const openInfoModal = (type: InfoModalType) => {
    setInfoModalType(type);
  };

  // Components (Inline for layout simplicity within file constraints)
  
  const Header = () => (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex flex-col cursor-pointer group" 
            onClick={() => { setCurrentView('home'); setSearchQuery(''); setIsSearchActive(false); }}
          >
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight group-hover:text-eth-earth transition-colors">ABYSSINIA <span className="text-eth-earth">DIRECT</span></h1>
            <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em] hidden sm:block">Addis Ababa • Paris • Berlin</span>
          </div>

          {/* Desktop Nav */}
          {!isSearchActive ? (
            <nav className="hidden md:flex gap-8">
              <button onClick={() => navigateToShop(Category.ALL)} className={`text-sm font-medium uppercase tracking-widest hover:text-eth-earth transition-colors ${currentView === 'shop' && selectedCategory === Category.ALL ? 'text-eth-earth border-b-2 border-eth-earth' : 'text-stone-600'}`}>Shop All</button>
              <button onClick={() => navigateToShop(Category.CLOTHES)} className="text-sm font-medium uppercase tracking-widest text-stone-600 hover:text-eth-earth transition-colors">Clothes</button>
              <button onClick={() => navigateToShop(Category.ART)} className="text-sm font-medium uppercase tracking-widest text-stone-600 hover:text-eth-earth transition-colors">Art</button>
              <button onClick={() => navigateToShop(Category.MISC)} className="text-sm font-medium uppercase tracking-widest text-stone-600 hover:text-eth-earth transition-colors">Miscellaneous</button>
            </nav>
          ) : (
            <div className="hidden md:flex flex-1 max-w-lg mx-8 animate-fade-in relative">
              <input 
                type="text" 
                placeholder="Search collection..." 
                autoFocus
                className="w-full bg-stone-50 border-b-2 border-emerald-900 px-4 py-2 text-stone-900 focus:outline-none placeholder:text-stone-400 font-serif"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button onClick={toggleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button 
              className={`hover:text-stone-900 hidden sm:block transition-colors ${isSearchActive ? 'text-emerald-900' : 'text-stone-600'}`}
              onClick={toggleSearch}
            >
              <Search size={20} />
            </button>
            <div className="relative">
              <button 
                className="text-stone-600 hover:text-eth-earth transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-eth-earth text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
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
        <div className="md:hidden bg-parchment border-b border-stone-200 py-4 px-4 space-y-4 shadow-lg">
           <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white border border-stone-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
                value={searchQuery}
                onChange={handleSearchChange}
              />
           </div>
           <button onClick={() => {navigateToShop(Category.ALL); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-serif font-medium text-stone-800 border-b border-stone-200">Shop All</button>
           <button onClick={() => {navigateToShop(Category.CLOTHES); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-serif font-medium text-stone-800 border-b border-stone-200">Clothes</button>
           <button onClick={() => {navigateToShop(Category.ART); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-serif font-medium text-stone-800 border-b border-stone-200">Art</button>
           <button onClick={() => {navigateToShop(Category.MISC); setIsMobileMenuOpen(false)}} className="block w-full text-left py-2 font-serif font-medium text-stone-800">Miscellaneous</button>
        </div>
      )}
    </header>
  );

  const Hero = () => (
    <div className="relative bg-eth-earth text-white overflow-hidden h-[75vh] flex items-center justify-center text-center">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center">
        <div className="max-w-4xl animate-fade-in flex flex-col items-center">
            <div className="mb-6">
                <h2 className="text-gold-accent font-medium tracking-[0.3em] uppercase text-sm mb-4">Direct from Addis Ababa to Europe</h2>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold mb-8 leading-tight">
            Timeless Ethiopian<br/> Craftsmanship
            </h1>
            <p className="text-xl text-stone-200 max-w-2xl mb-12 font-light leading-relaxed">
            Explore a curated collection of handwoven Tibeb, ancient manuscripts, and artisan home decor. Verified authentic, delivered to your doorstep.
            </p>
            <div className="flex gap-6">
            <Button size="lg" onClick={() => navigateToShop()} className="bg-gold-accent text-stone-900 hover:bg-white border-none font-bold px-8">Explore Collection</Button>
            </div>
        </div>
      </div>
    </div>
  );

  const CategorySection = () => (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-eth-earth uppercase tracking-widest text-xs font-bold mb-2 block">Discover</span>
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">Curated Collections</h2>
          <div className="w-24 h-px bg-eth-earth mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shirt, label: 'Clothes', cat: Category.CLOTHES, desc: 'Handwoven Tibeb & Modern Cuts', image: '/images/banners/fashion.png' },
            { icon: Palette, label: 'Fine Art & Icons', cat: Category.ART, desc: 'Coptic Art & Contemporary Canvas', image: '/images/banners/art.png' },
            { icon: Coffee, label: 'Miscellaneous', cat: Category.MISC, desc: 'Coffee, Spices & Home Decor', image: '/images/banners/coffee.png' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => navigateToShop(item.cat)}
              className="relative h-96 group rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <ImageWithFallback 
                src={item.image} 
                alt={item.label} 
                fallbackTerm={`ethiopian ${item.label}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white border border-white/20">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{item.label}</h3>
                  <p className="text-stone-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.desc}</p>
                  <div className="flex items-center text-gold-accent font-medium text-sm tracking-wide uppercase">
                    Shop Now <ChevronRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductDetailView = ({ product }: { product: Product }) => (
    <div className="bg-parchment min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
            onClick={() => setCurrentView('shop')}
            className="flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors group"
        >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image */}
            <div className="relative bg-white rounded-sm shadow-xl p-2 rotate-1 hover:rotate-0 transition-transform duration-500 border border-stone-200">
            <div className="aspect-[4/5] overflow-hidden relative">
                <ImageWithFallback 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fallbackTerm={`ethiopian ${product.category} ${product.name}`}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 text-xs font-mono uppercase tracking-widest text-stone-800">
                    Authentic
                </div>
            </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center pt-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-eth-earth"></span>
                <span className="text-eth-earth font-bold tracking-widest uppercase text-xs">{product.category}</span>
            </div>
            
            <h1 className="text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">{product.name}</h1>
            <p className="text-3xl text-coffee font-serif italic mb-8">{product.currency}{product.price}</p>
            
            <div className="prose prose-stone mb-10">
                <p className="text-lg leading-relaxed text-stone-700">{product.description}</p>
                
                <div className="bg-white p-6 border-l-4 border-gold-accent my-8 shadow-sm">
                    <h3 className="font-serif text-lg text-stone-900 mb-2 flex items-center gap-2">
                        <Globe size={16} className="text-stone-400" />
                        Heritage & Craft
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed italic">{product.detailedHistory}</p>
                </div>
            </div>

            <div className="flex gap-4 mb-10">
                <Button size="lg" className="flex-1 h-14 bg-eth-earth text-lg" onClick={() => handleAddToCart(product)} disabled={!product.inStock}>
                {product.inStock ? 'Add to Collection' : 'Out of Stock'}
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-200 pt-6">
                <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-full text-emerald-900"><Globe size={20} /></div>
                <div>
                    <h4 className="font-bold text-stone-900 text-sm">Global Shipping</h4>
                    <p className="text-xs text-stone-600 mt-1">Direct from Addis Ababa via Ethiopian Airlines.</p>
                </div>
                </div>
                <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-full text-emerald-900"><Palette size={20} /></div>
                <div>
                    <h4 className="font-bold text-stone-900 text-sm">Artisan Crafted</h4>
                    <p className="text-xs text-stone-600 mt-1">Handmade by master craftsmen in Ethiopia.</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-stone-50 text-stone-900 selection:bg-gold-accent selection:text-stone-900">
      <Header />
      
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <CategorySection />
            <div className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900">Featured Arrivals</h2>
                        <p className="text-stone-500 mt-2">New treasures from the highlands.</p>
                    </div>
                    <button onClick={() => navigateToShop()} className="text-eth-earth font-bold hover:text-emerald-900 flex items-center gap-2 transition-colors">
                        View All Collection <ArrowRightIcon size={16} />
                    </button>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-2">
                    {searchQuery ? `Search results for "${searchQuery}"` : (selectedCategory === Category.ALL ? 'Full Collection' : selectedCategory)}
                </h1>
                <p className="text-stone-500">{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found.</p>
              </div>
              
              {!searchQuery && (
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                  {Object.values(Category).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === cat ? 'bg-eth-earth text-white shadow-lg transform scale-105' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-emerald-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {filteredProducts.length > 0 ? (
                <ProductList 
                products={filteredProducts} 
                onProductClick={navigateToProduct}
                onAddToCart={handleAddToCart}
                />
            ) : (
                <div className="text-center py-20 bg-white border border-stone-100 rounded-lg">
                    <Search className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                    <h3 className="text-lg font-medium text-stone-900">No items found</h3>
                    <p className="text-stone-500 mt-2">Try adjusting your search terms or browse our full collection.</p>
                    <Button 
                        className="mt-6" 
                        onClick={() => {setSearchQuery(''); setIsSearchActive(false); setSelectedCategory(Category.ALL)}}
                    >
                        Reset Search
                    </Button>
                </div>
            )}
          </div>
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetailView product={selectedProduct} />
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-16 mt-0 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
             <h2 className="text-white text-2xl font-serif font-bold mb-6 tracking-wide">ABYSSINIA <span className="text-gold-accent">DIRECT</span></h2>
             <p className="max-w-sm text-sm leading-relaxed mb-6">Connecting the Horn of Africa to the world. We specialize in ethically sourced, high-quality cultural artifacts, textiles, and coffee from Ethiopia.</p>
             <div className="flex gap-4">
                 <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-eth-earth hover:text-white transition-colors cursor-pointer"><Globe size={18}/></div>
                 <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-gold-accent hover:text-stone-900 transition-colors cursor-pointer"><Coffee size={18}/></div>
             </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-gold-accent">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              <li onClick={() => openInfoModal('shipping')} className="hover:text-white cursor-pointer transition-colors">Shipping Policy (EU)</li>
              <li onClick={() => openInfoModal('authenticity')} className="hover:text-white cursor-pointer transition-colors">Authenticity Guarantee</li>
              <li onClick={() => openInfoModal('returns')} className="hover:text-white cursor-pointer transition-colors">Returns & Exchanges</li>
              <li onClick={() => openInfoModal('tracking')} className="hover:text-white cursor-pointer transition-colors font-bold text-gold-accent">Track Your Order</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-gold-accent">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-eth-earth flex-shrink-0"></span> 
                <a href="mailto:estifanosaddisuyimer@gmail.com" className="hover:text-white transition-colors break-all">estifanosaddisuyimer@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-accent flex-shrink-0"></span> 
                <a href="tel:+3225550199" className="hover:text-white transition-colors">+32 2 555 0199 (Brussels HQ)</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-600 flex-shrink-0"></span> 
                <a href="https://maps.google.com/?q=Bole+Road,Addis+Ababa" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Bole Road, Addis Ababa</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-stone-800 text-xs text-center flex justify-between items-center text-stone-500">
          <p>© 2024 Abyssinia Direct. All Rights Reserved.</p>
          <div className="flex gap-4 items-center">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              {/* Hidden Admin Trigger - Accessible via Ctrl+Shift+A */}
          </div>
        </div>
      </footer>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleStartCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onComplete={handleCheckoutComplete}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <InfoModal 
        isOpen={!!infoModalType}
        onClose={() => setInfoModalType(null)}
        type={infoModalType}
      />

      <CuratorChat activeProduct={currentView === 'product' ? selectedProduct : undefined} />
    </div>
  );
};

export default App;