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

type ActiveTab = 'beranda' | 'pesanan' | 'promosi' | 'profil';

type Service = {
  id: number;
  title: string;
  description: string;
  price?: string;
  image: string;
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
  const [currentPage, setCurrentPage] = useState<'home' | string>('home');

  const sliderRef = useRef<FlatList<typeof PROMO_SLIDES[number]> | null>(null);

  const handleOrderService = (service: Service) => {
    setCurrentPage(service.route);
    setActiveTab('beranda');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveTab('beranda');
  };

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
  );

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
