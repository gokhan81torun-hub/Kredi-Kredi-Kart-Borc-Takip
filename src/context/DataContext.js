import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [kartlar, setKartlar] = useState([
    {
      id: '1',
      tip: 'Kredi Kartı',
      bankaAdi: 'Garanti Bonus',
      kartAdi: 'Garanti Bonus Kredi Kartı',
      toplamLimit: 12480.00,
      guncelBorc: 1850.75,
      asgariTutar: 925.00,
      sonOdemeGunu: 3,
      sonOdemeTarihi: '25 Aralık 2023',
      hesapKesimTarihi: '15 Aralık 2023',
      renk: '#4a9d7f',
      odemeGecmisi: [
        { id: '1', ay: 'Kasım Ayı Ekstresi', tarih: '15 Kasım 2023', tutar: 1745.50, durum: 'Ödendi' },
        { id: '2', ay: 'Ekim Ayı Ekstresi', tarih: '15 Ekim 2023', tutar: 2120.00, durum: 'Ödendi' },
      ]
    },
    {
      id: '2',
      tip: 'Kredi Kartı',
      bankaAdi: 'Akbank',
      kartAdi: 'Konut Kredisi',
      toplamLimit: 0,
      guncelBorc: 2200.00,
      asgariTutar: 2200.00,
      sonOdemeGunu: 7,
      sonOdemeTarihi: '30 Ekim 2023',
      hesapKesimTarihi: '20 Ekim 2023',
      renk: '#f39c12',
      odemeGecmisi: []
    },
    {
      id: '3',
      tip: 'Kredi Kartı',
      bankaAdi: 'Yapı Kredi',
      kartAdi: 'World Card',
      toplamLimit: 8000.00,
      guncelBorc: 0,
      asgariTutar: 0,
      sonOdemeGunu: 0,
      sonOdemeTarihi: '',
      hesapKesimTarihi: '',
      renk: '#2ecc71',
      odemeGecmisi: []
    }
  ]);

  const kartEkle = (yeniKart) => {
    const kart = {
      ...yeniKart,
      id: Date.now().toString(),
      odemeGecmisi: []
    };
    setKartlar([...kartlar, kart]);
  };

  const kartGuncelle = (id, guncelKart) => {
    setKartlar(kartlar.map(k => k.id === id ? { ...k, ...guncelKart } : k));
  };

  const odemeEkle = (kartId, odeme) => {
    setKartlar(kartlar.map(k => {
      if (k.id === kartId) {
        return {
          ...k,
          odemeGecmisi: [odeme, ...k.odemeGecmisi]
        };
      }
      return k;
    }));
  };

  const toplamBorc = kartlar.reduce((sum, k) => sum + k.guncelBorc, 0);
  const buAykiOdemeler = kartlar.reduce((sum, k) => sum + k.asgariTutar, 0);

  return (
    <DataContext.Provider value={{
      kartlar,
      kartEkle,
      kartGuncelle,
      odemeEkle,
      toplamBorc,
      buAykiOdemeler
    }}>
      {children}
    </DataContext.Provider>
  );
};
