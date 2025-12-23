# Testing APIs with Postman

This guide explains how to test all the APIs using Postman.

## 1. Import the Collection

1. Open **Postman**
2. Click **Import** (top-left)
3. Select **Upload Files** tab
4. Choose `Teslead_API.postman_collection.json` from your project root
5. Click **Import**

The collection will be imported with all endpoints organized in folders.

## 2. Environment Variables

The collection includes 3 variables that auto-update:

- `{{accessToken}}` - Set automatically after login
- `{{refreshToken}}` - Set automatically after login
- `{{dcId}}` - Set manually when testing DC endpoints

### Manual Setup (Optional)

If variables don't auto-update, set them manually:

1. Click **Collections** → **Teslead API** → **Variables**
2. Set initial values for `accessToken`, `refreshToken`, `dcId`

## 3. Authentication Flow

### Step 1: Login

Choose one of the login endpoints:

**Option A: Login as Admin**
```
POST http://localhost:3012/api/auth/login

Body (raw JSON):
{
  "userId": "admin",
  "password": "admin123"
}
```

**Option B: Login as Super Admin**
```
{
  "userId": "super_admin",
  "password": "super123"
}
```

**Option C: Login as Regular User**
```
{
  "userId": "user",
  "password": "user123"
}
```

### Step 2: Copy Tokens

After login, you'll get response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "1",
      "userId": "admin",
      "name": "Admin User",
      "email": "admin@teslead.com",
      "role": "admin"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

Copy the `accessToken` and `refreshToken` values.

### Step 3: Set Variables in Postman

In **Postman**, paste the tokens:

1. Click **Collections** → **Teslead API**
2. Go to **Variables** tab
3. Paste `accessToken` value in **Current Value**
4. Paste `refreshToken` value in **Current Value**
5. Save (Ctrl+S)

Now all requests will use `{{accessToken}}` automatically!

## 4. Test Protected Endpoints

### Test 1: Protected Endpoint (Any authenticated user)

```
GET http://localhost:3012/api/v1/protected
Authorization: Bearer {{accessToken}}
```

**Expected Response (200 OK):**
```json
{
  "message": "This is a protected endpoint",
  "user": {
    "id": "1",
    "userId": "admin",
    "email": "admin@teslead.com",
    "name": "Admin User",
    "role": "admin",
    "iat": 1702000000,
    "exp": 1702003600
  }
}
```

### Test 2: Admin-Only Endpoint

**✅ Works with:** admin, super_admin
**❌ Fails with:** user

```
GET http://localhost:3012/api/v1/admin-only
Authorization: Bearer {{accessToken}}
```

Login as **admin** or **super_admin**, then test:
- **Expected (200 OK):** `"This endpoint is admin-only"`

Login as **user**, then test:
- **Expected (403 Forbidden):** `"Only admins can access this endpoint"`

### Test 3: Super Admin-Only Endpoint

**✅ Works with:** super_admin only
**❌ Fails with:** admin, user

```
GET http://localhost:3012/api/v1/super-admin-only
Authorization: Bearer {{accessToken}}
```

Login as **super_admin**, then test:
- **Expected (200 OK):** `"This endpoint is super_admin-only"`

Login as **admin** or **user**, then test:
- **Expected (403 Forbidden):** `"Only super admins can access this endpoint"`

## 5. Refresh Token Flow

When your access token expires (after 1 hour):

```
POST http://localhost:3012/api/auth/refresh
Content-Type: application/json

Body (raw JSON):
{
  "refreshToken": "{{refreshToken}}"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

Update the `{{accessToken}}` variable with the new token.

## 6. Delivery Challans API

### Get All Delivery Challans

```
GET http://localhost:3012/api/v1/delivery-challans?page=1&limit=10
Authorization: Bearer {{accessToken}}
```

### Get DC by ID

```
GET http://localhost:3012/api/v1/delivery-challans/{dcId}
Authorization: Bearer {{accessToken}}
```

Replace `{dcId}` with an actual UUID from the list.

### Create Delivery Challan

```
POST http://localhost:3012/api/v1/delivery-challans/create
Authorization: Bearer {{accessToken}}
Content-Type: application/json

Body:
{
  "dcNumber": "DC-2025-001",
  "customerName": "John Doe",
  "itemNames": ["Item1", "Item2"],
  "totalDispatchQty": 100,
  "totalReceivedQty": 0,
  "status": "draft"
}
```

**Response:** Returns the created DC with ID. Save the `id` to `{{dcId}}` variable.

### Update Delivery Challan

```
PUT http://localhost:3012/api/v1/delivery-challans/{{dcId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

Body:
{
  "customerName": "Jane Doe",
  "totalReceivedQty": 50,
  "status": "partial"
}
```

### Delete Delivery Challan

```
DELETE http://localhost:3012/api/v1/delivery-challans/{{dcId}}
Authorization: Bearer {{accessToken}}
```

## 7. Error Scenarios to Test

### Missing Token
```
GET http://localhost:3012/api/v1/protected
(No Authorization header)
```
**Expected (401):** `"No token provided"`

### Invalid Token
```
GET http://localhost:3012/api/v1/protected
Authorization: Bearer invalid_token_here
```
**Expected (401):** `"Invalid or expired token"`

### No Permission
```
GET http://localhost:3012/api/v1/admin-only
Authorization: Bearer {{userAccessToken}}
```
**Expected (403):** `"Only admins can access this endpoint"`

## 8. Test Checklist

- [ ] Login as admin ✓ Get tokens
- [ ] Login as super_admin ✓ Get tokens
- [ ] Login as user ✓ Get tokens
- [ ] Access protected endpoint ✓ Success
- [ ] Access admin-only as admin ✓ Success
- [ ] Access admin-only as user ✓ Forbidden (403)
- [ ] Access super-admin-only as super_admin ✓ Success
- [ ] Access super-admin-only as admin ✓ Forbidden (403)
- [ ] Refresh token ✓ Get new token
- [ ] Create DC ✓ Returns ID
- [ ] Get DC by ID ✓ Returns DC details
- [ ] Update DC ✓ Updated successfully
- [ ] Delete DC ✓ Deleted successfully
- [ ] Access with expired token ✓ Unauthorized (401)
- [ ] Access without token ✓ No token error (401)

## 9. Quick Test Sequence

Follow this order for complete testing:

1. **Login as super_admin** → Copy tokens
2. **Test Protected** → Should work
3. **Test Admin-Only** → Should work
4. **Test Super-Admin-Only** → Should work
5. **Create DC** → Save returned ID
6. **Get All DC** → Should see the created DC
7. **Get DC by ID** → Using the saved ID
8. **Update DC** → Modify some fields
9. **Delete DC** → Should be soft-deleted
10. **Refresh Token** → Get new access token
11. **Login as Admin** → Copy new tokens
12. **Test Super-Admin-Only** → Should fail (403)

## 10. Common Issues

**"Port 3012 refused"**
- Make sure your Next.js dev server is running: `npm run dev`

**"Invalid token"**
- Token expired (expires in 1 hour). Use refresh endpoint to get new one.
- Token is malformed. Login again and copy the full token.

**"No token provided"**
- Authorization header is missing. Add `Authorization: Bearer {{accessToken}}`

**"Only admins can access"**
- You're using a regular user token. Login as admin and get new token.

## 11. Additional Notes

- Access tokens expire in **1 hour**
- Refresh tokens expire in **7 days**
- Tokens are also stored in secure **HTTP-only cookies**
- All timestamps are in Unix epoch (seconds)
- Delivery Challans use soft deletes (paranoid mode in Sequelize)

Happy testing! 🚀
