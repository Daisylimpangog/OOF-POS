# 🌐 OOF POS - Network Access Guide

## Access Methods

### 1️⃣ **Local Machine (Same Computer)**
```
http://localhost/OOF%20POS/frontend/index.html
```

### 2️⃣ **Local Network (Other Computers/Tablets)**
```
http://192.168.1.13/OOF%20POS/frontend/index.html
```
Replace `192.168.1.13` with your actual server IP address.

### 3️⃣ **From Mobile Devices**
- Make sure the device is connected to the same WiFi network
- Use the IP address link above in your mobile browser
- Example: `http://192.168.1.13/OOF%20POS/frontend/index.html`

---

## 🔧 Configuration Details

### Your Server Information
- **Local IP:** 192.168.1.13
- **Port:** 80 (default HTTP)
- **Application Path:** `/OOF%20POS/`

### API Endpoints
The application automatically detects and uses the correct API base URL:
- From localhost: `http://localhost/OOF%20POS/backend/`
- From network IP: `http://192.168.1.13/OOF%20POS/backend/`
- API is dynamically configured in `frontend/js/main.js`

---

## ✅ How It Works

The application uses dynamic hostname detection:
```javascript
const host = window.location.hostname; // Automatically detects the IP/domain
```

This means:
- ✅ Works on any device accessing via the server's IP
- ✅ API calls route correctly to the backend
- ✅ No configuration changes needed when switching devices

---

## 📝 Access Checklist

1. **Ensure XAMPP is Running**
   - Apache module must be active
   - MySQL must be active (for database)

2. **Check Firewall Settings**
   - Allow port 80 (HTTP) through Windows Firewall
   - Or disable firewall for local network

3. **Test Connection**
   - From local: `http://localhost/OOF%20POS/frontend/index.html`
   - From network: `http://192.168.1.13/OOF%20POS/frontend/index.html`

4. **Access from Mobile**
   - Open browser on phone/tablet
   - Enter: `http://192.168.1.13/OOF%20POS/frontend/index.html`
   - Note: Must be on same WiFi network

---

## 🔐 Security Notes

- Default password: `admin123` (change this in production)
- Application uses session storage for authentication
- Accessible only on your local network (not the internet)
- For external access, use VPN or port forwarding (not recommended for production)

---

## 🚀 To Share the Application

You can share this link with team members on your network:
```
http://192.168.1.13/OOF%20POS/frontend/index.html
```

Password: `admin123`

---

## ❓ Troubleshooting

**Can't access from other device?**
1. Check if XAMPP Apache is running
2. Check Windows Firewall settings
3. Verify devices are on same network
4. Try pinging the IP: `ping 192.168.1.13`

**API not loading?**
1. Check browser console (F12)
2. Verify backend/api_*.php files exist
3. Check MySQL connection in backend/config.php

**Port 80 already in use?**
1. Change Apache port in XAMPP settings
2. Update the access URL accordingly
