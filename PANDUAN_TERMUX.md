# 📱 Panduan Lengkap - Membuka SIAP Tangsel Mobile di Termux

Panduan step-by-step untuk membuka dan menjalankan aplikasi SIAP Tangsel Mobile di smartphone Anda menggunakan Termux.

---

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Download & Setup](#download--setup)
3. [Instalasi Otomatis (Recommended)](#instalasi-otomatis-recommended)
4. [Menjalankan Server](#menjalankan-server)
5. [Akses Aplikasi](#akses-aplikasi)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Persiapan Awal

### Step 1: Download Termux

**Di smartphone Anda:**

1. Buka **Google Play Store** atau **F-Droid**
2. Cari: **"Termux"**
3. Tap **Install**
4. Tunggu hingga selesai

**Alternatif F-Droid (Recommended):**
- Kunjungi: https://f-droid.org/packages/com.termux/
- Tap **Install**

### Step 2: Buka Termux

Tap ikon Termux di home screen smartphone Anda.

**Tampilan awal:**
```
Welcome to Termux!

Wiki:            https://wiki.termux.com
Community forum: https://termux.com/community
Gitter chat:     https://gitter.im/termux/termux
IRC channel:     irc.libera.chat #termux

Help:            man help

$
```

### Step 3: Persiapkan Storage

Di Termux, jalankan:

```bash
termux-setup-storage
```

**Output:**
```
Allow Termux to access photos, media, and files on your device? [Y/n]
```

Ketik: `Y` dan tekan **Enter**

---

## 📥 Download & Setup

### Step 1: Update Termux

```bash
pkg update && pkg upgrade -y
```

**Waktu:** 2-5 menit

**Output yang diharapkan:**
```
Reading package lists... Done
Building dependency tree... Done
Calculating the upgrade... Done
...
Done.
```

### Step 2: Download Project

**Opsi A: Dari GitHub (Recommended)**

```bash
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile
```

**Opsi B: Dari ZIP File**

Jika sudah punya file ZIP:

```bash
# Pindahkan ZIP ke Termux storage
# Kemudian extract:
unzip siap-tangsel-mobile.zip
cd siap-tangsel-mobile
```

### Step 3: Verifikasi Project

```bash
ls -la
```

**Output yang diharapkan:**
```
total 256
drwxr-xr-x  install.sh
drwxr-xr-x  quick-start.sh
drwxr-xr-x  package.json
drwxr-xr-x  client/
drwxr-xr-x  server/
drwxr-xr-x  drizzle/
...
```

---

## ⚡ Instalasi Otomatis (Recommended)

### Step 1: Jalankan Quick Start Script

```bash
bash quick-start.sh
```

**Waktu:** 15-25 menit

### Step 2: Ikuti Pertanyaan Interaktif

Script akan menanyakan beberapa konfigurasi:

**Pertanyaan 1: Install system packages?**
```
⚠ Install system packages? (pkg update, build-essential, etc) (y/n): y
```
Ketik: `y` dan tekan **Enter**

**Pertanyaan 2: Install npm tools?**
```
⚠ Install npm tools (pnpm, yarn)? (y/n): y
```
Ketik: `y` dan tekan **Enter**

**Pertanyaan 3: Database URL**
```
🟡 Database URL [mysql://root:password@localhost:3306/siap_tangsel]: 
```

Ketik database URL Anda atau tekan **Enter** untuk default.

**Pertanyaan 4: Manus App ID**
```
🟡 Manus App ID [your-app-id]: 
```

Masukkan App ID dari Manus Dashboard.

**Pertanyaan 5: JWT Secret**
```
🟡 JWT Secret (or press Enter to generate) []: 
```

Tekan **Enter** untuk auto-generate.

**Pertanyaan 6: Owner Open ID**
```
🟡 Owner Open ID [your-open-id]: 
```

Masukkan Open ID dari Manus.

**Pertanyaan 7: Owner Name**
```
🟡 Owner Name [Administrator]: 
```

Ketik nama atau tekan **Enter** untuk default.

**Pertanyaan 8: Forge API Key**
```
🟡 Forge API Key [your-api-key]: 
```

Masukkan API Key dari Manus.

**Pertanyaan 9: Setup database now?**
```
⚠ Setup database now? (requires MySQL/TiDB to be running) (y/n): 
```

Ketik `y` jika database sudah siap, atau `n` untuk skip.

### Step 3: Tunggu Instalasi Selesai

Script akan:
- ✓ Update system packages
- ✓ Install Node.js, npm, pnpm
- ✓ Install project dependencies
- ✓ Create .env.local
- ✓ Setup database (optional)
- ✓ Create startup scripts

**Tampilan akhir:**
```
╔════════════════════════════════════════════════════════════════╗
║          Installation Complete! ✓                             ║
╚════════════════════════════════════════════════════════════════╝

SIAP Tangsel Mobile has been successfully installed!
```

---

## 🚀 Menjalankan Server

### Step 1: Jalankan Development Server

```bash
./start-dev.sh
```

**Output yang diharapkan:**
```
Starting SIAP Tangsel Mobile (Development Mode)...
Server will run on http://0.0.0.0:3000

[2026-02-13T14:30:00.000Z] Server running on http://localhost:3000/
[2026-02-13T14:30:02.000Z] [OAuth] Initialized with baseURL: https://api.manus.im
```

**Artinya:** Server sudah berjalan! ✓

### Step 2: Biarkan Server Berjalan

Jangan tutup terminal ini. Server akan terus berjalan.

**Tips:** Jika ingin menggunakan terminal untuk hal lain, buka terminal baru dengan:
- Tap tombol **≡** (menu) di Termux
- Pilih **New Session**

---

## 📱 Akses Aplikasi

### Step 1: Buka Terminal Baru

Di Termux, buka terminal baru:
- Tap tombol **≡** (menu)
- Pilih **New Session**

### Step 2: Dapatkan IP Address

```bash
./get-ip.sh
```

**Output:**
```
Finding your Termux IP address...

192.168.1.105

Use this IP to access from smartphone:
http://192.168.1.105:3000
```

### Step 3: Buka Browser

1. Buka browser di smartphone (Chrome, Firefox, dll)
2. Di address bar, ketik: `http://192.168.1.105:3000`
3. Tekan **Enter**

**Catatan:** Ganti `192.168.1.105` dengan IP yang Anda dapatkan dari `./get-ip.sh`

### Step 4: Lihat Aplikasi

Anda akan melihat halaman login SIAP Tangsel Mobile dengan desain cyberpunk:
- Background hitam dengan grid pattern
- Teks neon pink dan cyan
- HUD-style borders

---

## 🔐 Login & Mulai Gunakan

### Step 1: Login dengan Manus OAuth

1. Di halaman login, klik tombol **"Login dengan Manus"**
2. Anda akan diarahkan ke halaman Manus OAuth
3. Masukkan credentials Manus Anda
4. Klik **Authorize**

### Step 2: Dashboard

Setelah login, Anda akan melihat Dashboard dengan:
- Statistik Agenda
- Statistik Disposisi
- Upcoming Events

### Step 3: Buat Agenda Pertama

1. Klik menu **Agenda**
2. Klik tombol **"Buat Agenda Baru"**
3. Isi form:
   - Judul Agenda
   - Deskripsi
   - Tanggal & Waktu
   - Lokasi
   - Peserta
4. Klik **Simpan**

### Step 4: Buat Disposisi

1. Klik menu **Disposisi**
2. Klik tombol **"Buat Disposisi Baru"**
3. Isi form dan klik **Simpan**

---

## 💾 Menyimpan & Backup

### Backup Database

```bash
./backup-db.sh
```

**Output:**
```
Backing up database: siap_tangsel
✓ Backup completed: backups/siap_tangsel_20260213_143022.sql
```

### Melihat Backup

```bash
ls -la backups/
```

---

## 🛑 Menghentikan Server

### Cara 1: Langsung di Terminal Server

Di terminal yang menjalankan server, tekan:
```
Ctrl + C
```

### Cara 2: Dari Terminal Lain

```bash
pkill -f "npm run dev"
```

---

## 🔄 Menjalankan Ulang Server

### Setelah Berhenti

```bash
./start-dev.sh
```

### Background Mode (Tidak Close saat Exit Terminal)

```bash
./start-bg.sh
```

**Untuk melihat log:**
```bash
./view-logs.sh
```

---

## 🐛 Troubleshooting

### Problem 1: "Connection Refused" saat buka browser

**Penyebab:** Server tidak berjalan atau IP salah

**Solusi:**
```bash
# 1. Cek apakah server berjalan
netstat -tuln | grep 3000

# 2. Dapatkan IP yang benar
./get-ip.sh

# 3. Pastikan smartphone dan Termux di WiFi yang sama
```

### Problem 2: "Database Connection Failed"

**Penyebab:** DATABASE_URL salah atau database tidak accessible

**Solusi:**
```bash
# 1. Edit .env.local
nano .env.local

# 2. Verifikasi DATABASE_URL
# 3. Test koneksi database
mysql -u username -p -h hostname

# 4. Jalankan migrations
pnpm db:push
```

### Problem 3: "Module Not Found"

**Penyebab:** Dependencies tidak terinstall dengan benar

**Solusi:**
```bash
# 1. Hapus node_modules
rm -rf node_modules pnpm-lock.yaml

# 2. Install ulang
pnpm install

# 3. Jalankan server
./start-dev.sh
```

### Problem 4: "Out of Memory"

**Penyebab:** Smartphone memory terbatas

**Solusi:**
```bash
# 1. Edit start-dev.sh
nano start-dev.sh

# 2. Ubah memory limit dari 512 ke 256:
# NODE_OPTIONS="--max-old-space-size=256" npm run dev

# 3. Jalankan ulang
./start-dev.sh
```

### Problem 5: "Port 3000 Already in Use"

**Penyebab:** Port 3000 sudah digunakan

**Solusi:**
```bash
# 1. Edit .env.local
nano .env.local

# 2. Ubah PORT:
# PORT="3001"

# 3. Jalankan server
./start-dev.sh
```

---

## 📊 Monitoring Server

### Melihat Log Real-time

```bash
./view-logs.sh
```

### Check Resource Usage

```bash
top
```

Tekan `q` untuk exit.

### Check Network

```bash
netstat -tuln | grep 3000
```

---

## 💡 Tips & Tricks

### 1. Persistent Session dengan tmux

```bash
# Install tmux
pkg install tmux

# Start server di background
tmux new-session -d -s siap "./start-dev.sh"

# Attach ke session
tmux attach -t siap

# Detach: Ctrl+B, D
```

### 2. Keep Termux Awake

Settings > Display > Screen timeout > **Never**

### 3. SSH Access (Advanced)

```bash
pkg install openssh
sshd

# Dari PC
ssh -p 8022 user@localhost
```

### 4. Quick Commands

```bash
# Start server
./start-dev.sh

# Get IP
./get-ip.sh

# View logs
./view-logs.sh

# Backup database
./backup-db.sh

# Stop server
pkill -f "npm run dev"
```

---

## 📚 Dokumentasi Lengkap

- **INDEX.md** - Master index semua script
- **README-TERMUX.md** - Panduan Termux lengkap
- **SETUP_GUIDE.md** - Detailed setup guide
- **SCRIPTS.md** - Dokumentasi script
- **DEPLOYMENT.md** - Production deployment

---

## ✅ Checklist

- [ ] Download & install Termux
- [ ] Buka Termux
- [ ] Update packages: `pkg update && pkg upgrade -y`
- [ ] Download project: `git clone ...`
- [ ] Jalankan quick start: `bash quick-start.sh`
- [ ] Jalankan server: `./start-dev.sh`
- [ ] Dapatkan IP: `./get-ip.sh`
- [ ] Buka browser: `http://YOUR_IP:3000`
- [ ] Login dengan Manus OAuth
- [ ] Buat agenda pertama
- [ ] Backup database: `./backup-db.sh`

---

## 🎉 Selesai!

Anda sudah berhasil menjalankan SIAP Tangsel Mobile di Termux! 🎊

**Langkah berikutnya:**
1. Explore dashboard
2. Buat agenda dan disposisi
3. Test approval workflow
4. Upload dokumen
5. Setup email notifications

---

## 📞 Butuh Bantuan?

- **Lihat troubleshooting** di atas
- **Baca dokumentasi** di INDEX.md
- **Check logs** dengan `./view-logs.sh`

---

**Terakhir diupdate:** 13 Februari 2026  
**Status:** Production Ready ✓
