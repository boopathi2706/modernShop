import React, { useState } from 'react';
import { 
  ShoppingBag, Heart, Search, ArrowRight, Zap, Star, ShieldCheck, 
  Truck, RotateCcw, X, Plus, Minus, Trash2, CheckCircle2, ChevronDown,
  SlidersHorizontal, Filter, Eye, Sparkles, Award
} from 'lucide-react';

// Product Catalog Data
const PRODUCTS = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    category: "electronics",
    price: 2999,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 128,
    badge: "Bestseller",
    isFlashSale: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Experience studio-quality audio with advanced active noise cancellation, 40-hour battery life, and ergonomic plush ear cushions.",
    colors: ["Obsidian Black", "Arctic White", "Midnight Navy"]
  },
  {
    id: 2,
    title: "Smart Ergonomic Fitness Watch",
    category: "electronics",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 210,
    badge: "Trending",
    isFlashSale: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Track your health metrics, heart rate, sleep cycles, and 50+ workout modes with vibrant AMOLED display and 7-day battery.",
    colors: ["Space Gray", "Rose Gold", "Matte Black"]
  },
  {
    id: 3,
    title: "Minimalist Leather Backpack",
    category: "fashion",
    price: 3499,
    originalPrice: 4299,
    rating: 4.7,
    reviews: 94,
    badge: "Eco Leather",
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    description: "Crafted from sustainable full-grain leather with padded laptop sleeve, waterproof zippers, and hidden theft-proof pocket.",
    colors: ["Saddle Brown", "Charcoal Black"]
  },
  {
    id: 4,
    title: "Urban Everyday Denim Jacket",
    category: "fashion",
    price: 2199,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 76,
    badge: "New Arrival",
    isFlashSale: true,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    description: "Classic relaxed fit denim jacket with reinforced stitching and vintage wash effect. Ideal for layered street style.",
    colors: ["Washed Indigo", "Raw Black"]
  },
  {
    id: 5,
    title: "Aromatherapy Essential Diffuser",
    category: "essentials",
    price: 1299,
    originalPrice: 1799,
    rating: 4.9,
    reviews: 340,
    badge: "Popular",
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    description: "Ultrasonic mist technology with warm ambient ambient lighting, quiet sleep mode, and automatic shut-off feature.",
    colors: ["Wood Grain", "Ceramic White"]
  },
  {
    id: 6,
    title: "Ultra-Fast Magnetic Wireless Charger",
    category: "electronics",
    price: 999,
    originalPrice: 1499,
    rating: 4.5,
    reviews: 182,
    badge: "Hot Deal",
    isFlashSale: true,
    image: "https://m.media-amazon.com/images/I/61dvxIzWkEL.jpg",
    description: "15W rapid wireless charging alignment compatible with modern smartphones and earbuds. Includes braided USB-C cable.",
    colors: ["Silver Metallic", "Space Black"]
  }
];

