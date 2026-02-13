#!/bin/bash

################################################################################
# SIAP Tangsel Mobile - Quick Start Script
# 
# Script ini mempercepat setup untuk pengguna baru dengan pertanyaan interaktif.
# Usage: bash quick-start.sh
################################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
print_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║          SIAP TANGSEL MOBILE - QUICK START SETUP              ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
}

print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

read_input() {
    local prompt="$1"
    local default="$2"
    local input
    
    if [ -n "$default" ]; then
        echo -ne "${YELLOW}${prompt}${NC} [${BLUE}${default}${NC}]: "
    else
        echo -ne "${YELLOW}${prompt}${NC}: "
    fi
    
    read -r input
    
    if [ -z "$input" ]; then
        echo "$default"
    else
        echo "$input"
    fi
}

confirm() {
    local prompt="$1"
    local response
    
    echo -ne "${YELLOW}${prompt}${NC} (y/n): "
    read -r response
    
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Step 1: Welcome
welcome() {
    print_banner
    
    echo -e "${GREEN}Selamat datang di SIAP Tangsel Mobile!${NC}\n"
    echo "Script ini akan membantu Anda setup aplikasi di Termux dengan mudah.\n"
    echo -e "${CYAN}Apa yang akan dilakukan:${NC}"
    echo "  1. Install dependencies (Node.js, npm, pnpm)"
    echo "  2. Install project dependencies"
    echo "  3. Setup environment configuration"
    echo "  4. Create startup scripts"
    echo "  5. Setup database (optional)\n"
    
    if ! confirm "Lanjutkan dengan setup?"; then
        echo -e "${RED}Setup dibatalkan.${NC}"
        exit 0
    fi
}

# Step 2: Check environment
check_environment() {
    print_section "Checking Environment"
    
    echo "Checking Termux..."
    if [ -d "$HOME/.termux" ] || [ -n "$TERMUX_VERSION" ]; then
        echo -e "${GREEN}✓${NC} Termux detected\n"
    else
        echo -e "${YELLOW}⚠${NC} Termux not detected (script may not work properly)\n"
    fi
    
    echo "Checking Node.js..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION installed\n"
    else
        echo -e "${RED}✗${NC} Node.js not found"
        echo -e "${YELLOW}Installing Node.js...${NC}\n"
        pkg install -y nodejs || {
            echo -e "${RED}Failed to install Node.js${NC}"
            exit 1
        }
    fi
}

# Step 3: Install dependencies
install_deps() {
    print_section "Installing Dependencies"
    
    if confirm "Install system packages? (pkg update, build-essential, etc)"; then
        echo -e "${YELLOW}Updating packages...${NC}"
        pkg update -y
        pkg upgrade -y
        
        echo -e "${YELLOW}Installing dependencies...${NC}"
        pkg install -y git python3 build-essential curl wget
        
        echo -e "${GREEN}✓${NC} Dependencies installed\n"
    fi
    
    if confirm "Install npm tools (pnpm, yarn)?"; then
        echo -e "${YELLOW}Installing pnpm...${NC}"
        npm install -g pnpm
        
        echo -e "${YELLOW}Installing yarn...${NC}"
        npm install -g yarn
        
        echo -e "${GREEN}✓${NC} npm tools installed\n"
    fi
}

# Step 4: Install project dependencies
install_project() {
    print_section "Installing Project Dependencies"
    
    cd "$PROJECT_DIR" || exit 1
    
    echo -e "${YELLOW}Installing project dependencies...${NC}"
    echo -e "${CYAN}(This may take a few minutes)${NC}\n"
    
    if pnpm install; then
        echo -e "\n${GREEN}✓${NC} Project dependencies installed\n"
    else
        echo -e "${RED}✗${NC} Failed to install project dependencies"
        exit 1
    fi
}

# Step 5: Configure environment
configure_env() {
    print_section "Environment Configuration"
    
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        echo -e "${YELLOW}⚠${NC} .env.local already exists\n"
        
        if confirm "Overwrite existing .env.local?"; then
            rm "$PROJECT_DIR/.env.local"
        else
            echo -e "${CYAN}Skipping environment configuration${NC}\n"
            return 0
        fi
    fi
    
    echo -e "${CYAN}Configure your environment variables:${NC}\n"
    
    DB_URL=$(read_input "Database URL" "mysql://root:password@localhost:3306/siap_tangsel")
    APP_ID=$(read_input "Manus App ID" "your-app-id")
    JWT_SECRET=$(read_input "JWT Secret (or press Enter to generate)" "")
    OWNER_ID=$(read_input "Owner Open ID" "your-open-id")
    OWNER_NAME=$(read_input "Owner Name" "Administrator")
    API_KEY=$(read_input "Forge API Key" "your-api-key")
    
    # Generate JWT secret if not provided
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -base64 32)
        echo -e "${GREEN}Generated JWT Secret${NC}"
    fi
    
    # Create .env.local
    cat > "$PROJECT_DIR/.env.local" << EOF
# Database Configuration
DATABASE_URL="$DB_URL"

# Manus OAuth
VITE_APP_ID="$APP_ID"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# JWT Secret
JWT_SECRET="$JWT_SECRET"

# Owner Information
OWNER_OPEN_ID="$OWNER_ID"
OWNER_NAME="$OWNER_NAME"

# Manus APIs
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="$API_KEY"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="$API_KEY"

# Application
VITE_APP_TITLE="SIAP Tangsel Mobile"
VITE_APP_LOGO="/logo.png"

# Server
NODE_ENV="development"
HOST="0.0.0.0"
PORT="3000"
EOF

    echo -e "\n${GREEN}✓${NC} Environment configured\n"
}

