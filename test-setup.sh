#!/bin/bash

echo "Starting Next.js + Astro POC Test"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start Astro in background
echo -e "${YELLOW}Starting Astro documentation server...${NC}"
cd astro-docs
npm run dev > /tmp/astro.log 2>&1 &
ASTRO_PID=$!
echo "Astro PID: $ASTRO_PID"

# Wait for Astro to start
sleep 5

# Start Next.js in background
echo -e "${YELLOW}Starting Next.js application...${NC}"
cd ../nextjs-app
npm run dev > /tmp/nextjs.log 2>&1 &
NEXTJS_PID=$!
echo "Next.js PID: $NEXTJS_PID"

# Wait for Next.js to start
sleep 8

echo ""
echo -e "${GREEN}Testing endpoints...${NC}"
echo "===================="

# Test Next.js home
echo -e "\n${YELLOW}Testing Next.js home (http://localhost:3000/)${NC}"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/

# Test Astro docs through Next.js rewrite
echo -e "\n${YELLOW}Testing /docs (should proxy to Astro)${NC}"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/docs

# Test nested page
echo -e "\n${YELLOW}Testing /docs/getting-started${NC}"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/docs/getting-started

# Test deep nested page
echo -e "\n${YELLOW}Testing /docs/guides/installation${NC}"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/docs/guides/installation

echo ""
echo -e "${GREEN}Test complete!${NC}"
echo ""
echo "Servers are running:"
echo "- Next.js: http://localhost:3000"
echo "- Astro (direct): http://localhost:4321"
echo "- Docs (via Next.js): http://localhost:3000/docs"
echo ""
echo "Press Ctrl+C to stop servers..."

# Keep script running
wait

# Cleanup on exit
trap "kill $ASTRO_PID $NEXTJS_PID 2>/dev/null" EXIT