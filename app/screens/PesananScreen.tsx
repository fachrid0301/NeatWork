import React, { useMemo, useState } from 'react';
import './DashboardScreen.css';

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

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  mendatang: 'order-badge-upcoming',
  berlangsung: 'order-badge-progress',
  selesai: 'order-badge-done',
};

const STATUS_BADGE_LABEL: Record<OrderStatus, string> = {
  mendatang: 'Mendatang',
  berlangsung: 'Sedang Berlangsung',
  selesai: 'Selesai',
};

const PesananScreen = () => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('mendatang');

  const filteredOrders = useMemo(
    () => ORDERS.filter((order) => order.status === activeStatus),
    [activeStatus],
  );

  return (
    <div className="orders-screen">
      <header className="orders-header">
        <h1 className="orders-title">Pesanan</h1>
        <p className="orders-subtitle">
          Pantau semua aktivitas kebersihan Anda di satu tempat
        </p>
      </header>

      <div className="orders-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`orders-tab ${activeStatus === tab.id ? 'orders-tab-active' : ''}`}
            onClick={() => setActiveStatus(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty-state">
            <span className="orders-empty-icon">🗓️</span>
            <p className="orders-empty-title">Belum ada pesanan {STATUS_BADGE_LABEL[activeStatus]}</p>
            <p className="orders-empty-text">
              Pesanan yang {STATUS_BADGE_LABEL[activeStatus].toLowerCase()} akan muncul di sini.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-icon-wrapper">
                  <span className="order-icon">{order.icon}</span>
                </div>
                <div className="order-header-text">
                  <h3 className="order-title">{order.title}</h3>
                  <p className="order-id">#{order.id}</p>
                </div>
                <span className={`order-badge ${STATUS_BADGE_CLASS[order.status]}`}>
                  {STATUS_BADGE_LABEL[order.status]}
                </span>
              </div>

              <div className="order-info-row">
                <div>
                  <p className="order-info-label">Jadwal</p>
                  <p className="order-info-value">{order.date}</p>
                  <p className="order-info-time">{order.time}</p>
                </div>
                <div>
                  <p className="order-info-label">Petugas</p>
                  <p className="order-info-value">{order.helper}</p>
                  <p className="order-info-time">Gender sesuai pilihan</p>
                </div>
              </div>

              <div className="order-address">
                <p className="order-info-label">Alamat</p>
                <p className="order-info-value">{order.address}</p>
              </div>

              <div className="order-actions">
                {order.status !== 'selesai' ? (
                  <>
                    <button className="btn btn-outline order-btn">Ubah Jadwal</button>
                    <button className="btn btn-primary order-btn">Lihat Detail</button>
                  </>
                ) : (
                  <button className="btn btn-outline order-btn">Pesan Lagi</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PesananScreen;


