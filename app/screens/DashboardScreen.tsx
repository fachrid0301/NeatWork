import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import PesananScreen from './PesananScreen';
import { listJenisService } from '../../services/jenisService.api';
import { createBooking } from '../../services/booking.api';
import { listPromos } from '../../services/promo.api';
import { getMe } from '../../services/user.api';
import { getDashboardSummary } from '../../services/dashboard.api';
import { reverseGeocode, searchAddress } from '../../services/geocode.api';

// Avoid importing react-native-maps on web (it breaks due to codegen incompatibility)
const isWeb = Platform.OS === 'web';
const RNMaps = !isWeb ? require('react-native-maps') : null as any;

type ActiveTab = 'beranda' | 'pesanan' | 'promosi' | 'profil';

type PromoSlide = {
  title: string;
  subtitle?: string;
  discount?: string;
  code: string;
  period?: string;
  emoji?: string;
  image_url?: string;
};

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
  const [services, setServices] = useState<Service[]>([]);
  const [promoSlides, setPromoSlides] = useState<PromoSlide[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeOrderCount, setActiveOrderCount] = useState<number>(0);
  const [nextSchedule, setNextSchedule] = useState<string>('—');

  const sliderRef = useRef<FlatList<PromoSlide> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listJenisService();
        const items = Array.isArray((data as any)) ? (data as any) : [];
        const mapped: Service[] = items.map((j: any, idx: number) => ({
          id: Number(j.id ?? idx + 1),
          title: String(j.nama_service ?? j.nama ?? j.name ?? 'Layanan'),
          description: String(j.deskripsi ?? j.description ?? ''),
          price: j.harga != null ? `Rp ${Number(j.harga).toLocaleString('id-ID')}/jam` : undefined,
          image: typeof j.image_url === 'string' && j.image_url ? String(j.image_url) : String(j.icon ?? '✨'),
          badge: undefined,
          route: `service-${Number(j.id ?? idx + 1)}`,
        }));
        if (mounted && mapped.length) {
          setServices(mapped);
        }
      } catch (_) {
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch promos for banner
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listPromos();
        const arr: any[] = Array.isArray((data as any)) ? (data as any) : (Array.isArray((data as any)?.data) ? (data as any).data : []);
        const mapped: PromoSlide[] = arr.map((p: any) => ({
          title: String(p.title ?? ''),
          subtitle: p.subtitle ? String(p.subtitle) : undefined,
          discount: p.discount ? String(p.discount) : undefined,
          code: String(p.code ?? ''),
          period: p.period ? String(p.period) : undefined,
          emoji: p.emoji ? String(p.emoji) : undefined,
          image_url: p.image_url ? String(p.image_url) : undefined,
        })).filter((x) => x.code && x.title);
        if (mounted && mapped.length) setPromoSlides(mapped);
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch current user for greeting
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe();
        const nama = (me?.nama || me?.name || '').toString();
        const email = (me?.email || '').toString();
        if (!mounted) return;
        if (nama) setUserName(nama);
        if (email) setUserEmail(email);
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch dashboard summary (active_count, next_schedule)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getDashboardSummary();
        if (!mounted) return;
        const active = Number(data?.active_count ?? 0);
        const next = data?.next_schedule ? new Date(data.next_schedule) : null;
        setActiveOrderCount(Number.isFinite(active) ? active : 0);
        setNextSchedule(next ? next.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '—');
      } catch (_) {
        if (!mounted) return;
        setActiveOrderCount(0);
        setNextSchedule('—');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
    item: PromoSlide;
  }) => (
    <View style={[styles.card, styles.promoCard, { width: WINDOW_WIDTH - 48 }]}>
      <View style={styles.promoHeader}>
        <Text style={styles.promoEmoji}>{item.emoji ?? '✨'}</Text>
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
        {/^https?:\/\//.test(item.image) ? (
          <Image source={{ uri: item.image }} style={styles.serviceImage} />
        ) : (
          <Text style={styles.serviceIcon}>{item.image}</Text>
        )}
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
        <Text style={styles.heroGreeting}>Halo, {userName} 👋</Text>
        <Text style={styles.heroSubtitle}>Lanjutkan aktivitas kebersihanmu</Text>
        <View style={styles.heroStatRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Pesanan Aktif</Text>
            <Text style={styles.heroStatValue}>{activeOrderCount}</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Jadwal Terdekat</Text>
            <Text style={styles.heroStatValue}>{nextSchedule}</Text>
          </View>
        </View>
      </View>

      {promoSlides.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promo Spesial</Text>
            <Text style={styles.sectionMeta}>
              {currentSlide + 1}/{promoSlides.length}
            </Text>
          </View>
          <FlatList
            ref={(ref) => {
              sliderRef.current = ref;
            }}
            data={promoSlides}
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
            {promoSlides.map((promo, index) => (
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
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Layanan</Text>
          <Text style={styles.sectionMeta}>{services.length} tersedia</Text>
        </View>
        {services.length > 0 ? (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={renderServiceCard}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <Text style={{ color: '#6c7a93' }}>Belum ada layanan.</Text>
        )}
      </View>

      {/* removed dummy usage section */}
    </ScrollView>
  );

  const ServiceDetailPage = ({ service }: { service: Service }) => {
    const [alamat, setAlamat] = useState('');
    const [serviceDate, setServiceDate] = useState(''); // YYYY-MM-DD
    const [serviceTime, setServiceTime] = useState(''); // HH:MM
    const [duration, setDuration] = useState('2');
    const [preferredGender, setPreferredGender] = useState<'any' | 'male' | 'female'>('any');
    const [peopleCount, setPeopleCount] = useState('1');
    const [catatan, setCatatan] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [markerCoord, setMarkerCoord] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState({
      latitude: -6.200000, // Jakarta default
      longitude: 106.816666,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    const [favorites, setFavorites] = useState<{ label: string; address: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ display_name: string; lat?: string; lon?: string }[]>([]);

    const getCurrentLocation = async (onLocated?: (lat: number, lon: number) => void) => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Izin lokasi ditolak');
            return;
          }
        }
        const geo = (navigator as any).geolocation || (global as any).navigator?.geolocation;
        if (!geo) {
          Alert.alert('Lokasi tidak didukung');
          return;
        }
        geo.getCurrentPosition(
          (pos: any) => {
            const { latitude, longitude } = pos.coords || {};
            if (latitude && longitude) {
              onLocated?.(latitude, longitude);
            }
          },
          (err: any) => Alert.alert('Gagal mengambil lokasi', String(err?.message || 'Unknown')),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } catch (e: any) {
        Alert.alert('Gagal', String(e?.message || e));
      }
    };

    const submitBooking = async () => {
      try {
        if (!alamat || !serviceDate || !serviceTime || !duration || !peopleCount) {
          Alert.alert('Lengkapi Data', 'Mohon isi semua kolom yang wajib.');
          return;
        }
        setSubmitting(true);
        const payload = {
          jenis_service_id: service.id,
          alamat,
          service_date: serviceDate,
          service_time: serviceTime,
          duration: Number(duration),
          preferred_gender: preferredGender,
          people_count: Number(peopleCount),
          catatan: catatan || undefined,
          latitude: markerCoord?.latitude,
          longitude: markerCoord?.longitude,
        } as any;
        await createBooking(payload);
        Alert.alert('Sukses', 'Pemesanan berhasil dibuat');
        setCurrentPage('home');
        setActiveTab('pesanan');
      } catch (e: any) {
        const msg = e?.response?.data?.message || 'Gagal membuat pemesanan';
        Alert.alert('Gagal', String(msg));
      } finally {
        setSubmitting(false);
      }
    };

    return (
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
          <Text style={styles.sectionTitle}>Form Pemesanan</Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text style={styles.inputLabel}>Alamat</Text>
              <TextInput
                style={styles.input}
                placeholder="Alamat lengkap"
                value={alamat}
                onChangeText={setAlamat}
                multiline
              />
              <TouchableOpacity style={[styles.secondaryButton, { marginTop: 8 }]} onPress={() => setShowMapPicker(true)}>
                <Text style={styles.secondaryButtonText}>Pilih dari Peta</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1 }]}
                  onPress={() =>
                    getCurrentLocation(async (lat, lon) => {
                      try {
                        const res = await reverseGeocode(lat, lon);
                        if (res?.address) setAlamat(res.address);
                        setRegion((r) => ({ ...r, latitude: lat, longitude: lon }));
                        setMarkerCoord({ latitude: lat, longitude: lon });
                      } catch (e) {
                        Alert.alert('Gagal', 'Tidak bisa reverse geocode lokasi saat ini');
                      }
                    })
                  }
                >
                  <Text style={styles.secondaryButtonText}>Lokasi Saat Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1 }]}
                  onPress={() => {
                    if (!alamat) {
                      Alert.alert('Alamat kosong', 'Isi alamat terlebih dahulu');
                      return;
                    }
                    const label = `Favorit ${favorites.length + 1}`;
                    setFavorites((prev) => [...prev, { label, address: alamat }]);
                    Alert.alert('Tersimpan', `Alamat disimpan sebagai ${label}`);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Simpan ke Favorit</Text>
                </TouchableOpacity>
              </View>
              {favorites.length ? (
                <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {favorites.map((fav, idx) => (
                    <TouchableOpacity
                      key={fav.label + idx}
                      style={styles.chip}
                      onPress={() => setAlamat(fav.address)}
                      onLongPress={() => setFavorites((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <Text style={styles.chipText}>{fav.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Tanggal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={serviceDate}
                  onChangeText={setServiceDate}
                />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <TouchableOpacity
                    style={styles.chip}
                    onPress={() => setServiceDate(new Date().toISOString().slice(0, 10))}
                  >
                    <Text style={styles.chipText}>Hari ini</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.chip}
                    onPress={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      setServiceDate(d.toISOString().slice(0, 10));
                    }}
                  >
                    <Text style={styles.chipText}>Besok</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Jam</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={serviceTime}
                  onChangeText={setServiceTime}
                />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  {['09:00', '13:00', '16:00', '19:00'].map((t) => (
                    <TouchableOpacity key={t} style={styles.chip} onPress={() => setServiceTime(t)}>
                      <Text style={styles.chipText}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Durasi (jam)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Jumlah Petugas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  keyboardType="numeric"
                  value={peopleCount}
                  onChangeText={setPeopleCount}
                />
              </View>
            </View>
            <View>
              <Text style={styles.inputLabel}>Preferensi Gender (any/male/female)</Text>
              <TextInput
                style={styles.input}
                placeholder="any"
                autoCapitalize="none"
                value={preferredGender}
                onChangeText={(t) => {
                  const v = (t || '').toLowerCase();
                  if (v === 'male' || v === 'female' || v === 'any') setPreferredGender(v as any);
                }}
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Catatan (opsional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Tambahan informasi"
                value={catatan}
                onChangeText={setCatatan}
                multiline
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={submitBooking} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? 'Memesan...' : 'Pesan Layanan'}</Text>
        </TouchableOpacity>

        {showMapPicker && (
          <View style={styles.mapModalOverlay}>
            <View style={styles.mapModalCard}>
              <View style={styles.mapHeader}>
                <Text style={styles.sectionTitle}>Pilih Lokasi</Text>
                <TouchableOpacity onPress={() => setShowMapPicker(false)}>
                  <Text style={styles.backButtonText}>Tutup</Text>
                </TouchableOpacity>
              </View>
              {isWeb ? (
                <View style={{ gap: 8, flex: 1 }}>
                  <Text style={styles.inputLabel}>Cari alamat (OSM)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mis. Monas, Jakarta"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={async () => {
                      if (!searchQuery) return;
                      try {
                        const data = await searchAddress(searchQuery);
                        setSearchResults(Array.isArray(data) ? data : []);
                      } catch (e) {
                        Alert.alert('Gagal', 'Tidak bisa mencari alamat');
                      }
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Cari</Text>
                  </TouchableOpacity>
                  {/* Static OSM map preview (click opens OSM site in new tab) */}
                  <TouchableOpacity
                    onPress={() => {
                      const lat = markerCoord?.latitude ?? region.latitude;
                      const lon = markerCoord?.longitude ?? region.longitude;
                      const url = `https://www.openstreetmap.org/#map=16/${lat}/${lon}`;
                      Linking.openURL(url).catch(() => {});
                    }}
                    style={{ height: 260, borderRadius: 12, overflow: 'hidden' }}
                  >
                    <Image
                      source={{
                        uri: `https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(
                          String(markerCoord?.latitude ?? region.latitude),
                        )},${encodeURIComponent(String(markerCoord?.longitude ?? region.longitude))}&zoom=14&size=600x300&markers=${encodeURIComponent(
                          markerCoord ? `${markerCoord.latitude},${markerCoord.longitude},red` : `${region.latitude},${region.longitude},lightblue`
                        )}`,
                      }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <ScrollView style={{ flex: 1 }}>
                    {searchResults.map((it, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                        onPress={() => {
                          const lat = Number((it as any).lat);
                          const lon = Number((it as any).lon);
                          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
                            setMarkerCoord({ latitude: lat, longitude: lon });
                            setRegion((r) => ({ ...r, latitude: lat, longitude: lon }));
                          }
                          setAlamat((it as any).display_name);
                          setShowMapPicker(false);
                        }}
                      >
                        <Text style={{ color: '#0f1c2e' }}>{(it as any).display_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <>
                  <RNMaps.MapView
                    style={styles.map}
                    initialRegion={region}
                    onRegionChangeComplete={(r: any) => setRegion(r)}
                    onLongPress={(e: any) => {
                      const { latitude, longitude } = e.nativeEvent.coordinate;
                      setMarkerCoord({ latitude, longitude });
                    }}
                  >
                    <RNMaps.UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />
                    {markerCoord ? (
                      <RNMaps.Marker coordinate={markerCoord} draggable onDragEnd={(e: any) => setMarkerCoord(e.nativeEvent.coordinate)} />
                    ) : null}
                  </RNMaps.MapView>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity style={[styles.secondaryButton, { flex: 1 }]} onPress={() => setMarkerCoord(null)}>
                      <Text style={styles.secondaryButtonText}>Reset Marker</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.secondaryButton, { flex: 1 }]}
                      onPress={() =>
                        getCurrentLocation((lat, lon) => {
                          setMarkerCoord({ latitude: lat, longitude: lon });
                          setRegion((r) => ({ ...r, latitude: lat, longitude: lon }));
                        })
                      }
                    >
                      <Text style={styles.secondaryButtonText}>Lokasi Saat Ini</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.primaryButton, { flex: 1 }]}
                      onPress={async () => {
                        if (!markerCoord) {
                          Alert.alert('Pilih Lokasi', 'Tekan lama pada peta untuk memilih lokasi.');
                          return;
                        }
                        try {
                          const res = await reverseGeocode(markerCoord.latitude, markerCoord.longitude);
                          if (res?.address) setAlamat(res.address);
                          setShowMapPicker(false);
                        } catch (err) {
                          Alert.alert('Gagal', 'Tidak dapat mendapatkan alamat dari lokasi');
                        }
                      }}
                    >
                      <Text style={styles.primaryButtonText}>Gunakan Lokasi Ini</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  const PromoScreen = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Promo & Penawaran</Text>
        <Text style={styles.sectionMeta}>Update mingguan</Text>
      </View>
      {promoSlides.length > 0 ? (
        promoSlides.map((promo: PromoSlide) => (
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
        ))
      ) : (
        <Text style={{ color: '#6c7a93' }}>Belum ada promo.</Text>
      )}
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
          <Text style={styles.profileName}>{userName || 'Pengguna'}</Text>
          {!!userEmail && <Text style={styles.profileEmail}>{userEmail}</Text>}
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
    () => services.find((s: Service) => s.route === currentPage),
    [currentPage, services],
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
    width: '100%',
    gap: 8,
  },
  serviceIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceIcon: {
    fontSize: 36,
  },
  serviceImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
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
  inputLabel: {
    fontSize: 13,
    color: '#6c7a93',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f1c2e',
    minHeight: 44,
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
  mapModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mapModalCard: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  chipText: {
    color: '#0f1c2e',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DashboardScreen;
