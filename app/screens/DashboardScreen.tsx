import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  color: string;
};

type MenuItem = {
  id: number;
  title: string;
  icon: string;
  color: string;
};

type NavItem = {
  id: number;
  name: string;
  icon: string;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleLogout = (): void => {
    navigation.navigate('Login');
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
    </View>
  );

  const menuItems: MenuItem[] = [
    { id: 1, title: 'Analytics', icon: '📊', color: '#4A90E2' },
    { id: 2, title: 'Reports', icon: '📈', color: '#7B68EE' },
    { id: 3, title: 'Settings', icon: '⚙️', color: '#FF6B6B' },
    { id: 4, title: 'Notifications', icon: '🔔', color: '#FFA500' },
    { id: 5, title: 'Messages', icon: '💬', color: '#20B2AA' },
    { id: 6, title: 'Profile', icon: '👤', color: '#9370DB' },
  ];

  const navItems: NavItem[] = [
    { id: 1, name: 'Home', icon: '🏠' },
    { id: 2, name: 'Search', icon: '🔍' },
    { id: 3, name: 'Add', icon: '➕' },
    { id: 4, name: 'Activity', icon: '📱' },
    { id: 5, name: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#003366', '#0066cc']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerTitle}>Welcome Back!</Text>
              <Text style={styles.headerSubtitle}>John Doe</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <StatCard title="Total Users" value="2,547" icon="👥" color="#4A90E2" />
            <StatCard title="Revenue" value="$45.2K" icon="💰" color="#27AE60" />
            <StatCard title="Orders" value="1,423" icon="📦" color="#E74C3C" />
            <StatCard title="Growth" value="+23%" icon="📈" color="#F39C12" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[item.color + '20', item.color + '10']}
                  style={styles.menuIconContainer}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </LinearGradient>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>📋</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New order received</Text>
                <Text style={styles.activityTime}>{item} hour ago</Text>
              </View>
              <TouchableOpacity style={styles.activityBtn}>
                <Text style={styles.activityBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => setActiveTab(item.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.navIconContainer,
              activeTab === item.id && styles.navIconActive
            ]}>
              <Text style={[
                styles.navIcon,
                activeTab === item.id && styles.navIconTextActive
              ]}>
                {item.icon}
              </Text>
            </View>
            <Text style={[
              styles.navText,
              activeTab === item.id && styles.navTextActive
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  notificationBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 22,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
  },
  statIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 55) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 30,
  },
  menuTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#003366',
  },
  activityBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    borderRadius: 15,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 20,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#003366',
  },
  navIcon: {
    fontSize: 22,
  },
  navIconTextActive: {
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#003366',
    fontWeight: '700',
  },
});

export default DashboardScreen;