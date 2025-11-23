☕ Project Roadmap: Modern Aesthetic Cafe AppStatus: Planning PhaseTech Stack: Next.js 15, TypeScript, Tailwind v4, Neon DB (Drizzle), Better Auth, Cloudflare R2, OpenAI, Polar.sh.🏗️ Phase 1: Inisialisasi & Setup DasarFase ini membangun pondasi aplikasi agar stabil dan siap dikembangkan.[ ] Project Setup[ ] Initialize Next.js 15 app: npx create-next-app@latest --typescript --eslint --tailwind[ ] Upgrade/Verify Tailwind CSS v4 setup.[ ] Install shadcn/ui CLI dan init components dasar (Button, Input, Card, Dialog, Sheet).[ ] Install lucide-react untuk ikon minimalist.[ ] Konfigurasi next.config.ts untuk optimasi image domain (Cloudflare R2).[ ] Database Setup (Neon + Drizzle ORM)[ ] Setup akun Neon PostgreSQL.[ ] Install drizzle-orm dan drizzle-kit.[ ] Konfigurasi drizzle.config.ts dan connection string.[ ] Schema Design (v1):users: ID, name, email, role (admin/user), image.categories: ID, name, slug (e.g., "Coffee", "Pastry").products: ID, name, description, price, image_url, category_id, is_available.orders: ID, user_id, status (pending/paid/completed), total_amount, payment_id (Polar).reservations: ID, name, email, date, time, pax, status, notes.[ ] Authentication (Better Auth v1.2.8)[ ] Install & Config Better Auth.[ ] Setup Google OAuth & Email/Password provider.[ ] Implementasi Role Based Access Control (RBAC): Pastikan ada flag role: 'admin' | 'user'.[ ] Buat Middleware untuk memproteksi route /admin.🎨 Phase 2: Public Frontend (Modern Aesthetic)Fokus pada UI/UX yang clean, tipografi yang bagus, dan animasi halus.[ ] Global Styling & Layout[ ] Define color palette (Warm Neutrals: Cream, Earthy Brown, Sage Green) di globals.css.[ ] Setup font: Gunakan font serif modern (e.g., Playfair Display) untuk heading dan sans-serif (Inter/Geist) untuk body.[ ] Buat Navbar (Responsive dengan Hamburger menu untuk mobile).[ ] Buat Footer dengan link sosmed dan info alamat.[ ] Homepage (Landing Page)[ ] Hero Section: Full-screen image/video background dengan overlay text estetik & CTA "Order Now".[ ] Our Story: Layout grid asimetris (teks kiri, gambar kanan) menceritakan filosofi cafe.[ ] Featured Menu: Carousel atau Grid menampilkan menu andalan.[ ] Testimonials: Card minimalis horizontal scroll.[ ] Menu Page (Catalog)[ ] Fetch data produk dari Database (Server Component).[ ] Filter Logic: Filter berdasarkan kategori (Coffee, Non-Coffee, Food).[ ] Product Card: Tampilkan foto, nama, harga, dan tombol "Add to Cart".[ ] Implementasi Search bar dengan debounce.[ ] Reservation Page[ ] Form UI menggunakan react-hook-form + zod validation.[ ] Input: Nama, No WA, Tanggal, Jam, Jumlah Orang.[ ] Logic: Cek ketersediaan slot (opsional: validasi sederhana dulu).🛠️ Phase 3: Admin Panel (CMS)Dashboard untuk mengatur konten tanpa menyentuh kode.[ ] Admin Layout[ ] Sidebar Navigation (Dashboard, Products, Orders, Reservations, Settings).[ ] Proteksi route: Hanya user dengan role admin yang bisa akses.[ ] Product Management (CRUD)[ ] List: Table view dengan pagination.[ ] Create/Edit Form:Input Nama, Harga, Deskripsi.Image Upload: Integrasi Cloudflare R2.Logic: Upload file ke R2 -> Dapatkan Public URL -> Simpan URL ke Database.[ ] Delete: Soft delete atau hard delete produk.[ ] Reservation Management[ ] Tampilkan list reservasi masuk.[ ] Action buttons: "Approve" (Kirim email konfirmasi) atau "Reject".[ ] AI Content Generator (OpenAI SDK)[ ] Fitur di form "Add Product": Tombol "Generate Description".[ ] Logic: Kirim nama produk ke OpenAI -> Terima deskripsi estetik -> Auto-fill ke text area.💳 Phase 4: Cart & Payments (Polar.sh)Implementasi alur pembelian.[ ] Shopping Cart[ ] State management (Zustand atau React Context) untuk menyimpan item di keranjang.[ ] UI: Slide-over sheet dari kanan saat klik icon cart.[ ] Checkout Process[ ] Integrasi Polar.sh API.[ ] Logic:User klik Checkout.Create Checkout session di Polar.Redirect user ke halaman pembayaran Polar.Webhook: Setup webhook handler untuk menangkap event payment.succeeded -> Update status order di database Neon menjadi 'Paid'.📊 Phase 5: Analytics & OptimizationMengukur performa aplikasi.[ ] Analytics (PostHog)[ ] Install PostHog SDK.[ ] Setup custom events: "View Menu", "Add to Cart", "Complete Reservation".[ ] Buat Dashboard sederhana di PostHog untuk melihat traffic.[ ] Performance & SEO[ ] Generate Metadata dinamis untuk setiap halaman (Open Graph images).[ ] Pastikan semua image menggunakan next/image dengan properti blurDataURL.[ ] Implementasi React.Suspense untuk loading state yang smooth (Skeleton UI).🚀 Phase 6: Deployment[ ] Push code ke GitHub.[ ] Connect repo ke Vercel.[ ] Konfigurasi Environment Variables di Vercel:DATABASE_URLBETTER_AUTH_SECRETR2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEYOPENAI_API_KEYPOLAR_ACCESS_TOKEN[ ] Final Test di production URL.📂 Usulan Struktur Folder (App Router)src/
├── app/
│   ├── (auth)/             # Route group untuk login/register
│   │   ├── login/
│   │   └── register/
│   ├── (public)/           # Route public (Landing, Menu)
│   │   ├── page.tsx
│   │   ├── menu/
│   │   └── contact/
│   ├── admin/              # Route admin (Protected)
│   │   ├── layout.tsx      # Admin Sidebar
│   │   ├── products/
│   │   └── reservations/
│   ├── api/                # API Routes (Webhooks, Upload)
│   │   ├── webhooks/
│   │   │   └── polar/
│   │   └── upload/
│   └── layout.tsx
├── components/
│   ├── ui/                 # Shadcn components
│   ├── features/           # Components spesifik (MenuGrid, CartSheet)
│   └── layout/             # Navbar, Footer, Sidebar
├── db/
│   ├── schema.ts           # Drizzle schema
│   └── index.ts            # DB connection
├── lib/
│   ├── auth.ts             # Better Auth config
│   ├── s3.ts               # R2 Cloudflare config
│   ├── openai.ts           # OpenAI helper
│   └── utils.ts
└── styles/
    └── globals.css