export default function App() {
  // Navigation & View States
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'shop', 'categories', 'deals', 'about', 'dashboard'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive E-Commerce States
  const [cart, setCart] = useState([
    { ...PRODUCTS[0], qty: 1 },
    { ...PRODUCTS[1], qty: 2 }
  ]);
  const [wishlist, setWishlist] = useState([1, 3]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Filter & Search Logic
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = currentTab === 'deals' ? product.isFlashSale : true;
    return matchesCategory && matchesSearch && matchesTab;
  });

  // Toast Helper
  const showToastNotification = (title, message) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Operations
  const addToCart = (product, qty = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prevCart, { ...product, qty }];
    });
    setIsCartOpen(true);
    showToastNotification("Added to Cart", `${product.title} (x${qty}) added to cart.`);
  };

  const updateCartQty = (id, delta) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    showToastNotification("Item Removed", "Product removed from your shopping bag.");
  };

  // Wishlist Toggle
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      showToastNotification("Removed from Wishlist", "Item removed from favorites.");
    } else {
      setWishlist([...wishlist, id]);
      showToastNotification("Added to Wishlist", "Item saved to your favorites!");
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Trigger Checkout
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setCart([]);
    showToastNotification("Order Placed Successfully! 🎉", "Order #MS-89240 confirmed. Thank you for shopping with ModernShop.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] font-sans antialiased">
      
      {/* Dynamic Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#283044] text-[#eef0ff] px-5 py-4 rounded-xl shadow-2xl border border-white/10 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-[#6ffbbe]" />
          <div>
            <p className="font-bold text-sm">{toast.title}</p>
            <p className="text-xs text-white/80">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Top Flash Banner */}
      <div className="bg-[#4f46e5] text-[#dad7ff] py-2 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" /> 
            FLASH SALE: Extra 15% off with code <strong className="text-white">MODERN15</strong> | Free delivery on orders over ₹999
          </span>
          <span className="hidden md:inline-block bg-white/10 px-2 py-0.5 rounded text-[11px] text-white">
            Featured Showcase Project
          </span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentTab('home'); setSelectedCategory('all'); }} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img src="./logo.png" alt="ModernShop Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Shop All' },
              { id: 'categories', label: 'Categories' },
              // { id: 'deals', label: 'Flash Deals' },
              { id: 'about', label: 'About Us' },
              { id: 'dashboard', label: 'My Account' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => { setCurrentTab(nav.id); if(nav.id==='shop') setSelectedCategory('all'); }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentTab === nav.id 
                    ? 'bg-[#e2e7ff] text-[#3525cd] font-bold shadow-sm' 
                    : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Search */}
          <div className="flex items-center gap-3">
            
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if(currentTab !== 'shop') setCurrentTab('shop'); }}
                className="w-full h-10 pl-9 pr-4 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 border border-transparent"
              />
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={() => setCurrentTab('shop')} 
              className="relative p-2.5 text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#712ae2] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2.5 text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#3525cd] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <div 
              onClick={() => setCurrentTab('dashboard')} 
              className="flex items-center gap-2 pl-2 cursor-pointer border-l border-gray-200"
            >
              <img 
                src="https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg" 
                alt="Alex Sharma" 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3525cd]/20" 
              />
              <span className="text-xs font-semibold hidden xl:inline text-[#131b2e]">Alex</span>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Banner Section (Shown on Home Tab) */}
      {currentTab === 'home' && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#e2e7ff]/40 via-[#faf8ff] to-[#faf8ff] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 bg-[#eaedff] px-3.5 py-1.5 rounded-full border border-[#3525cd]/10">
                <Sparkles className="w-4 h-4 text-[#3525cd]" />
                <span className="text-xs font-bold text-[#3525cd] uppercase tracking-wide">Next-Gen Storefront 2026</span>
              </div>
              
              <h1 className="font-display font-extrabold text-4xl md:text-6xl text-[#131b2e] leading-tight">
                Everything You Need. <br />
                <span className="bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent">
                  All in One Place.
                </span>
              </h1>
              
              <p className="text-gray-600 text-base md:text-lg max-w-xl">
                Discover curated fashion, cutting-edge electronics, and daily lifestyle essentials engineered for seamless shopping, rapid delivery, and transparent checkout.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => { setCurrentTab('shop'); setSelectedCategory('all'); }}
                  className="h-12 px-7 bg-gradient-to-r from-[#3525cd] to-[#712ae2] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#3525cd]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Shop Catalog <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => setCurrentTab('deals')}
                  className="h-12 px-7 bg-white border border-gray-200 text-[#131b2e] rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all"
                >
                  <Zap className="w-4 h-4 text-[#712ae2] fill-[#712ae2]" /> Explore Deals
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200/80 w-full max-w-lg">
                <div>
                  <p className="font-display font-extrabold text-2xl text-[#131b2e]">14.2k+</p>
                  <p className="text-xs text-gray-500 font-medium">Happy Customers</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl text-[#131b2e]">99.8%</p>
                  <p className="text-xs text-gray-500 font-medium">On-Time Delivery</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl text-[#005338] flex items-center gap-1">
                    4.9 <Star className="w-4 h-4 fill-[#005338]" />
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Average Rating</p>
                </div>
              </div>

            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-[440px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
                  alt="Featured Product" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider w-max mb-2">
                    Spotlight Product
                  </span>
                  <h3 className="font-display font-bold text-xl">The Urban Audio Suite</h3>
                  <p className="text-xs text-gray-300 mt-1">Immersive sound engineered for modern living.</p>
                </div>
              </div>

              {/* Floating Badge overlay */}
              <div className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#131b2e]">Top Rated Choice</p>
                  <p className="text-[10px] text-gray-500">2026 Editor's Pick</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10">

        {/* Tab 1: Shop & Catalog */}
        {(currentTab === 'home' || currentTab === 'shop' || currentTab === 'categories' || currentTab === 'deals') && (
          <section className="space-y-8">
            
            {/* Catalog Controls & Filtering Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-[#131b2e]">
                  {currentTab === 'deals' ? '⚡ Flash Sale & Special Offers' : 'Featured Products'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {filteredProducts.length} items curated for quality and design.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'electronics', label: 'Electronics' },
                  { id: 'fashion', label: 'Fashion' },
                  { id: 'essentials', label: 'Essentials' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#3525cd] text-white shadow-md'
                        : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-gray-800">No products found</h3>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search or category filters.</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-[#3525cd] text-white text-xs font-bold rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => {
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Product Image & Badges */}
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1">
                          <span className="bg-[#3525cd] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                            {product.badge}
                          </span>
                          {product.isFlashSale && (
                            <span className="bg-[#712ae2] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow">
                              <Zap className="w-3 h-3 fill-white" /> SALE
                            </span>
                          )}
                        </div>

                        {/* Wishlist Action Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 hover:text-red-500 shadow-md transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>

                        {/* Quick View Button on Hover */}
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute bottom-4 left-4 right-4 py-2.5 bg-white/95 backdrop-blur-md rounded-xl font-bold text-xs text-[#131b2e] shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-[#3525cd]" /> Quick Preview
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span className="capitalize font-semibold text-[#3525cd] bg-[#e2e7ff]/50 px-2 py-0.5 rounded">
                              {product.category}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              {product.rating} ({product.reviews})
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-lg text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                            {product.title}
                          </h3>
                          
                          <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Add to Cart Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-xs text-gray-400 line-through mr-2">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="font-display font-extrabold text-xl text-[#3525cd]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            className="px-4 py-2.5 bg-[#3525cd] hover:bg-[#25005a] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                          >
                            <ShoppingBag className="w-4 h-4" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: About Us */}
        {currentTab === 'about' && (
          <section className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold text-[#3525cd] uppercase tracking-wider bg-[#e2e7ff] px-3 py-1 rounded-full">
                About ModernShop
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-[#131b2e]">
                Redefining Modern E-Commerce Experiences.
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                ModernShop is crafted to demonstrate modern frontend architecture, aesthetic UI micro-interactions, and instant client-side performance. Built with React and tailored CSS systems, every element is designed to elevate the online buying journey.
              </p>
            </div>

            {/* Creative Director Feature */}
            <div className="bg-[#faf8ff] p-6 md:p-8 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center gap-6">
              <img 
                src="https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg" 
                alt="Alex Sharma" 
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[#3525cd]/20 shadow-md"
              />
              <div className="space-y-1 text-center md:text-left">
                <h3 className="font-display font-bold text-xl text-[#131b2e]">Alex Sharma</h3>
                <p className="text-xs text-[#712ae2] font-semibold">Creative Director & Lead Designer</p>
                <p className="text-xs text-gray-500 pt-2 max-w-xl">
                  "Our vision for ModernShop was to combine minimalist luxury with ultra-responsive interactive components—bringing effortless elegance to everyday digital commerce."
                </p>
              </div>
            </div>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-[#f2f3ff] space-y-2">
                <Truck className="w-6 h-6 text-[#3525cd]" />
                <h4 className="font-bold text-sm text-[#131b2e]">Express Delivery</h4>
                <p className="text-xs text-gray-500">Guaranteed 24-hour dispatch on all verified orders.</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f2f3ff] space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#3525cd]" />
                <h4 className="font-bold text-sm text-[#131b2e]">Secure Checkout</h4>
                <p className="text-xs text-gray-500">256-Bit SSL encryption & safe payment processing.</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f2f3ff] space-y-2">
                <RotateCcw className="w-6 h-6 text-[#3525cd]" />
                <h4 className="font-bold text-sm text-[#131b2e]">Instant Returns</h4>
                <p className="text-xs text-gray-500">Hassle-free 30-day money-back refund guarantee.</p>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Customer Account Dashboard */}
        {currentTab === 'dashboard' && (
          <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-100">
              <img 
                src="https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg" 
                alt="Alex Sharma Profile" 
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#3525cd]/20"
              />
              <div className="text-center md:text-left space-y-1">
                <h2 className="font-display font-bold text-2xl text-[#131b2e]">Alex Sharma</h2>
                <p className="text-xs text-gray-500">alex.sharma@creativeminds.io • VIP Platinum Member</p>
                <span className="inline-block mt-2 bg-[#e2dfff] text-[#3525cd] text-[10px] font-bold px-3 py-1 rounded-full">
                  1,450 ModernPoints Earned
                </span>
              </div>
            </div>

            {/* Dashboard Mock Data */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#131b2e]">Recent Orders History</h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="p-4 bg-[#f2f3ff] flex justify-between items-center text-xs font-bold text-gray-700">
                  <span>Order #MS-89240</span>
                  <span className="text-[#005338] bg-[#6ffbbe]/30 px-2 py-0.5 rounded">Delivered</span>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-800">1x Premium Wireless Headphones</p>
                    <p className="text-[11px] text-gray-400">Placed on Sep 28, 2026</p>
                  </div>
                  <span className="font-bold text-[#3525cd]">₹2,999</span>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Shopping Cart Drawer Side Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setIsCartOpen(false)} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#3525cd]" />
                <h3 className="font-display font-bold text-lg text-[#131b2e]">Your Cart ({cartItemCount})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-gray-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-sm font-medium">Your shopping bag is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-[#f2f3ff] border border-gray-100">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#131b2e] truncate">{item.title}</h4>
                        <p className="font-extrabold text-xs text-[#3525cd] mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200">
                          <button onClick={() => updateCartQty(item.id, -1)} className="p-1 text-gray-500 hover:text-black">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="p-1 text-gray-500 hover:text-black">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4 bg-gray-50">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#131b2e] pt-2 border-t">
                    <span>Total Amount</span>
                    <span className="text-[#3525cd]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#3525cd] to-[#712ae2] text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Quick Preview Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setQuickViewProduct(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={quickViewProduct.image} 
              alt={quickViewProduct.title} 
              className="w-full h-64 md:h-full object-cover rounded-2xl" 
            />
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="bg-[#e2e7ff] text-[#3525cd] px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                  {quickViewProduct.category}
                </span>
                <h3 className="font-display font-bold text-xl text-[#131b2e]">{quickViewProduct.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{quickViewProduct.description}</p>
                <div className="pt-2">
                  <span className="font-display font-extrabold text-2xl text-[#3525cd]">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through ml-2">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                className="w-full py-3 bg-[#3525cd] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCheckoutOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-display font-bold text-lg text-[#131b2e]">Express Checkout</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Sharma" 
                  required 
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Shipping Address</label>
                <input 
                  type="text" 
                  defaultValue="Suite 402, Creative Heights, Bandra West, Mumbai" 
                  required 
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Payment Option</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd] bg-white">
                    <option>UPI / GPay / PhonePe</option>
                    <option>Credit / Debit Card</option>
                    <option>Cash on Delivery</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Promo Code</label>
                  <input 
                    type="text" 
                    defaultValue="MODERN15" 
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg uppercase font-bold text-[#3525cd]"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#f2f3ff] rounded-xl space-y-1 text-xs">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Total Payable:</span>
                  <span className="text-[#3525cd]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-gray-500">Includes all applicable taxes & free express shipping.</p>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#3525cd] to-[#712ae2] text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Confirm & Place Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#f2f3ff] text-[#464555] pt-12 pb-8 border-t border-gray-200/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="./logo.png" alt="Logo" className="h-6 w-auto" />
              <span className="font-display font-bold text-lg text-[#131b2e]">ModernShop</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Elevated digital storefront engineered for speed, interactive design, and seamless customer experience.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#131b2e] uppercase mb-3">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => { setCurrentTab('shop'); setSelectedCategory('electronics'); }} className="hover:text-[#3525cd]">Electronics</button></li>
              <li><button onClick={() => { setCurrentTab('shop'); setSelectedCategory('fashion'); }} className="hover:text-[#3525cd]">Fashion & Apparel</button></li>
              <li><button onClick={() => { setCurrentTab('shop'); setSelectedCategory('essentials'); }} className="hover:text-[#3525cd]">Home Essentials</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#131b2e] uppercase mb-3">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-[#3525cd]">Order Tracking</a></li>
              <li><a href="#" className="hover:text-[#3525cd]">Shipping & Delivery Policy</a></li>
              <li><a href="#" className="hover:text-[#3525cd]">Return Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#131b2e] uppercase mb-3">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email..." className="h-9 px-3 text-xs bg-white rounded-lg border w-full" />
              <button className="px-3 bg-[#3525cd] text-white text-xs font-bold rounded-lg">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© 2026 ModernShop. All rights reserved. Designed for Alex Sharma Showcase.</p>
          <span className="flex items-center gap-1 text-[#005338] font-semibold">
            <ShieldCheck className="w-4 h-4" /> 256-Bit Encrypted Secure Front-End
          </span>
        </div>
      </footer>

    </div>
  );
}
