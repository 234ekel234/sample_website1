# [Company Name] — Official Website

A static company website showcasing services and products, with integrated ordering via Google Forms and online payment support.

---

## Overview

This website serves as the online presence for **[Company Name]**, providing visitors with:

- Company background and contact information
- A catalog of services and products
- An online order form (powered by Google Forms)
- Payment instructions and options

---

## Pages / Sections

| Section | Description |
|---|---|
| **Home** | Hero banner, tagline, and call-to-action |
| **About** | Company history, mission, and vision |
| **Services** | List of services offered with descriptions |
| **Products** | Product catalog with photos and pricing |
| **Order** | Link to Google Form for placing orders |
| **Payment** | Payment methods and instructions |
| **Contact** | Address, phone, email, and social links |

---

## Ordering

Orders are placed through a **Google Form** linked on the Order page. The form collects:

- Customer name and contact details
- Product/service selection and quantity
- Preferred delivery or pickup option
- Special instructions

> **Google Form link:** *(to be added)*

---

## Payment Methods

After submitting an order form, customers can pay through any of the following:

### GCash / PayMaya
- Send payment to: `0900-000-0000` *(placeholder)*
- Account name: **[Company Name]**
- Send a screenshot of your payment confirmation to our contact number or email.

### Bank Transfer
- Bank: **[Bank Name]**
- Account name: **[Company Name]**
- Account number: `0000-0000-0000` *(placeholder)*
- After transfer, email your receipt to `orders@[company].com`.

### Cash on Delivery / Cash on Pickup
- Available for local deliveries and in-store pickup only.
- Payment is collected upon receipt of goods.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Forms | Google Forms (linked/embedded) |
| Hosting | Vercel (free tier) |

**Design direction:** Corporate & Professional — navy/white/gray palette, strong typographic hierarchy, trust-first layout.

---

## Project Structure

```
sample_website/
├── index.html          # Home page
├── about.html          # About page
├── services.html       # Services page
├── products.html       # Products / catalog page
├── order.html          # Order page (Google Form link/embed)
├── payment.html        # Payment instructions page
├── contact.html        # Contact page
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
└── README.md
```

---

## Setup & Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/sample_website.git
   ```
2. Open `index.html` in a browser to preview locally.
3. Replace all placeholder values (company name, contact info, Google Form URL, payment details).
4. Deploy to **GitHub Pages**:
   - Go to repository **Settings → Pages**
   - Set source to `main` branch, `/ (root)`
   - Your site will be live at `https://<your-username>.github.io/sample_website/`

---

## Customization Checklist

- [ ] Replace `[Company Name]` with the actual company name
- [ ] Add company logo to `assets/images/`
- [ ] Update color scheme in `assets/css/style.css`
- [ ] Insert the real Google Form URL on the Order page
- [ ] Fill in actual payment account details
- [ ] Add real product/service descriptions and photos
- [ ] Update contact information (address, phone, email, social media)

---

## License

This project is for demonstration purposes. All placeholder content should be replaced before going live.
