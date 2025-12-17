import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function GecmisScreen() {
  const { kartlar } = useData();

  const tumOdemeler = kartlar
    .flatMap(kart => 
      (kart.odemeGecmisi || []).map(odeme => ({
        ...odeme,
        kartAdi: kart.kartAdi,
        bankaAdi: kart.bankaAdi
      }))
    )
    .sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ödeme Geçmişi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {tumOdemeler.length > 0 ? (
          tumOdemeler.map((odeme) => (
            <View key={odeme.id} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons name="checkmark-circle" size={28} color="#00ff88" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyBank}>{odeme.bankaAdi}</Text>
                <Text style={styles.historyCard}>{odeme.kartAdi}</Text>
                <Text style={styles.historyDate}>{odeme.tarih}</Text>
              </View>
              <View style={styles.historyAmount}>
                <Text style={styles.historyAmountText}>₺{odeme.tutar.toFixed(2)}</Text>
                <Text style={styles.historyStatus}>{odeme.durum}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#6b8f7f" />
            <Text style={styles.emptyText}>Henüz ödeme geçmişi bulunmuyor</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2f1f',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  historyBank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  historyCard: {
    fontSize: 14,
    color: '#8fb8a8',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#6b8f7f',
  },
  historyAmount: {
    alignItems: 'flex-end',
  },
  historyAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 12,
    color: '#00ff88',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b8f7f',
    marginTop: 16,
  },
});
