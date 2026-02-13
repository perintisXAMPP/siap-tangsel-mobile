#!/bin/bash

################################################################################
# SIAP Tangsel Mobile - Termux Installation Script
# 
# Script ini menginstal dan mengkonfigurasi SIAP Tangsel Mobile di Termux
# dengan semua dependencies yang diperlukan.
#
# Usage: bash install.sh
################################################################################

set -e

# Color codes untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="SIAP Tangsel Mobile"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$PROJECT_DIR/install.log"

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

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

log_output() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check if running on Termux
check_termux() {
    print_step "Checking Termux environment..."
    
    if [ -d "$HOME/.termux" ] || [ -n "$TERMUX_VERSION" ]; then
        print_success "Termux detected"
        log_output "Termux environment detected"
    else
        print_warning "This script is optimized for Termux"
        print_warning "Some features may not work on other systems"
        log_output "Non-Termux environment detected"
    fi
}

# Update system packages
update_packages() {
    print_step "Updating system packages..."
    
    if ! pkg update -y >> "$LOG_FILE" 2>&1; then
        print_error "Failed to update packages"
        log_output "ERROR: Failed to update packages"
        return 1
    fi
    
    if ! pkg upgrade -y >> "$LOG_FILE" 2>&1; then
        print_error "Failed to upgrade packages"
        log_output "ERROR: Failed to upgrade packages"
        return 1
    fi
    
    print_success "System packages updated"
    log_output "System packages updated successfully"
}

# Install dependencies
install_dependencies() {
    print_step "Installing required dependencies..."
    
    local packages="git nodejs python3 build-essential curl wget"
    
    for pkg in $packages; do
        if ! pkg install -y "$pkg" >> "$LOG_FILE" 2>&1; then
            print_error "Failed to install $pkg"
            log_output "ERROR: Failed to install $pkg"
            return 1
        fi
        print_success "Installed $pkg"
    done
    
    log_output "All dependencies installed successfully"
}

# Install Node.js package managers
install_npm_tools() {
    print_step "Installing npm and pnpm..."
    
    if ! npm install -g pnpm >> "$LOG_FILE" 2>&1; then
        print_error "Failed to install pnpm"
        log_output "ERROR: Failed to install pnpm"
        return 1
    fi
    
    print_success "pnpm installed"
    
    if ! npm install -g yarn >> "$LOG_FILE" 2>&1; then
        print_error "Failed to install yarn"
        log_output "ERROR: Failed to install yarn"
        return 1
    fi
    
    print_success "yarn installed"
    log_output "npm tools installed successfully"
}

# Install project dependencies
install_project_deps() {
    print_step "Installing project dependencies..."
    
    cd "$PROJECT_DIR" || exit 1
    
    if ! pnpm install >> "$LOG_FILE" 2>&1; then
        print_error "Failed to install project dependencies"
        log_output "ERROR: Failed to install project dependencies"
        return 1
    fi
    
    print_success "Project dependencies installed"
    log_output "Project dependencies installed successfully"
}

# Create environment file
create_env_file() {
    print_step "Creating environment configuration..."
    
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        print_warning ".env.local already exists, skipping..."
        log_output "Skipped .env.local creation - file already exists"
        return 0
    fi
    
    cat > "$PROJECT_DIR/.env.local" << 'EOF'
# ============================================
# SIAP Tangsel Mobile - Environment Variables
# ============================================

# Database Configuration (REQUIRED)
# Format: mysql://username:password@hostname:port/database
DATABASE_URL="mysql://root:password@localhost:3306/siap_tangsel"

# Manus OAuth Configuration (REQUIRED)
VITE_APP_ID="your-manus-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# JWT Secret (REQUIRED - Generate random string min 32 chars)
# Generate: openssl rand -base64 32
JWT_SECRET="your-random-jwt-secret-key-min-32-characters"

# Owner Information (REQUIRED)
OWNER_OPEN_ID="your-open-id-from-manus"
OWNER_NAME="Administrator"

# Manus APIs (REQUIRED)
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-forge-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-forge-api-key"

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# Application Configuration
VITE_APP_TITLE="SIAP Tangsel Mobile"
VITE_APP_LOGO="/logo.png"

# Server Configuration
NODE_ENV="development"
HOST="0.0.0.0"
PORT="3000"

# AWS S3 Configuration (Optional - for file storage)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
S3_BUCKET="siap-tangsel-documents"
EOF

    print_success ".env.local created"
    print_warning "Please update .env.local with your configuration"
    log_output ".env.local created - user must configure it"
}

# Setup database
setup_database() {
    print_step "Setting up database..."
    
    cd "$PROJECT_DIR" || exit 1
    
    print_warning "Make sure your MySQL/TiDB database is accessible"
    print_warning "Running database migrations..."
    
    if ! pnpm db:push >> "$LOG_FILE" 2>&1; then
        print_error "Failed to run database migrations"
        print_warning "Please check your DATABASE_URL in .env.local"
        log_output "ERROR: Failed to run database migrations"
        return 1
    fi
    
    print_success "Database setup completed"
    log_output "Database migrations completed successfully"
}

# Build project
build_project() {
    print_step "Building project..."
    
    cd "$PROJECT_DIR" || exit 1
    
    if ! pnpm build >> "$LOG_FILE" 2>&1; then
        print_error "Failed to build project"
        log_output "ERROR: Failed to build project"
        return 1
    fi
    
    print_success "Project built successfully"
    log_output "Project build completed successfully"
}

# Create startup scripts
create_startup_scripts() {
    print_step "Creating startup scripts..."
    
    # Development startup script
    cat > "$PROJECT_DIR/start-dev.sh" << 'EOF'
#!/bin/bash
# Development server startup script
cd "$(dirname "$0")" || exit 1
echo "Starting SIAP Tangsel Mobile (Development Mode)..."
echo "Server will run on http://0.0.0.0:3000"
echo ""
NODE_OPTIONS="--max-old-space-size=512" npm run dev
EOF

    chmod +x "$PROJECT_DIR/start-dev.sh"
    print_success "Created start-dev.sh"
    
    # Production startup script
    cat > "$PROJECT_DIR/start-prod.sh" << 'EOF'
#!/bin/bash
# Production server startup script
cd "$(dirname "$0")" || exit 1
echo "Starting SIAP Tangsel Mobile (Production Mode)..."
echo "Server will run on http://0.0.0.0:3000"
echo ""
NODE_ENV="production" NODE_OPTIONS="--max-old-space-size=512" npm start
EOF

    chmod +x "$PROJECT_DIR/start-prod.sh"
    print_success "Created start-prod.sh"
    
    # Background startup script
    cat > "$PROJECT_DIR/start-background.sh" << 'EOF'
#!/bin/bash
# Background server startup script
cd "$(dirname "$0")" || exit 1
echo "Starting SIAP Tangsel Mobile in background..."
nohup npm run dev > server.log 2>&1 &
echo "Server started with PID: $!"
echo "View logs: tail -f server.log"
EOF

    chmod +x "$PROJECT_DIR/start-background.sh"
    print_success "Created start-background.sh"
    
    log_output "Startup scripts created successfully"
}

