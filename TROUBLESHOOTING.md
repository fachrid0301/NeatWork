# 🔧 Troubleshooting: Koneksi ke Backend API

## ❌ Error: "Tidak dapat terhubung ke server"

Jika Anda melihat error ini saat menggunakan HP (device fisik), ikuti langkah-langkah berikut:

### 📍 Langkah 1: Cari IP Address Komputer Anda

#### Windows:
1. Buka **Command Prompt** (CMD)
2. Ketik: `ipconfig`
3. Cari **"IPv4 Address"** di bagian:
   - **"Wireless LAN adapter Wi-Fi"** (jika pakai WiFi)
   - **"Ethernet adapter"** (jika pakai kabel)
4. Contoh: `192.168.1.100`

#### Mac:
1. Buka **Terminal**
2. Ketik: `ifconfig`
3. Cari **"inet"** di bagian `en0` atau `en1`
4. Contoh: `192.168.1.100`

#### Linux:
1. Buka **Terminal**
2. Ketik: `ip addr` atau `ifconfig`
3. Cari **"inet"** di bagian `wlan0` atau `eth0`
4. Contoh: `192.168.1.100`

### 📝 Langkah 2: Update IP di `services/httpClient.js`

1. Buka file `services/httpClient.js`
2. Cari baris: `const LOCAL_IP = '192.168.1.6';`
3. Ganti dengan IP komputer Anda yang baru ditemukan
4. Contoh: `const LOCAL_IP = '192.168.1.100';`

### ✅ Langkah 3: Pastikan Semua Sudah Benar

#### Checklist:
- [ ] **Backend API sudah running** di port 8000
  - Test di browser: `http://localhost:8000/api/auth/login`
  - Harus ada response (bisa error, tapi harus ada response)
  
- [ ] **HP dan komputer dalam WiFi yang SAMA**
  - HP dan komputer harus terhubung ke WiFi yang sama
  - Jangan pakai mobile data di HP
  
- [ ] **IP address sudah benar**
  - Cek di console Expo, akan muncul: `🔗 API Base URL: http://192.168.x.x:8000`
  - Pastikan IP ini sesuai dengan IP komputer Anda
  
- [ ] **Firewall tidak memblokir**
  - Windows: Allow port 8000 di Windows Firewall
  - Mac: System Preferences > Security & Privacy > Firewall

### 🧪 Langkah 4: Test Koneksi

1. **Test dari browser di HP:**
   - Buka browser di HP
   - Ketik: `http://[IP-KOMPUTER-ANDA]:8000/api/auth/login`
   - Contoh: `http://192.168.1.100:8000/api/auth/login`
   - Harus ada response (bisa error, tapi harus ada response)

2. **Cek console Expo:**
   - Saat app start, akan muncul log:
     ```
     🔗 API Base URL: http://192.168.1.100:8000
     📱 Platform: android
     🔧 Mode: Development
     ```
   - Pastikan IP di log sesuai dengan IP komputer Anda

### 🔄 Langkah 5: Restart Aplikasi

Setelah mengubah IP:
1. Stop aplikasi Expo (Ctrl+C di terminal)
2. Restart: `npm start` atau `expo start`
3. Reload aplikasi di HP (shake device > Reload)

### 💡 Tips Tambahan

- **Jika masih error**, coba:
  1. Matikan firewall sementara untuk test
  2. Pastikan backend API bisa diakses dari browser komputer
  3. Cek apakah port 8000 sudah benar
  4. Coba restart router WiFi

- **Untuk Android Emulator:**
  - Ubah `ANDROID_MODE = 'emulator'` di `httpClient.js`
  - Gunakan `10.0.2.2` (tidak perlu IP komputer)

- **Untuk iOS Simulator:**
  - Bisa pakai `localhost` langsung

### 📞 Masih Error?

Jika masih error setelah semua langkah di atas:
1. Cek console Expo untuk melihat URL yang dicoba
2. Pastikan backend API benar-benar running
3. Coba test dengan Postman atau browser dulu
4. Pastikan tidak ada proxy atau VPN yang mengganggu

