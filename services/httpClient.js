import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL API Configuration
// Untuk Android Emulator: gunakan 10.0.2.2 (alias untuk localhost)
// Untuk Android Device: gunakan IP address komputer Anda (contoh: 192.168.1.6)
// Untuk iOS Simulator: gunakan localhost
// Untuk Production: gunakan URL lengkap (https://your-api-domain.com)

const getBaseURL = () => {
  // ============================================
  // KONFIGURASI BASE URL API
  // ============================================
  // PENTING: Ganti dengan IP address komputer Anda yang sebenarnya!
  // 
  // CARA MENCARI IP ADDRESS:
  // Windows:
  //   1. Buka CMD (Command Prompt)
  //   2. Ketik: ipconfig
  //   3. Cari "IPv4 Address" di bagian "Wireless LAN adapter Wi-Fi" atau "Ethernet adapter"
  //   4. Contoh: 192.168.1.100
  //
  // Mac/Linux:
  //   1. Buka Terminal
  //   2. Ketik: ifconfig (Mac) atau ip addr (Linux)
  //   3. Cari "inet" di bagian wlan0 atau eth0
  //   4. Contoh: 192.168.1.100
  //
  // PASTIKAN:
  // - HP dan komputer harus dalam WiFi yang SAMA
  // - Backend API harus running di port 8000
  // - Firewall tidak memblokir koneksi
  
  const LOCAL_IP = '192.168.1.6'; // ⚠️ GANTI DENGAN IP KOMPUTER ANDA!
  const API_PORT = '8000'; // Port backend API Anda
  
  // Pilih mode koneksi:
  // - 'emulator': untuk Android Emulator (menggunakan 10.0.2.2)
  // - 'device': untuk Android Device fisik (menggunakan IP komputer)
  const ANDROID_MODE = 'device'; // atau 'emulator'
  
  let baseURL;
  
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      if (ANDROID_MODE === 'emulator') {
        // Android Emulator menggunakan 10.0.2.2 untuk akses localhost
        baseURL = `http://10.0.2.2:${API_PORT}`;
      } else {
        // Android Device fisik menggunakan IP komputer
        baseURL = `http://${LOCAL_IP}:${API_PORT}`;
      }
    } else if (Platform.OS === 'ios') {
      // iOS Simulator bisa menggunakan localhost
      baseURL = `http://localhost:${API_PORT}`;
    } else {
      // Default untuk web
      baseURL = `http://localhost:${API_PORT}`;
    }
  } else {
    // Production mode - ganti dengan URL production Anda
    baseURL = 'https://your-api-domain.com';
  }
  
  // Log untuk debugging (akan muncul di console)
  console.log('🔗 API Base URL:', baseURL);
  console.log('📱 Platform:', Platform.OS);
  console.log('🔧 Mode:', __DEV__ ? 'Development' : 'Production');
  
  return baseURL;
};

const BASE_URL = getBaseURL();

// Helper untuk mendapatkan token dari storage
const getToken = async () => {
  try {
    // Menggunakan expo-secure-store untuk menyimpan token dengan aman
    return await SecureStore.getItemAsync('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper untuk menyimpan token
const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync('access_token', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Helper untuk menghapus token
const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('access_token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// HTTP Client menggunakan fetch API
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token untuk request yang memerlukan autentikasi
    const token = await getToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Tambahkan token jika ada
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Jika ada body, stringify
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      // Log untuk debugging
      console.log('🌐 Request URL:', url);
      console.log('📤 Request Method:', config.method || 'GET');
      
      const response = await fetch(url, config);
      
      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        const error = {
          message: data.message || data.error || 'Terjadi kesalahan pada server',
          status: response.status,
          response: {
            data,
            status: response.status,
          },
        };
        throw error;
      }

      // Return dalam format yang mirip dengan axios
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      // Jika error sudah memiliki format yang benar, throw langsung
      if (error.response || (error.message && error.status !== undefined)) {
        throw error;
      }
      
      // Handle network errors dengan pesan yang lebih jelas
      let errorMessage = 'Terjadi kesalahan jaringan';
      
      // Log error untuk debugging
      console.error('❌ Network Error:', error.message);
      console.error('🔗 URL yang dicoba:', url);
      
      if (error.message) {
        if (error.message.includes('Network request failed')) {
          errorMessage = `Tidak dapat terhubung ke server.\n\nPastikan:\n1. Backend API sudah running di port 8000\n2. IP address sudah benar (cek di console)\n3. HP dan komputer dalam WiFi yang sama\n4. Firewall tidak memblokir koneksi\n\nURL yang dicoba: ${url}`;
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Server tidak merespons.';
        } else {
          errorMessage = error.message;
        }
      }
      
      throw {
        message: errorMessage,
        status: 0,
        response: null,
        originalError: error,
      };
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  }
}

// Export instance http client
export const http = new HttpClient(BASE_URL);

// Export helper functions untuk digunakan di auth.api.js
export { getToken, removeToken, saveToken };