# Create utility scripts
create_utility_scripts() {
    print_step "Creating utility scripts..."
    
    # IP finder script
    cat > "$PROJECT_DIR/get-ip.sh" << 'EOF'
#!/bin/bash
# Get Termux IP address
echo "Finding your Termux IP address..."
echo ""
ifconfig | grep -E "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -1
echo ""
echo "Use this IP to access from smartphone:"
echo "http://YOUR_IP:3000"
EOF

    chmod +x "$PROJECT_DIR/get-ip.sh"
    print_success "Created get-ip.sh"
    
    # Log viewer script
    cat > "$PROJECT_DIR/view-logs.sh" << 'EOF'
#!/bin/bash
# View server logs
if [ -f "server.log" ]; then
    tail -f server.log
else
    echo "No server.log found. Start server with: ./start-background.sh"
fi
EOF

    chmod +x "$PROJECT_DIR/view-logs.sh"
    print_success "Created view-logs.sh"
    
    # Database backup script
    cat > "$PROJECT_DIR/backup-db.sh" << 'EOF'
#!/bin/bash
# Backup database
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/siap_tangsel_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

# Read DATABASE_URL from .env.local
source .env.local

# Extract connection details
DB_URL="$DATABASE_URL"
DB_USER=$(echo "$DB_URL" | sed -n 's/.*:\/\/\([^:]*\).*/\1/p')
DB_PASS=$(echo "$DB_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\).*/\1/p')
DB_HOST=$(echo "$DB_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_PORT=$(echo "$DB_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DB_URL" | sed -n 's/.*\/\(.*\)/\1/p')

echo "Backing up database: $DB_NAME"
mysqldump -u "$DB_USER" -p"$DB_PASS" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Backup completed: $BACKUP_FILE"
else
    echo "✗ Backup failed"
    exit 1
fi
EOF

    chmod +x "$PROJECT_DIR/backup-db.sh"
    print_success "Created backup-db.sh"
    
    log_output "Utility scripts created successfully"
}

# Create README for scripts
create_scripts_readme() {
    cat > "$PROJECT_DIR/SCRIPTS.md" << 'EOF'
# SIAP Tangsel Mobile - Termux Scripts

Panduan lengkap untuk menggunakan script-script yang tersedia.

## Startup Scripts

### start-dev.sh
Menjalankan server dalam mode development dengan hot-reload.

```bash
./start-dev.sh
```

**Output:**
```
Starting SIAP Tangsel Mobile (Development Mode)...
Server will run on http://0.0.0.0:3000
```

### start-prod.sh
Menjalankan server dalam mode production (optimized).

```bash
./start-prod.sh
```

**Catatan:** Pastikan sudah menjalankan `pnpm build` terlebih dahulu.

### start-background.sh
Menjalankan server di background (tidak akan stop saat close terminal).

```bash
./start-background.sh
```

**Output:**
```
Starting SIAP Tangsel Mobile in background...
Server started with PID: 12345
View logs: tail -f server.log
```

## Utility Scripts

### get-ip.sh
Menampilkan IP address Termux Anda untuk akses dari smartphone.

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

### view-logs.sh
Melihat log server secara real-time.

```bash
./view-logs.sh
```

### backup-db.sh
Membuat backup database ke folder `backups/`.

```bash
./backup-db.sh
```

**Output:**
```
Backing up database: siap_tangsel
✓ Backup completed: backups/siap_tangsel_20260213_143022.sql
```

## Quick Start

1. **Instalasi pertama kali:**
   ```bash
   bash install.sh
   ```

2. **Edit konfigurasi:**
   ```bash
   nano .env.local
   ```

3. **Jalankan server:**
   ```bash
   ./start-dev.sh
   ```

4. **Akses dari smartphone:**
   ```bash
   ./get-ip.sh
   # Buka browser: http://YOUR_IP:3000
   ```

## Troubleshooting

### Port 3000 sudah digunakan
Edit `.env.local` dan ubah PORT:
```env
PORT="3001"
```

### Memory error
Edit script startup dan kurangi memory:
```bash
NODE_OPTIONS="--max-old-space-size=256" npm run dev
```

### Database connection failed
Verifikasi DATABASE_URL di `.env.local`:
```bash
mysql -u username -p -h hostname
```

## Tips & Tricks

### Persistent session dengan tmux
```bash
pkg install tmux
tmux new-session -d -s siap "./start-dev.sh"
tmux attach -t siap
```

### Monitor resource usage
```bash
top
```

### Check if server is running
```bash
netstat -tuln | grep 3000
```

---

**Terakhir diupdate:** 13 Februari 2026
EOF

    print_success "Created SCRIPTS.md"
    log_output "Scripts documentation created"
}

# Final summary
print_summary() {
    print_header "Installation Complete! ✓"
    
    echo -e "${GREEN}SIAP Tangsel Mobile has been successfully installed!${NC}\n"
    
    echo -e "${BLUE}Next Steps:${NC}\n"
    echo -e "1. ${YELLOW}Configure Environment${NC}"
    echo -e "   Edit .env.local with your credentials:"
    echo -e "   ${BLUE}nano .env.local${NC}\n"
    
    echo -e "2. ${YELLOW}Start the Server${NC}"
    echo -e "   Development mode:"
    echo -e "   ${BLUE}./start-dev.sh${NC}\n"
    
    echo -e "3. ${YELLOW}Find Your IP Address${NC}"
    echo -e "   ${BLUE}./get-ip.sh${NC}\n"
    
    echo -e "4. ${YELLOW}Access from Smartphone${NC}"
    echo -e "   Open browser: ${BLUE}http://YOUR_IP:3000${NC}\n"
    
    echo -e "${BLUE}Available Scripts:${NC}\n"
    echo -e "  • ${GREEN}./start-dev.sh${NC}         - Run in development mode"
    echo -e "  • ${GREEN}./start-prod.sh${NC}        - Run in production mode"
    echo -e "  • ${GREEN}./start-background.sh${NC}  - Run in background"
    echo -e "  • ${GREEN}./get-ip.sh${NC}            - Get your IP address"
    echo -e "  • ${GREEN}./view-logs.sh${NC}         - View server logs"
    echo -e "  • ${GREEN}./backup-db.sh${NC}         - Backup database\n"
    
    echo -e "${BLUE}Documentation:${NC}\n"
    echo -e "  • TERMUX_SETUP.md - Detailed Termux setup guide"
    echo -e "  • SCRIPTS.md      - Scripts documentation"
    echo -e "  • DEPLOYMENT.md   - Deployment guide\n"
    
    echo -e "${YELLOW}Important:${NC}\n"
    echo -e "  • Make sure DATABASE_URL is configured correctly"
    echo -e "  • Keep .env.local secure (don't share it)"
    echo -e "  • Backup your database regularly\n"
    
    echo -e "${BLUE}Installation log saved to:${NC} $LOG_FILE\n"
    
    log_output "Installation completed successfully"
}

# Main installation flow
main() {
    print_header "SIAP Tangsel Mobile - Termux Installation"
    
    log_output "Installation started"
    
    check_termux || true
    update_packages || exit 1
    install_dependencies || exit 1
    install_npm_tools || exit 1
    install_project_deps || exit 1
    create_env_file || exit 1
    
    # Database setup is optional (user might not have DB ready yet)
    print_warning "Skipping database setup - configure .env.local first"
    log_output "Database setup skipped - user will configure later"
    
    create_startup_scripts || exit 1
    create_utility_scripts || exit 1
    create_scripts_readme || exit 1
    
    print_summary
}

# Run main function
main "$@"
