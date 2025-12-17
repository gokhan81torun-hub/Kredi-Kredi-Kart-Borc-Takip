import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useData } from '../context/DataContext';

export default function YeniKartScreen({ navigation }) {
  const { kartEkle } = useData();
  const [tip, setTip] = useState('Kredi Kartı');
  const [bankaAdi, setBankaAdi] = useState('');
  const [kartAdi, setKartAdi] = useState('');
  const [toplamLimit, setToplamLimit] = useState('');
  const [guncelBorc, setGuncelBorc] = useState('');
  const [sonOdemeGunu, setSonOdemeGunu] = useState('');
  const [minimumOdeme, setMinimumOdeme] = useState('');

  const kaydet = () => {
    if (!bankaAdi || !kartAdi) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const yeniKart = {
      tip,
      bankaAdi,
      kartAdi,
      toplamLimit: parseFloat(toplamLimit) || 0,
      guncelBorc: parseFloat(guncelBorc) || 0,
      asgariTutar: parseFloat(minimumOdeme) || 0,
      sonOdemeGunu: parseInt(sonOdemeGunu) || 0,
      sonOdemeTarihi: '',
      hesapKesimTarihi: '',
      renk: '#' + Math.floor(Math.random()*16777215).toString(16),
    };

    kartEkle(yeniKart);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, tip === 'Kredi Kartı' && styles.toggleButtonActive]}
            onPress={() => setTip('Kredi Kartı')}
          >
            <Text style={[styles.toggleText, tip === 'Kredi Kartı' && styles.toggleTextActive]}>
              Kredi Kartı
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, tip === 'Kredi' && styles.toggleButtonActive]}
            onPress={() => setTip('Kredi')}
          >
            <Text style={[styles.toggleText, tip === 'Kredi' && styles.toggleTextActive]}>
              Kredi
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banka Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Banka seçin veya yazın"
            placeholderTextColor="#6b8f7f"
            value={bankaAdi}
            onChangeText={setBankaAdi}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kart/Kredi Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Maaş Kartım"
            placeholderTextColor="#6b8f7f"
            value={kartAdi}
            onChangeText={setKartAdi}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Toplam Limit</Text>
          <TextInput
            style={styles.input}
            placeholder="₺0,00"
            placeholderTextColor="#6b8f7f"
            keyboardType="numeric"
            value={toplamLimit}
            onChangeText={setToplamLimit}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Güncel Borç</Text>
          <TextInput
            style={styles.input}
            placeholder="₺0,00"
            placeholderTextColor="#6b8f7f"
            keyboardType="numeric"
            value={guncelBorc}
            onChangeText={setGuncelBorc}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Son Ödeme Günü</Text>
            <TextInput
              style={styles.input}
              placeholder="Ayın günü"
              placeholderTextColor="#6b8f7f"
              keyboardType="numeric"
              value={sonOdemeGunu}
              onChangeText={setSonOdemeGunu}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Minimum Ödeme</Text>
            <TextInput
              style={styles.input}
              placeholder="₺0,00"
              placeholderTextColor="#6b8f7f"
              keyboardType="numeric"
              value={minimumOdeme}
              onChangeText={setMinimumOdeme}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={kaydet}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a4d3a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#0a2f1f',
  },
  toggleText: {
    fontSize: 16,
    color: '#8fb8a8',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a4d3a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2a5d4a',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#00ff88',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a2f1f',
  },
});
