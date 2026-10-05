# Jain Connect 360 Degree
> **Subtitle:** *Connecting Every Jain*

A tri-lingual interactive verification portal designed to collect, verify, and synchronize member details across the Jain community.

---

## 🌐 1. Multi-Language Support (Instant 1-Click Toggle)
The entire form dynamically switches language with a single click:
* **English**
* **ગુજરાતી (Gujarati)**
* **हिंदी (Hindi)**

All headers, labels, placeholders, dropdown values, validation error banners, and success confirmation cards translate immediately.

---

## 📋 2. Form Fields & Validation

1. **Name**: Full Name (min 2 characters).
2. **Number (Calling)**: Primary 10-digit mobile contact.
3. **Whats App Number**: WhatsApp contact with a **"Same as Number"** auto-fill shortcut.
4. **Jain Sampradaya / Panth**:
   * *Shwetambar Murtipujak* (શ્વેતાંબર મૂર્તિપૂજક / श्वेतांबर मूर्तिपूजक)
   * *Digambar* (દિગંબર / दिगंबर)
   * *Shwetambar Sthanakvasi* (શ્વેતાંબર સ્થાનકવાસી / श्वेतांबर स्थानकवासी)
   * *Shwetambar Terapanthi* (શ્વેતાંબર તેરાપંથી / श्वेतांबर तेरापंथी)
   * *Other*
5. **Name of Sammaj**:
   * Dropdown featuring prominent Samajs (Visa Oswal, Dasa Oswal, Kutchi Oswal, Porwal/Porwad, Shrimali, Khandelwal, Parwar, Humad, etc.).
   * **"Not found in list? Enter manually..."** fallback that seamlessly reveals a custom input field.
6. **State**: Dropdown containing all Indian states and Union Territories.
7. **City / Town**: Automatically populates major cities based on the selected State, with an **"Other"** option to manually enter any village or taluka.
8. **Business Name / Occupation**: Specific description of work/profession (e.g. Textiles, Diamond Merchant, Software Engineer, Student, etc.).

*(Removed: Residential Address and Family Count as requested).*

---

## 🚀 3. File Summary

| File | Purpose |
| :--- | :--- |
| **[`public.html`](./public.html)** | **Public Form:** The file you share with community members. Contains the 3 languages, clean confirmation card, and no admin records tab. |
| **[`index.html`](./index.html)** | **Admin / Developer App:** Includes the form + **Collected Records** viewer with 1-click **Export to CSV**. |
| **[`google-sheets-script.js`](./google-sheets-script.js)** | Google Apps Script webhook to record submissions in your private Google Sheet. |
| **[`supabase-schema.sql`](./supabase-schema.sql)** | Supabase SQL schema for PostgreSQL cloud database storage. |
| **[`src/InteractiveForm.tsx`](./src/InteractiveForm.tsx)** | React + TypeScript component with Zod validation. |
