# 🔌 API Reference Documentation

## Overview
This document provides comprehensive details about all API endpoints in the Global Real Estate Platform.

## Base URL
- **Development**: `http://localhost:5544/api`
- **Production**: `https://your-domain.com/api`

## Authentication
Most endpoints require authentication via NextAuth session cookies. For Socket.IO, use JWT tokens from `/api/auth/socket-token`.

---

## 🔐 Authentication Endpoints

### POST `/api/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user|agent|expert",
  "phone": "+1234567890",
  "agencyName": "Real Estate Co"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "agent",
    "phone": "+1234567890",
    "agencyName": "Real Estate Co",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Missing required fields, invalid email format, password too short
- `409`: Email already exists

---

### POST `/api/auth/forgot-password`
Request a password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, we have sent password reset instructions."
}
```

**Errors:**
- `400`: Missing or invalid email format

---

### POST `/api/auth/reset-password`
Reset password using a valid token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Errors:**
- `400`: Missing token/password, password too short, invalid/expired token

---

### POST `/api/auth/verify-reset-token`
Validate a password reset token.

**Request Body:**
```json
{
  "token": "reset_token_here"
}
```

**Response (200):**
```json
{
  "valid": true
}
```

**Errors:**
- `400`: Missing token, invalid/expired token

---

### POST `/api/auth/send-verification`
Send email verification link.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent successfully"
}
```

**Errors:**
- `400`: Missing email
- `404`: User not found
- `200`: Email already verified

---

### POST `/api/auth/verify-email`
Verify email address using token.

