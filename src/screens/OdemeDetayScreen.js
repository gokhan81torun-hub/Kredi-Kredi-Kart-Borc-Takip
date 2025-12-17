import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function OdemeDetayScreen({ route, navigation }) {
  const { kart } = route.params;
  const { odemeEkle, kartGuncelle } = useData();

  const kalanGunHesapla = () => {
    if (!kart.sonOdemeTarihi) return 0;
    const tarih = new Date(kart.sonOdemeTarihi);
    const bugun = new Date();
    const fark = Math.ceil((tarih - bugun) / (1000 * 60 * 60 * 24));
    return fark > 0 ? fark : 0;
  };

  const odemeYap = () => {
    Alert.alert(
      'Ödeme Onayı',
      `${kart.guncelBorc.toFixed(2)} ₺ tutarında ödeme yapmak istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: () => {
            const yeniOdeme = {
              id: Date.now().toString(),
              ay: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) + ' Ekstresi',
              tarih: new Date().toLocaleDateString('tr-TR'),
              tutar: kart.guncelBorc,
              durum: 'Ödendi'
            };
            
            odemeEkle(kart.id, yeniOdeme);
            kartGuncelle(kart.id, { guncelBorc: 0, asgariTutar: 0 });
            
            Alert.alert('Başarılı', 'Ödeme işlemi tamamlandı', [
              { text: 'Tamam', onPress: () => navigation.goBack() }
            ]);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{kart.kartAdi}</Text>
          <Text style={styles.amountLabel}>Ödenecek Tutar</Text>
          <Text style={styles.amount}>₺{kart.guncelBorc.toFixed(2)}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#8fb8a8" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Son Ödeme Tarihi</Text>
                <Text style={styles.infoValue}>{kart.sonOdemeTarihi || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#8fb8a8" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Kalan Gün</Text>
                <Text style={styles.infoValue}>{kalanGunHesapla()} Gün</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Toplam Borç</Text>
            <Text style={styles.detailValue}>₺{kart.guncelBorc.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Asgari Tutar</Text>
            <Text style={styles.detailValue}>₺{kart.asgariTutar.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hesap Kesim Tarihi</Text>
            <Text style={styles.detailValue}>{kart.hesapKesimTarihi || '-'}</Text>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Ödeme Geçmişi</Text>

          {kart.odemeGecmisi && kart.odemeGecmisi.length > 0 ? (
            kart.odemeGecmisi.map((odeme) => (
              <View key={odeme.id} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#00ff88" />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyMonth}>{odeme.ay}</Text>
                  <Text style={styles.historyDate}>{odeme.tarih}</Text>
                </View>
                <Text style={styles.historyAmount}>₺{odeme.tutar.toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noHistory}>Henüz ödeme geçmişi bulunmuyor</Text>
          )}
        </View>
      </ScrollView>

      {kart.guncelBorc > 0 && (
        <TouchableOpacity style={styles.payButton} onPress={odemeYap}>
          <Text style={styles.payButtonText}>Ödendi Olarak İşaretle</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2f1f',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#1a4d3a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#8fb8a8',
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8fb8a8',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  detailsCard: {
    backgroundColor: '#1a4d3a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a5d4a',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8fb8a8',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  historySection: {
    marginBottom: 100,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#1a4d3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  historyIcon: {
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: '#8fb8a8',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  noHistory: {
    fontSize: 14,
    color: '#8fb8a8',
    textAlign: 'center',
    paddingVertical: 20,
  },
  payButton: {
    backgroundColor: '#00ff88',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a2f1f',
  },
});
