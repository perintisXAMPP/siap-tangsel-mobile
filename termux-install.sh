#!/bin/bash

# SIAP Tangsel Mobile - Termux Installation Script
# Script untuk menginstal dan setup aplikasi di Termux

set -e

echo "=========================================="
echo "SIAP Tangsel Mobile - Termux Installation"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Termux
if [ ! -d "$HOME/.termux" ]; then
    echo -e "${YELLOW}Warning: This script is optimized for Termux${NC}"
    echo "Continuing anyway..."
    echo ""
fi

# Step 1: Update system packages
echo -e "${GREEN}Step 1: Updating system packages...${NC}"
pkg update -y
pkg upgrade -y

# Step 2: Install required dependencies
echo -e "${GREEN}Step 2: Installing required dependencies...${NC}"
pkg install -y git nodejs python3 build-essential curl wget

# Step 3: Install Node.js package managers
echo -e "${GREEN}Step 3: Installing npm and pnpm...${NC}"
npm install -g pnpm yarn

# Step 4: Navigate to project directory
echo -e "${GREEN}Step 4: Setting up project directory...${NC}"
cd "$(dirname "$0")" || exit 1

# Step 5: Install project dependencies
echo -e "${GREEN}Step 5: Installing project dependencies...${NC}"
pnpm install

# Step 6: Create .env.local file if not exists
if [ ! -f .env.local ]; then
    echo -e "${GREEN}Step 6: Creating .env.local file...${NC}"
    cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/siap_tangsel"

# Manus OAuth
VITE_APP_ID="your-manus-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# JWT Secret (generate random string)
JWT_SECRET="your-random-jwt-secret-key-min-32-chars"

# Owner Information
OWNER_OPEN_ID="your-open-id"
OWNER_NAME="Admin Name"

# Manus APIs
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-forge-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-forge-api-key"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# App Configuration
VITE_APP_TITLE="SIAP Tangsel Mobile"
VITE_APP_LOGO="/logo.png"

# Termux Specific
NODE_ENV="development"
HOST="0.0.0.0"
PORT="3000"
EOF
    echo -e "${YELLOW}Created .env.local - Please update with your credentials${NC}"
else
    echo -e "${YELLOW}.env.local already exists, skipping...${NC}"
fi

# Step 7: Database setup
echo -e "${GREEN}Step 7: Setting up database...${NC}"
echo -e "${YELLOW}Note: Make sure your MySQL/TiDB database is accessible${NC}"
echo "Running database migrations..."
pnpm db:push

# Step 8: Build the project
echo -e "${GREEN}Step 8: Building project...${NC}"
pnpm build

# Step 9: Create startup script
echo -e "${GREEN}Step 9: Creating startup script...${NC}"
cat > start-server.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "Starting SIAP Tangsel Mobile Server..."
echo "Server will run on http://0.0.0.0:3000"
echo "Access from smartphone: http://YOUR_TERMUX_IP:3000"
echo ""
echo "To find your IP address, run: ifconfig"
echo ""
NODE_OPTIONS="--max-old-space-size=512" npm run dev
EOF

chmod +x start-server.sh

echo ""
echo -e "${GREEN}=========================================="
echo "Installation Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Run: ./start-server.sh"
echo "3. Find your Termux IP: ifconfig"
echo "4. Access from smartphone: http://YOUR_IP:3000"
echo ""
echo -e "${YELLOW}For more information, see DEPLOYMENT.md${NC}"
