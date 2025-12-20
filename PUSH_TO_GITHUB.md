# How to Push Code to Another GitHub Repository

## Step-by-Step Guide

### Option 1: New Repository (Recommended)

1. **Create a new repository on GitHub**
   - Go to your GitHub account
   - Click "New repository"
   - Name it (e.g., `edu2medu-project`)
   - Don't initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Initialize Git (if not already done)**
   ```bash
   git init
   ```

3. **Add all files**
   ```bash
   git add .
   ```

4. **Make initial commit**
   ```bash
   git commit -m "Initial commit: Edu2Medu project"
   ```

5. **Add remote repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   Replace:
   - `YOUR_USERNAME` with your GitHub username
   - `YOUR_REPO_NAME` with your repository name

6. **Push to GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Option 2: If Repository Already Exists

If you want to push to an existing repository:

```bash
# Remove old remote (if exists)
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to new repository
git push -u origin main
```

### Option 3: Using SSH (More Secure)

If you have SSH keys set up:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Important Files to Check

Make sure `.gitignore` includes:
- `node_modules/`
- `.env` files (backend/.env, frontend/.env)
- `dist/` or `build/` folders
- `.DS_Store`
- `*.log`

## Authentication

If prompted for credentials:
- **HTTPS**: Use Personal Access Token (not password)
- **SSH**: Use SSH keys (recommended)

## Quick Commands Reference

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push origin main

# Check remotes
git remote -v

# Remove remote
git remote remove origin
```