# Step 6: Setup database
setup_database() {
    print_section "Database Setup"
    
    if confirm "Setup database now? (requires MySQL/TiDB to be running)"; then
        cd "$PROJECT_DIR" || exit 1
        
        echo -e "${YELLOW}Running database migrations...${NC}\n"
        
        if pnpm db:push; then
            echo -e "\n${GREEN}✓${NC} Database setup completed\n"
        else
            echo -e "${RED}✗${NC} Database setup failed"
            echo -e "${YELLOW}You can try again later with: pnpm db:push${NC}\n"
        fi
    else
        echo -e "${CYAN}Skipping database setup${NC}\n"
        echo -e "${YELLOW}You can setup database later with: pnpm db:push${NC}\n"
    fi
}

# Step 7: Create startup scripts
create_scripts() {
    print_section "Creating Startup Scripts"
    
    # Check if scripts already exist
    if [ -f "$PROJECT_DIR/start-dev.sh" ]; then
        echo -e "${YELLOW}⚠${NC} Startup scripts already exist\n"
        return 0
    fi
    
    echo -e "${YELLOW}Creating startup scripts...${NC}\n"
    
    # Development script
    cat > "$PROJECT_DIR/start-dev.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "Starting SIAP Tangsel Mobile..."
NODE_OPTIONS="--max-old-space-size=512" npm run dev
EOF
    chmod +x "$PROJECT_DIR/start-dev.sh"
    echo -e "${GREEN}✓${NC} Created start-dev.sh"
    
    # Background script
    cat > "$PROJECT_DIR/start-bg.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")" || exit 1
nohup npm run dev > server.log 2>&1 &
echo "Server started with PID: $!"
EOF
    chmod +x "$PROJECT_DIR/start-bg.sh"
    echo -e "${GREEN}✓${NC} Created start-bg.sh"
    
    # IP script
    cat > "$PROJECT_DIR/get-ip.sh" << 'EOF'
#!/bin/bash
echo "Your IP address:"
ifconfig | grep -E "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -1
EOF
    chmod +x "$PROJECT_DIR/get-ip.sh"
    echo -e "${GREEN}✓${NC} Created get-ip.sh\n"
}

# Step 8: Summary
print_summary() {
    print_section "Setup Complete! ✓"
    
    echo -e "${GREEN}SIAP Tangsel Mobile is ready to use!${NC}\n"
    
    echo -e "${CYAN}Next Steps:${NC}\n"
    
    echo "1. ${YELLOW}Verify Configuration${NC}"
    echo "   ${BLUE}nano .env.local${NC}\n"
    
    echo "2. ${YELLOW}Start the Server${NC}"
    echo "   ${BLUE}./start-dev.sh${NC}\n"
    
    echo "3. ${YELLOW}Find Your IP Address${NC}"
    echo "   ${BLUE}./get-ip.sh${NC}\n"
    
    echo "4. ${YELLOW}Open in Browser${NC}"
    echo "   ${BLUE}http://YOUR_IP:3000${NC}\n"
    
    echo -e "${CYAN}Available Commands:${NC}\n"
    echo "   ${GREEN}./start-dev.sh${NC}   - Run development server"
    echo "   ${GREEN}./start-bg.sh${NC}    - Run in background"
    echo "   ${GREEN}./get-ip.sh${NC}      - Show your IP address"
    echo "   ${GREEN}pnpm db:push${NC}     - Setup/migrate database"
    echo "   ${GREEN}pnpm build${NC}       - Build for production\n"
    
    echo -e "${YELLOW}Documentation:${NC}\n"
    echo "   TERMUX_SETUP.md - Detailed setup guide"
    echo "   SCRIPTS.md      - Scripts documentation\n"
}

# Main flow
main() {
    welcome
    check_environment
    install_deps
    install_project
    configure_env
    setup_database
    create_scripts
    print_summary
}

# Run
main "$@"
