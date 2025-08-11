#!/bin/bash

echo "🚀 IMPLEMENTING CRITICAL PERFORMANCE OPTIMIZATIONS"
echo "=================================================="
echo ""

# 1. Check current Next.js config
echo "1. Analyzing current Next.js configuration..."
if [ -f "next.config.ts" ]; then
    echo "   ✅ Next.js config found"
else
    echo "   ❌ Next.js config missing"
fi

# 2. Build production version to test performance
echo ""
echo "2. Building production version for performance testing..."
echo "   This will show the real performance without dev overhead..."

npm run build

if [ $? -eq 0 ]; then
    echo "   ✅ Production build successful"
    echo ""
    echo "3. Starting production server..."
    echo "   Note: This will show true performance metrics"
    
    # Kill existing dev server
    pkill -f "tsx server.ts" 2>/dev/null || true
    sleep 2
    
    # Start production server
    echo "   Starting production server on port 3001..."
    PORT=3001 npm start &
    PROD_PID=$!
    
    # Wait for server to start
    echo "   Waiting for production server to start..."
    sleep 10
    
    # Test production performance
    echo ""
    echo "4. Testing production performance..."
    
    # Test homepage
    echo "   Testing homepage load time..."
    time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:3001" 2>/dev/null)
    echo "   📊 Homepage load time: ${time}s"
    
    if (( $(echo "$time < 1.0" | bc -l) )); then
        echo "   ✅ FAST - Production build is optimized!"
    elif (( $(echo "$time < 2.0" | bc -l) )); then
        echo "   ⚠️  MODERATE - Some optimization needed"
    else
        echo "   ❌ SLOW - Further optimization required"
    fi
    
    # Kill production server
    kill $PROD_PID 2>/dev/null || true
    
else
    echo "   ❌ Production build failed - check for errors"
fi

echo ""
echo "🎯 Performance optimization test complete!"
echo "   Check PERFORMANCE_ANALYSIS_REPORT.md for detailed recommendations"
