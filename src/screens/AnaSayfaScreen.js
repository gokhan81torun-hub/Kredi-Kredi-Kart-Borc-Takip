import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function AnaSayfaScreen({ navigation }) {
  const { kartlar, toplamBorc, buAykiOdemeler } = useData();

  const kalanGunHesapla = (sonOdemeTarihi) => {
    if (!sonOdemeTarihi) return 0;
    const tarih = new Date(sonOdemeTarihi);
    const bugun = new Date();
    const fark = Math.ceil((tarih - bugun) / (1000 * 60 * 60 * 24));
    return fark > 0 ? fark : 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ana Sayfa</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Merhaba, Ahmet!</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Toplam Borç Bakiyesi</Text>
          <Text style={styles.summaryAmount}>₺{toplamBorc.toFixed(2)}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summarySubLabel}>Bu Ayki Ödemeler</Text>
            <Text style={styles.summarySubAmount}>₺{buAykiOdemeler.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yaklaşan Ödemeler</Text>
        </View>

        {kartlar.filter(k => k.guncelBorc > 0).map((kart) => {
          const kalanGun = kalanGunHesapla(kart.sonOdemeTarihi);
          return (
            <TouchableOpacity
              key={kart.id}
              style={styles.paymentCard}
              onPress={() => navigation.navigate('OdemeDetay', { kart })}
            >
              <View style={[styles.cardIcon, { backgroundColor: kart.renk }]}>
                <Text style={styles.cardIconText}>{kart.bankaAdi.substring(0, 2)}</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{kart.bankaAdi}</Text>
                <Text style={styles.paymentDate}>
                  Son Ödeme: {kart.sonOdemeTarihi}
                </Text>
                {kalanGun > 0 && (
                  <Text style={styles.paymentDaysLeft}>{kalanGun} gün kaldı</Text>
                )}
              </View>
              <View style={styles.paymentAmount}>
                <Text style={styles.paymentAmountText}>₺{kart.guncelBorc.toFixed(2)}</Text>
                {kart.guncelBorc === 0 && (
                  <View style={styles.paidBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#00ff88" />
                    <Text style={styles.paidText}>Ödendi</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {kartlar.filter(k => k.guncelBorc === 0).map((kart) => (
          <TouchableOpacity
            key={kart.id}
            style={styles.paymentCard}
            onPress={() => navigation.navigate('OdemeDetay', { kart })}
          >
            <View style={[styles.cardIcon, { backgroundColor: kart.renk }]}>
              <Text style={styles.cardIconText}>{kart.bankaAdi.substring(0, 2)}</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>{kart.bankaAdi}</Text>
              <Text style={styles.paymentDate}>{kart.kartAdi}</Text>
            </View>
            <View style={styles.paymentAmount}>
              <Text style={styles.paymentAmountText}>₺{kart.guncelBorc.toFixed(2)}</Text>
              <View style={styles.paidBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#00ff88" />
                <Text style={styles.paidText}>Ödendi</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('YeniKart')}
      >
        <Ionicons name="add" size={32} color="#0a2f1f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2f1f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#1a4d3a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8fb8a8',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summarySubLabel: {
    fontSize: 14,
    color: '#8fb8a8',
  },
  summarySubAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  paymentCard: {
    flexDirection: 'row',
    backgroundColor: '#1a4d3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 13,
    color: '#8fb8a8',
    marginBottom: 2,
  },
  paymentDaysLeft: {
    fontSize: 12,
    color: '#ff6b6b',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paidText: {
    fontSize: 12,
    color: '#00ff88',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
