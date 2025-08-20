<img width="1352" height="676" alt="image" src="https://github.com/user-attachments/assets/e25bfc57-9199-448b-871f-0a78dd11303e" />

<img width="1364" height="633" alt="image" src="https://github.com/user-attachments/assets/8121a953-3b52-4adc-be7b-cf1a0e24f7cd" />

# 📄 Invoice Reader Web App

A simple web application that reads invoices (image/PDF upload) and extracts the **total amount** using the **Google Cloud Vision API**.  
No login or signup required — just upload a file and get the total instantly.

---

## 🚀 Features
- Upload invoices (image or PDF).
- Uses **Google Cloud Vision API** for text extraction (OCR).
- Automatically detects and highlights the **Total Amount**.
- Clean and minimal UI.
- Works directly in the browser — no backend required.

---

## 🛠️ Tech Stack
- **HTML5** - Structure  
- **CSS3** - Styling  
- **JavaScript (ES6)** - Logic & API integration  
- **Google Cloud Vision API** - Text recognition (OCR)  

---

## 🔑 API Used
This project uses **Google Cloud Vision API** for Optical Character Recognition (OCR).  
You need an **API Key** from Google Cloud:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).  
2. Create a new project and enable **Vision API**.  
3. Generate an **API Key**.  
4. Replace the placeholder key in `script.js`:
   ```javascript
   const API_KEY = "YOUR_API_KEY_HERE";

