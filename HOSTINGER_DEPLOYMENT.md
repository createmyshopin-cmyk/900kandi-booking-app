# Hostinger Deployment Guide

## Step 1: Build the Frontend

Run this command locally to generate production build:

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

---

## Step 2: Setup on Hostinger

### Via Hostinger hPanel:

1. **Access File Manager** (cPanel → File Manager or Hostinger Dashboard)
2. **Navigate to public_html** folder
3. **Upload contents of `dist/` folder** to `public_html/`
   - Delete any default index.html if present
   - Upload all files from your `dist/` folder

### Via FTP:

- Use FileZilla or any FTP client
- **Host**: ftp.yourdomain.com
- **Username/Password**: From Hostinger dashboard
- **Path**: /public_html/
- Upload all files from `dist/` folder

---

## Step 3: Configure Backend (PHP)

1. **Create a new folder** in your hosting:
   - Go to public_html → Create folder named `api` (or `backend`)

2. **Upload backend files**:
   - Upload all files from your `/backend` folder to `/public_html/api/`

3. **Update API URLs** in your frontend code:
   - In your `.js` files (check `src/services/api.js` or similar)
   - Change API calls from localhost to your domain:

   ```javascript
   // Change from:
   const API_BASE = "http://localhost:3000";

   // To:
   const API_BASE = "https://yourdomain.com/api";
   ```

---

## Step 4: Setup Database

1. **Create MySQL Database**:
   - Hostinger Dashboard → Databases → Create New Database
   - Database name, user, password (save these!)

2. **Import SQL Schema**:
   - Go to phpMyAdmin (from Hostinger dashboard)
   - Select your database
   - Import → Choose `database.sql` file from your project
   - Click Import

3. **Update PHP Database Configuration**:
   - Find the database config file in your backend folder
   - Update with your new credentials:
   ```php
   $db['default'] = array(
       'hostname' => 'localhost',
       'username' => 'your_db_user',
       'password' => 'your_db_password',
       'database' => 'your_db_name',
   );
   ```

---

## Step 5: Configure .htaccess (if needed)

Create/update `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
</IfModule>
```

---

## Step 6: Enable HTTPS

- Hostinger usually provides free SSL certificate
- Dashboard → SSL → Auto-activate (or manually enable)
- Update all `http://` URLs to `https://` in frontend code

---

## Socket Server Limitation

⚠️ **Node.js is NOT available on Shared Hosting**

### Alternatives:

1. **Use WebSockets via PHP** (Ratchet library)
2. **Upgrade to Cloud Hosting** (Hostinger Cloud supports Node.js)
3. **Use polling instead of sockets** (frontend polls backend for updates)
4. **Use external service** (Socket.io hosted separately)

---

## Troubleshooting

### 404 errors on page refresh:

- Ensure `.htaccess` is properly configured above

### CORS errors:

- Your PHP backend already has CORS headers, should be fine
- If issues persist, add to backend `.htaccess`:

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
```

### Database connection errors:

- Verify credentials in PHP config match Hostinger database settings
- Check database name matches exactly

### 500 Internal Server Error:

- Check Hostinger error logs (Dashboard → Logs)
- Verify PHP version compatibility (usually PHP 7.4+ is fine)

---

## Recommended Next Steps:

1. Build frontend locally first: `npm run build`
2. Test locally with production build: `npm run preview`
3. Upload to Hostinger
4. Test each feature and check browser console for errors
5. Check Hostinger error logs if issues occur

---

## Admin Panel Access:

If you have an admin frontend:

- Access it at: `https://yourdomain.com/admin-frontend/`
- Update any API URLs there too
