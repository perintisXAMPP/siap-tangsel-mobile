# SIAP Tangsel Mobile - Setup Guide

Panduan lengkap untuk setup SIAP Tangsel Mobile di Termux dengan penjelasan detail setiap langkah.

---

## 📋 Daftar Isi

1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi Cepat](#instalasi-cepat)
3. [Konfigurasi Environment](#konfigurasi-environment)
4. [Setup Database](#setup-database)
5. [Menjalankan Server](#menjalankan-server)
6. [Akses dari Smartphone](#akses-dari-smartphone)

---

## 🖥️ Persyaratan Sistem

### Minimum Requirements
- **Smartphone** - Android 7.0+
- **Termux** - Latest version dari F-Droid
- **Storage** - 500MB+ free space
- **RAM** - 1GB+ (recommended 2GB+)
- **Internet** - WiFi atau mobile data

### Recommended Setup
- **RAM** - 2GB+
- **Storage** - 1GB+
- **WiFi** - Koneksi stabil
- **Database** - Cloud MySQL (TiDB, PlanetScale, dll)

---

## ⚡ Instalasi Cepat

### Langkah 1: Download Termux

1. Buka Google Play Store atau F-Droid
2. Cari "Termux"
3. Install aplikasi

### Langkah 2: Buka Termux

Tap aplikasi Termux di smartphone Anda.

### Langkah 3: Download Project

```bash
# Clone dari GitHub
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile
```

Atau jika sudah punya file ZIP:

```bash
# Extract ZIP
unzip siap-tangsel-mobile.zip
cd siap-tangsel-mobile
```

### Langkah 4: Jalankan Quick Start

```bash
bash quick-start.sh
```

Script akan menanyakan:
- Database URL
- Manus App ID
- JWT Secret (atau auto-generate)
- Owner information
- API keys

### Langkah 5: Jalankan Server

```bash
./start-dev.sh
```

### Langkah 6: Akses dari Browser

Di terminal baru:
```bash
./get-ip.sh
```

Buka browser: `http://YOUR_IP:3000`

---

## 🔧 Konfigurasi Environment

### Membuat .env.local

```bash
# Copy template
cp .env.example .env.local

# Edit dengan nano
nano .env.local
```

### Environment Variables Penting

#### 1. DATABASE_URL (WAJIB)

Format: `mysql://username:password@hostname:port/database`

**Contoh untuk localhost:**
```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/siap_tangsel"
```

**Contoh untuk cloud database:**
```env
DATABASE_URL="mysql://user:pass@db.example.com:3306/database"
```

**Cara mendapatkan:**
1. Setup MySQL/TiDB di server
2. Create database: `CREATE DATABASE siap_tangsel;`
3. Create user: `CREATE USER 'user'@'%' IDENTIFIED BY 'password';`
4. Grant permissions: `GRANT ALL ON siap_tangsel.* TO 'user'@'%';`

#### 2. VITE_APP_ID (WAJIB)

Dapatkan dari Manus Dashboard:
1. Login ke https://manus.im
2. Go to Settings > Applications
3. Create new application
4. Copy App ID

```env
VITE_APP_ID="abc123def456"
```

#### 3. JWT_SECRET (WAJIB)

Generate random string:

```bash
# Di Termux
openssl rand -base64 32
```

Copy output dan paste ke .env.local:

```env
JWT_SECRET="aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3=="
```

#### 4. OWNER_OPEN_ID & OWNER_NAME (WAJIB)

Dapatkan dari Manus OAuth callback:

```env
OWNER_OPEN_ID="user_12345"
OWNER_NAME="Administrator"
```

#### 5. API Keys (WAJIB)

Dapatkan dari Manus Dashboard:

```env
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key-here"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-key-here"
```

#### 6. Optional Variables

```env
# Analytics
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# Application
VITE_APP_TITLE="SIAP Tangsel Mobile"
VITE_APP_LOGO="/logo.png"

# Server
NODE_ENV="development"
HOST="0.0.0.0"
PORT="3000"
```

### Verifikasi Konfigurasi

```bash
# Check if .env.local exists
ls -la .env.local

# View content (be careful with secrets!)
cat .env.local

# Test database connection
mysql -u username -p -h hostname
```

---

## 🗄️ Setup Database

### Step 1: Prepare Database

Pastikan MySQL/TiDB server sudah berjalan dan accessible.

### Step 2: Run Migrations

```bash
pnpm db:push
```

Output yang diharapkan:
```
✓ Database migrations completed
✓ Tables created successfully
```

### Step 3: Verify Database

```bash
# Connect to database
mysql -u username -p -h hostname -D siap_tangsel

# List tables
SHOW TABLES;

# Check users table
SELECT * FROM users;
```

### Step 4: Backup Database

```bash
./backup-db.sh
```

Backup akan tersimpan di `backups/` folder.

---

## 🚀 Menjalankan Server

### Development Mode

```bash
./start-dev.sh
```

**Fitur:**
- Hot-reload (auto-restart saat ada perubahan)
- Detailed error messages
- Source maps untuk debugging

**Output:**
```
Starting SIAP Tangsel Mobile...
[2026-02-13T14:30:00.000Z] Server running on http://localhost:3000/
```

### Production Mode

```bash
pnpm build
./start-prod.sh
```

**Fitur:**
- Optimized bundle
- Faster startup
- Lower memory usage

### Background Mode

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

### Memory Optimization

Jika server crash karena memory:

```bash
# Edit start-dev.sh
nano start-dev.sh

# Ubah line:
# NODE_OPTIONS="--max-old-space-size=512" npm run dev
# Menjadi:
# NODE_OPTIONS="--max-old-space-size=256" npm run dev
```

---

## 📱 Akses dari Smartphone

### Cara 1: Menggunakan Script (Recommended)

```bash
./get-ip.sh
```

Output:
```
Your IP address:
192.168.1.105

Use this IP to access from smartphone:
http://192.168.1.105:3000
```

### Cara 2: Manual dengan ifconfig

```bash
ifconfig
```

Cari line yang berisi `inet` dan bukan `127.0.0.1`:

```
inet 192.168.1.105 netmask 255.255.255.0
```

Buka browser di smartphone: `http://192.168.1.105:3000`

### Cara 3: Troubleshooting Koneksi

**Jika tidak bisa connect:**

1. Pastikan server berjalan:
   ```bash
   netstat -tuln | grep 3000
   ```

2. Pastikan smartphone dan Termux di WiFi yang sama

3. Disable firewall (jika ada):
   ```bash
   # Check firewall
   iptables -L
   ```

4. Test ping dari smartphone:
   ```bash
   ping 192.168.1.105
   ```

---

## 🔐 Security Checklist

- [ ] Ubah JWT_SECRET dengan random string yang kuat
- [ ] Gunakan strong password untuk database
- [ ] Jangan expose ke internet publik
- [ ] Backup database secara regular
- [ ] Update dependencies secara berkala
- [ ] Jangan commit .env.local ke Git
- [ ] Keep API keys secure

---

## 📊 Monitoring

### Check Server Status

```bash
# Check if port 3000 is listening
netstat -tuln | grep 3000

# Check process
ps aux | grep node

# Check memory usage
top
```

### View Logs

```bash
# Real-time logs
./view-logs.sh

# Last 50 lines
tail -50 server.log

# Search for errors
grep ERROR server.log
```

### Database Status

```bash
# Connect to database
mysql -u username -p -h hostname -D siap_tangsel

# Check tables
SHOW TABLES;

# Count records
SELECT COUNT(*) FROM agendas;
SELECT COUNT(*) FROM dispositions;
```

---

## 🆘 Common Issues

### Issue: "Connection Refused"

**Cause:** Server not running or wrong IP

**Solution:**
```bash
# Check if server is running
netstat -tuln | grep 3000

# Get correct IP
./get-ip.sh

# Restart server
./start-dev.sh
```

### Issue: "Database Connection Failed"

**Cause:** Wrong DATABASE_URL or database not accessible

**Solution:**
```bash
# Edit .env.local
nano .env.local

# Test connection
mysql -u username -p -h hostname

# Run migrations
pnpm db:push
```

### Issue: "Out of Memory"

**Cause:** Node.js needs more memory

**Solution:**
```bash
# Reduce memory limit
NODE_OPTIONS="--max-old-space-size=256" npm run dev

# Or kill other apps to free memory
```

### Issue: "Port Already in Use"

**Cause:** Port 3000 is already used

**Solution:**
```bash
# Change port in .env.local
nano .env.local
# Change: PORT="3001"

# Or kill existing process
pkill -f "npm run dev"
```

---

## 📚 Next Steps

1. **Create First Agenda**
   - Login to http://YOUR_IP:3000
   - Go to Dashboard
   - Click "Buat Agenda Baru"

2. **Setup Dispositions**
   - Go to Dispositions
   - Create new disposition
   - Test approval workflow

3. **Upload Documents**
   - Go to Documents
   - Upload supporting files
   - Test S3 integration

4. **Configure Notifications**
   - Setup email notifications
   - Test notification triggers

---

## 📞 Support

- **Documentation** - See TERMUX_SETUP.md, README-TERMUX.md
- **Scripts Help** - See SCRIPTS.md
- **Issues** - Check troubleshooting section above

---

**Last Updated:** 13 February 2026  
**Status:** Production Ready ✓
