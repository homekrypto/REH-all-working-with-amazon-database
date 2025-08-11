# 🧪 TEST USER ACCOUNT - MANUAL CREATION

## 🎯 Quick Test User Creation

Since the automated script might need database setup, here's the **manual approach**:

### 📝 **Method 1: Use Registration Flow (Recommended)**

1. **Go to Registration**: http://localhost:5544/register
2. **Select Role**: Choose "User" (Free account)
3. **Fill Details**:
   - **Name**: Test User
   - **Email**: testuser@example.com
   - **Password**: testuser123
   - **Confirm Password**: testuser123
4. **Submit**: Complete registration
5. **Verify Email**: Check email or mark as verified in database
6. **Login**: Use credentials to test

### 📝 **Method 2: Use Simple Signup (Alternative)**

1. **Go to Login**: http://localhost:5544/auth/login
2. **Click**: "Don't have an account? Sign up"
3. **Use Registration Flow**: Same as Method 1

### 🎯 **Test Credentials**
```
📧 Email: testuser@example.com
🔑 Password: testuser123
👤 Role: USER
💳 Subscription: FREE
```

## 🧪 **Testing Checklist**

### ✅ **What USER Can Do:**
- [ ] Browse properties in dashboard
- [ ] Save properties to favorites (heart button)
- [ ] Remove properties from favorites
- [ ] Contact agents (phone, email buttons)
- [ ] Send messages to agents
- [ ] Search and filter properties
- [ ] View property details

### 🚫 **What USER Cannot Do:**
- [ ] Access /add-listing page
- [ ] See "Add Listing" in navigation menu
- [ ] Access agent dashboard features
- [ ] Create property listings

### 📊 **Expected Dashboard:**
- [ ] "Browse Properties" tab with property cards
- [ ] "Favorites" tab (empty initially)
- [ ] "My Activity" tab
- [ ] "Free Account" badge in header
- [ ] Upgrade banner for Pro features
- [ ] No "Add Listing" in user dropdown

## 🚀 **Quick Test Flow:**

1. **Register** → Use registration flow
2. **Login** → testuser@example.com / testuser123
3. **Dashboard** → Verify USER dashboard loads
4. **Browse** → See property listings
5. **Favorite** → Click heart on a property
6. **Contact** → Click contact buttons
7. **Restricted** → Try accessing /add-listing directly

## ✅ **Expected Results:**

- ✅ Dashboard shows USER interface
- ✅ Can browse and favorite properties
- ✅ Can contact agents
- ✅ Cannot create listings
- ✅ Shows upgrade prompts

**This will fully test the USER role permissions!** 🎯
