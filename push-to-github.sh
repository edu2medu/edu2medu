#!/bin/bash

# Script to push code to new GitHub repository
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME"
    echo "Example: ./push-to-github.sh john-doe edu2medu-project"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "🚀 Preparing to push to GitHub..."
echo "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Add all files
echo "📦 Adding files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Initial commit: Edu2Medu project with modern UI and performance optimizations"

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Rename branch to main
git branch -M main

# Push
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "View your repository at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

