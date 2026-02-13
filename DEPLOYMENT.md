# SIAP Tangsel Mobile - Deployment Guide

## Panduan Lengkap Menjalankan Server di Termux dan Akses via Localhost

Dokumen ini menjelaskan cara menginstal, mengkonfigurasi, dan menjalankan aplikasi SIAP Tangsel Mobile di Termux dengan akses via localhost di smartphone.

---

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Smartphone dengan Termux** - Aplikasi Termux sudah terinstal dari F-Droid atau Google Play Store
- **Koneksi Internet** - WiFi atau mobile data untuk download dependencies
- **Node.js & npm** - Akan diinstal otomatis melalui script
- **MySQL/TiDB Database** - Akun database sudah siap (bisa di cloud atau lokal)
- **Manus Account** - Untuk OAuth dan API keys

---

## Instalasi di Termux

### Langkah 1: Persiapan Awal

Buka Termux dan jalankan perintah untuk update sistem:

```bash
pkg update && pkg upgrade -y
```

### Langkah 2: Install Dependencies Utama

Termux memerlukan beberapa package sistem sebelum Node.js:

```bash
pkg install -y git nodejs python3 build-essential
```

### Langkah 3: Clone atau Download Project

Pilih salah satu metode:

**Opsi A: Clone dari GitHub (jika sudah di-push)**
```bash
cd ~
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile
```

**Opsi B: Download ZIP dan Extract**
```bash
cd ~
# Download file ZIP dari Manus atau GitHub
unzip siap-tangsel-mobile.zip
cd siap-tangsel-mobile
```

### Langkah 4: Install Dependencies Project

```bash
npm install
# atau jika menggunakan pnpm
npm install -g pnpm
pnpm install
```

### Langkah 5: Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```bash
nano .env.local
```

Isi dengan konfigurasi berikut (sesuaikan dengan akun Anda):

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/siap_tangsel"

# Manus OAuth
VITE_APP_ID="your-manus-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# JWT Secret (generate random string)
JWT_SECRET="your-random-jwt-secret-key-min-32-chars"

# Owner Information
OWNER_OPEN_ID="your-open-id"
OWNER_NAME="Admin Name"

# Manus APIs
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-forge-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-forge-api-key"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# App Configuration
VITE_APP_TITLE="SIAP Tangsel Mobile"
VITE_APP_LOGO="/logo.png"

# Termux Specific
NODE_ENV="development"
HOST="0.0.0.0"
PORT="3000"
```

Tekan `Ctrl+X`, kemudian `Y`, lalu `Enter` untuk menyimpan.

### Langkah 6: Setup Database

Jika menggunakan MySQL lokal di Termux:

```bash
pkg install -y mysql
mysqld_safe &
```

Atau jika menggunakan cloud database (recommended), pastikan connection string sudah benar di `.env.local`.

Jalankan migration database:

```bash
npm run db:push
```

---

## Menjalankan Server

### Opsi 1: Development Mode (dengan auto-reload)

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Opsi 2: Production Mode

```bash
npm run build
npm run start
```

---

## Akses via Localhost dari Smartphone

### Langkah 1: Temukan IP Address Termux

Di Termux, jalankan:

```bash
ifconfig
# atau
ip addr show
```

Cari IP address yang dimulai dengan `192.168.x.x` atau `10.x.x.x` (jangan gunakan `127.0.0.1`).

Contoh output:
```
inet 192.168.1.105 netmask 255.255.255.0 broadcast 192.168.1.255
```

IP address Anda: `192.168.1.105`

### Langkah 2: Akses dari Browser Smartphone

Buka browser di smartphone (Chrome, Firefox, atau browser lainnya) dan masukkan:

```
http://192.168.1.105:3000
```

Ganti `192.168.1.105` dengan IP address Termux Anda.

### Langkah 3: Login dengan Manus OAuth

Klik tombol "Login" dan ikuti flow OAuth Manus untuk autentikasi.

---

## Troubleshooting

### Masalah: "Connection Refused" saat akses dari smartphone

