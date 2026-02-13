# SIAP Tangsel Mobile - Script & Documentation Index

Panduan lengkap untuk semua script dan dokumentasi yang tersedia.

---

## 📦 Installation Scripts

### 1. **quick-start.sh** ⭐ RECOMMENDED

Script instalasi interaktif untuk setup cepat.

```bash
bash quick-start.sh
```

**Fitur:**
- ✓ Interactive setup (pertanyaan step-by-step)
- ✓ Auto-detect environment
- ✓ Install dependencies
- ✓ Configure environment variables
- ✓ Setup database (optional)
- ✓ Create startup scripts

**Waktu:** 10-20 menit

**Best for:** First-time users

---

### 2. **install.sh**

Script instalasi lengkap dengan logging.

```bash
bash install.sh
```

**Fitur:**
- ✓ Detailed logging
- ✓ Error handling
- ✓ Rollback capability
- ✓ Create utility scripts
- ✓ Documentation generation

**Waktu:** 15-25 menit

**Best for:** Advanced users, CI/CD

---

## 🚀 Startup Scripts

### 1. **start-dev.sh**

Menjalankan server dalam development mode.

```bash
./start-dev.sh
```

**Fitur:**
- Hot-reload
- Detailed error messages
- Source maps
- Auto-restart

**Best for:** Development & debugging

---

### 2. **start-prod.sh**

Menjalankan server dalam production mode.

```bash
./start-prod.sh
```

**Requirements:** `pnpm build` harus dijalankan terlebih dahulu

**Fitur:**
- Optimized bundle
- Faster startup
- Lower memory usage

**Best for:** Production deployment

---

### 3. **start-bg.sh**

Menjalankan server di background.

```bash
./start-bg.sh
```

**Fitur:**
- Non-blocking
- Log file output
- PID tracking

**Best for:** Long-running sessions

---

## 🛠️ Utility Scripts

### 1. **get-ip.sh**

Menampilkan IP address Termux.

```bash
./get-ip.sh
```

**Output:**
```
Your IP address:
192.168.1.105

Use this IP to access from smartphone:
http://192.168.1.105:3000
```

---

### 2. **view-logs.sh**

Melihat server logs secara real-time.

```bash
./view-logs.sh
```

**Fitur:**
- Real-time log streaming
- Auto-follow new logs
- Colorized output

---

### 3. **backup-db.sh**

Membuat backup database.

```bash
./backup-db.sh
```

**Output:**
```
Backing up database: siap_tangsel
✓ Backup completed: backups/siap_tangsel_20260213_143022.sql
```

**Restore:**
```bash
mysql -u user -p database < backups/siap_tangsel_20260213_143022.sql
```

---

## 📚 Documentation

### 1. **README-TERMUX.md** ⭐ START HERE

Panduan lengkap untuk Termux setup.

**Isi:**
- Persyaratan sistem
- Instalasi cepat
- Instalasi manual
- Menjalankan server
- Akses dari smartphone
- Troubleshooting
- Tips & tricks

**Best for:** Getting started

---

### 2. **SETUP_GUIDE.md**

Panduan setup detail dengan penjelasan setiap langkah.

**Isi:**
- Persyaratan sistem
- Instalasi cepat
- Konfigurasi environment
- Setup database
- Menjalankan server
- Akses dari smartphone
- Security checklist
- Monitoring
- Common issues

**Best for:** Detailed reference

---

### 3. **SCRIPTS.md**

Dokumentasi lengkap semua script.

**Isi:**
- Startup scripts
- Utility scripts
- npm commands
- Quick start
- Troubleshooting

**Best for:** Script reference

---

### 4. **TERMUX_SETUP.md**

Panduan Termux setup yang sudah ada.

**Isi:**
- Persyaratan
- Persiapan awal
- Download project
- Instalasi otomatis
- Konfigurasi
- Menjalankan server
- Akses dari smartphone
- Troubleshooting
- Optimasi
- Maintenance

**Best for:** Detailed Termux guide

---

### 5. **DEPLOYMENT.md**

Panduan deployment.

**Isi:**
- Pre-deployment checklist
- Environment setup
- Database migration
- Build optimization
- Performance tuning
- Monitoring
- Backup strategy

**Best for:** Production deployment

---

## 🎯 Quick Start Paths

### Path 1: First-Time User (Recommended)

```
1. Read: README-TERMUX.md (5 min)
2. Run: bash quick-start.sh (15 min)
3. Run: ./start-dev.sh (1 min)
4. Run: ./get-ip.sh (1 min)
5. Open: http://YOUR_IP:3000
```

**Total time:** ~25 minutes

---

### Path 2: Advanced User

