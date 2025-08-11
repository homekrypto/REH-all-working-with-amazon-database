#!/bin/bash

echo "🧪 Testing Edit Listing with NextAuth..."
echo

BASE_URL="http://localhost:5544"
LISTING_ID="cme70an9q0001xbe8sftm5072"
CSRF_TOKEN=""

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

# Test 3: Get CSRF token
echo "3. Getting CSRF token..."
CSRF_RESPONSE=$(curl -s -c session_cookies.txt "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | jq -r '.csrfToken')
echo "CSRF Token: ${CSRF_TOKEN:0:20}..."
echo

# Test 4: Login with NextAuth credentials endpoint
echo "4. Testing NextAuth login..."
LOGIN_DATA="csrfToken=$CSRF_TOKEN&email=me%40p.pl&password=password123&redirect=false&json=true"

LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -b session_cookies.txt -c session_cookies.txt -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "$LOGIN_DATA" \
  "$BASE_URL/api/auth/callback/credentials")

HTTP_CODE="${LOGIN_RESPONSE: -3}"
BODY="${LOGIN_RESPONSE%???}"

echo "Login HTTP Status: $HTTP_CODE"
echo "Login Response: $BODY"
echo

# Test 5: Try update with session cookie
echo "5. Testing PATCH with authenticated session..."
UPDATE_DATA='{"title":"Updated via API Test with Auth","description":"This listing was updated through the authenticated API test script","price":145000,"location":"Updated Miami Beach Location, FL"}'

UPDATE_RESPONSE=$(curl -s -w "%{http_code}" -b session_cookies.txt -X PATCH \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA" \
  "$BASE_URL/api/listings/$LISTING_ID")

HTTP_CODE="${UPDATE_RESPONSE: -3}"
BODY="${UPDATE_RESPONSE%???}"

echo "Update HTTP Status: $HTTP_CODE"
if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Update successful!"
  echo "$BODY" | jq '.listing | {id, title, price, location}'
else
  echo "❌ Update failed"
  echo "Response: $BODY"
fi
echo

# Test 6: Verify changes persisted
echo "6. Verifying changes persisted..."
curl -s "$BASE_URL/api/listings/$LISTING_ID" | jq '.listing | {id, title, price, location}'

# Cleanup
rm -f session_cookies.txt

echo
echo "✅ Test completed!"
