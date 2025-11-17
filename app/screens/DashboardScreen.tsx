import React, { useState } from 'react';
import './DashboardScreen.css';
import PesananScreen from './PesananScreen';

type Service = {
  id: number;
  title: string;
  description: string;
  price?: string;
  image: string;
  bgColor: string;
  badge?: string;
  route: string;
};

const NeatWork = () => {
  const [activeTab, setActiveTab] = useState('beranda');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');

  const promoSlides = [
    {
      title: "Cukup Klik Klik Klik",
      subtitle: "Rumah Rapi & Resik",
      discount: "15%",
      code: "MIDWEEKDEALNOV",
      period: "Periode: 10 - 24 November 2025",
      emoji: "🏠✨"
    },
    {
      title: "Promo Akhir Tahun",
      subtitle: "Bersih Total!",
      discount: "20%",
      code: "NEWYEAR2025",
      period: "Periode: 1 - 31 Desember 2025",
      emoji: "🎉🎊"
    },
    {
      title: "Weekend Special",
      subtitle: "Santai, Rumah Bersih",
      discount: "10%",
      code: "WEEKEND2025",
      period: "Setiap Sabtu & Minggu",
      emoji: "🌟💫"
    }
  ];

  const services: Service[] = [
    {
      id: 1,
      title: "ART (per jam)",
      description: "Pembersihan umum, asisten rumahan (alatmu)",
      price: "40rb/jam",
      image: "🧹",
      bgColor: "service-card-blue",
      route: "art-service"
    },
    {
      id: 2,
      title: "Deep Cleaning",
      description: "Cleaning bergaransi kualitas dengan alat lengkap",
      price: "80rb/jam",
      image: "✨",
      bgColor: "service-card-purple",
      route: "deep-cleaning"
    },
    {
      id: 3,
      title: "Subscription & Ticket",
      description: "Langganan pembersihan rumah",
      image: "🎫",
      bgColor: "service-card-green",
      badge: "Popular",
      route: "subscription"
    }
  ];

  const handleOrderService = (service: Service) => {
    setCurrentPage(service.route);
    setActiveTab('beranda');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveTab('beranda');
  };

  // Service Detail Page Component
  const ServiceDetailPage = ({ service }: { service: Service }) => (
    <div className="service-detail-page">
      {/* Header */}
      <div className="service-detail-header">
        <button 
          onClick={handleBackToHome}
          className="back-button"
        >
          <span className="back-button-icon">←</span>
          <span className="back-button-text">Kembali</span>
        </button>
        <div className="service-detail-header-main">
          <div className="service-detail-icon">
            {service.image}
          </div>
          <div className="service-detail-header-text">
            <h1 className="service-detail-title">{service.title}</h1>
            {service.price && (
              <p className="service-detail-price">{service.price}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="service-detail-content">
        {/* Description */}
        <div className="card card-spacing">
          <h2 className="card-title">
            <span className="card-title-icon">📝</span>
            Deskripsi Layanan
          </h2>
          <p className="card-text">{service.description}</p>
        </div>

        {/* Features */}
        <div className="card card-spacing">
          <h2 className="card-title">
            <span className="card-title-icon">⭐</span>
            Keunggulan
          </h2>
          <div className="card-list">
            <div className="card-list-item">
              <span className="card-list-icon">✅</span>
              <p className="card-text">Tenaga profesional terlatih</p>
            </div>
            <div className="card-list-item">
              <span className="card-list-icon">✅</span>
              <p className="card-text">Garansi kepuasan 100%</p>
            </div>
            <div className="card-list-item">
              <span className="card-list-icon">✅</span>
              <p className="card-text">Booking mudah & cepat</p>
            </div>
            <div className="card-list-item">
              <span className="card-list-icon">✅</span>
              <p className="card-text">Pembayaran fleksibel</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="card card-spacing">
          <h2 className="card-title">
            <span className="card-title-icon">📅</span>
            Pilih Jadwal
          </h2>
          
          <div className="form-grid">
            <div>
              <label className="form-label">Tanggal</label>
              <input 
                type="date" 
                className="form-input"
              />
            </div>
            
            <div>
              <label className="form-label">Waktu</label>
              <select className="form-input">
                <option>08:00 - 10:00</option>
                <option>10:00 - 12:00</option>
                <option>13:00 - 15:00</option>
                <option>15:00 - 17:00</option>
              </select>
            </div>

            <div>
              <label className="form-label">Durasi (jam)</label>
              <input 
                type="number" 
                min="1"
                defaultValue="2"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Gender Petugas</label>
              <select className="form-input">
                <option value="">Pilih gender petugas</option>
                <option value="female">Perempuan</option>
                <option value="male">Laki-laki</option>
                <option value="no-preference">Bebas / Apa saja</option>
              </select>
            </div>

            <div>
              <label className="form-label">Alamat</label>
              <textarea 
                rows={3}
                placeholder="Masukkan alamat lengkap..."
                className="form-input textarea"
              />
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="promo-card">
          <div className="promo-card-main">
            <div className="promo-card-icon">🎟️</div>
            <div>
              <p className="promo-card-title">Punya Kode Promo?</p>
              <p className="promo-card-text">Dapatkan diskon spesial!</p>
            </div>
          </div>
          <button className="btn btn-orange">
            Pakai
          </button>
        </div>
      </div>

      {/* Fixed Bottom Order Button */}
      <div className="order-bar">
        <div className="order-bar-top">
          <span className="order-bar-label">Total Estimasi</span>
          <span className="order-bar-total">Rp 80.000</span>
        </div>
        <button className="btn btn-primary btn-full">
          <span>Konfirmasi Pesanan</span>
          <span className="btn-icon">🚀</span>
        </button>
      </div>
    </div>
  );

  // Home Page Component
  const HomePage = () => (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-logo-icon">
            <span className="dashboard-logo-emoji">🏠</span>
          </div>
          <div>
            <h1 className="dashboard-title">NeatWork</h1>
            <p className="dashboard-subtitle">INDONESIA</p>
          </div>
        </div>
        <div className="dashboard-header-right">
          <span className="dashboard-usage-text">50.7 KB/d</span>
          <span className="dashboard-menu-icon">≡</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Promo Banner Carousel */}
        <div className="promo-wrapper">
          <div className="promo-card">
            <div className="promo-decor-top">✨</div>
            <div className="promo-decor-bottom">🌟</div>
            
            <div className="promo-content">
              <div className="promo-header">
                <div className="promo-text">
                  <h2 className="promo-title">
                    {promoSlides[currentSlide].title}
                  </h2>
                  <p className="promo-subtitle">
                    {promoSlides[currentSlide].subtitle}
                  </p>
                  
                  <div className="promo-discount-row">
                    <span className="promo-discount-label">Dapatkan DISKON</span>
                    <span className="promo-discount-value">
                      {promoSlides[currentSlide].discount}
                    </span>
                  </div>
                  
                  <p className="promo-description">
                    untuk pesan Cleaning di Selasa, Rabu & Kamis
                  </p>
                  
                  <div className="promo-code-chip">
                    <span className="promo-code-label">Gunakan Kode:</span>
                    <span className="promo-code-value">
                      {promoSlides[currentSlide].code}
                    </span>
                  </div>
                  
                  <p className="promo-period">
                    {promoSlides[currentSlide].period}
                  </p>
                </div>
                
                <button className="btn btn-ticket">
                  <span className="btn-ticket-icon">🎫</span>
                  <span className="btn-ticket-text">Tiket</span>
                </button>
              </div>
            </div>

            <div className="promo-dots">
              {promoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`promo-dot ${currentSlide === index ? 'promo-dot-active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="services-list">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.bgColor}`}
            >
              {service.badge && (
                <div className="service-badge">
                  {service.badge} 🔥
                </div>
              )}
              
              <div className="service-card-main">
                <div className="service-card-text">
                  <h3 className="service-title">
                    {service.title}
                  </h3>
                  <p className="service-description">
                    {service.description}
                  </p>
                  {service.price && (
                    <div className="service-price-row">
                      <span className="service-price-label">Mulai Dari</span>
                      <span className="service-price-value">
                        {service.price}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="service-image-wrapper">
                  <span className="service-image">
                    {service.image}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => handleOrderService(service)}
                className="btn btn-outline service-order-button"
              >
                <span>Pesan Sekarang</span>
                <span className="service-order-icon">›</span>
              </button>
            </div>
          ))}
        </div>

        {/* Referral Banner */}
        <div className="referral-banner">
          <div className="referral-decor-right">👥</div>
          <div className="referral-decor-left">💰</div>
          
          <div className="referral-content">
            <p className="referral-subtitle">Bagikan 30% diskon untuk teman Anda</p>
            <h3 className="referral-title">
              Dapatkan 50% diskon untuk order berikutnya
            </h3>
            <button className="btn btn-referral">
              <span>Perkenalkan teman</span>
              <span className="btn-icon">🎁</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PromoScreen = () => (
    <div className="promo-screen">
      <div className="promo-screen-card">
        <span className="promo-screen-icon">💡</span>
        <h2>Promo & Kabar Terbaru</h2>
        <p>Kami sedang menyiapkan promo menarik khusus untukmu. Pantau terus halaman ini ya!</p>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="profile-screen">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h2>Nama Pengguna</h2>
          <p>nama@email.com</p>
        </div>
        <button className="btn btn-outline profile-edit-btn">Edit Profil</button>
      </div>

      <div className="profile-menu">
        {[
          { icon: '📋', label: 'Riwayat Pesanan' },
          { icon: '🏡', label: 'Alamat Favorit' },
          { icon: '💳', label: 'Metode Pembayaran' },
          { icon: '⚙️', label: 'Pengaturan Akun' },
        ].map((item) => (
          <button key={item.label} className="profile-menu-item">
            <span className="profile-menu-icon">{item.icon}</span>
            <span>{item.label}</span>
            <span className="profile-menu-arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Find current service for detail page
  const currentService = services.find(s => s.route === currentPage);

  const renderMainView = () => {
    if (currentPage !== 'home') {
      return currentService ? <ServiceDetailPage service={currentService} /> : <HomePage />;
    }

    switch (activeTab) {
      case 'beranda':
        return <HomePage />;
      case 'pesanan':
        return <PesananScreen />;
      case 'promosi':
        return <PromoScreen />;
      case 'profil':
        return <ProfileScreen />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="dashboard-root">
      {renderMainView()}

      {/* Bottom Navigation - Always visible */}
      <div className="bottom-nav">
        <div className="bottom-nav-inner">
          {[
            { id: 'beranda', label: 'Beranda', emoji: '🏠' },
            { id: 'pesanan', label: 'Pesanan', emoji: '📋' },
            { id: 'promosi', label: 'Promosi', emoji: '💰' },
            { id: 'profil', label: 'Profil', emoji: '👤' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'beranda') {
                  handleBackToHome();
                } else {
                  if (currentPage !== 'home') {
                    setCurrentPage('home');
                  }
                  setActiveTab(item.id);
                }
              }}
              className="bottom-nav-item"
            >
              <div
                className={`bottom-nav-icon-wrapper ${
                  activeTab === item.id ? 'bottom-nav-icon-wrapper-active' : ''
                }`}
              >
                <span
                  className={`bottom-nav-icon ${
                    activeTab === item.id ? 'bottom-nav-icon-active' : ''
                  }`}
                >
                  {item.emoji}
                </span>
              </div>
              <span
                className={`bottom-nav-label ${
                  activeTab === item.id ? 'bottom-nav-label-active' : ''
                }`}
              >
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="bottom-nav-indicator" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeatWork;