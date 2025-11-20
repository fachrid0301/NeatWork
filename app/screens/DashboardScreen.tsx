import React, { useEffect, useState } from 'react';
import './DashboardScreen.css';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PesananScreen from './PesananScreen';
import { createBooking } from '../../services/booking.api';
import { listJenisService } from '../../services/jenisService.api';

type ActiveTab = 'beranda' | 'pesanan' | 'promosi' | 'profil';

type Service = {
  id: number;
  title: string;
  description: string;
  price?: string;
<<<<<<< HEAD
  image: string; // URL or emoji
  bgColor: string;
=======
  image: string;
>>>>>>> d6c5b36fd5bc3d9ec599c7c69eb04c81b58b04a7
  badge?: string;
  route: string;
};

const WINDOW_WIDTH = Dimensions.get('window').width;

const PROMO_SLIDES = [
  {
    title: 'Cukup Klik Klik Klik',
    subtitle: 'Rumah Rapi & Resik',
    discount: '15%',
    code: 'MIDWEEKDEALNOV',
    period: 'Periode: 10 - 24 November 2025',
    emoji: '🏠✨',
  },
  {
    title: 'Promo Akhir Tahun',
    subtitle: 'Bersih Total!',
    discount: '20%',
    code: 'NEWYEAR2025',
    period: 'Periode: 1 - 31 Desember 2025',
    emoji: '🎉🎊',
  },
  {
    title: 'Weekend Special',
    subtitle: 'Santai, Rumah Bersih',
    discount: '10%',
    code: 'WEEKEND2025',
    period: 'Setiap Sabtu & Minggu',
    emoji: '🌟💫',
  },
];

const SERVICES: Service[] = [
  {
    id: 1,
    title: 'ART (per jam)',
    description: 'Pembersihan umum, asisten rumahan (alatmu)',
    price: '40rb/jam',
    image: '🧹',
    route: 'art-service',
  },
  {
    id: 2,
    title: 'Deep Cleaning',
    description: 'Cleaning bergaransi kualitas dengan alat lengkap',
    price: '80rb/jam',
    image: '✨',
    route: 'deep-cleaning',
  },
  {
    id: 3,
    title: 'Subscription & Ticket',
    description: 'Langganan pembersihan rumah',
    image: '🎫',
    badge: 'Popular',
    route: 'subscription',
  },
];

const PROFILE_MENU = [
  { icon: '📋', label: 'Riwayat Pesanan' },
  { icon: '🏡', label: 'Alamat Favorit' },
  { icon: '💳', label: 'Metode Pembayaran' },
  { icon: '⚙️', label: 'Pengaturan Akun' },
];

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [currentSlide, setCurrentSlide] = useState(0);
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState('home');
  const [services, setServices] = useState<Service[]>([]);

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

  useEffect(() => {
    (async () => {
      try {
        const data = await listJenisService();
        const items = Array.isArray((data as any)?.data)
          ? (data as any).data
          : (Array.isArray(data) ? (data as any) : []);
        const mapped: Service[] = items.map((j: any, idx: number) => ({
          id: Number(j.id ?? idx + 1),
          title: String(j.nama_service ?? j.nama ?? j.name ?? 'Layanan'),
          description: String(j.deskripsi ?? j.description ?? ''),
          price: j.harga != null ? `Rp ${Number(j.harga).toLocaleString('id-ID')}/jam` : undefined,
          image: String(j.image_url ?? '✨'),
          bgColor: 'service-card-blue',
          badge: undefined,
          route: `service-${Number(j.id ?? idx + 1)}`,
        }));
        setServices(mapped);
      } catch (_) {
        setServices([]);
      }
    })();
  }, []);
=======
  const [currentPage, setCurrentPage] = useState<'home' | string>('home');

  const sliderRef = useRef<FlatList<typeof PROMO_SLIDES[number]> | null>(null);
>>>>>>> d6c5b36fd5bc3d9ec599c7c69eb04c81b58b04a7

  const handleOrderService = (service: Service) => {
    setCurrentPage(service.route);
    setActiveTab('beranda');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveTab('beranda');
  };

<<<<<<< HEAD
  // Service Detail Page Component
  const ServiceDetailPage = ({ service }: { service: Service }) => {
    const [tanggal, setTanggal] = useState('');
    const [waktu, setWaktu] = useState('08:00');
    const [durasi, setDurasi] = useState(2);
    const [gender, setGender] = useState('any');
    const [alamat, setAlamat] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);
    const [catatan, setCatatan] = useState('');
    const [jenisList, setJenisList] = useState<any[]>([]);
    const [jenisId, setJenisId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const showAlert = (msg: string) => {
      try {
        const g: any = globalThis as any;
        if (g && typeof g.alert === 'function') {
          g.alert(msg);
        } else {
          console.log(msg);
        }
      } catch {
        console.log(msg);
      }
    };

    useEffect(() => {
      if (service?.id) {
        setJenisId(service.id);
      }
      (async () => {
        try {
          const data = await listJenisService();
          const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
          setJenisList(items);
          if (items.length && !jenisId && !service?.id) {
            setJenisId(items[0].id);
          }
        } catch (_) {
          // Fallback: biarkan jenisId null, backend akan menolak jika tidak diisi
        }
      })();
    }, []);

    const handleSubmit = async () => {
      if (!jenisId) {
        showAlert('Jenis layanan belum tersedia. Coba lagi nanti.');
        return;
      }
      if (!tanggal || !waktu || !alamat) {
        showAlert('Tanggal, waktu, dan alamat wajib diisi.');
        return;
      }
      setSubmitting(true);
      try {
        const payload = {
          jenis_service_id: jenisId,
          alamat,
          service_date: tanggal,
          service_time: waktu,
          duration: Number(durasi) || 1,
          preferred_gender: gender || 'any',
          people_count: Number(peopleCount) || 1,
          catatan: catatan || undefined,
        };
        await createBooking(payload);
        showAlert('Pemesanan berhasil dibuat');
        // Optional: kembali ke Pesanan tab
        setCurrentPage('home');
        setActiveTab('pesanan');
      } catch (e: any) {
        const msg = e?.message || e?.response?.data?.message || 'Gagal membuat pemesanan';
        showAlert(msg);
      } finally {
        setSubmitting(false);
      }
    };

    return (
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
              <label className="form-label">Jenis Layanan</label>
              <select
                className="form-input"
                value={jenisId ?? ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setJenisId(Number(e.target.value))}
              >
                {jenisList.length === 0 ? (
                  <option value="" disabled>Memuat jenis layanan...</option>
                ) : (
                  jenisList.map((j: any) => (
                    <option key={j.id} value={j.id}>{j.nama_service ?? j.nama ?? j.name ?? `Service ${j.id}`}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="form-label">Tanggal</label>
              <input 
                type="date" 
                className="form-input"
                value={tanggal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTanggal(e.target.value)}
              />
            </div>
            
            <div>
              <label className="form-label">Waktu</label>
              <select className="form-input" value={waktu} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWaktu(e.target.value)}>
                <option value="08:00">08:00</option>
                <option value="10:00">10:00</option>
                <option value="13:00">13:00</option>
                <option value="15:00">15:00</option>
              </select>
            </div>

            <div>
              <label className="form-label">Durasi (jam)</label>
              <input 
                type="number" 
                min="1"
                value={durasi}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDurasi(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Gender Petugas</label>
              <select className="form-input" value={gender} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)}>
                <option value="any">Bebas / Apa saja</option>
                <option value="female">Perempuan</option>
                <option value="male">Laki-laki</option>
              </select>
            </div>

            <div>
              <label className="form-label">Alamat</label>
              <textarea 
                rows={3}
                placeholder="Masukkan alamat lengkap..."
                className="form-input textarea"
                value={alamat}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAlamat(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Jumlah Petugas</label>
              <input 
                type="number"
                min="1"
                value={peopleCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeopleCount(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-col-span-2">
              <label className="form-label">Catatan</label>
              <textarea 
                rows={2}
                placeholder="(Opsional) catatan untuk petugas"
                className="form-input textarea"
                value={catatan}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCatatan(e.target.value)}
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
        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={submitting}>
          <span>Konfirmasi Pesanan</span>
          <span className="btn-icon">🚀</span>
        </button>
      </div>
    </div>
=======
  const renderPromoItem = ({
    item,
  }: {
    item: (typeof PROMO_SLIDES)[number];
  }) => (
    <View style={[styles.card, styles.promoCard, { width: WINDOW_WIDTH - 48 }]}>
      <View style={styles.promoHeader}>
        <Text style={styles.promoEmoji}>{item.emoji}</Text>
        <Text style={styles.promoDiscount}>{item.discount}</Text>
      </View>
      <Text style={styles.promoTitle}>{item.title}</Text>
      <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
      <View style={styles.promoFooter}>
        <View>
          <Text style={styles.promoCodeLabel}>Kode Promo</Text>
          <Text style={styles.promoCode}>{item.code}</Text>
        </View>
        <Text style={styles.promoPeriod}>{item.period}</Text>
      </View>
    </View>
  );

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      onPress={() => handleOrderService(item)}
      style={[styles.card, styles.serviceCard]}
    >
      <View style={styles.serviceIconWrapper}>
        <Text style={styles.serviceIcon}>{item.image}</Text>
        {item.badge ? (
          <View style={styles.serviceBadge}>
            <Text style={styles.serviceBadgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      {item.price ? <Text style={styles.servicePrice}>{item.price}</Text> : null}
    </TouchableOpacity>
>>>>>>> d6c5b36fd5bc3d9ec599c7c69eb04c81b58b04a7
  );
  };

  const HomePage = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroGreeting}>Halo, Asep 👋</Text>
        <Text style={styles.heroSubtitle}>Lanjutkan aktivitas kebersihanmu</Text>
        <View style={styles.heroStatRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Pesanan Aktif</Text>
            <Text style={styles.heroStatValue}>2</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Jadwal Terdekat</Text>
            <Text style={styles.heroStatValue}>19 Nov</Text>
          </View>
        </View>
      </View>

<<<<<<< HEAD
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
                  {(/^https?:\/\//.test(service.image) || service.image.startsWith('/')) ? (
                    <img src={service.image} alt={service.title} className="service-image" />
                  ) : (
                    <span className="service-image">{service.image}</span>
                  )}
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
=======
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Promo Spesial</Text>
          <Text style={styles.sectionMeta}>
            {currentSlide + 1}/{PROMO_SLIDES.length}
          </Text>
        </View>
        <FlatList
          ref={(ref) => {
            sliderRef.current = ref;
          }}
          data={PROMO_SLIDES}
          keyExtractor={(item) => item.code}
          renderItem={renderPromoItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (WINDOW_WIDTH - 48),
            );
            setCurrentSlide(index);
          }}
          contentContainerStyle={styles.sliderContent}
        />
        <View style={styles.sliderDots}>
          {PROMO_SLIDES.map((promo, index) => (
            <View
              key={promo.code}
              style={[
                styles.sliderDot,
                currentSlide === index && styles.sliderDotActive,
              ]}
            />
>>>>>>> d6c5b36fd5bc3d9ec599c7c69eb04c81b58b04a7
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Layanan Populer</Text>
          <Text style={styles.sectionMeta}>Pilih kebutuhanmu</Text>
        </View>
        <FlatList
          data={SERVICES}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          renderItem={renderServiceCard}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catatan Pemakaian</Text>
          <Text style={styles.sectionMeta}>Rata-rata 50.7 KB/d</Text>
        </View>
        <View style={[styles.card, styles.usageCard]}>
          <View>
            <Text style={styles.usageLabel}>Total Estimasi</Text>
            <Text style={styles.usageValue}>Rp 80.000</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Konfirmasi Pesanan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const ServiceDetailPage = ({ service }: { service: Service }) => (
    <ScrollView
      contentContainerStyle={styles.detailContent}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
        <Text style={styles.backButtonIcon}>←</Text>
        <Text style={styles.backButtonText}>Kembali</Text>
      </TouchableOpacity>

      <View style={[styles.card, styles.detailHeaderCard]}>
        <Text style={styles.detailEmoji}>{service.image}</Text>
        <Text style={styles.detailTitle}>{service.title}</Text>
        {service.price ? (
          <Text style={styles.detailPrice}>{service.price}</Text>
        ) : null}
        <Text style={styles.detailDescription}>{service.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Keunggulan</Text>
        {['Tenaga profesional', 'Garansi 100%', 'Booking cepat', 'Pembayaran fleksibel'].map(
          (item) => (
            <View key={item} style={styles.detailListItem}>
              <Text style={styles.detailListIcon}>✅</Text>
              <Text style={styles.detailListText}>{item}</Text>
            </View>
          ),
        )}
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Pesan Layanan</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const PromoScreen = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Promo & Penawaran</Text>
        <Text style={styles.sectionMeta}>Update mingguan</Text>
      </View>
      {PROMO_SLIDES.map((promo) => (
        <View key={promo.code} style={[styles.card, styles.promoListCard]}>
          <Text style={styles.promoDiscountBadge}>{promo.discount}</Text>
          <Text style={styles.promoTitle}>{promo.title}</Text>
          <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
          <Text style={styles.promoCode}>
            Gunakan kode <Text style={styles.promoCodeHighlight}>{promo.code}</Text>
          </Text>
          <Text style={styles.promoPeriod}>{promo.period}</Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Gunakan Promo</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const ProfileScreen = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, styles.profileCard]}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>👤</Text>
        </View>
        <View>
          <Text style={styles.profileName}>Asep Nusrulah</Text>
          <Text style={styles.profileEmail}>asep@gmail.com</Text>
        </View>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Edit Profil</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.profileMenuCard]}>
        {PROFILE_MENU.map((item) => (
          <TouchableOpacity key={item.label} style={styles.profileMenuItem}>
            <Text style={styles.profileMenuIcon}>{item.icon}</Text>
            <Text style={styles.profileMenuLabel}>{item.label}</Text>
            <Text style={styles.profileMenuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const currentService = useMemo(
    () => SERVICES.find((service) => service.route === currentPage),
    [currentPage],
  );

  const renderMainView = () => {
    if (currentPage !== 'home' && currentService) {
      return <ServiceDetailPage service={currentService} />;
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
    <View style={styles.root}>
      {renderMainView()}
      <View style={styles.bottomNav}>
        {(
          [
            { id: 'beranda', label: 'Beranda', emoji: '🏠' },
            { id: 'pesanan', label: 'Pesanan', emoji: '📋' },
            { id: 'promosi', label: 'Promosi', emoji: '💰' },
            { id: 'profil', label: 'Profil', emoji: '👤' },
          ] as { id: ActiveTab; label: string; emoji: string }[]
        ).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.bottomNavItem}
            onPress={() => {
              if (item.id === 'beranda') {
                handleBackToHome();
              } else {
                if (currentPage !== 'home') {
                  setCurrentPage('home');
                }
                setActiveTab(item.id);
              }
            }}
          >
            <View
              style={[
                styles.bottomNavIconWrapper,
                activeTab === item.id && styles.bottomNavIconWrapperActive,
              ]}
            >
              <Text
                style={[
                  styles.bottomNavIcon,
                  activeTab === item.id && styles.bottomNavIconActive,
                ]}
              >
                {item.emoji}
              </Text>
            </View>
            <Text
              style={[
                styles.bottomNavLabel,
                activeTab === item.id && styles.bottomNavLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  heroCard: {
    backgroundColor: '#003366',
    padding: 24,
    borderRadius: 24,
    gap: 12,
  },
  heroGreeting: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  heroStatRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  heroStat: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f1c2e',
  },
  sectionMeta: {
    fontSize: 14,
    color: '#6c7a93',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  promoCard: {
    marginRight: 16,
  },
  sliderContent: {
    paddingRight: 24,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoEmoji: {
    fontSize: 28,
  },
  promoDiscount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#d97706',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    color: '#0f1c2e',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#6c7a93',
    marginTop: 4,
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  promoCodeLabel: {
    fontSize: 12,
    color: '#6c7a93',
  },
  promoCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1c2e',
    marginTop: 4,
  },
  promoCodeHighlight: {
    color: '#2563eb',
  },
  promoPeriod: {
    fontSize: 12,
    color: '#6c7a93',
  },
  sliderDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dfe7f5',
  },
  sliderDotActive: {
    width: 24,
    backgroundColor: '#2563eb',
  },
  serviceCard: {
    width: 200,
    gap: 8,
  },
  serviceIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceIcon: {
    fontSize: 36,
  },
  serviceBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceBadgeText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f1c2e',
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6c7a93',
  },
  servicePrice: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  usageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 14,
    color: '#6c7a93',
  },
  usageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f1c2e',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d4d7dd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
    color: '#0f1c2e',
  },
  detailContent: {
    padding: 24,
    gap: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonIcon: {
    fontSize: 18,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  detailHeaderCard: {
    alignItems: 'center',
    gap: 12,
  },
  detailEmoji: {
    fontSize: 40,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f1c2e',
  },
  detailPrice: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: '600',
  },
  detailDescription: {
    textAlign: 'center',
    color: '#6c7a93',
  },
  detailListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  detailListIcon: {
    fontSize: 18,
  },
  detailListText: {
    fontSize: 14,
    color: '#0f1c2e',
  },
  promoListCard: {
    gap: 8,
  },
  promoDiscountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 28,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f1c2e',
  },
  profileEmail: {
    color: '#6c7a93',
  },
  profileMenuCard: {
    padding: 0,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f1f5',
  },
  profileMenuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  profileMenuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#0f1c2e',
  },
  profileMenuArrow: {
    fontSize: 18,
    color: '#6c7a93',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 4,
  },
  bottomNavIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  bottomNavIconWrapperActive: {
    backgroundColor: '#dbeafe',
  },
  bottomNavIcon: {
    fontSize: 18,
  },
  bottomNavIconActive: {
    color: '#2563eb',
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomNavLabelActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default DashboardScreen;
