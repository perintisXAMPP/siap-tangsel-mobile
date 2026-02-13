# SIAP Tangsel Mobile - Panduan Termux

Panduan lengkap untuk menginstal dan menjalankan SIAP Tangsel Mobile di Termux dengan script otomatis.

---

## 📋 Daftar Isi

1. [Persyaratan](#persyaratan)
2. [Instalasi Cepat](#instalasi-cepat)
3. [Instalasi Manual](#instalasi-manual)
4. [Menjalankan Server](#menjalankan-server)
5. [Akses dari Smartphone](#akses-dari-smartphone)
6. [Script Referensi](#script-referensi)
7. [Troubleshooting](#troubleshooting)

---

## 📱 Persyaratan

- **Smartphone dengan Termux** - Download dari [F-Droid](https://f-droid.org/packages/com.termux/) atau Google Play
- **Storage** - Minimal 500MB untuk dependencies
- **RAM** - Minimal 1GB (lebih baik 2GB+)
- **Database** - MySQL/TiDB yang accessible
- **Internet** - Untuk download dependencies

---

## ⚡ Instalasi Cepat (Recommended)

### Langkah 1: Buka Termux

Tap aplikasi Termux di smartphone Anda.

### Langkah 2: Download Project

```bash
# Clone dari GitHub
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile

# Atau extract dari ZIP
unzip siap-tangsel-mobile.zip
cd siap-tangsel-mobile
```

### Langkah 3: Jalankan Quick Start

```bash
bash quick-start.sh
```

Script ini akan:
- ✓ Update system packages
- ✓ Install dependencies (Node.js, npm, pnpm)
- ✓ Install project dependencies
- ✓ Setup environment configuration (interactive)
- ✓ Setup database (optional)
- ✓ Create startup scripts

**Waktu:** 10-20 menit (tergantung kecepatan internet)

### Langkah 4: Jalankan Server

```bash
./start-dev.sh
```

**Output yang diharapkan:**
```
Starting SIAP Tangsel Mobile...
Server running on http://localhost:3000/
```

### Langkah 5: Akses dari Smartphone

Di terminal baru (atau background):
```bash
./get-ip.sh
```

Buka browser: `http://YOUR_IP:3000`

---

## 🔧 Instalasi Manual

Jika quick-start tidak bekerja, ikuti langkah manual:

### Step 1: Update Termux

```bash
pkg update && pkg upgrade -y
```

### Step 2: Install Dependencies

```bash
pkg install -y git nodejs python3 build-essential curl wget
```

### Step 3: Install npm Tools

```bash
npm install -g pnpm yarn
```

### Step 4: Clone Project

```bash
cd ~
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile
```

### Step 5: Install Project Dependencies

```bash
pnpm install
```

### Step 6: Setup Environment

```bash
cp .env.example .env.local
nano .env.local
```

Edit dengan konfigurasi Anda:
```env
DATABASE_URL="mysql://user:pass@host:port/db"
VITE_APP_ID="your-app-id"
JWT_SECRET="generate-random-string"
OWNER_OPEN_ID="your-id"
OWNER_NAME="Your Name"
BUILT_IN_FORGE_API_KEY="your-key"
```

### Step 7: Setup Database

```bash
pnpm db:push
```

### Step 8: Jalankan Server

```bash
npm run dev
```

---

## 🚀 Menjalankan Server

### Development Mode (dengan hot-reload)

```bash
./start-dev.sh
```

**Keuntungan:**
- Auto-reload saat ada perubahan code
- Detailed error messages
- Cocok untuk development

### Production Mode (optimized)

```bash
pnpm build
./start-prod.sh
```

**Keuntungan:**
- Lebih cepat
- Lebih hemat memory
- Cocok untuk production

### Background Mode (tidak close saat exit terminal)

```bash
./start-bg.sh
```

**Untuk melihat log:**
```bash
./view-logs.sh
```

**Untuk stop server:**
```bash
pkill -f "npm run dev"
```

---

## 📱 Akses dari Smartphone

### Cara 1: Menggunakan Script

```bash
./get-ip.sh
```

Output:
```
Your IP address:
192.168.1.105
```

Buka browser: `http://192.168.1.105:3000`

### Cara 2: Manual

Di Termux:
```bash
ifconfig
```

Cari IP yang dimulai dengan `192.168.x.x` atau `10.x.x.x`

Contoh output:
```
inet 192.168.1.105 netmask 255.255.255.0
```

Buka browser: `http://192.168.1.105:3000`

### Cara 3: Menggunakan Hostname

Jika di network yang sama:
```bash
http://termux.local:3000
```

---

## 📚 Script Referensi

### Startup Scripts

| Script | Fungsi | Perintah |
|--------|--------|---------|
| `start-dev.sh` | Development mode | `./start-dev.sh` |
| `start-prod.sh` | Production mode | `./start-prod.sh` |
| `start-bg.sh` | Background mode | `./start-bg.sh` |

### Utility Scripts

| Script | Fungsi | Perintah |
|--------|--------|---------|
| `get-ip.sh` | Tampilkan IP | `./get-ip.sh` |
| `view-logs.sh` | Lihat log | `./view-logs.sh` |
| `backup-db.sh` | Backup database | `./backup-db.sh` |

### npm Commands

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Development server |
| `npm run build` | Build project |
| `npm start` | Production server |
| `npm test` | Run tests |
| `pnpm db:push` | Database migration |

---

## 🐛 Troubleshooting

### Error: "Connection Refused"

**Penyebab:** Server tidak berjalan atau IP salah

**Solusi:**
```bash
# Verifikasi server berjalan
netstat -tuln | grep 3000

# Cek IP
./get-ip.sh

# Pastikan smartphone dan Termux di WiFi yang sama
```

### Error: "Database Connection Failed"

**Penyebab:** DATABASE_URL salah atau database tidak accessible

**Solusi:**
```bash
# Edit .env.local
nano .env.local

# Test koneksi
mysql -u username -p -h hostname

# Jalankan migration
pnpm db:push
```

### Error: "Module Not Found"

**Penyebab:** Dependencies tidak terinstall dengan benar

**Solusi:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Port 3000 Already in Use"

**Penyebab:** Port 3000 sudah digunakan

**Solusi:**
```bash
# Edit .env.local
nano .env.local

# Ubah PORT
PORT="3001"

# Jalankan server
./start-dev.sh
```

### Error: "Out of Memory"

**Penyebab:** Node.js memerlukan terlalu banyak memory

**Solusi:**
```bash
# Edit script startup
nano start-dev.sh

# Ubah memory limit
NODE_OPTIONS="--max-old-space-size=256" npm run dev
```

### Server Crash atau Hang

**Solusi:**
```bash
# Restart server
pkill -f "npm run dev"
./start-dev.sh

# Atau dengan memory optimization
NODE_OPTIONS="--max-old-space-size=256" npm run dev
```

---

## 💡 Tips & Tricks

### 1. Persistent Session dengan tmux

```bash
pkg install tmux

# Start server di background
tmux new-session -d -s siap "./start-dev.sh"

# Attach ke session
tmux attach -t siap

# Detach: Ctrl+B, D
```

### 2. Monitor Resource Usage

```bash
top
```

Tekan `q` untuk exit.

### 3. Check Network

```bash
netstat -tuln | grep 3000
```

### 4. View System Info

```bash
uname -a
free -h
df -h
```

### 5. SSH Access (Advanced)

```bash
pkg install openssh
sshd

# Dari PC
ssh -p 8022 user@localhost
```

### 6. Keep Awake

Jika Termux sering sleep:
```bash
# Settings > Display > Screen timeout > Never
```

---

## 🔐 Keamanan

### Production Checklist

- [ ] Ubah JWT_SECRET dengan random string yang kuat
- [ ] Gunakan strong password untuk database
- [ ] Backup database secara regular
- [ ] Jangan expose ke internet publik (hanya lokal network)
- [ ] Update dependencies secara berkala

### Backup Database

```bash
./backup-db.sh
```

Backup akan tersimpan di folder `backups/`

### Restore Database

```bash
mysql -u username -p database_name < backups/siap_tangsel_20260213_143022.sql
```

---

## 📞 Support & Resources

- **Manus Docs** - https://manus.im/docs
- **Termux Docs** - https://termux.dev
- **Node.js Docs** - https://nodejs.org/docs
- **MySQL Docs** - https://dev.mysql.com/doc

---

## 📝 Changelog

### v1.0 (13 Feb 2026)
- Initial release
- Quick start script
- Full Termux support
- Comprehensive documentation

---

**Terakhir diupdate:** 13 Februari 2026  
**Status:** Production Ready ✓
