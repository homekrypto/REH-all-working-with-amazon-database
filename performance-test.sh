#!/bin/bash

echo "🚀 WEBSITE PERFORMANCE ANALYSIS"
echo "==============================="
echo "Testing: http://localhost:3001"
echo "Date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to measure response time
measure_response_time() {
    local url="$1"
    local name="$2"
    
    echo "Testing: $name"
    local result=$(curl -o /dev/null -s -w "%{time_total},%{time_namelookup},%{time_connect},%{time_pretransfer},%{time_starttransfer},%{size_download},%{http_code}" "$url")
    
    IFS=',' read -r total_time dns_time connect_time pretransfer_time starttransfer_time size_download http_code <<< "$result"
    
    echo "  HTTP Status: $http_code"
    echo "  Total Time: ${total_time}s"
    echo "  DNS Lookup: ${dns_time}s"
    echo "  Connect Time: ${connect_time}s"
    echo "  First Byte: ${starttransfer_time}s"
    echo "  Download Size: ${size_download} bytes"
    
    # Performance assessment
    if (( $(echo "$total_time > 3.0" | bc -l) )); then
        echo -e "  ${RED}❌ SLOW${NC} - Response time > 3s"
    elif (( $(echo "$total_time > 1.0" | bc -l) )); then
        echo -e "  ${YELLOW}⚠️  MODERATE${NC} - Response time > 1s"
    else
        echo -e "  ${GREEN}✅ FAST${NC} - Response time < 1s"
    fi
    echo ""
}

# Test key pages
echo "📊 PAGE LOAD PERFORMANCE:"
echo "========================="

measure_response_time "http://localhost:3001" "Homepage"
measure_response_time "http://localhost:3001/properties" "Properties Page"
measure_response_time "http://localhost:3001/register" "Registration Page"
measure_response_time "http://localhost:3001/auth/login" "Login Page"

echo "🔧 API ENDPOINT PERFORMANCE:"
echo "============================"

measure_response_time "http://localhost:3001/api/auth/session" "Auth Session API"
measure_response_time "http://localhost:3001/api/listings" "Listings API"
measure_response_time "http://localhost:3001/sitemap.xml" "Sitemap Generation"

echo "📈 MULTIPLE REQUEST TEST:"
echo "========================"

echo "Testing 5 consecutive homepage requests..."
total_time=0
for i in {1..5}; do
    time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:3001")
    echo "  Request $i: ${time}s"
    total_time=$(echo "$total_time + $time" | bc -l)
done

average_time=$(echo "scale=3; $total_time / 5" | bc -l)
echo "  Average Time: ${average_time}s"

if (( $(echo "$average_time > 2.0" | bc -l) )); then
    echo -e "  ${RED}❌ SLOW AVERAGE${NC} - Needs optimization"
elif (( $(echo "$average_time > 1.0" | bc -l) )); then
    echo -e "  ${YELLOW}⚠️  MODERATE AVERAGE${NC} - Could be improved"
else
    echo -e "  ${GREEN}✅ FAST AVERAGE${NC} - Good performance"
fi

echo ""
echo "🎯 Performance analysis complete!"
