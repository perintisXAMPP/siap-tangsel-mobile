# SIAP Tangsel Mobile - Panduan Setup Termux

Panduan lengkap untuk menginstal dan menjalankan SIAP Tangsel Mobile di Termux dengan akses via localhost dari smartphone.

---

## Persyaratan

- **Smartphone dengan Termux** - Download dari [F-Droid](https://f-droid.org/packages/com.termux/) atau Google Play Store
- **Koneksi Internet** - WiFi atau mobile data untuk download dependencies
- **Storage** - Minimal 500MB untuk dependencies dan project
- **Database** - MySQL/TiDB yang accessible (bisa di cloud atau lokal)

---

## Langkah 1: Persiapan Awal di Termux

### 1.1 Buka Termux

Tap aplikasi Termux di smartphone Anda.

### 1.2 Update Sistem

```bash
pkg update && pkg upgrade -y
```

Ini akan memperbarui semua package manager Termux. Tunggu hingga selesai.

### 1.3 Konfigurasi Storage (Opsional)

Untuk akses ke storage smartphone:

```bash
termux-setup-storage
```

Izinkan akses storage ketika diminta.

---

## Langkah 2: Download Project

### Opsi A: Clone dari GitHub

```bash
cd ~
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile
```

### Opsi B: Download dari Manus

1. Download file ZIP dari Manus Management UI
2. Extract ke home directory:

```bash
cd ~
unzip siap-tangsel-mobile.zip
cd siap-tangsel-mobile
```

---

## Langkah 3: Instalasi Otomatis

Jalankan script instalasi yang sudah disiapkan:

```bash
chmod +x termux-install.sh
./termux-install.sh
```

Script ini akan:
- Update system packages
- Install Node.js, npm, pnpm
- Install project dependencies
- Setup database
- Build project
- Create startup script

**Waktu instalasi:** 10-20 menit (tergantung kecepatan internet)

---

## Langkah 4: Konfigurasi Environment

Setelah instalasi, edit file `.env.local`:

```bash
nano .env.local
```

Update dengan konfigurasi Anda:

```env
# Database (WAJIB)
DATABASE_URL="mysql://username:password@host:port/database"

# Manus OAuth (WAJIB)
VITE_APP_ID="your-app-id-dari-manus"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# JWT Secret (WAJIB - generate random string)
JWT_SECRET="generate-random-string-min-32-chars"

# Owner Info (WAJIB)
OWNER_OPEN_ID="your-open-id"
OWNER_NAME="Your Name"

# API Keys (WAJIB)
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-key"

# Optional
VITE_APP_TITLE="SIAP Tangsel Mobile"
VITE_APP_LOGO="/logo.png"
```

**Tips:**
- Generate JWT_SECRET: `openssl rand -base64 32`
- Dapatkan API keys dari Manus Dashboard
- Pastikan DATABASE_URL accessible dari Termux

---

## Langkah 5: Menjalankan Server

### Cara 1: Menggunakan Script Startup

```bash
./start-server.sh
```

### Cara 2: Manual

```bash
npm run dev
```

**Output yang diharapkan:**
```
[2026-02-13T...] Server running on http://localhost:3000/
```

---

## Langkah 6: Akses dari Smartphone

### 6.1 Temukan IP Address Termux

Di terminal Termux, jalankan:

```bash
ifconfig
```

Cari IP yang dimulai dengan `192.168.x.x` atau `10.x.x.x`. Contoh:
```
inet 192.168.1.105 netmask 255.255.255.0
```

IP Anda: **192.168.1.105**

### 6.2 Buka di Browser

Di browser smartphone (Chrome, Firefox, dll), buka:

```
http://192.168.1.105:3000
```

Ganti `192.168.1.105` dengan IP Anda.

### 6.3 Login

Klik "Login" dan ikuti flow OAuth Manus.

---

## Troubleshooting

### Error: "Connection Refused"

**Solusi:**
1. Pastikan server masih berjalan di Termux
2. Verifikasi IP address dengan `ifconfig`
3. Pastikan smartphone dan Termux di WiFi yang sama
4. Coba ping: `ping 192.168.1.105` (dari smartphone)

### Error: "Database Connection Failed"

**Solusi:**
1. Verifikasi DATABASE_URL di `.env.local`
2. Test koneksi: `mysql -u username -p -h hostname`
3. Pastikan database server berjalan
4. Check firewall rules

### Error: "Module Not Found"

**Solusi:**
```bash
rm -rf node_modules package-lock.json
pnpm install
```

### Port 3000 Sudah Digunakan

**Solusi:**
Edit `.env.local`:
```env
PORT="3001"
```

Akses: `http://192.168.1.105:3001`

### Server Crash atau Hang

**Solusi:**
Jalankan dengan memory optimization:
```bash
NODE_OPTIONS="--max-old-space-size=256" npm run dev
```

---

## Optimasi untuk Termux

### 1. Hemat Memory

Termux memiliki keterbatasan resource. Gunakan:

```bash
NODE_OPTIONS="--max-old-space-size=512" npm run dev
```

Sesuaikan `512` dengan available memory di smartphone Anda.

### 2. Background Process

Untuk menjalankan server di background:

```bash
nohup npm run dev > server.log 2>&1 &
```

Lihat log:
```bash
tail -f server.log
```

### 3. Auto-start pada Termux Launch

Buat file `~/.termux/boot/start-server`:

```bash
#!/bin/bash
cd ~/siap-tangsel-mobile
npm run dev
```

Buat executable:
```bash
chmod +x ~/.termux/boot/start-server
```

---

## Fitur yang Tersedia

Setelah server berjalan, akses:

| Fitur | URL | Deskripsi |
|-------|-----|-----------|
| Dashboard | `/dashboard` | Statistik agenda dan disposisi |
| Agendas | `/agendas` | Manajemen agenda protokoler |
| Dispositions | `/dispositions` | Tracking disposisi dokumen |
| Notifications | `/notifications` | Pusat notifikasi |

---

## Maintenance

### Update Dependencies

```bash
pnpm update
```

### Database Backup

```bash
mysqldump -u username -p database_name > backup.sql
```

### Clear Cache

```bash
rm -rf dist build .next
pnpm build
```

### Stop Server

Di terminal Termux: `Ctrl+C`

---

## Tips & Tricks

### 1. Persistent Terminal Session

Gunakan `tmux` atau `screen`:

```bash
pkg install tmux
tmux new-session -d -s siap "npm run dev"
tmux attach -t siap
```

### 2. Monitor Resource Usage

```bash
top
```

### 3. Check Network

```bash
netstat -tuln | grep 3000
```

### 4. SSH Access (Advanced)

Install SSH server:
```bash
pkg install openssh
sshd
```

Akses dari PC:
```bash
ssh -p 8022 user@localhost
```

---

## Keamanan

### Production Deployment

Untuk production di Termux:

1. **Gunakan HTTPS** - Setup reverse proxy dengan SSL
2. **Ubah JWT_SECRET** - Generate random string yang kuat
3. **Restrict Network** - Jangan expose ke internet publik
4. **Database Security** - Gunakan strong password
5. **Backup Regular** - Backup database setiap hari

### Firewall

Jika ada firewall, buka port 3000:

```bash
# Hanya untuk testing lokal
# Jangan expose ke internet publik
```

---

## Support & Resources

- **Manus Docs** - https://manus.im/docs
- **Termux Docs** - https://termux.dev
- **Node.js Docs** - https://nodejs.org/docs
- **MySQL Docs** - https://dev.mysql.com/doc

---

## Checklist Sebelum Go-Live

- [ ] Termux sudah terinstall di smartphone
- [ ] Dependencies sudah terinstall
- [ ] `.env.local` sudah dikonfigurasi
- [ ] Database sudah setup dan accessible
- [ ] Server berjalan tanpa error
- [ ] Dapat diakses dari smartphone via localhost
- [ ] OAuth login berfungsi
- [ ] Dashboard menampilkan data dengan benar
- [ ] CRUD agenda berfungsi
- [ ] Disposisi workflow berfungsi
- [ ] Email notifications terkirim
- [ ] File upload ke S3 berfungsi

---

**Terakhir diupdate:** 13 Februari 2026  
**Versi:** 1.0  
**Status:** Production Ready
