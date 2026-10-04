# Manchester United Reimagined Website

# Start here: setup (once)

1. Accept the collaborator invite from your email or GitHub notifications.
2. Install Git and VS Code if you don't have them.
3. Clone the repo:
   ```
   git clone https://github.com/ssoziderrick/Man-United-website-reimagined.git
   cd REPO
   ```
4. Set your identity. **The email must match an email on your GitHub account**, otherwise your commits will not show under your profile:
   ```
   git config user.name "Your Name"
   git config user.email "your-github-email@example.com"
   ```
5. Create your own branch, named after your page:
   ```
   git checkout -b news-yourname
   ```

## Daily workflow

```
git checkout main
git pull origin main            # get the latest
git checkout news-yourname
git merge main                  # bring latest into your branch

# ...design your page...

git add .
git commit -m "news: add featured article card"
git push origin news-yourname
```

Then open a **Pull Request** on GitHub into `main`. 

## The rules

1. Edit **only** your own page's `.html`, `.css` and `.js` files.
2. **Never** edit the nav, the footer, or `css/base.css`. Need a change? Open a GitHub Issue for the lead.
3. Do not use inline CSS (`style="..."`). Put styles in your own `css/<page>.css`.
4. Put your images in `images/<page>/` (example: `images/news/hero.jpg`) so filenames never clash.
5. Commit small and often, with clear messages: `page: what you did`.
6. Never commit directly to `main`.
7. Use the colors in `base.css` (`var(--red)`, `var(--gold)`) so the site stays consistent. Layout, fonts for headings, and creativity are yours.
8. Be ready to explain every line of your page to the group.

