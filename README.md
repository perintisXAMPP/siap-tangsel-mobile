# SIAP Tangsel Mobile

Aplikasi manajemen protokoler dengan estetika cyberpunk yang dapat dijalankan di Termux dan diakses via localhost di smartphone.

## 🎯 Fitur Utama

- **Dashboard** - Statistik agenda dan disposisi protokoler
- **Manajemen Agenda** - CRUD operations untuk event protokoler
- **Disposisi Dokumen** - Tracking status dan approval workflow
- **Autentikasi** - Manus OAuth untuk user dan admin
- **Database** - MySQL/TiDB untuk data persistence
- **Email Notifications** - Notifikasi otomatis untuk pejabat terkait
- **File Storage** - S3 untuk dokumen pendukung
- **Mobile-First** - Responsive design optimal untuk smartphone

## 🎨 Desain

Estetika cyberpunk dengan:
- Background hitam pekat (#0a0a0a)
- Neon pink (#FF00FF) dan cyan (#00FFFF)
- HUD-style borders dengan glow effects
- Scan lines effect
- Geometris sans-serif typography

## 🚀 Quick Start

### Instalasi Cepat (Recommended)

```bash
bash quick-start.sh
```

### Menjalankan Server

```bash
./start-dev.sh
```

### Akses Aplikasi

```bash
./get-ip.sh
# Buka browser: http://YOUR_IP:3000
```

## 📚 Dokumentasi

- **LANGKAH_DEMI_LANGKAH.txt** - Panduan visual 13 langkah
- **PANDUAN_TERMUX.md** - Panduan lengkap Termux setup
- **QUICK_START_STEPS.md** - 5 langkah tercepat
- **SETUP_GUIDE.md** - Detailed setup guide
- **README-TERMUX.md** - Panduan Termux komprehensif
- **SCRIPTS.md** - Dokumentasi semua script
- **INDEX.md** - Master index

## 🛠️ Scripts

| Script | Fungsi |
|--------|--------|
| `quick-start.sh` | Interactive setup wizard |
| `install.sh` | Full installation |
| `start-dev.sh` | Development server |
| `start-prod.sh` | Production server |
| `start-bg.sh` | Background mode |
| `get-ip.sh` | Display IP address |
| `view-logs.sh` | Real-time logs |
| `backup-db.sh` | Database backup |

## 🏗️ Tech Stack

- **Frontend** - React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend** - Express 4 + tRPC 11 + Drizzle ORM
- **Database** - MySQL/TiDB
- **Storage** - AWS S3
- **Auth** - Manus OAuth
- **Email** - Manus Notification API

## 📋 Database Schema

- **users** - User accounts dengan role-based access
- **agendas** - Protocol events dan scheduling
- **dispositions** - Document disposition tracking
- **documents** - Supporting files dan attachments
- **notifications** - Email notification history
- **auditLogs** - System activity logging

## 🔐 Security

- JWT-based session management
- Role-based access control (admin/user)
- Secure S3 file storage
- Environment-based configuration
- Database encryption support

## 📱 Mobile-First Design

- Responsive layout untuk semua ukuran layar
- Touch-friendly interface
- Optimized untuk Termux access
- Cyberpunk aesthetic yang konsisten

## 🐛 Troubleshooting

Lihat dokumentasi untuk troubleshooting:
- Connection refused → Check server status
- Database error → Verify DATABASE_URL
- Out of memory → Reduce memory limit
- Port in use → Change PORT in .env.local

## 📞 Support

Untuk bantuan lebih lanjut, lihat:
- SETUP_GUIDE.md - Troubleshooting section
- PANDUAN_TERMUX.md - Common issues
- LANGKAH_DEMI_LANGKAH.txt - Visual guide

## 📄 License

MIT License - Lihat LICENSE file

## 👨‍💻 Author

SIAP Tangsel Development Team

---

**Status:** Production Ready ✓  
**Last Updated:** 13 February 2026
