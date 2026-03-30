@echo off
git init
git remote add origin https://github.com/smartcoding0101-eng/projects-coding.git
git add .
git commit -m "feat: initial dynamic FAPCLAS system with CMS and news"
git branch -M main
git push -u origin main
