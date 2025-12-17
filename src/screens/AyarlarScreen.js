import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AyarlarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#8fb8a8" />
            <Text style={styles.menuText}>Profil Bilgileri</Text>
            <Ionicons name="chevron-forward" size={24} color="#6b8f7f" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={24} color="#8fb8a8" />
            <Text style={styles.menuText}>Güvenlik</Text>
            <Ionicons name="chevron-forward" size={24} color="#6b8f7f" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#8fb8a8" />
            <Text style={styles.menuText}>Bildirim Ayarları</Text>
            <Ionicons name="chevron-forward" size={24} color="#6b8f7f" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="alarm-outline" size={24} color="#8fb8a8" />
            <Text style={styles.menuText}>Ödeme Hatırlatıcıları</Text>
            <Ionicons name="chevron-forward" size={24} color="#6b8f7f" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diğer</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#8fb8a8" />
            <Text style={styles.menuText}>Yardım & Destek</Text>
            <Ionicons name="chevron-forward" size={24} color="#6b8f7f" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color="#8fb8a8" />
            <Text style={styles.menuText}>Hakkında</Text>
            <Ionicons name="chevron-forward" size={24} color="#6b8f7f" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8fb8a8',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a4d3a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
