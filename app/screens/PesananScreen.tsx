import React, { useEffect, useMemo, useState } from 'react';
import './DashboardScreen.css';
import { listBookings } from '../../services/booking.api';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type OrderStatus = 'mendatang' | 'berlangsung' | 'selesai';

type Order = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: OrderStatus;
  address: string;
  icon: string;
  helper: string;
};

const STATUS_TABS: { id: OrderStatus; label: string }[] = [
  { id: 'mendatang', label: 'Mendatang' },
  { id: 'berlangsung', label: 'Berlangsung' },
  { id: 'selesai', label: 'Selesai' },
];

const STATUS_BADGE_LABEL: Record<OrderStatus, string> = {
  mendatang: 'Mendatang',
  berlangsung: 'Sedang Berlangsung',
  selesai: 'Selesai',
};

const ORDERS: Order[] = [
  {
    id: 'ORD-2101',
    title: 'Deep Cleaning',
    date: 'Selasa, 19 Nov 2025',
    time: '09:00 - 12:00',
    status: 'mendatang',
    address: 'Jl. Melati No. 21, Jakarta Selatan',
    icon: '✨',
    helper: 'Tim Profesional',
  },
  {
    id: 'ORD-2092',
    title: 'ART (per jam)',
    date: 'Hari ini',
    time: '14:00 - 16:00',
    status: 'berlangsung',
    address: 'Apartemen Green Lake Tower B-1203',
    icon: '🧹',
    helper: 'Dewi P.',
  },
  {
    id: 'ORD-2084',
    title: 'Subscription & Ticket',
    date: 'Sabtu, 16 Nov 2025',
    time: '08:00 - 11:00',
    status: 'selesai',
    address: 'Jl. Pangeran Antasari No. 10',
    icon: '🎫',
    helper: 'Tim Langganan',
  },
];

const PesananScreen = () => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('mendatang');
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listBookings();
        const arr = Array.isArray(data) ? data : [];
        const mapped: Order[] = arr.map((b: any, idx: number) => ({
          id: String(b.id ?? idx + 1),
          title: String(b.title ?? b.service_name ?? 'Pesanan'),
          date: String(b.date ?? b.scheduled_date ?? ''),
          time: String(b.time ?? b.scheduled_time ?? ''),
          status: (['mendatang', 'berlangsung', 'selesai'].includes(b.status) ? b.status : 'mendatang') as OrderStatus,
          address: String(b.address ?? b.lokasi ?? ''),
          icon: '🧹',
          helper: String(b.staff_name ?? 'Tim'),
        })).filter((o) => !!o.id);
        if (mounted && mapped.length) {
          setOrders(mapped);
        }
      } catch (_) {
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = useMemo(
    () => orders.filter((order) => order.status === activeStatus),
    [activeStatus, orders],
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIconWrapper}>
          <Text style={styles.orderIcon}>{item.icon}</Text>
        </View>
        <View style={styles.orderHeaderText}>
          <Text style={styles.orderTitle}>{item.title}</Text>
          <Text style={styles.orderId}>#{item.id}</Text>
        </View>
        <View
          style={[
            styles.orderBadge,
            item.status === 'mendatang' && styles.orderBadge_mendatang,
            item.status === 'berlangsung' && styles.orderBadge_berlangsung,
            item.status === 'selesai' && styles.orderBadge_selesai,
          ]}
        >
          <Text style={styles.orderBadgeText}>{STATUS_BADGE_LABEL[item.status]}</Text>
        </View>
      </View>

      <View style={styles.orderInfoRow}>
        <View style={styles.orderInfoColumn}>
          <Text style={styles.orderInfoLabel}>Jadwal</Text>
          <Text style={styles.orderInfoValue}>{item.date}</Text>
          <Text style={styles.orderInfoTime}>{item.time}</Text>
        </View>
        <View style={styles.orderInfoColumn}>
          <Text style={styles.orderInfoLabel}>Petugas</Text>
          <Text style={styles.orderInfoValue}>{item.helper}</Text>
          <Text style={styles.orderInfoTime}>Gender sesuai pilihan</Text>
        </View>
      </View>

      <View style={styles.orderAddress}>
        <Text style={styles.orderInfoLabel}>Alamat</Text>
        <Text style={styles.orderInfoValue}>{item.address}</Text>
      </View>

      <View style={styles.orderActions}>
        {item.status !== 'selesai' ? (
          <>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Ubah Jadwal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Lihat Detail</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Pesan Lagi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pesanan</Text>
        <Text style={styles.subtitle}>
          Pantau semua aktivitas kebersihan Anda di satu tempat
        </Text>
      </View>

      <View style={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeStatus === tab.id && styles.tabActive]}
            onPress={() => setActiveStatus(tab.id)}
          >
            <Text
              style={[styles.tabLabel, activeStatus === tab.id && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🗓️</Text>
          <Text style={styles.emptyTitle}>
            Belum ada pesanan {STATUS_BADGE_LABEL[activeStatus]}
          </Text>
          <Text style={styles.emptyText}>
            Pesanan yang {STATUS_BADGE_LABEL[activeStatus].toLowerCase()} akan muncul di sini.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(order) => order.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 24,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f1c2e',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c7a93',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#e4e8f2',
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    color: '#6c7a93',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 24,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f1c2e',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c7a93',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    gap: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderIcon: {
    fontSize: 24,
  },
  orderHeaderText: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f1c2e',
  },
  orderId: {
    color: '#6c7a93',
  },
  orderBadge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  orderBadge_mendatang: {
    backgroundColor: '#f97316',
  },
  orderBadge_berlangsung: {
    backgroundColor: '#2563eb',
  },
  orderBadge_selesai: {
    backgroundColor: '#22c55e',
  },
  orderInfoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  orderInfoColumn: {
    flex: 1,
    gap: 4,
  },
  orderInfoLabel: {
    fontSize: 12,
    color: '#6c7a93',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f1c2e',
  },
  orderInfoTime: {
    color: '#6c7a93',
  },
  orderAddress: {
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d4d7dd',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0f1c2e',
    fontWeight: '600',
  },
});

export default PesananScreen;
