# MapMyKidz - Deployment Guide

Complete guide for deploying MapMyKidz to GitHub Pages and connecting a custom GoDaddy domain.

## 📋 Prerequisites

Before starting deployment, ensure you have:

- **GitHub Account**: For repository hosting and GitHub Pages
- **GoDaddy Account**: For domain registration and DNS management
- **Node.js 18+**: For building the application
- **Git**: For version control
- **Domain Name**: Registered with GoDaddy (e.g., `mapmykidz.com`)

## 🚀 Step 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository" or "Create repository"
3. Configure repository:
   ```
   Repository name: Mapmykidz
   Description: A pediatric growth tracking application for calculating WHO/CDC percentiles and Z-scores
   Visibility: Public (required for free GitHub Pages)
   Initialize with: README, .gitignore (Node), license
   ```
4. Click "Create repository"

### 1.2 Push Your Code

```bash
# Clone your repository (replace YOUR_USERNAME with your GitHub username)
git clone https://github.com/YOUR_USERNAME/Mapmykidz.git
cd Mapmykidz

# Copy your project files to this directory
# (All your source code, package.json, etc.)

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: MapMyKidz growth tracking app"

# Push to GitHub
git push origin main
```

### 1.3 Update Package.json Homepage

Edit `package.json` and update the homepage field:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/Mapmykidz",
  // ... rest of your package.json
}
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🌐 Step 2: GitHub Pages Deployment

### 2.1 Install Dependencies

```bash
# Install project dependencies
npm install

# Verify gh-pages is installed
npm list gh-pages
```

### 2.2 Build and Deploy

```bash
# Build the application
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 2.3 Configure GitHub Pages

1. Go to your GitHub repository
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` (created by gh-pages package)
   - **Folder**: `/ (root)`
5. Click "Save"

### 2.4 Verify Deployment

- Wait 2-5 minutes for deployment
- Visit: `https://YOUR_USERNAME.github.io/Mapmykidz`
- Your app should be live!

## 🏠 Step 3: GoDaddy Domain Setup

### 3.1 Purchase Domain (if not already owned)

1. Go to [GoDaddy.com](https://godaddy.com)
2. Search for your desired domain (e.g., `mapmykidz.com`)
3. Complete purchase and domain registration

### 3.2 Configure DNS Records

1. Log into GoDaddy account
2. Go to "My Products" → "Domains"
3. Find your domain and click "DNS"
4. Add/update DNS records:

#### Option A: Using CNAME (Recommended)
```
Type: CNAME
Name: @ (or leave blank)
Value: YOUR_USERNAME.github.io
TTL: 600 (or default)
```

#### Option B: Using A Records
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153
TTL: 600

Type: A
Name: @ (or leave blank)
Value: 185.199.109.153
TTL: 600

Type: A
Name: @ (or leave blank)
Value: 185.199.110.153
TTL: 600

Type: A
Name: @ (or leave blank)
Value: 185.199.111.153
TTL: 600
```

### 3.3 Create Custom Domain File

Create a file named `CNAME` in your `public` directory:

```bash
# Create CNAME file
echo "yourdomain.com" > public/CNAME
```

Replace `yourdomain.com` with your actual domain.

### 3.4 Update Package.json for Custom Domain

Update your `package.json` homepage:

```json
{
  "homepage": "https://yourdomain.com",
  // ... rest of your package.json
}
```

### 3.5 Redeploy with Custom Domain

```bash
# Commit CNAME file
git add public/CNAME
git commit -m "Add custom domain CNAME"
git push origin main

# Redeploy
npm run deploy
```

### 3.6 Configure GitHub Pages for Custom Domain

1. Go to repository Settings → Pages
2. In "Custom domain" field, enter your domain
3. Check "Enforce HTTPS" (recommended)
4. Click "Save"

## 🔧 Step 4: Advanced Configuration

### 4.1 Environment Variables (if needed)

Create `.env` file for any environment variables:

```bash
# .env
VITE_APP_TITLE=MapMyKidz
VITE_APP_DESCRIPTION=Child Growth Tracker
```

### 4.2 PWA Configuration

Your app is already configured as a PWA. Verify these files exist:

- `public/manifest.json` ✅
- `public/sw.js` ✅
- PWA icons in `public/` directory

### 4.3 HTTPS Configuration

GitHub Pages automatically provides HTTPS. For GoDaddy:
1. Enable SSL certificate in GoDaddy hosting
2. Or use GitHub Pages with custom domain (recommended)

## 🚨 Troubleshooting

### Common Issues

#### 1. 404 Errors on Refresh
**Problem**: React Router routes don't work on page refresh
**Solution**: This is normal for SPA. GitHub Pages handles this automatically.

#### 2. Domain Not Working
**Problem**: Custom domain shows GitHub 404
**Solution**:
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check GitHub Pages settings

#### 3. Build Errors
**Problem**: `npm run build` fails
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Deployment Issues
**Problem**: `npm run deploy` fails
**Solution**:
```bash
# Check gh-pages installation
npm install gh-pages --save-dev

# Clear gh-pages cache
rm -rf node_modules/.cache/gh-pages

# Redeploy
npm run deploy
```

### 4.4 DNS Propagation Check

Check if your DNS has propagated:
```bash
# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com
```

## 📊 Monitoring & Maintenance

### 4.5 Regular Updates

```bash
# Update dependencies
npm update

# Test locally
npm run dev

# Build and deploy
npm run build
npm run deploy
```

### 4.6 Performance Monitoring

- Use GitHub Pages analytics (if available)
- Monitor with Google Analytics (optional)
- Check PWA performance in browser dev tools

## 🔒 Security Considerations

### 4.7 HTTPS Enforcement

- GitHub Pages provides automatic HTTPS
- Always check "Enforce HTTPS" in GitHub Pages settings
- Update any hardcoded HTTP URLs to HTTPS

### 4.8 Content Security Policy

Your app already includes basic security. Consider adding CSP headers if needed.

## 📱 PWA Features

Your app includes these PWA features:
- ✅ Offline functionality
- ✅ Installable on devices
- ✅ Service worker caching
- ✅ App manifest
- ✅ Responsive design

## 🎯 Final Checklist

Before going live:

- [ ] GitHub repository created and code pushed
- [ ] `package.json` homepage updated
- [ ] `npm run deploy` successful
- [ ] GitHub Pages configured (gh-pages branch)
- [ ] Custom domain DNS configured
- [ ] CNAME file created in public directory
- [ ] Custom domain set in GitHub Pages settings
- [ ] HTTPS enforced
- [ ] App tested on multiple devices
- [ ] PWA features verified

## 🆘 Support

If you encounter issues:

1. **GitHub Issues**: Create an issue in your repository
2. **GitHub Pages Docs**: [pages.github.com](https://pages.github.com)
3. **GoDaddy Support**: Contact GoDaddy customer service
4. **DNS Issues**: Use [whatsmydns.net](https://whatsmydns.net) to check propagation

## 🎉 Success!

Once completed, your MapMyKidz app will be available at:
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/Mapmykidz`
- **Custom Domain**: `https://yourdomain.com`

Your pediatric growth tracking application is now live and accessible worldwide! 🌍

---

**Note**: This deployment guide assumes a standard React/Vite setup. Adjust paths and commands if your project structure differs.
