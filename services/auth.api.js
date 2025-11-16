import { http, removeToken, saveToken } from './httpClient';

export async function login(email, password) {
  try {
    if (!email || !password) {
      throw { message: 'Email dan password wajib diisi' };
    }

    const response = await http.post('/api/auth/login', { email, password });
    
    // Handle response - bisa dalam format response.data.token atau response.data.data.token
    const token = response.data?.token || response.data?.data?.token;
    const userData = response.data?.data || response.data;
    
    if (token) {
      // Simpan token menggunakan expo-secure-store
      await saveToken(token);
      // Return both user data and token
      return {
        ...userData,
        token: token
      };
    }
    
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle network errors
    if (error.status === 0 || error.message?.includes('Network request failed')) {
      throw { 
        message: 'Tidak dapat terhubung ke server. Pastikan backend API sudah running dan IP address sudah benar.', 
        status: 0 
      };
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Login gagal. Periksa email dan password Anda.';
    throw { message: errorMessage, status: error.response?.status || error.status || 500 };
  }
}

export async function checkEmail(email) {
  if (!email) {
    throw new Error('Email is required');
  }
  const response = await http.post('/api/auth/check-email', { email });
  return response.data;
}

// Fungsi register untuk pelanggan (default role: 'pelanggan')
export async function register({ email, password, password_confirmation, username, role }) {
  try {
    if (!email || !password || !password_confirmation) {
      throw { message: 'email, password, dan password_confirmation wajib diisi' };
    }
    
    // Check email jika fungsi checkEmail tersedia
    try {
      const emailCheck = await checkEmail(email);
      if (emailCheck.exists) {
        throw { message: 'Email sudah terdaftar', status: 400 };
      }
    } catch (checkError) {
      // Jika checkEmail gagal, lanjutkan saja (mungkin endpoint tidak tersedia)
      console.log('Email check skipped:', checkError);
    }
    
    // Default role adalah 'pelanggan' jika tidak diisi
    const userRole = role || 'pelanggan';
    
    const payload = { 
      email, 
      password, 
      password_confirmation,
      role: userRole,
      ...(username ? { username } : {})
    };
    
    const response = await http.post('/api/auth/register', payload);
    return response.data;
  } catch (error) {
    // Handle network errors
    if (error.status === 0 || error.message?.includes('Network request failed')) {
      throw { 
        message: 'Tidak dapat terhubung ke server. Pastikan backend API sudah running dan IP address sudah benar.', 
        status: 0 
      };
    }
    
    if (error.message && error.status) {
      throw error;
    }
    const errorMessage = error.response?.data?.message || error.message || 'Registrasi gagal. Silakan coba lagi.';
    throw { message: errorMessage, status: error.response?.status || error.status || 500 };
  }
}

// Fungsi register khusus untuk petugas (backward compatibility)
export async function registerPetugas({ email, password, password_confirmation }) {
  return register({ email, password, password_confirmation, role: 'petugas' });
}

export async function logout() {
  try {
    await http.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    try {
      // Hapus token dari secure storage
      await removeToken();
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
}

