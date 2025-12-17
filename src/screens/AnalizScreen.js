import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useData } from '../context/DataContext';

export default function AnalizScreen() {
  const { kartlar, toplamBorc } = useData();

  const toplamLimit = kartlar.reduce((sum, k) => sum + k.toplamLimit, 0);
  const kullanimOrani = toplamLimit > 0 ? (toplamBorc / toplamLimit * 100).toFixed(1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analiz</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Genel Durum</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Toplam Limit</Text>
            <Text style={styles.statValue}>₺{toplamLimit.toFixed(2)}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Toplam Borç</Text>
            <Text style={styles.statValue}>₺{toplamBorc.toFixed(2)}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Kullanım Oranı</Text>
            <Text style={styles.statValue}>%{kullanimOrani}</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(kullanimOrani, 100)}%` }]} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kart Bazlı Analiz</Text>
          
          {kartlar.map((kart) => {
            const kartKullanimOrani = kart.toplamLimit > 0 
              ? (kart.guncelBorc / kart.toplamLimit * 100).toFixed(1) 
              : 0;

            return (
              <View key={kart.id} style={styles.kartItem}>
                <View style={styles.kartHeader}>
                  <Text style={styles.kartName}>{kart.bankaAdi}</Text>
                  <Text style={styles.kartPercentage}>%{kartKullanimOrani}</Text>
                </View>
                <View style={styles.kartDetails}>
                  <Text style={styles.kartDetail}>
                    ₺{kart.guncelBorc.toFixed(2)} / ₺{kart.toplamLimit.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(kartKullanimOrani, 100)}%` }]} />
                </View>
              </View>
            );
          })}
        </View>
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
  card: {
    backgroundColor: '#1a4d3a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 16,
    color: '#8fb8a8',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2a5d4a',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 4,
  },
  kartItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a5d4a',
  },
  kartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  kartPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  kartDetails: {
    marginBottom: 8,
  },
  kartDetail: {
    fontSize: 14,
    color: '#8fb8a8',
  },
});
