# Multi-Role Support Setup Guide

## Overview

The system now supports **multiple roles per user**. One email can have admin, designer, and client roles simultaneously. When a user logs in, they get access to all areas based on their assigned roles.

## What Changed

### 1. Database Schema
- Added `UserRole` table for many-to-many relationship between User and Role
- Kept `roleId` field in User table for backward compatibility
- Users can now have multiple roles assigned

### 2. Authentication
- **Unified Login**: One login page that detects all user roles
- **Multiple Cookies**: Sets cookies for all roles the user has (admin, designer, client)
- **Automatic Access**: User can access all areas they have roles for

### 3. Middleware
- Updated to check if user **has** the required role (not just exact match)
- Supports multi-role checking

## Setup Instructions

### Step 1: Run Database Migration

```bash
# Option 1: Run the migration SQL file directly
psql -U your_username -d your_database -f prisma/migrations/20260113000000_add_multi_role_support/migration.sql

# Option 2: Use Prisma migrate (recommended)
npx prisma migrate dev --name add_multi_role_support
```

### Step 2: Regenerate Prisma Client

```bash
npx prisma generate
```

**Note**: If you get a permission error on Windows, close any running applications that might be using the Prisma client, then try again.

### Step 3: Test the System

1. **Create a user with multiple roles** using the admin API:
   ```bash
   POST /api/admin/users/roles
   {
     "userId": "user-uuid",
     "roleNames": ["admin", "designer", "client"]
   }
   ```

2. **Login with unified login** - the user will get cookies for all roles

3. **Access different areas**:
   - `/admin/dashboard` - if user has admin role
   - `/designer/dashboard` - if user has designer role  
   - `/dashboard` - if user has client role

## API Endpoints

### Assign Roles to User
```
POST /api/admin/users/roles
Body: {
  "userId": "string",
  "roleNames": ["admin", "designer", "client"]
}
```

### Get User Roles
```
GET /api/admin/users/roles?userId=user-uuid
Response: {
  "userId": "string",
  "email": "string",
  "roles": ["admin", "designer", "client"]
}
```

## How It Works

### Login Flow
1. User enters email/password on unified login page
2. System authenticates and fetches all user roles
3. Sets cookies for **all roles** the user has:
   - `next-auth.session-token.admin` (if admin role)
   - `next-auth.session-token.designer` (if designer role)
   - `next-auth.session-token.client` (always set)
4. Redirects to highest priority role dashboard (admin > designer > client)

### Access Control
- **Middleware** checks if user has the required role in their roles array
- User can access any area they have a role for
- No need to logout/login to switch between roles

## Example Use Cases

### Use Case 1: Admin who is also a Designer
```javascript
// Assign both roles
POST /api/admin/users/roles
{
  "userId": "admin-user-id",
  "roleNames": ["admin", "designer"]
}

// User can now:
// - Access /admin/dashboard (admin role)
// - Access /designer/dashboard (designer role)
// - Access /dashboard (client role)
```

### Use Case 2: Designer who wants Client Access
```javascript
// Assign both roles
POST /api/admin/users/roles
{
  "userId": "designer-user-id",
  "roleNames": ["designer", "client"]
}

// User can now:
// - Access /designer/dashboard (designer role)
// - Access /dashboard (client role)
```

## Backward Compatibility

- Old `roleId` field is still supported
- Existing users with single role continue to work
- Migration script automatically migrates existing `roleId` to `UserRole` table
- Signup routes create entries in both old and new systems

## Important Notes

1. **Regenerate Prisma Client**: After running migration, you must run `npx prisma generate` to update TypeScript types

2. **Migration**: The migration script automatically migrates existing `roleId` values to the new `UserRole` table

3. **Default Role**: If a user has no roles assigned, they default to "client" role

4. **Cookie Management**: All role cookies are set during unified login, allowing seamless access to all areas

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about `roles` not existing:
1. Make sure you've run `npx prisma generate`
2. Restart your TypeScript server in your IDE
3. The code includes type assertions as a temporary workaround

### Permission Errors on Windows
If Prisma generate fails with permission error:
1. Close any running Next.js dev server
2. Close your IDE
3. Run `npx prisma generate` from command line
4. Restart your IDE

### Migration Issues
If migration fails:
1. Check database connection
2. Ensure you have proper permissions
3. Review the migration SQL file manually
4. You can run the SQL commands directly in your database client