```
1. Read: SETUP_GUIDE.md (10 min)
2. Run: bash install.sh (20 min)
3. Configure: nano .env.local (5 min)
4. Run: ./start-dev.sh (1 min)
5. Monitor: ./view-logs.sh
```

**Total time:** ~40 minutes

---

### Path 3: Production Deployment

```
1. Read: DEPLOYMENT.md (15 min)
2. Read: SETUP_GUIDE.md (10 min)
3. Run: bash install.sh (20 min)
4. Configure: nano .env.local (5 min)
5. Run: pnpm build (5 min)
6. Run: ./start-prod.sh (1 min)
7. Backup: ./backup-db.sh (1 min)
```

**Total time:** ~60 minutes

---

## 📋 File Structure

```
siap-tangsel-mobile/
├── install.sh                 # Main installation script
├── quick-start.sh             # Interactive quick start
├── start-dev.sh               # Development startup
├── start-prod.sh              # Production startup
├── start-bg.sh                # Background startup
├── get-ip.sh                  # Get IP address
├── view-logs.sh               # View logs
├── backup-db.sh               # Database backup
│
├── README-TERMUX.md           # Termux setup guide
├── SETUP_GUIDE.md             # Detailed setup guide
├── SCRIPTS.md                 # Scripts documentation
├── TERMUX_SETUP.md            # Termux setup (original)
├── DEPLOYMENT.md              # Deployment guide
├── INDEX.md                   # This file
│
├── .env.example               # Environment template
├── .env.local                 # Your configuration (don't commit)
│
├── client/                    # Frontend
├── server/                    # Backend
├── drizzle/                   # Database schema
├── storage/                   # S3 helpers
├── shared/                    # Shared code
│
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind config
└── vite.config.ts             # Vite config
```

---

## 🎓 Learning Resources

### For Beginners

1. **README-TERMUX.md** - Start here
2. **quick-start.sh** - Run this
3. **SCRIPTS.md** - Learn commands

### For Intermediate Users

1. **SETUP_GUIDE.md** - Understand setup
2. **DEPLOYMENT.md** - Learn deployment
3. **TERMUX_SETUP.md** - Deep dive

### For Advanced Users

1. **DEPLOYMENT.md** - Production setup
2. **Source code** - Explore codebase
3. **API documentation** - Build features

---

## ⚡ Common Commands

```bash
# Installation
bash quick-start.sh              # Quick setup
bash install.sh                  # Full setup

# Running server
./start-dev.sh                   # Development
./start-prod.sh                  # Production
./start-bg.sh                    # Background

# Utilities
./get-ip.sh                      # Get IP
./view-logs.sh                   # View logs
./backup-db.sh                   # Backup DB

# npm commands
npm run dev                      # Dev server
npm run build                    # Build
npm start                        # Production
npm test                         # Tests
pnpm db:push                     # Database migration
```

---

## 🔍 Troubleshooting Guide

### Can't connect to server?

```bash
# 1. Check if server is running
netstat -tuln | grep 3000

# 2. Get correct IP
./get-ip.sh

# 3. Check firewall
iptables -L

# 4. Restart server
pkill -f "npm run dev"
./start-dev.sh
```

### Database connection failed?

```bash
# 1. Check DATABASE_URL
cat .env.local | grep DATABASE_URL

# 2. Test connection
mysql -u username -p -h hostname

# 3. Run migrations
pnpm db:push
```

### Out of memory?

```bash
# 1. Reduce memory limit
nano start-dev.sh
# Change: NODE_OPTIONS="--max-old-space-size=256"

# 2. Kill other processes
pkill -f "npm"

# 3. Restart server
./start-dev.sh
```

---

## 📞 Support

- **Issues?** Check SETUP_GUIDE.md troubleshooting section
- **Script help?** See SCRIPTS.md
- **Termux help?** See README-TERMUX.md or TERMUX_SETUP.md
- **Deployment?** See DEPLOYMENT.md

---

## ✅ Checklist

Before going live:

- [ ] Read README-TERMUX.md
- [ ] Run quick-start.sh or install.sh
- [ ] Configure .env.local
- [ ] Test database connection
- [ ] Run server successfully
- [ ] Access from smartphone
- [ ] Create test agenda
- [ ] Test dispositions
- [ ] Backup database
- [ ] Review security checklist

---

## 📝 Version Info

- **Version:** 1.0
- **Last Updated:** 13 February 2026
- **Status:** Production Ready ✓
- **Compatibility:** Termux, Android 7.0+

---

## 🎉 Ready to Start?

**For first-time users:**
```bash
bash quick-start.sh
```

**For detailed setup:**
```bash
cat README-TERMUX.md
```

**For production:**
```bash
cat DEPLOYMENT.md
```

---

Happy coding! 🚀
