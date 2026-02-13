# ⚡ Quick Start - 5 Langkah Membuka SIAP Tangsel Mobile di Termux

Panduan tercepat untuk membuka aplikasi di Termux. Hanya 5 langkah!

---

## 🎯 5 Langkah Cepat

### Langkah 1️⃣: Download & Buka Termux

1. Download **Termux** dari Google Play Store atau F-Droid
2. Buka aplikasi Termux

```bash
# Akan melihat prompt seperti ini:
$
```

---

### Langkah 2️⃣: Download Project

```bash
git clone https://github.com/yourusername/siap-tangsel-mobile.git
cd siap-tangsel-mobile
```

Atau jika punya file ZIP:
```bash
unzip siap-tangsel-mobile.zip
cd siap-tangsel-mobile
```

---

### Langkah 3️⃣: Jalankan Instalasi

```bash
bash quick-start.sh
```

**Apa yang akan terjadi:**
- System packages akan diupdate
- Dependencies akan diinstall
- Script akan menanyakan konfigurasi (database, API keys, dll)
- Setup selesai dalam 15-25 menit

**Saat ditanya konfigurasi:**
- Masukkan database URL Anda
- Masukkan Manus App ID
- Tekan Enter untuk auto-generate JWT Secret
- Masukkan owner information
- Masukkan API keys

---

### Langkah 4️⃣: Jalankan Server

```bash
./start-dev.sh
```

**Output yang akan Anda lihat:**
```
Starting SIAP Tangsel Mobile (Development Mode)...
Server will run on http://0.0.0.0:3000

[2026-02-13T14:30:00.000Z] Server running on http://localhost:3000/
```

✓ Server sudah berjalan!

---

### Langkah 5️⃣: Buka di Browser

**Buka terminal baru di Termux:**
- Tap menu ≡ → New Session

**Dapatkan IP:**
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

**Buka browser di smartphone:**
- Chrome / Firefox / Browser apapun
- Ketik: `http://192.168.1.105:3000`
- Tekan Enter

✓ Aplikasi sudah terbuka!

---

## 🎉 Selesai!

Anda sekarang bisa:
- ✓ Login dengan Manus OAuth
- ✓ Lihat Dashboard
- ✓ Buat Agenda
- ✓ Buat Disposisi
- ✓ Upload Dokumen

---

## 🆘 Jika Ada Masalah

### "Connection Refused"
```bash
# Pastikan server berjalan
netstat -tuln | grep 3000

# Dapatkan IP yang benar
./get-ip.sh
```

### "Database Connection Failed"
```bash
# Edit konfigurasi
nano .env.local

# Verifikasi DATABASE_URL
# Simpan dengan: Ctrl+X, Y, Enter
```

### "Out of Memory"
```bash
# Edit start-dev.sh
nano start-dev.sh

# Ubah: NODE_OPTIONS="--max-old-space-size=256"
# Simpan dengan: Ctrl+X, Y, Enter

# Jalankan ulang
./start-dev.sh
```

---

## 📚 Dokumentasi Lengkap

Jika butuh penjelasan lebih detail:
- **PANDUAN_TERMUX.md** - Panduan lengkap step-by-step
- **README-TERMUX.md** - Panduan Termux komprehensif
- **SETUP_GUIDE.md** - Detailed setup guide
- **INDEX.md** - Master index semua dokumentasi

---

## 💡 Tips Penting

| Tips | Perintah |
|------|----------|
| **Lihat IP** | `./get-ip.sh` |
| **Lihat Log** | `./view-logs.sh` |
| **Stop Server** | `Ctrl+C` (di terminal server) |
| **Backup DB** | `./backup-db.sh` |
| **Background Mode** | `./start-bg.sh` |

---

## ✅ Checklist

- [ ] Download Termux
- [ ] Buka Termux
- [ ] Clone/extract project
- [ ] Jalankan `bash quick-start.sh`
- [ ] Jalankan `./start-dev.sh`
- [ ] Jalankan `./get-ip.sh`
- [ ] Buka browser: `http://YOUR_IP:3000`
- [ ] Login
- [ ] Mulai gunakan aplikasi

---

**Waktu total:** ~30 menit (termasuk download)

**Status:** ✓ Ready to use!
