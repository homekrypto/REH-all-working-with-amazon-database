#!/bin/bash

echo "🧪 Testing Edit Listing Functionality..."
echo

BASE_URL="http://localhost:5544"
LISTING_ID="cme70an9q0001xbe8sftm5072"

# Test 1: Get listing details (should work without auth)
echo "1. Testing public listing detail fetch..."
curl -s "$BASE_URL/api/listings/$LISTING_ID" | jq '.listing | {id, title, price, type, location}'
echo

# Test 2: Try to update listing without auth (should fail)
echo "2. Testing PATCH without auth (should fail)..."
UPDATE_DATA='{"title":"Should Fail","price":999999}'
RESPONSE=$(curl -s -w "%{http_code}" -X PATCH \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA" \
  "$BASE_URL/api/listings/$LISTING_ID")

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

echo "HTTP Status: $HTTP_CODE"
if [[ "$HTTP_CODE" == "401" ]]; then
  echo "✅ Correctly rejected unauthorized request"
else
  echo "❌ Expected 401, got $HTTP_CODE"
fi
echo

# Test 3: Login and get session cookie
echo "3. Testing login to get session..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"me@p.pl","password":"password123"}' \
  "$BASE_URL/api/auth/signin")

echo "Login response received"
echo

# Test 4: Try update with session cookie
echo "4. Testing PATCH with auth..."
UPDATE_DATA='{"title":"Updated via API Test","description":"This listing was updated through the API test script","price":135000,"location":"Updated Miami Location, FL"}'

UPDATE_RESPONSE=$(curl -s -w "%{http_code}" -b cookies.txt -X PATCH \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA" \
  "$BASE_URL/api/listings/$LISTING_ID")

HTTP_CODE="${UPDATE_RESPONSE: -3}"
BODY="${UPDATE_RESPONSE%???}"

echo "HTTP Status: $HTTP_CODE"
if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Update successful!"
  echo "$BODY" | jq '.listing | {id, title, price, location}'
else
  echo "❌ Update failed"
  echo "Response: $BODY"
fi
echo

# Test 5: Verify changes persisted
echo "5. Verifying changes persisted..."
curl -s "$BASE_URL/api/listings/$LISTING_ID" | jq '.listing | {id, title, price, location}'

# Cleanup
rm -f cookies.txt

echo
echo "✅ Test completed!"
