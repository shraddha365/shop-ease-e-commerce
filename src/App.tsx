import { createContext, FormEvent, useEffect, useMemo, useState } from "react";

type Role = "user" | "admin";
type PageName = "home" | "products" | "product" | "cart" | "checkout" | "profile" | "admin" | "login" | "register" | "about" | "contact" | "wishlist" | "order-summary";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  rating: number;
  reviews: Review[];
  stock: number;
  badge?: "New" | "Sale" | "Out of Stock";
  images: string[];
  createdAt: string;
  sold: number;
};

type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
};

type CartItem = {
  productId: string;
  quantity: number;
};

type ShopUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
};

type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: string;
  paymentMethod: string;
  total: number;
  discount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
};

type Route = {
  name: PageName;
  productId?: string;
};

type ShopContextValue = {
  products: Product[];
  users: ShopUser[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  user: ShopUser | null;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const heroImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=85";

const seedProducts: Product[] = [
  {
    id: "p-1001",
    name: "AeroFlex Running Sneakers",
    category: "Footwear",
    price: 129,
    originalPrice: 169,
    description: "Lightweight knit sneakers with responsive cushioning, breathable panels, and all-day city comfort.",
    rating: 4.8,
    stock: 18,
    badge: "Sale",
    createdAt: "2026-01-08",
    sold: 940,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [
      { id: "r1", user: "Mia", rating: 5, comment: "Soft landing, clean design, and true to size." },
      { id: "r2", user: "Noah", rating: 4, comment: "Great for commuting and gym sessions." }
    ]
  },
  {
    id: "p-1002",
    name: "Luma Smart Watch Pro",
    category: "Electronics",
    price: 249,
    description: "A polished smart watch with wellness tracking, long battery life, AMOLED display, and fast charging.",
    rating: 4.7,
    stock: 26,
    badge: "New",
    createdAt: "2026-02-02",
    sold: 780,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r3", user: "Aarav", rating: 5, comment: "Battery lasts for days and the screen is excellent." }]
  },
  {
    id: "p-1003",
    name: "CloudWeave Oversized Hoodie",
    category: "Fashion",
    price: 89,
    originalPrice: 110,
    description: "Brushed cotton fleece hoodie with a relaxed silhouette, kangaroo pocket, and premium rib trim.",
    rating: 4.6,
    stock: 0,
    badge: "Out of Stock",
    createdAt: "2025-12-19",
    sold: 1130,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r4", user: "Ethan", rating: 4, comment: "Warm, heavy, and looks more expensive than it is." }]
  },
  {
    id: "p-1004",
    name: "Aurora Ceramic Dinner Set",
    category: "Home",
    price: 149,
    description: "A 16-piece stoneware dinner set with organic edges, matte glaze, and dishwasher-safe durability.",
    rating: 4.9,
    stock: 14,
    createdAt: "2026-01-22",
    sold: 510,
    images: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r5", user: "Sofia", rating: 5, comment: "Beautiful glaze and surprisingly sturdy." }]
  },
  {
    id: "p-1005",
    name: "Nomad Vegan Leather Backpack",
    category: "Accessories",
    price: 119,
    originalPrice: 139,
    description: "Structured everyday backpack with laptop sleeve, water-resistant finish, and hidden back pocket.",
    rating: 4.5,
    stock: 21,
    badge: "Sale",
    createdAt: "2025-11-28",
    sold: 640,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r6", user: "Liam", rating: 4, comment: "Good pockets and premium finish." }]
  },
  {
    id: "p-1006",
    name: "PulseWave Noise-Canceling Headphones",
    category: "Electronics",
    price: 199,
    description: "Immersive wireless headphones with adaptive ANC, plush memory foam cups, and studio-grade sound.",
    rating: 4.8,
    stock: 32,
    badge: "New",
    createdAt: "2026-02-15",
    sold: 890,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r7", user: "Ivy", rating: 5, comment: "Clear calls, deep bass, and comfortable on long flights." }]
  },
  {
    id: "p-1007",
    name: "PureForm Yoga Mat",
    category: "Fitness",
    price: 69,
    description: "Non-slip natural rubber mat with alignment guides, dense cushioning, and recycled carry strap.",
    rating: 4.4,
    stock: 42,
    createdAt: "2025-10-04",
    sold: 430,
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r8", user: "Nora", rating: 4, comment: "Grip is excellent and it rolls flat quickly." }]
  },
  {
    id: "p-1008",
    name: "BrewCraft Pour Over Kit",
    category: "Home",
    price: 79,
    description: "Complete coffee ritual kit with glass dripper, server, reusable filter, scoop, and starter guide.",
    rating: 4.7,
    stock: 16,
    createdAt: "2025-12-01",
    sold: 370,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=85"
    ],
    reviews: [{ id: "r9", user: "Kai", rating: 5, comment: "Makes a clean cup and looks great on the counter." }]
  }
];

const demoUsers: ShopUser[] = [
  { id: "u-1", name: "Admin Manager", email: "admin@shopease.com", password: "Admin123!", role: "admin", phone: "+1 555 0199", address: "100 Market Street, New York" },
  { id: "u-2", name: "Demo Customer", email: "user@shopease.com", password: "User123!", role: "user", phone: "+1 555 0152", address: "42 Commerce Lane, Austin" }
];

const coupons: Record<string, number> = {
  WELCOME10: 0.1,
  EASE20: 0.2
};

const categories = ["Fashion", "Electronics", "Home", "Footwear", "Accessories", "Fitness"];

const contactDetails = {
  name: "Shraddha Khandu Landge",
  email: "shraddhalandge9960@gmail.com",
  phone: "+91 8600596547",
  sales: "shraddhalandge9960@gmail.com",
  addressLine1: "At Post Vadgoan Kandali",
  addressLine2: "Taluka Junnar, District Pune, Maharashtra, India",
  hours: "Monday to Saturday, 9:00 AM to 6:00 PM IST",
  responseTime: "Average reply time: under 24 hours",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Vadgoan+Kandali+Junnar+Pune+Maharashtra+India"
};

const API_BASE_URL = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || "http://localhost:5000/api";

const currency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

function useStoredState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-sm text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index + 1 <= Math.round(rating) ? "★" : "☆"}</span>
      ))}
      <span className="ml-1 text-xs font-medium text-slate-500">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductBadge({ product }: { product: Product }) {
  const label = product.stock === 0 ? "Out of Stock" : product.badge;
  if (!label) return null;
  return (
    <span className={cx("absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]", label === "Sale" && "bg-rose-600 text-white", label === "New" && "bg-emerald-600 text-white", label === "Out of Stock" && "bg-slate-950 text-white")}>{label}</span>
  );
}

