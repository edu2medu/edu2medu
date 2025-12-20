#!/bin/bash

echo "🔧 Fixing GitHub Push Permission Issue"
echo "======================================"
echo ""
echo "Choose an option:"
echo ""
echo "1. Push to YOUR account (satyanarayansaiprasad)"
echo "2. Push to edu2medu account (requires authentication)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "Enter your repository name:"
    read -p "Repository name: " repo_name
    echo ""
    echo "Removing old remote..."
    git remote remove origin
    echo "Adding new remote..."
    git remote add origin https://github.com/satyanarayansaiprasad/$repo_name.git
    echo ""
    echo "✅ Remote updated!"
    echo "Now run: git push -u origin main"
    
elif [ "$choice" == "2" ]; then
    echo ""
    echo "To push to edu2medu account, you need:"
    echo "1. A Personal Access Token from the edu2medu account"
    echo "2. Or be added as a collaborator"
    echo ""
    echo "If you have a token, GitHub will prompt for:"
    echo "  Username: edu2medu (or the account owner)"
    echo "  Password: [paste your Personal Access Token]"
    echo ""
    echo "Then run: git push -u origin main"
else
    echo "Invalid choice"
fi

