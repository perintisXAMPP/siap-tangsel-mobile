#!/bin/bash

################################################################################
# SIAP Tangsel Mobile - Push to GitHub Script
# 
# Script ini membuat repository di GitHub dan push semua file project
# Usage: bash push-to-github.sh <github-token> <owner> <repo-name>
################################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GITHUB_API="https://api.github.com"

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check arguments
if [ $# -lt 3 ]; then
    print_header "SIAP Tangsel Mobile - Push to GitHub"
    echo "Usage: bash push-to-github.sh <github-token> <owner> <repo-name>"
    echo ""
    echo "Example:"
    echo "  bash push-to-github.sh ghp_xxxxxxxxxxxx perintisXAMPP siap-tangsel-mobile"
    echo ""
    echo "Arguments:"
    echo "  <github-token>  - GitHub Personal Access Token (with 'repo' scope)"
    echo "  <owner>         - GitHub username or organization"
    echo "  <repo-name>     - Repository name"
    exit 1
fi

GITHUB_TOKEN="$1"
GITHUB_OWNER="$2"
GITHUB_REPO="$3"
GITHUB_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git"

# Main flow
print_header "SIAP Tangsel Mobile - Push to GitHub"

# Step 1: Verify token
print_step "Verifying GitHub token..."

if ! curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    "${GITHUB_API}/user" | grep -q "login"; then
    print_error "Invalid GitHub token"
    exit 1
fi

print_success "GitHub token verified"

# Step 2: Check if repository exists
print_step "Checking if repository exists..."

REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    "${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}")

if [ "$REPO_EXISTS" = "200" ]; then
    print_info "Repository already exists"
else
    print_step "Creating repository on GitHub..."
    
    REPO_RESPONSE=$(curl -s -X POST \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        "${GITHUB_API}/user/repos" \
        -d "{
            \"name\": \"${GITHUB_REPO}\",
            \"description\": \"SIAP Tangsel Mobile - Protocol Management Application\",
            \"private\": false,
            \"auto_init\": false
        }")
    
    if echo "$REPO_RESPONSE" | grep -q "\"id\""; then
        print_success "Repository created successfully"
    else
        print_error "Failed to create repository"
        echo "$REPO_RESPONSE"
        exit 1
    fi
fi

# Step 3: Setup git remote
print_step "Setting up git remote..."

cd "$PROJECT_DIR" || exit 1

if git remote | grep -q origin; then
    git remote remove origin
fi

git remote add origin "$GITHUB_URL"
print_success "Git remote configured"

# Step 4: Verify git status
print_step "Checking git status..."

if [ -z "$(git status --porcelain)" ]; then
    print_info "Working directory is clean"
else
    print_info "Staging changes..."
    git add .
    
    if ! git commit -m "SIAP Tangsel Mobile - Complete application with Termux scripts and documentation"; then
        print_info "No new changes to commit"
    fi
fi

# Step 5: Push to GitHub
print_step "Pushing to GitHub..."

if git push -u origin main 2>&1 | tee /tmp/git_push.log; then
    print_success "Successfully pushed to GitHub"
else
    if grep -q "already exists" /tmp/git_push.log; then
        print_info "Branch already exists, force pushing..."
        git push -u origin main --force
        print_success "Force pushed to GitHub"
    else
        print_error "Failed to push to GitHub"
        cat /tmp/git_push.log
        exit 1
    fi
fi

# Step 6: Create .gitignore if not exists
print_step "Configuring .gitignore..."

if [ ! -f "$PROJECT_DIR/.gitignore" ]; then
    cat > "$PROJECT_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
pnpm-lock.yaml
yarn.lock
package-lock.json

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
.next/
out/

# Logs
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
server.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS
Thumbs.db
.DS_Store

# Database
backups/
*.sql
*.db

# Temporary
tmp/
temp/
.cache/
.turbo/

# Testing
coverage/
.nyc_output/

# Misc
.manus-logs/
EOF
    
    git add .gitignore
    git commit -m "Add .gitignore"
    git push origin main
    print_success ".gitignore created and pushed"
fi

# Step 7: Create README.md if not exists
print_step "Checking README.md..."

if [ ! -f "$PROJECT_DIR/README.md" ]; then
    cat > "$PROJECT_DIR/README.md" << 'EOF'
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
EOF
    
    git add README.md
    git commit -m "Add comprehensive README"
    git push origin main
    print_success "README.md created and pushed"
fi

# Final summary
print_header "Push to GitHub Complete! ✓"

echo -e "${GREEN}Project successfully pushed to GitHub!${NC}\n"

echo -e "${BLUE}Repository Details:${NC}"
echo -e "  Owner: ${YELLOW}${GITHUB_OWNER}${NC}"
echo -e "  Repository: ${YELLOW}${GITHUB_REPO}${NC}"
echo -e "  URL: ${YELLOW}https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}${NC}\n"

echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. Visit: ${YELLOW}https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}${NC}"
echo -e "  2. Clone on Termux: ${YELLOW}git clone https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git${NC}"
echo -e "  3. Follow setup guide: ${YELLOW}bash quick-start.sh${NC}\n"

echo -e "${BLUE}Documentation:${NC}"
echo -e "  • LANGKAH_DEMI_LANGKAH.txt - Visual step-by-step guide"
echo -e "  • PANDUAN_TERMUX.md - Complete Termux setup"
echo -e "  • QUICK_START_STEPS.md - 5 quick steps"
echo -e "  • README.md - Project overview\n"

print_success "All done!"