function ProductTile({ product, onView, onAdd, inWishlist, onWishlist }: { product: Product; onView: (id: string) => void; onAdd: (id: string) => void; inWishlist: boolean; onWishlist: (id: string) => void }) {
  return (
    <article className="group animate-rise overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200">
      <button type="button" onClick={() => onView(product.id)} className="relative block aspect-[4/5] w-full overflow-hidden bg-slate-100 text-left">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <ProductBadge product={product} />
      </button>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{product.category}</p>
              <button type="button" onClick={() => onView(product.id)} className="mt-1 text-left text-lg font-semibold text-slate-950 hover:text-indigo-700">
                {product.name}
              </button>
            </div>
            <button type="button" onClick={() => onWishlist(product.id)} className={cx("rounded-full border px-3 py-2 text-sm transition", inWishlist ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500 hover:border-slate-400")} aria-label="Toggle wishlist">
              {inWishlist ? "Saved" : "Save"}
            </button>
          </div>
          <Stars rating={product.rating} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-950">{currency(product.price)}</span>
            {product.originalPrice ? <span className="text-sm text-slate-400 line-through">{currency(product.originalPrice)}</span> : null}
          </div>
          <button type="button" disabled={product.stock === 0} onClick={() => onAdd(product.id)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function Navbar({ route, cartCount, user, onNavigate, onLogout }: { route: Route; cartCount: number; user: ShopUser | null; onNavigate: (name: PageName, productId?: string) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const links: Array<{ label: string; page: PageName }> = [
    { label: "Shop", page: "products" },
    { label: "Wishlist", page: "wishlist" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" }
  ];

  const navLink = (page: PageName, label: string) => (
    <button key={page} type="button" onClick={() => { onNavigate(page); setOpen(false); }} className={cx("text-sm font-semibold transition hover:text-indigo-700", route.name === page ? "text-indigo-700" : "text-slate-600")}>
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => onNavigate("home")} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white">SE</span>
          <span className="text-2xl font-black tracking-tight text-slate-950">ShopEase</span>
        </button>
        <nav className="hidden items-center gap-8 md:flex">{links.map((link) => navLink(link.page, link.label))}</nav>
        <div className="hidden items-center gap-3 md:flex">
          {user?.role === "admin" ? <button type="button" onClick={() => onNavigate("admin")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">Admin</button> : null}
          {user ? <button type="button" onClick={() => onNavigate("profile")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">{user.name.split(" ")[0]}</button> : <button type="button" onClick={() => onNavigate("login")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">Login</button>}
          {user ? <button type="button" onClick={onLogout} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-950">Logout</button> : null}
          <button type="button" onClick={() => onNavigate("cart")} className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">Cart {cartCount}</button>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 md:hidden">Menu</button>
      </div>
      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => navLink(link.page, link.label))}
            {user?.role === "admin" ? navLink("admin", "Admin") : null}
            {user ? navLink("profile", "Profile") : navLink("login", "Login")}
            <button type="button" onClick={() => onNavigate("cart")} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Cart {cartCount}</button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Footer({ onNavigate }: { onNavigate: (name: PageName) => void }) {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-3xl font-black tracking-tight">ShopEase</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">A complete MERN e-commerce starter with storefront, auth, cart, checkout, admin operations, and a production-ready backend structure.</p>
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <p className="font-bold uppercase tracking-[0.2em] text-white">Explore</p>
          {(["products", "about", "contact"] as PageName[]).map((page) => (
            <button key={page} type="button" onClick={() => onNavigate(page)} className="block hover:text-white">{page === "products" ? "Products" : page[0].toUpperCase() + page.slice(1)}</button>
          ))}
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <p className="font-bold uppercase tracking-[0.2em] text-white">Contact</p>
          <a href={`mailto:${contactDetails.email}`} className="block hover:text-white">{contactDetails.email}</a>
          <a href={`tel:${contactDetails.phone.replace(/[^+0-9]/g, "")}`} className="block hover:text-white">{contactDetails.phone}</a>
          <p>{contactDetails.addressLine1}</p>
          <p>{contactDetails.addressLine2}</p>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ products, wishlist, onView, onNavigate, onAdd, onWishlist, onNewsletter }: { products: Product[]; wishlist: string[]; onView: (id: string) => void; onNavigate: (name: PageName) => void; onAdd: (id: string) => void; onWishlist: (id: string) => void; onNewsletter: (email: string) => Promise<void> | void }) {
  const featured = products.filter((product) => product.badge === "New" || product.badge === "Sale").slice(0, 4);
  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const [email, setEmail] = useState("");

  function submitNewsletter(event: FormEvent) {
    event.preventDefault();
    onNewsletter(email);
    setEmail("");
  }

  return (
    <main>
      <section className="relative isolate min-h-[calc(100vh-77px)] overflow-hidden bg-slate-950 text-white">
        <div className="hero-zoom absolute inset-0 -z-20 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />
        <div className="mx-auto flex min-h-[calc(100vh-77px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-rise space-y-7">
            <p className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">ShopEase</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">Modern essentials selected for faster, cleaner shopping.</h1>
            <p className="max-w-xl text-base leading-7 text-slate-200 sm:text-lg">Discover curated fashion, electronics, home goods, and everyday gear with secure JWT checkout flows and admin-ready operations.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => onNavigate("products")} className="rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-indigo-100">Shop collection</button>
              <button type="button" onClick={() => onNavigate("about")} className="rounded-full border border-white/40 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">Why ShopEase</button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Featured products" title="Fresh drops with proven demand" subtitle="A focused shelf of new arrivals and limited-time deals." />
        <ProductGrid products={featured} wishlist={wishlist} onView={onView} onAdd={onAdd} onWishlist={onWishlist} />
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Categories" title="Shop by the way you live" subtitle="Simple category paths keep discovery fast on every device." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => onNavigate("products")} className="group overflow-hidden rounded-[2rem] bg-white p-8 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">{category}</span>
                <span className="mt-8 block text-3xl font-black text-slate-950">{products.filter((product) => product.category === category).length} items</span>
                <span className="mt-3 block text-sm text-slate-500">Browse curated {category.toLowerCase()} essentials.</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Best sellers" title="Customer favorites" subtitle="Products with the highest order velocity and review quality." />
        <ProductGrid products={best} wishlist={wishlist} onView={onView} onAdd={onAdd} onWishlist={onWishlist} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-slate-950 text-white md:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-300">Newsletter</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Get launches, coupons, and shopping notes.</h2>
          </div>
          <form onSubmit={submitNewsletter} className="flex flex-col justify-center gap-3 p-8 sm:p-12">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="rounded-full border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-slate-400 focus:border-indigo-300" />
            <button type="submit" className="rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-indigo-100">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10 max-w-2xl animate-rise">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-500">{subtitle}</p>
    </div>
  );
}

function ProductGrid({ products, wishlist, onView, onAdd, onWishlist }: { products: Product[]; wishlist: string[]; onView: (id: string) => void; onAdd: (id: string) => void; onWishlist: (id: string) => void }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductTile key={product.id} product={product} onView={onView} onAdd={onAdd} inWishlist={wishlist.includes(product.id)} onWishlist={onWishlist} />
      ))}
    </div>
  );
}

function ProductsPage({ products, wishlist, onView, onAdd, onWishlist }: { products: Product[]; wishlist: string[]; onView: (id: string) => void; onAdd: (id: string) => void; onWishlist: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("latest");

  const filtered = useMemo(() => {
    const limits: Record<string, [number, number]> = {
      All: [0, Number.MAX_SAFE_INTEGER],
      "Under $100": [0, 99],
      "$100 - $200": [100, 200],
      "$200+": [201, Number.MAX_SAFE_INTEGER]
    };
    const [min, max] = limits[price];
    return products
      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase()))
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => product.price >= min && product.price <= max)
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [category, price, products, search, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Product listing" title="Search, filter, and sort" subtitle="Every product view supports category, price, latest, and price sorting." />
      <div className="mb-8 grid gap-3 rounded-[2rem] bg-slate-100 p-4 md:grid-cols-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-indigo-400" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-indigo-400">
          <option>All</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={price} onChange={(event) => setPrice(event.target.value)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-indigo-400">
          {(["All", "Under $100", "$100 - $200", "$200+"] as string[]).map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-indigo-400">
          <option value="latest">Latest</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
        </select>
      </div>
      {filtered.length ? <ProductGrid products={filtered} wishlist={wishlist} onView={onView} onAdd={onAdd} onWishlist={onWishlist} /> : <EmptyState title="No products found" message="Try a different search, category, or price range." />}
    </main>
  );
}

function ProductDetailPage({ product, onAdd, onWishlist, inWishlist, onReview }: { product: Product; onAdd: (id: string) => void; onWishlist: (id: string) => void; inWishlist: boolean; onReview: (productId: string, rating: number, comment: string) => void }) {
  const [image, setImage] = useState(product.images[0]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  function submitReview(event: FormEvent) {
    event.preventDefault();
    onReview(product.id, rating, comment);
    setComment("");
    setRating(5);
  }

  useEffect(() => {
    setImage(product.images[0]);
  }, [product]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100">
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
            <ProductBadge product={product} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((item) => (
              <button key={item} type="button" onClick={() => setImage(item)} className={cx("aspect-square overflow-hidden rounded-3xl border-2 bg-slate-100", image === item ? "border-indigo-600" : "border-transparent")}>
                <img src={item} alt={`${product.name} thumbnail`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">{product.category}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4"><Stars rating={product.rating} /><span className="text-sm text-slate-500">{product.reviews.length} reviews</span><span className={cx("rounded-full px-3 py-1 text-xs font-bold", product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span></div>
          <div className="mt-8 flex items-baseline gap-3"><span className="text-4xl font-black text-slate-950">{currency(product.price)}</span>{product.originalPrice ? <span className="text-xl text-slate-400 line-through">{currency(product.originalPrice)}</span> : null}</div>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{product.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" disabled={product.stock === 0} onClick={() => onAdd(product.id)} className="rounded-full bg-slate-950 px-8 py-4 text-sm font-black text-white transition hover:bg-indigo-700 disabled:bg-slate-300">Add to cart</button>
            <button type="button" onClick={() => onWishlist(product.id)} className="rounded-full border border-slate-200 px-8 py-4 text-sm font-black text-slate-700 transition hover:border-rose-300 hover:text-rose-600">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</button>
          </div>
          <div className="mt-12 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black text-slate-950">Reviews and ratings</h2>
            <div className="mt-5 space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-3xl bg-slate-100 p-5">
                  <div className="flex items-center justify-between gap-4"><p className="font-bold text-slate-950">{review.user}</p><Stars rating={review.rating} /></div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
            <form onSubmit={submitReview} className="mt-6 grid gap-3 rounded-3xl border border-slate-200 p-4">
              <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="rounded-full border border-slate-200 px-4 py-3 text-sm">
                {[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} stars</option>)}
              </select>
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} required placeholder="Write a review" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
              <button type="submit" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700">Submit review</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function CartPage({ cart, products, onQuantity, onRemove, onNavigate }: { cart: CartItem[]; products: Product[]; onQuantity: (productId: string, quantity: number) => void; onRemove: (productId: string) => void; onNavigate: (name: PageName) => void }) {
  const rows = cart.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((row): row is { item: CartItem; product: Product } => Boolean(row.product));
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Cart" title="Review your order" subtitle="Update quantities, remove items, and continue to checkout." />
      {rows.length ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {rows.map(({ item, product }) => (
              <div key={product.id} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <img src={product.images[0]} alt={product.name} className="h-28 w-28 rounded-3xl object-cover" />
                <div>
                  <p className="font-black text-slate-950">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{currency(product.price)} each</p>
                  <button type="button" onClick={() => onRemove(product.id)} className="mt-3 text-sm font-bold text-rose-600">Remove</button>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => onQuantity(product.id, item.quantity - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 font-bold">-</button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button type="button" onClick={() => onQuantity(product.id, item.quantity + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] bg-slate-100 p-6">
            <h2 className="text-2xl font-black text-slate-950">Cart total</h2>
            <div className="mt-6 space-y-3 text-sm text-slate-600"><SummaryLine label="Subtotal" value={currency(subtotal)} /><SummaryLine label="Shipping" value="Calculated at checkout" /></div>
            <button type="button" onClick={() => onNavigate("checkout")} className="mt-6 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-indigo-700">Continue to checkout</button>
          </aside>
        </div>
      ) : <EmptyState title="Your cart is empty" message="Browse products and add something you love." action="Shop products" onAction={() => onNavigate("products")} />}
    </main>
  );
}

function CheckoutPage({ cart, products, user, onPlaceOrder, onNavigate }: { cart: CartItem[]; products: Product[]; user: ShopUser | null; onPlaceOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => void; onNavigate: (name: PageName) => void }) {
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("Stripe card");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const rows = cart.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((row): row is { item: CartItem; product: Product } => Boolean(row.product));
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);
  const discount = appliedCoupon ? subtotal * coupons[appliedCoupon] : 0;
  const shipping = subtotal > 150 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  function placeOrder(event: FormEvent) {
    event.preventDefault();
    if (!user) {
      onNavigate("login");
      return;
    }
    onPlaceOrder({ userId: user.id, items: cart, shippingAddress, paymentMethod, total, discount });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Checkout" title="Shipping and payment" subtitle="Use a coupon code, choose a payment method, and place the order." />
      {rows.length ? (
        <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-950">Shipping address</h2>
              <textarea value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} required placeholder="Street, city, state, postal code" className="mt-4 min-h-32 w-full rounded-3xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-indigo-400" />
            </div>
            <div className="rounded-[2rem] border border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-950">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Stripe card", "Razorpay", "Cash on delivery"].map((method) => (
                  <label key={method} className={cx("cursor-pointer rounded-3xl border p-4 text-sm font-bold", paymentMethod === method ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600")}>
                    <input className="sr-only" type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    {method}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-[2rem] bg-slate-100 p-6">
            <h2 className="text-2xl font-black text-slate-950">Order summary</h2>
            <div className="mt-5 space-y-4">
              {rows.map(({ item, product }) => <SummaryLine key={product.id} label={`${product.name} x ${item.quantity}`} value={currency(product.price * item.quantity)} />)}
            </div>
            <div className="mt-6 flex gap-2">
              <input value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} placeholder="WELCOME10" className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none" />
              <button type="button" onClick={() => setAppliedCoupon(coupons[coupon] ? coupon : "")} className="rounded-full bg-white px-4 py-3 text-sm font-black text-slate-950">Apply</button>
            </div>
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm"><SummaryLine label="Subtotal" value={currency(subtotal)} /><SummaryLine label="Discount" value={`-${currency(discount)}`} /><SummaryLine label="Shipping" value={currency(shipping)} /><SummaryLine label="Total" value={currency(total)} strong /></div>
            <button type="submit" className="mt-6 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-indigo-700">Place order</button>
          </aside>
        </form>
      ) : <EmptyState title="Checkout needs a cart" message="Add products before placing an order." action="Shop products" onAction={() => onNavigate("products")} />}
    </main>
  );
}

function SummaryLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className={cx("flex items-center justify-between gap-4", strong ? "text-lg font-black text-slate-950" : "text-slate-600")}><span>{label}</span><span className="font-bold text-slate-950">{value}</span></div>;
}

function AuthPage({ mode, users, onAuth, onNavigate }: { mode: "login" | "register"; users: ShopUser[]; onAuth: (user: ShopUser, isNew: boolean) => void; onNavigate: (name: PageName) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "user@shopease.com" : "");
  const [password, setPassword] = useState(mode === "login" ? "User123!" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      if (mode === "login") {
        const match = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
        if (!match) setError("Invalid email or password.");
        else onAuth(match, false);
      } else {
        if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) setError("An account with this email already exists.");
        else onAuth({ id: `u-${Date.now()}`, name, email, password, role: "user" }, true);
      }
      setLoading(false);
    }, 500);
  }

  return (
    <main className="grid min-h-[calc(100vh-77px)] bg-slate-950 text-white lg:grid-cols-2">
      <section className="hidden bg-cover bg-center lg:block" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1400&q=85)" }} />
      <section className="flex items-center justify-center px-4 py-16">
        <form onSubmit={submit} className="w-full max-w-md animate-rise space-y-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-300">JWT authentication</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">{mode === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="mt-3 text-sm text-slate-300">Demo admin: admin@shopease.com / Admin123!</p>
          </div>
          {mode === "register" ? <Input label="Full name" value={name} onChange={setName} required /> : null}
          <Input label="Email" value={email} onChange={setEmail} type="email" required />
          <Input label="Password" value={password} onChange={setPassword} type="password" required />
          {error ? <p className="rounded-2xl bg-rose-500/15 p-3 text-sm font-semibold text-rose-100">{error}</p> : null}
          <button type="submit" className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-indigo-100 disabled:opacity-60" disabled={loading}>{loading ? "Authenticating..." : mode === "login" ? "Login" : "Register"}</button>
          <button type="button" onClick={() => onNavigate(mode === "login" ? "register" : "login")} className="text-sm font-bold text-indigo-200 hover:text-white">{mode === "login" ? "Need an account? Register" : "Already registered? Login"}</button>
        </form>
      </section>
    </main>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-bold text-current">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} type={type} required={required} className="mt-2 w-full rounded-full border border-white/15 bg-white/10 px-5 py-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300" />
    </label>
  );
}

function ProfilePage({ user, orders, onUpdate, onNavigate }: { user: ShopUser | null; orders: Order[]; onUpdate: (user: ShopUser) => void; onNavigate: (name: PageName) => void }) {
  const [form, setForm] = useState<ShopUser | null>(user);
  if (!user || !form) return <ProtectedMessage onNavigate={onNavigate} />;
  const userOrders = orders.filter((order) => order.userId === user.id);

  function updateField(field: keyof ShopUser, value: string) {
    setForm((current) => current ? { ...current, [field]: value } : current);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Profile" title="Account details" subtitle="Update contact details and review your order history." />
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <form onSubmit={(event) => { event.preventDefault(); onUpdate(form); }} className="h-fit rounded-[2rem] border border-slate-200 p-6">
          <div className="space-y-4">
            <ProfileInput label="Name" value={form.name} onChange={(value) => updateField("name", value)} />
            <ProfileInput label="Email" value={form.email} onChange={(value) => updateField("email", value)} />
            <ProfileInput label="Phone" value={form.phone || ""} onChange={(value) => updateField("phone", value)} />
            <ProfileInput label="Address" value={form.address || ""} onChange={(value) => updateField("address", value)} />
          </div>
          <button type="submit" className="mt-6 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-indigo-700">Update profile</button>
        </form>
        <div className="rounded-[2rem] bg-slate-100 p-6">
          <h2 className="text-2xl font-black text-slate-950">Order history</h2>
          <div className="mt-5 overflow-x-auto">
            {userOrders.length ? <OrdersTable orders={userOrders} /> : <EmptyState title="No orders yet" message="Your completed orders will appear here." />}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-bold text-slate-700">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:border-indigo-400" /></label>;
}

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <table className="min-w-full text-left text-sm">
      <thead className="text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="py-3">Order</th><th className="py-3">Date</th><th className="py-3">Total</th><th className="py-3">Status</th></tr></thead>
      <tbody className="divide-y divide-slate-200">
        {orders.map((order) => <tr key={order.id}><td className="py-4 font-bold text-slate-950">{order.id}</td><td className="py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td><td className="py-4 font-bold text-slate-950">{currency(order.total)}</td><td className="py-4"><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700">{order.status}</span></td></tr>)}
      </tbody>
    </table>
  );
}

function AdminPage({ user, products, users, orders, onAddProduct, onUpdateProduct, onDeleteProduct, onDeleteUser, onOrderStatus, onNavigate }: { user: ShopUser | null; products: Product[]; users: ShopUser[]; orders: Order[]; onAddProduct: (product: Product) => void; onUpdateProduct: (product: Product) => void; onDeleteProduct: (id: string) => void; onDeleteUser: (id: string) => void; onOrderStatus: (id: string, status: Order["status"]) => void; onNavigate: (name: PageName) => void }) {
  const [tab, setTab] = useState<"dashboard" | "products" | "users" | "orders">("dashboard");
  const [editingId, setEditingId] = useState<string>("");
  const editing = products.find((product) => product.id === editingId);
  const [form, setForm] = useState({ name: "", category: "Fashion", price: "", stock: "", description: "", image: "" });
  if (!user || user.role !== "admin") return <ProtectedMessage onNavigate={onNavigate} admin />;

  function loadProduct(product: Product) {
    setEditingId(product.id);
    setForm({ name: product.name, category: product.category, price: String(product.price), stock: String(product.stock), description: product.description, image: product.images[0] });
  }

  function resetForm() {
    setEditingId("");
    setForm({ name: "", category: "Fashion", price: "", stock: "", description: "", image: "" });
  }

  function submitProduct(event: FormEvent) {
    event.preventDefault();
    const payload: Product = {
      id: editing?.id || `p-${Date.now()}`,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description,
      rating: editing?.rating || 4.5,
      reviews: editing?.reviews || [],
      stock: Number(form.stock),
      badge: Number(form.stock) === 0 ? "Out of Stock" : editing?.badge || "New",
      images: [form.image || seedProducts[0].images[0]],
      createdAt: editing?.createdAt || new Date().toISOString(),
      sold: editing?.sold || 0
    };
    if (editing) onUpdateProduct(payload);
    else onAddProduct(payload);
    resetForm();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Admin panel" title="Control center" subtitle="Manage products, users, orders, and fulfillment status." />
      <div className="mb-8 flex flex-wrap gap-3">{(["dashboard", "products", "users", "orders"] as const).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={cx("rounded-full px-5 py-3 text-sm font-black capitalize", tab === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700")}>{item}</button>)}</div>
      {tab === "dashboard" ? <AdminDashboard products={products} users={users} orders={orders} /> : null}
      {tab === "products" ? <AdminProducts products={products} form={form} setForm={setForm} submitProduct={submitProduct} loadProduct={loadProduct} deleteProduct={onDeleteProduct} resetForm={resetForm} editing={Boolean(editing)} /> : null}
      {tab === "users" ? <AdminUsers users={users} deleteUser={onDeleteUser} /> : null}
      {tab === "orders" ? <AdminOrders orders={orders} onOrderStatus={onOrderStatus} /> : null}
    </main>
  );
}

function AdminDashboard({ products, users, orders }: { products: Product[]; users: ShopUser[]; orders: Order[] }) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  return <div className="grid gap-4 md:grid-cols-4">{[{ label: "Products", value: products.length }, { label: "Users", value: users.length }, { label: "Orders", value: orders.length }, { label: "Revenue", value: currency(revenue) }].map((item) => <div key={item.label} className="rounded-[2rem] bg-slate-100 p-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{item.label}</p><p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p></div>)}</div>;
}

function AdminProducts({ products, form, setForm, submitProduct, loadProduct, deleteProduct, resetForm, editing }: { products: Product[]; form: { name: string; category: string; price: string; stock: string; description: string; image: string }; setForm: (form: { name: string; category: string; price: string; stock: string; description: string; image: string }) => void; submitProduct: (event: FormEvent) => void; loadProduct: (product: Product) => void; deleteProduct: (id: string) => void; resetForm: () => void; editing: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submitProduct} className="h-fit rounded-[2rem] border border-slate-200 p-6">
        <h2 className="text-2xl font-black text-slate-950">{editing ? "Edit product" : "Add new product"}</h2>
        <div className="mt-5 space-y-3">
          <AdminInput label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <label className="block text-sm font-bold text-slate-700">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-sm">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <AdminInput label="Price" value={form.price} onChange={(value) => setForm({ ...form, price: value })} type="number" />
          <AdminInput label="Stock" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} type="number" />
          <AdminInput label="Image URL" value={form.image} onChange={(value) => setForm({ ...form, image: value })} />
          <label className="block text-sm font-bold text-slate-700">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 min-h-24 w-full rounded-3xl border border-slate-200 px-5 py-3 text-sm" /></label>
        </div>
        <div className="mt-5 flex gap-3"><button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">Save</button><button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black">Reset</button></div>
      </form>
      <div className="overflow-x-auto rounded-[2rem] bg-slate-100 p-4">
        <table className="min-w-full text-left text-sm"><thead className="text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">{products.map((product) => <tr key={product.id}><td className="p-3 font-bold text-slate-950">{product.name}</td><td className="p-3">{currency(product.price)}</td><td className="p-3">{product.stock}</td><td className="p-3"><button type="button" onClick={() => loadProduct(product)} className="mr-3 font-bold text-indigo-700">Edit</button><button type="button" onClick={() => deleteProduct(product.id)} className="font-bold text-rose-600">Delete</button></td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-bold text-slate-700">{label}<input value={value} onChange={(event) => onChange(event.target.value)} required type={type} className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-sm" /></label>;
}

function AdminUsers({ users, deleteUser }: { users: ShopUser[]; deleteUser: (id: string) => void }) {
  return <div className="overflow-x-auto rounded-[2rem] bg-slate-100 p-4"><table className="min-w-full text-left text-sm"><thead className="text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-200">{users.map((item) => <tr key={item.id}><td className="p-3 font-bold text-slate-950">{item.name}</td><td className="p-3">{item.email}</td><td className="p-3 capitalize">{item.role}</td><td className="p-3"><button type="button" onClick={() => deleteUser(item.id)} disabled={item.role === "admin"} className="font-bold text-rose-600 disabled:text-slate-400">Delete</button></td></tr>)}</tbody></table></div>;
}

function AdminOrders({ orders, onOrderStatus }: { orders: Order[]; onOrderStatus: (id: string, status: Order["status"]) => void }) {
  return <div className="overflow-x-auto rounded-[2rem] bg-slate-100 p-4"><table className="min-w-full text-left text-sm"><thead className="text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="p-3">Order</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-200">{orders.map((order) => <tr key={order.id}><td className="p-3 font-bold text-slate-950">{order.id}</td><td className="p-3">{currency(order.total)}</td><td className="p-3">{order.paymentMethod}</td><td className="p-3"><select value={order.status} onChange={(event) => onOrderStatus(order.id, event.target.value as Order["status"])} className="rounded-full border border-slate-200 px-3 py-2">{(["Processing", "Shipped", "Delivered", "Cancelled"] as Order["status"][]).map((item) => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table></div>;
}

function StaticPage({ type }: { type: "about" | "contact" }) {
  const isAbout = type === "about";
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "Order support", message: "" });
  const [contactStatus, setContactStatus] = useState("");

  async function submitContactMessage(event: FormEvent) {
    event.preventDefault();
    setContactStatus("Saving message...");
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      if (!response.ok) throw new Error("Message failed");
      setContactForm({ name: "", email: "", phone: "", subject: "Order support", message: "" });
      setContactStatus("Message saved to the MongoDB backend.");
    } catch (_error) {
      setContactStatus("Start the backend API to save this message to MongoDB.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">{isAbout ? "About ShopEase" : "Contact"}</p>
      <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950">{isAbout ? "Shopping made simple from Junnar to everywhere." : "Talk to the ShopEase team."}</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">{isAbout ? "ShopEase is a modern online shopping platform managed by Shraddha Khandu Landge, created to offer a clean buying experience with secure accounts, curated products, fast checkout, and a reliable MongoDB-backed order system." : "Reach customer support, sales, or our office team using the details below. We respond quickly during business hours."}</p>
      {isAbout ? (
        <div className="mt-10 space-y-10">
          <section className="rounded-[2.5rem] bg-slate-950 p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-200">Founder information</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-4xl font-black tracking-tight">{contactDetails.name}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">ShopEase is operated from {contactDetails.addressLine1}, {contactDetails.addressLine2}. The goal is to provide a dependable local-first shopping experience with professional e-commerce features.</p>
              </div>
              <div className="space-y-3 rounded-[2rem] bg-white/10 p-6">
                <a href={`mailto:${contactDetails.email}`} className="block text-lg font-black hover:text-indigo-200">{contactDetails.email}</a>
                <a href={`tel:${contactDetails.phone.replace(/[^+0-9]/g, "")}`} className="block text-lg font-black hover:text-indigo-200">{contactDetails.phone}</a>
                <a href={contactDetails.mapUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-indigo-100">View location</a>
              </div>
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Our mission", text: "Make online shopping easy, organized, and trustworthy with clear product details, simple checkout, and customer-first support." },
              { title: "What we sell", text: "Fashion, footwear, electronics, home essentials, accessories, and fitness products selected for everyday use." },
              { title: "Customer promise", text: "Helpful communication, transparent pricing, order tracking, coupons, reviews, and a smooth return-support experience." }
            ].map((item) => <div key={item.title} className="rounded-[2rem] bg-slate-100 p-6"><p className="text-xl font-black text-slate-950">{item.title}</p><p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p></div>)}
          </section>
          <section className="grid gap-6 rounded-[2.5rem] border border-slate-200 p-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">Database and backend</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Built on a real MERN backend.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "MongoDB schemas for users, products, carts, orders, contact messages, and newsletters",
                "Express REST APIs with JWT protected routes and admin-only routes",
                "bcrypt password hashing and centralized error handling",
                "Input validation for auth, products, orders, cart, payments, contact, and newsletter data"
              ].map((item) => <p key={item} className="rounded-3xl bg-slate-100 p-5 text-sm font-semibold leading-6 text-slate-700">{item}</p>)}
            </div>
          </section>
          <section className="rounded-[2.5rem] bg-indigo-50 p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-700">Why ShopEase</p>
            <p className="mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-950">The platform combines a polished customer-facing store with backend tools for product management, customer management, order status updates, payment preparation, and database persistence.</p>
          </section>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            {[
              { label: "Contact person", value: contactDetails.name },
              { label: "Primary email", value: contactDetails.email, href: `mailto:${contactDetails.email}` },
              { label: "Sales and partnerships", value: contactDetails.sales, href: `mailto:${contactDetails.sales}` },
              { label: "Phone", value: contactDetails.phone, href: `tel:${contactDetails.phone.replace(/[^+0-9]/g, "")}` },
              { label: "Business hours", value: contactDetails.hours }
            ].map((item) => (
              <div key={item.label} className="rounded-[2rem] bg-slate-100 p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">{item.label}</p>
                {item.href ? <a href={item.href} className="mt-2 block text-xl font-black text-slate-950 hover:text-indigo-700">{item.value}</a> : <p className="mt-2 text-xl font-black text-slate-950">{item.value}</p>}
              </div>
            ))}
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Office location</p>
              <p className="mt-3 text-2xl font-black">{contactDetails.addressLine1}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{contactDetails.addressLine2}</p>
              <a href={contactDetails.mapUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-indigo-100">Open in Google Maps</a>
            </div>
          </section>
          <section>
            <div className="overflow-hidden rounded-[2rem] bg-slate-100">
              <div className="grid min-h-72 place-items-center bg-[linear-gradient(135deg,#0f172a_0%,#312e81_50%,#4f46e5_100%)] p-8 text-center text-white">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-100">ShopEase location</p>
                  <p className="mt-4 text-4xl font-black tracking-tight">Vadgoan Kandali</p>
                  <p className="mt-3 text-sm leading-6 text-indigo-100">At Post Vadgoan Kandali, Taluka Junnar, District Pune, Maharashtra.</p>
                </div>
              </div>
              <form onSubmit={submitContactMessage} className="grid gap-4 p-6">
                <input value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} required placeholder="Name" className="rounded-full border border-slate-200 px-5 py-4" />
                <input value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} required type="email" placeholder="Email" className="rounded-full border border-slate-200 px-5 py-4" />
                <input value={contactForm.phone} onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })} placeholder="Phone number" className="rounded-full border border-slate-200 px-5 py-4" />
                <select value={contactForm.subject} onChange={(event) => setContactForm({ ...contactForm, subject: event.target.value })} className="rounded-full border border-slate-200 px-5 py-4">
                  <option>Order support</option>
                  <option>Returns and refunds</option>
                  <option>Vendor partnership</option>
                  <option>General question</option>
                </select>
                <textarea value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} required placeholder="Message" className="min-h-32 rounded-3xl border border-slate-200 px-5 py-4" />
                <p className="text-sm font-semibold text-slate-500">{contactDetails.responseTime}</p>
                {contactStatus ? <p className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-700">{contactStatus}</p> : null}
                <button type="submit" className="rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-indigo-700">Send message</button>
              </form>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function EmptyState({ title, message, action, onAction }: { title: string; message: string; action?: string; onAction?: () => void }) {
  return <div className="rounded-[2rem] bg-slate-100 p-10 text-center"><h2 className="text-2xl font-black text-slate-950">{title}</h2><p className="mt-2 text-slate-500">{message}</p>{action && onAction ? <button type="button" onClick={onAction} className="mt-5 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white">{action}</button> : null}</div>;
}

function ProtectedMessage({ onNavigate, admin }: { onNavigate: (name: PageName) => void; admin?: boolean }) {
  return <main className="mx-auto max-w-3xl px-4 py-20"><EmptyState title={admin ? "Admin access required" : "Login required"} message={admin ? "Use the demo admin account to open the admin panel." : "Please login or register to continue."} action="Go to login" onAction={() => onNavigate("login")} /></main>;
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return <div className={cx("fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-black text-white shadow-2xl", type === "success" ? "bg-emerald-600" : "bg-rose-600")}>{message}</div>;
}

export default function App() {
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [products, setProducts] = useStoredState<Product[]>("shopease-products", seedProducts);
  const [users, setUsers] = useStoredState<ShopUser[]>("shopease-users", demoUsers);
  const [orders, setOrders] = useStoredState<Order[]>("shopease-orders", []);
  const [cart, setCart] = useStoredState<CartItem[]>("shopease-cart", []);
  const [wishlist, setWishlist] = useStoredState<string[]>("shopease-wishlist", []);
  const [user, setUser] = useStoredState<ShopUser | null>("shopease-session", null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shopContextValue: ShopContextValue = { products, users, orders, cart, wishlist, user };

  function notify(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2600);
  }

  function navigate(name: PageName, productId?: string) {
    setRoute({ name, productId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stock === 0) {
      notify("This product is currently out of stock.", "error");
      return;
    }
    setCart((current) => {
      const exists = current.find((item) => item.productId === productId);
      if (exists) return current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      return [...current, { productId, quantity: 1 }];
    });
    notify("Added to cart.");
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) setCart((current) => current.filter((item) => item.productId !== productId));
    else setCart((current) => current.map((item) => item.productId === productId ? { ...item, quantity } : item));
  }

  function toggleWishlist(productId: string) {
    setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    notify("Wishlist updated.");
  }

  function handleAuth(authUser: ShopUser, isNew: boolean) {
    if (isNew) setUsers((current) => [...current, authUser]);
    setUser(authUser);
    notify(isNew ? "Registration successful." : "Login successful.");
    navigate("profile");
  }

  function updateProfile(updated: ShopUser) {
    setUser(updated);
    setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
    notify("Profile updated.");
  }

  async function subscribeNewsletter(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "ShopEase frontend" })
      });
      if (!response.ok) throw new Error("Subscription failed");
      notify("Newsletter subscription saved to database.");
    } catch (_error) {
      notify("Start the backend API to save this newsletter subscription.", "error");
    }
  }

  function placeOrder(payload: Omit<Order, "id" | "createdAt" | "status">) {
    const order: Order = { ...payload, id: `ORD-${Date.now().toString().slice(-6)}`, status: "Processing", createdAt: new Date().toISOString() };
    setOrders((current) => [order, ...current]);
    setCart([]);
    notify("Order placed successfully.");
    navigate("order-summary");
  }

  function addReview(productId: string, rating: number, comment: string) {
    const reviewer = user?.name || "Guest";
    setProducts((current) => current.map((product) => {
      if (product.id !== productId) return product;
      const reviews = [{ id: `r-${Date.now()}`, user: reviewer, rating, comment }, ...product.reviews];
      const nextRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      return { ...product, reviews, rating: nextRating };
    }));
    notify("Review submitted.");
  }

  function renderPage() {
    if (route.name === "home") return <HomePage products={products} wishlist={wishlist} onView={(id) => navigate("product", id)} onNavigate={navigate} onAdd={addToCart} onWishlist={toggleWishlist} onNewsletter={subscribeNewsletter} />;
    if (route.name === "products") return <ProductsPage products={products} wishlist={wishlist} onView={(id) => navigate("product", id)} onAdd={addToCart} onWishlist={toggleWishlist} />;
    if (route.name === "product") {
      const product = products.find((item) => item.id === route.productId) || products[0];
      return <ProductDetailPage product={product} onAdd={addToCart} onWishlist={toggleWishlist} inWishlist={wishlist.includes(product.id)} onReview={addReview} />;
    }
    if (route.name === "cart") return <CartPage cart={cart} products={products} onQuantity={updateQuantity} onRemove={(id) => setCart((current) => current.filter((item) => item.productId !== id))} onNavigate={navigate} />;
    if (route.name === "checkout") return <CheckoutPage cart={cart} products={products} user={user} onPlaceOrder={placeOrder} onNavigate={navigate} />;
    if (route.name === "login" || route.name === "register") return <AuthPage mode={route.name} users={users} onAuth={handleAuth} onNavigate={navigate} />;
    if (route.name === "profile") return <ProfilePage user={user} orders={orders} onUpdate={updateProfile} onNavigate={navigate} />;
    if (route.name === "admin") return <AdminPage user={user} products={products} users={users} orders={orders} onAddProduct={(product) => { setProducts((current) => [product, ...current]); notify("Product added."); }} onUpdateProduct={(product) => { setProducts((current) => current.map((item) => item.id === product.id ? product : item)); notify("Product updated."); }} onDeleteProduct={(id) => { setProducts((current) => current.filter((item) => item.id !== id)); notify("Product deleted."); }} onDeleteUser={(id) => { setUsers((current) => current.filter((item) => item.id !== id)); notify("User removed."); }} onOrderStatus={(id, status) => { setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order)); notify("Order status updated."); }} onNavigate={navigate} />;
    if (route.name === "wishlist") {
      const saved = products.filter((product) => wishlist.includes(product.id));
      return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeader eyebrow="Wishlist" title="Saved products" subtitle="Keep products for later and add them to cart when ready." />{saved.length ? <ProductGrid products={saved} wishlist={wishlist} onView={(id) => navigate("product", id)} onAdd={addToCart} onWishlist={toggleWishlist} /> : <EmptyState title="No saved products" message="Save products from the listing page." action="Shop products" onAction={() => navigate("products")} />}</main>;
    }
    if (route.name === "order-summary") return <main className="mx-auto max-w-3xl px-4 py-20"><EmptyState title="Order placed" message="Your order is now visible in profile order history. Admins can update its status from the dashboard." action="View profile" onAction={() => navigate("profile")} /></main>;
    return <StaticPage type={route.name === "contact" ? "contact" : "about"} />;
  }

  return (
    <ShopContext.Provider value={shopContextValue}>
      <div className="min-h-screen bg-white text-slate-950">
        <Navbar route={route} cartCount={cartCount} user={user} onNavigate={navigate} onLogout={() => { setUser(null); notify("Logged out."); }} />
        {renderPage()}
        <Footer onNavigate={navigate} />
        {toast ? <Toast message={toast.message} type={toast.type} /> : null}
      </div>
    </ShopContext.Provider>
  );
}