# Improved Multi-Role System (Best Practice)

## Overview

This implementation follows **best security practices** by:
1. ✅ Setting **only the primary role cookie** during login (principle of least privilege)
2. ✅ **Checking database on-demand** when user tries to access another role area
3. ✅ **Auto-setting cookie** if user has the role (seamless experience)
4. ✅ **No logout/login needed** to switch between dashboards

## How It Works

### Login Flow

```
User logs in with email/password
↓
System detects user has: [admin, designer, client] roles
↓
System sets ONLY primary role cookie (e.g., admin cookie)
↓
User redirected to /admin/dashboard
```

**Only 1 cookie is set** - the primary role cookie.

---

### Accessing Other Dashboards (Seamless Switching)

```
User clicks link to /designer/dashboard
↓
Middleware checks: "Does user have designer cookie?"
↓
NO - But user has admin cookie (authenticated)
↓
Middleware redirects to: /api/auth/check-role?role=designer&redirect=/designer/dashboard
↓
API checks database: "Does user have designer role?"
↓
YES - User has designer role in database
↓
API sets designer cookie on-demand
↓
API redirects to /designer/dashboard
↓
User can now access designer dashboard ✅
```

**No logout/login needed!** Cookie is set automatically when needed.

---

## Security Benefits

### ✅ Principle of Least Privilege
- Only active role has a cookie
- Reduces attack surface
- More secure than setting all cookies at once

### ✅ On-Demand Cookie Setting
- Cookies are set only when needed
- Database is checked to verify role
- Prevents unauthorized access

### ✅ Seamless User Experience
- No logout/login required
- Automatic role detection
- Smooth navigation between dashboards

---

## Code Flow

### 1. Login (Sets Only Primary Cookie)

**File**: `lib/auth/helpers.ts`

```typescript
// For unified login, set cookie ONLY for primary role
if (route === "unified") {
  // Determine primary role (admin > designer > client)
  let primaryRole = "client"
  if (hasAdminRole) primaryRole = "admin"
  else if (hasDesignerRole) primaryRole = "designer"

  // Set cookie ONLY for primary role
  cookieStore.set({
    name: getCookieName(primaryRole),
    value: primaryToken,
    // ...
  })
}
```

### 2. Middleware (Checks and Redirects)

**File**: `middleware.ts`

```typescript
// Check designer routes
if (protectedRoutes.designer.some(route => url.startsWith(route))) {
  const token = getTokenFromRequest(req, "designer")
  
  if (!token) {
    // No designer cookie - but user might be authenticated with another role
    if (hasAnyAuthenticatedCookie(req)) {
      // Redirect to role checker API
      const checkRoleUrl = new URL('/api/auth/check-role', req.url)
      checkRoleUrl.searchParams.set('role', 'designer')
      checkRoleUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(checkRoleUrl)
    }
    // Not authenticated - redirect to login
  }
}
```

### 3. Role Checker API (On-Demand Cookie Setting)

**File**: `app/api/auth/check-role/route.ts`

```typescript
export async function GET(req: Request) {
  const requiredRole = searchParams.get("role")
  const userId = await getUserIdFromAnyCookie() // Get from any authenticated cookie
  
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Check database and set cookie if user has role
  const hasRole = await checkAndSetRoleCookie(userId, requiredRole)
  
  if (hasRole) {
    // Cookie is now set - redirect to requested URL
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }
}
```

### 4. Role Checker Helper (Database Check)

**File**: `lib/auth/role-checker.ts`

```typescript
export async function checkAndSetRoleCookie(
  userId: string,
  requiredRole: "admin" | "designer" | "client"
): Promise<boolean> {
  // Get user with all roles from database
  const user = await prisma.user.findUnique({
    include: { roles: { include: { role: true } } }
  })

  // Check if user has required role
  const hasRequiredRole = allRoles.includes(requiredRole)

  if (hasRequiredRole) {
    // Set cookie on-demand
    cookieStore.set({
      name: getCookieName(requiredRole),
      value: token,
      // ...
    })
    return true
  }
  
  return false
}
```

---

## Example Scenarios

### Scenario 1: Admin User Accesses Designer Dashboard

```
1. User logs in → Admin cookie set
2. User navigates to /designer/dashboard
3. Middleware: "No designer cookie, but user has admin cookie"
4. Redirects to /api/auth/check-role?role=designer
5. API: Checks database → User has designer role ✅
6. API: Sets designer cookie
7. API: Redirects to /designer/dashboard
8. User can now access designer dashboard ✅
```

### Scenario 2: Designer User Tries to Access Admin Dashboard (No Admin Role)

```
1. User logs in → Designer cookie set
2. User navigates to /admin/dashboard
3. Middleware: "No admin cookie, but user has designer cookie"
4. Redirects to /api/auth/check-role?role=admin
5. API: Checks database → User does NOT have admin role ❌
6. API: Redirects to /login
7. User cannot access admin dashboard ✅ (Security maintained)
```

---

## Comparison: Old vs New Approach

### ❌ Old Approach (Setting All Cookies at Once)

**Problems:**
- Security risk: All role cookies set even if not needed
- Violates principle of least privilege
- Unnecessary cookies in browser

**Flow:**
```
Login → Set admin cookie ✅
      → Set designer cookie ✅
      → Set client cookie ✅
```

### ✅ New Approach (On-Demand Cookie Setting)

**Benefits:**
- Security: Only active role has cookie
- Principle of least privilege followed
- Cookies set only when needed
- Still seamless (no logout/login)

**Flow:**
```
Login → Set admin cookie ✅ (primary role only)

Access designer dashboard:
  → Check database
  → Set designer cookie on-demand ✅
  → Allow access
```

---

## API Endpoints

### Check Role and Set Cookie
```
GET /api/auth/check-role?role=designer&redirect=/designer/dashboard

Response:
- If user has role: Sets cookie and redirects to redirect URL
- If user doesn't have role: Redirects to login
- If not authenticated: Redirects to login
```

---

## Security Features

1. **Database Verification**: Every role check queries the database
2. **On-Demand Cookies**: Cookies set only when role is verified
3. **Single Active Cookie**: Only primary role cookie exists initially
4. **Automatic Cleanup**: Old cookies expire naturally (7 days)

---

## Testing

### Test Case 1: Multi-Role User
1. Create user with admin + designer roles
2. Login → Should set only admin cookie
3. Navigate to `/designer/dashboard`
4. Should automatically set designer cookie and allow access
5. No logout/login needed ✅

### Test Case 2: Single Role User
1. Create user with only designer role
2. Login → Should set only designer cookie
3. Navigate to `/admin/dashboard`
4. Should redirect to login (user doesn't have admin role) ✅

### Test Case 3: Unauthenticated User
1. User not logged in
2. Navigate to `/admin/dashboard`
3. Should redirect to `/admin/login` ✅

---

## Benefits Summary

✅ **Security**: Only active role cookie set (principle of least privilege)
✅ **Seamless**: No logout/login needed to switch roles
✅ **Efficient**: Cookies set only when needed
✅ **Secure**: Database verified on every role check
✅ **User-Friendly**: Automatic role detection and cookie setting