**Solusi:**
1. Pastikan server Termux masih berjalan (lihat output di terminal)
2. Verifikasi IP address yang benar dengan `ifconfig`
3. Pastikan smartphone dan Termux device terhubung ke WiFi yang sama
4. Cek firewall - buka port 3000 jika ada firewall aktif

### Masalah: Database Connection Error

**Solusi:**
1. Verifikasi `DATABASE_URL` di `.env.local` sudah benar
2. Pastikan database server berjalan (jika lokal)
3. Test koneksi database dengan `mysql -u username -p -h hostname`

### Masalah: Module Not Found atau Dependencies Error

**Solusi:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Masalah: Port 3000 Sudah Digunakan

**Solusi:**
Ubah port di `.env.local`:
```env
PORT="3001"
```

Kemudian akses `http://192.168.1.105:3001`

---

## Optimasi untuk Termux

### 1. Hemat Resource

Termux memiliki keterbatasan resource. Untuk performa optimal:

```bash
# Jalankan dengan memory optimization
NODE_OPTIONS="--max-old-space-size=512" npm run dev
```

### 2. Background Process (Optional)

Untuk menjalankan server di background:

```bash
nohup npm run dev > server.log 2>&1 &
```

Lihat log:
```bash
tail -f server.log
```

### 3. Auto-start Script

Buat file `start-server.sh`:

```bash
#!/bin/bash
cd ~/siap-tangsel-mobile
NODE_ENV=development NODE_OPTIONS="--max-old-space-size=512" npm run dev
```

Buat executable:
```bash
chmod +x start-server.sh
```

Jalankan:
```bash
./start-server.sh
```

---

## Fitur yang Tersedia

Setelah server berjalan, Anda dapat mengakses:

| Fitur | URL | Deskripsi |
|-------|-----|-----------|
| Dashboard | `/` | Halaman utama dengan statistik agenda dan disposisi |
| Agenda Management | `/agendas` | CRUD manajemen agenda protokoler |
| Dispositions | `/dispositions` | Tracking dan approval workflow disposisi |
| Documents | `/documents` | Upload dan download dokumen pendukung |
| Notifications | `/notifications` | Pusat notifikasi email dan system |
| Admin Settings | `/admin/settings` | Pengaturan sistem (admin only) |

---

## Keamanan

### Rekomendasi Keamanan untuk Production

1. **Gunakan HTTPS** - Setup reverse proxy dengan SSL certificate
2. **Ubah JWT_SECRET** - Generate random string yang kuat (minimum 32 karakter)
3. **Restrict Network Access** - Jangan expose port 3000 ke internet publik
4. **Database Security** - Gunakan strong password dan restrict access
5. **Environment Variables** - Jangan commit `.env.local` ke repository

### Setup HTTPS dengan Reverse Proxy

Untuk production, gunakan nginx atau Apache sebagai reverse proxy:

```bash
pkg install -y nginx
```

Konfigurasi nginx untuk proxy ke localhost:3000 dengan SSL.

---

## Maintenance

### Update Dependencies

```bash
npm update
```

### Database Backup

```bash
mysqldump -u username -p database_name > backup.sql
```

### Clear Cache & Rebuild

```bash
rm -rf dist build .next
npm run build
```

---

## Support & Resources

- **Manus Documentation** - https://manus.im/docs
- **Termux Documentation** - https://termux.dev
- **Node.js Documentation** - https://nodejs.org/docs
- **MySQL Documentation** - https://dev.mysql.com/doc

---

## Checklist Deployment

Sebelum go-live, pastikan:

- [ ] `.env.local` sudah dikonfigurasi dengan benar
- [ ] Database sudah di-setup dan migration selesai
- [ ] Server berjalan tanpa error di Termux
- [ ] Dapat diakses dari smartphone via localhost
- [ ] OAuth login berfungsi dengan baik
- [ ] Email notifications terkirim
- [ ] File upload ke S3 berfungsi
- [ ] Semua fitur CRUD agenda dan disposisi berfungsi
- [ ] Responsive design optimal di mobile
- [ ] Backup database sudah dibuat

---

**Terakhir diupdate:** 13 Februari 2026  
**Versi:** 1.0  
**Status:** Production Ready
