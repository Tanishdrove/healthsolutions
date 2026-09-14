# P3 Health Solutions LLP — Implementation & Testing Guide

## Table of Contents

1. [Project Structure](#project-structure)
2. [How to Run Locally](#how-to-run-locally)
3. [Customisation Steps](#customisation-steps)
4. [Feature Testing Checklist](#feature-testing-checklist)
5. [Browser Compatibility](#browser-compatibility)
6. [Deployment](#deployment)

---

## Project Structure

```
healthsolutions/
├── index.html          # Main single-page website
├── css/
│   └── styles.css      # All styles (responsive, animations, components)
├── js/
│   └── main.js         # All interactions (nav, slider, counters, form)
├── images/             # Drop real photos here (see Customisation)
└── IMPLEMENTATION.md   # This file
```

---

## How to Run Locally

### Option 1 — Open directly in browser (simplest)

```bash
# Navigate to the project folder
cd /home/ahoy/workspace/healthsolutions

# Open in your default browser
xdg-open index.html          # Linux
open index.html               # macOS
start index.html              # Windows
```

Or just double-click `index.html` in your file explorer.

> **Note:** All assets (CSS, JS) are loaded via relative paths, so this works with zero setup.

---

### Option 2 — Local dev server (recommended for testing)

Using Python (built into every system):

```bash
cd /home/ahoy/workspace/healthsolutions

# Python 3
python3 -m http.server 8080

# Python 2 (fallback)
python -m SimpleHTTPServer 8080
```

Then open: [http://localhost:8080](http://localhost:8080)

---

### Option 3 — VS Code Live Server

1. Install the **Live Server** extension in VS Code / Kiro
2. Right-click `index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500`
4. Auto-reloads on every file save

---

### Option 4 — Node.js `serve`

```bash
npx serve /home/ahoy/workspace/healthsolutions
```

---

## Customisation Steps

### 1. Update Contact Details

Open `index.html` and replace these placeholders:

| Placeholder | Replace with | Where |
|---|---|---|
| `+91 99999 99999` | Your real phone number | Hero CTA, Contact section, Footer |
| `info@p3healthsolutions.com` | Your real email | Contact section, Footer |
| `Your City, State – PIN Code` | Real address | Contact section, Footer |
| `https://wa.me/919999999999` | Your WhatsApp number | Floating button (bottom-right) |

Quick find-and-replace in any editor:
```
Find:    +91 99999 99999
Replace: +91 XXXXX XXXXX
```

---

### 2. Replace Gallery Placeholders with Real Photos

The gallery currently uses SVG illustrations. To swap in real photos:

1. Copy your lab photos into the `images/` folder (JPG or WebP recommended)
2. In `index.html`, find each `<div class="gallery-item ...">` block
3. Replace the inner `<svg>` with an `<img>` tag:

```html
<!-- Before -->
<div class="gallery-item gallery-item--wide" ...>
  <div class="gallery-item__inner">
    <svg ...>...</svg>
  </div>
</div>

<!-- After -->
<div class="gallery-item gallery-item--wide" ...>
  <div class="gallery-item__inner">
    <img src="images/lab-main.jpg" alt="Main laboratory workstation" loading="lazy" />
  </div>
</div>
```

Add this CSS to `styles.css` so images fill the cards:

```css
.gallery-item__inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

---

### 3. Update Logo

Replace the inline SVG cross icon with your actual logo:

```html
<!-- In index.html, find .logo__icon and replace: -->
<div class="logo__icon">
  <img src="images/logo.png" alt="P3 Health Solutions Logo" width="42" height="42" />
</div>
```

---

### 4. Update Statistics

In `index.html`, find the `.stats` section and update `data-target` values:

```html
<div class="stat-card__number" data-target="50000" data-suffix="+">0</div>
<!-- Change 50000 to your actual patient count -->
```

---

### 5. Update Package Prices

Find the `.packages` section and edit the `₹` price values to match your actual rates.

---

### 6. Update Lab Hours

Search for `7:00 AM – 8:00 PM` and `8:00 AM – 2:00 PM` and replace with your actual timings. These appear in the Contact section and Footer.

---

### 7. Connect the Booking Form (Backend Integration)

The form currently simulates submission. To connect to a real backend:

**Option A — Formspree (no backend needed):**

```html
<!-- In index.html, update the form tag: -->
<form class="contact-form" id="contactForm"
      action="https://formspree.io/f/YOUR_FORM_ID"
      method="POST">
```

Then in `js/main.js`, replace the `setTimeout` simulation block with:

```javascript
// Replace the setTimeout block in initContactForm()
const formData = new FormData(form);
fetch(form.action, {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/json' }
})
.then(res => {
  if (res.ok) {
    form.reset();
    successEl.hidden = false;
    setTimeout(() => { successEl.hidden = true; }, 6000);
  }
})
.finally(() => {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit Booking Request';
});
```

**Option B — EmailJS (client-side email):**
See [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

---

### 8. Add Google Maps

In the Contact section, add an embed after the `.contact__details` div:

```html
<div class="contact__map" style="margin-top:32px; border-radius:12px; overflow:hidden;">
  <iframe
    src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
    width="100%" height="280" style="border:0;"
    allowfullscreen="" loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="P3 Health Solutions location">
  </iframe>
</div>
```

Get your embed URL from [Google Maps](https://maps.google.com) → Share → Embed a map.

---

### 9. Add Google Analytics

Paste inside `<head>` before `</head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Feature Testing Checklist

Run through each item below after opening the site in a browser.

### Navigation

- [ ] Header is visible and fixed at top on scroll
- [ ] Header gains a box-shadow after scrolling past 40px
- [ ] Clicking each nav link scrolls smoothly to the correct section
- [ ] Active nav link updates as you scroll through sections
- [ ] **Book a Test** button in header scrolls to the Contact section
- [ ] Resize browser to ≤ 768px — hamburger icon appears, desktop nav hides
- [ ] Hamburger opens/closes the mobile drawer
- [ ] Clicking a mobile nav link closes the drawer and scrolls correctly
- [ ] Clicking outside the mobile menu closes it

### Hero Section

- [ ] Gradient background animation plays on page load
- [ ] **Book a Test** button scrolls to Contact section
- [ ] **Call Now** button has a `tel:` link
- [ ] Scroll indicator arrow is visible and bounces
- [ ] Clicking the scroll arrow moves to the Stats section

### Stats / Counter Animation

- [ ] Numbers start at 0
- [ ] Counters animate upward when the section scrolls into view
- [ ] Counters animate only once (not on every scroll)
- [ ] Values display with Indian number formatting (e.g. `50,000+`)

### Testimonials Slider

- [ ] 3 cards visible on desktop, 2 on tablet, 1 on mobile
- [ ] Previous (←) and Next (→) buttons advance the slider
- [ ] Dot indicators update to reflect current slide
- [ ] Clicking a dot jumps to that slide
- [ ] Slider auto-advances every 5 seconds
- [ ] Swipe left/right works on touch devices
- [ ] Keyboard arrow keys work when slider has focus

### Booking Form

- [ ] Submitting empty form shows validation errors on required fields
- [ ] Name field rejects input shorter than 2 characters
- [ ] Phone field rejects non-numeric / too-short values
- [ ] Email field (optional) rejects malformed addresses when filled
- [ ] Date picker blocks past dates
- [ ] Test/package dropdown is required
- [ ] Walk-In / Home Collection radio buttons are selectable
- [ ] Valid submission shows "Thank you" success message after ~1.2s
- [ ] Form resets to empty after successful submission
- [ ] Success message disappears after 6 seconds

### Fade-In Animations

- [ ] Service cards fade in when section scrolls into view
- [ ] Package cards, Why Us cards, Gallery items all animate on scroll
- [ ] Each grid staggers its children slightly

### Floating Elements

- [ ] WhatsApp button (green, bottom-right) is visible and links correctly
- [ ] Back-to-top button appears after scrolling 500px
- [ ] Clicking back-to-top scrolls page to top smoothly
- [ ] Both buttons disappear / hide correctly when not needed

### Responsive Layout

| Breakpoint | What to check |
|---|---|
| > 1024px | 4-column packages grid, 3-column services/why-us |
| ≤ 1024px | Packages become 2-column, footer 2-column |
| ≤ 768px | Hamburger menu, 2-column services, 1-slide testimonials |
| ≤ 480px | Single column everywhere, gallery stacks vertically |

### Accessibility

- [ ] Tab through the page — all interactive elements are reachable
- [ ] Focused elements show visible outlines (teal ring)
- [ ] Images and SVGs have meaningful `alt` / `aria-label` attributes
- [ ] Form fields have associated `<label>` elements
- [ ] Error messages are announced via `role="alert"`
- [ ] Nav has `aria-label="Main navigation"`
- [ ] Screen reader: success message uses `aria-live="polite"`

---

## Browser Compatibility

| Browser | Version | Status |
|---|---|---|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Samsung Internet | 14+ | ✅ Full support |
| IE 11 | — | ❌ Not supported (CSS variables, IntersectionObserver) |

> The site uses `IntersectionObserver`, CSS custom properties, `backdrop-filter`, and `scroll-behavior`. All are supported in all modern browsers without polyfills.

---

## Deployment

### Option A — Static hosting (free, recommended)

**Netlify (drag & drop):**
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `healthsolutions/` folder onto the page
3. Your site is live in seconds with a `.netlify.app` URL

**Vercel:**
```bash
npx vercel --cwd /home/ahoy/workspace/healthsolutions
```

**GitHub Pages:**
1. Push the folder contents to a GitHub repo
2. Go to repo Settings → Pages → Source: `main` branch, `/ (root)`
3. Site available at `https://<username>.github.io/<repo-name>`

---

### Option B — cPanel / shared hosting

1. Log in to your hosting control panel
2. Open **File Manager** → `public_html`
3. Upload `index.html`, `css/`, `js/`, `images/` folders
4. Visit your domain — the site is live

---

### Option C — VPS / Linux server (nginx)

```bash
# Copy files to web root
sudo cp -r /home/ahoy/workspace/healthsolutions/* /var/www/html/

# Basic nginx config
sudo nano /etc/nginx/sites-available/p3health
```

```nginx
server {
    listen 80;
    server_name p3healthsolutions.com www.p3healthsolutions.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|webp|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/p3health /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

### Add HTTPS (free SSL via Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d p3healthsolutions.com -d www.p3healthsolutions.com
```

---

## Quick Reference — Things to Replace Before Going Live

| Item | File | Search for |
|---|---|---|
| Phone number | `index.html` | `+91 99999 99999` |
| WhatsApp number | `index.html` | `wa.me/919999999999` |
| Email address | `index.html` | `info@p3healthsolutions.com` |
| Physical address | `index.html` | `Your City, State – PIN Code` |
| Patient count stat | `index.html` | `data-target="50000"` |
| Package prices | `index.html` | `₹499`, `₹999`, `₹1,799`, `₹1,299` |
| Lab hours | `index.html` | `7:00 AM – 8:00 PM` |
| Gallery photos | `index.html` | SVG placeholders in `.gallery-item` |
| Logo | `index.html` | `.logo__icon` SVG |
| Social media links | `index.html` | `href="#"` in `.footer__social` |

---

*Built for P3 Health Solutions LLP — pure HTML/CSS/JS, no build tools, no dependencies.*