**Request Body:**
```json
{
  "token": "verification_token_here"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

**Errors:**
- `400`: Missing token, invalid/expired token, already verified

---

### POST `/api/auth/socket-token`
Generate JWT token for Socket.IO authentication.

**Auth Required:** Yes

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Payload:**
```json
{
  "sub": "user_id",
  "userId": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "agent",
  "iat": 1640995200,
  "exp": 1641081600
}
```

**Errors:**
- `401`: Unauthorized (no session)
- `500`: Server configuration error

---

## 🏠 Property Listing Endpoints

### GET `/api/listings`
Retrieve all property listings.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset
- `status` (optional): Filter by status

**Response (200):**
```json
{
  "listings": [
    {
      "id": "clx123...",
      "agentId": "clx456...",
      "title": "Luxury Downtown Penthouse",
      "description": "Beautiful 3BR/2BA penthouse...",
      "price": 850000,
      "currency": "USD",
      "location": "New York, NY",
      "type": "sale",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "images": [
        {
          "id": "clx789...",
          "url": "https://example.com/image1.jpg",
          "sortOrder": 0
        }
      ]
    }
  ]
}
```

---

### POST `/api/listings`
Create a new property listing.

**Auth Required:** Yes (AGENT or EXPERT role)

**Request Body:**
```json
{
  "title": "Luxury Downtown Penthouse",
  "description": "Beautiful 3BR/2BA penthouse with city views",
  "price": 850000,
  "currency": "USD",
  "location": "New York, NY",
  "type": "sale",
  "status": "active",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Response (201):**
```json
{
  "listing": {
    "id": "clx123...",
    "agentId": "current_user_id",
    "title": "Luxury Downtown Penthouse",
    // ... other fields
    "images": [
      {
        "id": "clx789...",
        "url": "https://example.com/image1.jpg",
        "sortOrder": 0
      }
    ]
  }
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Insufficient permissions (not agent/expert)
- `400`: Missing required fields

---

### GET `/api/listings/[id]`
Get a specific listing by ID.

**Path Parameters:**
- `id`: Listing ID

**Response (200):**
```json
{
  "listing": {
    "id": "clx123...",
    "agentId": "clx456...",
    "title": "Luxury Downtown Penthouse",
    // ... all listing fields
    "images": [...],
    "agent": {
      "id": "clx456...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "image": "https://example.com/avatar.jpg"
    },
    "_count": {
      "favorites": 12,
      "leads": 5
    }
  }
}
```

**Errors:**
- `404`: Listing not found

---

### PATCH `/api/listings/[id]`
Update a listing (owner or admin only).

**Auth Required:** Yes (Owner or Admin)

**Path Parameters:**
- `id`: Listing ID

**Request Body (partial update):**
```json
{
  "title": "Updated Title",
  "price": 900000,
  "status": "pending"
}
```

**Response (200):**
```json
{
  "listing": {
    // Updated listing object
  }
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Not listing owner or admin
- `404`: Listing not found

---

### DELETE `/api/listings/[id]`
Delete a listing (owner or admin only).

**Auth Required:** Yes (Owner or Admin)

**Path Parameters:**
- `id`: Listing ID

**Response (200):**
```json
{
  "message": "Listing 'Property Title' deleted successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Not listing owner or admin
- `404`: Listing not found

---

### GET `/api/listings/my-listings`
Get current user's listings.

**Auth Required:** Yes (AGENT or EXPERT role)

**Response (200):**
```json
{
  "listings": [
    // Array of user's listings
  ]
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Insufficient permissions

---

## 👥 Lead Management Endpoints

### POST `/api/leads`
Create a lead/inquiry.

**Auth Required:** Yes

**Request Body:**
```json
{
  "agentId": "clx456...",
  "listingId": "clx789...",
  "message": "I'm interested in viewing this property."
}
```

**Response (201):**
```json
{
  "lead": {
    "id": "clx123...",
    "userId": "current_user_id",
    "agentId": "clx456...",
    "listingId": "clx789...",
    "message": "I'm interested in viewing this property.",
    "status": "new",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing required fields (agentId, message)

---

## 💬 Messaging Endpoints

### GET `/api/conversations`
Get user's conversations.

**Auth Required:** Yes

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "clx123...",
      "title": "Property Inquiry",
      "isGroup": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "participants": [
        {
          "id": "clx456...",
          "userId": "clx789...",
          "role": "member",
          "user": {
            "id": "clx789...",
            "name": "John Doe",
            "email": "john@example.com",
            "image": "https://example.com/avatar.jpg"
          }
        }
      ],
      "messages": [
        {
          "id": "clx999...",
          "content": "Hello, I'm interested in your property",
          "createdAt": "2024-01-01T12:00:00.000Z",
          "sender": {
            "id": "clx789...",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      ]
    }
  ]
}
```

**Errors:**
- `401`: Unauthorized

---

### POST `/api/conversations`
Create a new conversation.

**Auth Required:** Yes

**Request Body (Direct Conversation):**
```json
{
  "otherUserId": "clx456...",
  "title": "Property Inquiry"
}
```

**Request Body (Group Conversation):**
```json
{
  "title": "Project Discussion",
  "isGroup": true,
  "participantIds": ["clx456...", "clx789..."]
}
```

**Response (201):**
```json
{
  "conversation": {
    "id": "clx123...",
    "title": "Property Inquiry",
    "isGroup": false,
    // ... conversation details with participants
  }
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing required fields

---

### POST `/api/messages`
Send a message in a conversation.

**Auth Required:** Yes

**Request Body:**
```json
{
  "conversationId": "clx123...",
  "content": "Hello, I'm interested in viewing the property tomorrow."
}
```

**Response (201):**
```json
{
  "message": {
    "id": "clx456...",
    "conversationId": "clx123...",
    "senderId": "current_user_id",
    "content": "Hello, I'm interested in viewing the property tomorrow.",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "sender": {
      "id": "current_user_id",
      "name": "Current User",
      "email": "user@example.com",
      "image": "https://example.com/avatar.jpg"
    }
  }
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing conversationId or content
- `403`: Not a participant in the conversation

---

## 💳 Subscription & Payment Endpoints

### GET `/api/packages`
Get all available subscription packages.

**Response (200):**
```json
{
  "packages": [
    {
      "id": "agent_basic",
      "name": "Agent Basic",
      "description": "Perfect for new agents",
      "price": 3000,
      "interval": "month",
      "listingsMax": 10,
      "features": {
        "listings": 10,
        "analytics": "basic",
        "support": "email"
      },
      "stripePriceId": "price_agent_basic_monthly",
      "active": true
    }
  ]
}
```

---

### POST `/api/stripe/create-checkout-session`
Create Stripe checkout session for new subscriptions.

**Request Body:**
```json
{
  "priceId": "price_agent_basic_monthly",
  "packageId": "agent_basic",
  "email": "user@example.com",
  "name": "John Doe",
  "successUrl": "https://app.com/success",
  "cancelUrl": "https://app.com/cancel"
}
```

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_123..."
}
```

**Errors:**
- `400`: Missing required fields
- `404`: Package not found

---

### POST `/api/stripe/create-upgrade-session`
Create Stripe checkout session for subscription upgrades.

**Auth Required:** Yes

**Request Body:**
```json
{
  "userId": "clx123...",
  "email": "user@example.com",
  "priceId": "price_agent_standard_monthly",
  "packageId": "agent_standard",
  "targetRole": "AGENT",
  "currentRole": "AGENT"
}
```

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_123..."
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing required fields, invalid upgrade path

---

### POST `/api/stripe/webhook`
Handle Stripe webhook events.

**Request Body:** Stripe webhook event payload

**Headers Required:**
- `stripe-signature`: Stripe webhook signature

**Response (200):**
```json
{
  "received": true
}
```

**Supported Events:**
- `checkout.session.completed`: New subscription
- `invoice.payment_succeeded`: Successful payment
- `customer.subscription.updated`: Subscription changes
- `customer.subscription.deleted`: Subscription cancellation

---

## 🏥 System Health Endpoints

### GET `/api/health`
System health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

**Response (500) - Unhealthy:**
```json
{
  "status": "unhealthy",
  "error": "Database connection failed",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🔌 Socket.IO Events

### Connection
```javascript
// Client connects with JWT token
io.connect('ws://localhost:5544', {
  auth: {
    token: 'jwt_token_from_/api/auth/socket-token'
  }
});
```

### Events

#### `join-conversation`
Join a conversation room.
```javascript
socket.emit('join-conversation', { conversationId: 'clx123...' });
```

#### `leave-conversation`
Leave a conversation room.
```javascript
socket.emit('leave-conversation', { conversationId: 'clx123...' });
```

#### `send-message`
Send a message (use API endpoint instead for persistence).

#### `message-received`
Receive new messages.
```javascript
socket.on('message-received', (message) => {
  // Handle new message
});
```

#### `typing`
Send typing indicator.
```javascript
socket.emit('typing', { conversationId: 'clx123...', isTyping: true });
```

#### `user-typing`
Receive typing indicators.
```javascript
socket.on('user-typing', ({ userId, isTyping, conversationId }) => {
  // Handle typing indicator
});
```

#### `user-online`/`user-offline`
User presence events.
```javascript
socket.on('user-online', ({ userId }) => {
  // User came online
});

socket.on('user-offline', ({ userId }) => {
  // User went offline
});
```

---

## 📝 Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists |
| `500` | Internal Server Error | Server error occurred |

---

## 🔧 Error Response Format

All API errors follow this format:
```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details when applicable"
  }
}
```

---

## 📊 Rate Limiting

Currently no rate limiting is implemented, but recommended limits:
- Authentication endpoints: 5 requests/minute
- Messaging endpoints: 100 requests/minute
- General API: 1000 requests/hour

---

## 🧪 Testing

Example API test using curl:

```bash
# Register a new user
curl -X POST http://localhost:5544/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "agent"
  }'

# Create a listing (requires authentication)
curl -X POST http://localhost:5544/api/listings \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "title": "Test Property",
    "description": "A test property",
    "price": 500000,
    "location": "Test City",
    "type": "sale"
  }'
```

This API reference provides comprehensive information for integrating with the Global Real Estate Platform APIs.
