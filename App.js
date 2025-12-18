// Türk Lirası formatı fonksiyonu
function formatTurkishLira(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '₺0,00';
    }
    
    // Sayıyı string'e çevir ve ondalık kısmını ayır
    const num = Math.abs(Number(amount));
    const parts = num.toFixed(2).split('.');
    
    // Binlik ayraçları ekle (nokta ile)
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Ondalık ayracını virgül yap ve birleştir
    const formatted = parts.join(',');
    
    // Negatif sayılar için eksi işareti ekle
    const sign = amount < 0 ? '-' : '';
    
    return `${sign}₺${formatted}`;
}

// Dinamik tarih oluşturma fonksiyonları (ISO formatında)
function getDynamicDateISO(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
}

// Tarih gösterim fonksiyonu (ISO -> Türkçe)
function formatDateTR(isoDate) {
    if (!isoDate) return '-';
    
    try {
        const date = new Date(isoDate);
        // Invalid date kontrolü
        if (isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
        return '-';
    }
}

// Eski Türkçe tarih formatını ISO'ya çevir (veri temizleme için)
function convertTurkishDateToISO(turkishDate) {
    if (!turkishDate || turkishDate === '-') return null;
    
    // Eğer zaten ISO formatındaysa (YYYY-MM-DD), direkt döndür
    if (/^\d{4}-\d{2}-\d{2}$/.test(turkishDate)) {
        return turkishDate;
    }
    
    try {
        // Türkçe ay isimleri
        const aylar = {
            'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
            'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
        };
        
        // "12 Aralık 2025" formatını parse et
        const parts = turkishDate.split(' ');
        if (parts.length === 3) {
            const gun = parseInt(parts[0]);
            const ay = aylar[parts[1]];
            const yil = parseInt(parts[2]);
            
            if (!isNaN(gun) && ay !== undefined && !isNaN(yil)) {
                const date = new Date(yil, ay, gun);
                return date.toISOString().split('T')[0];
            }
        }
    } catch (e) {
        console.error('Tarih dönüştürme hatası:', e);
    }
    
    // Dönüştürülemezse bugünün tarihini döndür
    return getDynamicDateISO(0);
}

// Döngüsel tarih hesaplama: Sadece gün numarasından tam ISO tarihi oluştur
function calculateCyclicalDate(dayOfMonth) {
    if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) return null;
    
    const bugun = new Date();
    const bugunGunu = bugun.getDate();
    
    // Yeni tarih objesi oluştur
    let hedefTarih = new Date(bugun);
    
    // Eğer bugünün günü seçilen günden büyükse, gelecek aya geç
    if (bugunGunu > dayOfMonth) {
        hedefTarih.setMonth(hedefTarih.getMonth() + 1);
    }
    
    // Günü ayarla
    hedefTarih.setDate(dayOfMonth);
    
    // ISO formatında döndür
    return hedefTarih.toISOString().split('T')[0];
}

// Para formatı fonksiyonları
function formatCurrency(input) {
    // Mevcut değeri al ve sadece rakamları tut
    let value = input.value.replace(/\D/g, '');
    
    // Boşsa çık
    if (!value) {
        input.value = '';
        return;
    }
    
    // Binlik ayracı ekle
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Input'a geri yaz
    input.value = value;
}

function parseCurrency(value) {
    // String değilse string'e çevir
    if (typeof value !== 'string') {
        value = String(value);
    }
    // Noktaları temizle ve sayıya çevir
    return parseFloat(value.replace(/\./g, '')) || 0;
}

function formatCurrencyDisplay(value) {
    // Sayıyı binlik ayraçlı string'e çevir
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Veri yönetimi (TÜM TARİHLER ISO FORMATINDA)
// localStorage'dan kartları yükle
function loadKartlarFromStorage() {
    const savedKartlar = localStorage.getItem('kartlar');
    if (savedKartlar) {
        try {
            return JSON.parse(savedKartlar);
        } catch (e) {
            console.error('Kartlar verisi yüklenemedi:', e);
            return getDefaultKartlar();
        }
    }
    return getDefaultKartlar();
}

// localStorage'a kartları kaydet
function saveKartlarToStorage() {
    try {
        localStorage.setItem('kartlar', JSON.stringify(kartlar));
    } catch (e) {
        console.error('Kartlar verisi kaydedilemedi:', e);
    }
}

// Varsayılan kartlar
function getDefaultKartlar() {
    return [
    {
        id: '1',
        tip: 'Kredi Kartı',
        bankaAdi: 'Garanti Bonus',
        kartAdi: 'Garanti Bonus Kredi Kartı',
        toplamLimit: 12480.00,
        guncelBorc: 1250.00,
        asgariTutar: 925.00,
        sonOdemeGunu: 25,
        sonOdemeTarihi: getDynamicDateISO(5), // 5 gün sonra (ISO format)
        hesapKesimTarihi: getDynamicDateISO(-10), // 10 gün önce (ISO format)
        renk: '#4a9d7f',
        odenenTutar: 0, // Toplam ödenen tutar
        odemeGecmisi: [
            { id: '1', ay: 'Geçen Ay Ekstresi', tarih: getDynamicDateISO(-30), tutar: 1745.50, durum: 'Ödendi' },
            { id: '2', ay: 'İki Ay Önce Ekstresi', tarih: getDynamicDateISO(-60), tutar: 2120.00, durum: 'Ödendi' },
        ]
    },
    {
        id: '2',
        tip: 'Kredi',
        bankaAdi: 'Akbank',
        kartAdi: 'Konut Kredisi',
        toplamLimit: 0,
        guncelBorc: 2200.00,
        asgariTutar: 2200.00,
        sonOdemeGunu: 30,
        sonOdemeTarihi: getDynamicDateISO(3), // 3 gün sonra (ISO format)
        hesapKesimTarihi: getDynamicDateISO(-20), // 20 gün önce (ISO format)
        renk: '#f39c12',
        odenenTutar: 0, // Toplam ödenen tutar
        odemeGecmisi: []
    },
    {
        id: '3',
        tip: 'Kredi Kartı',
        bankaAdi: 'Yapı Kredi',
        kartAdi: 'World Card',
        toplamLimit: 8000.00,
        guncelBorc: 875.50,
        asgariTutar: 0,
        sonOdemeGunu: 0,
        sonOdemeTarihi: '',
        hesapKesimTarihi: '',
        renk: '#2ecc71',
        odenenTutar: 0, // Toplam ödenen tutar
        odemeGecmisi: []
    }
    ];
}

let kartlar = loadKartlarFromStorage();
let secilenKart = null;
let yeniKartTip = 'Kredi Kartı';

// Ekran geçişleri
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'anaSayfa') {
        renderKartListesi();
    } else if (screenId === 'gecmis') {
        renderGecmis();
    } else if (screenId === 'analiz') {
        renderAnaliz();
    } else if (screenId === 'ayarlar') {
        renderAyarlar();
    }
}

// Yan menü
function toggleSideMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('sideMenuOverlay').classList.toggle('active');
}

function closeSideMenu() {
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('sideMenuOverlay').classList.remove('active');
}

// FAB menü
function toggleFabMenu() {
    document.getElementById('fabMenu').classList.toggle('active');
    document.getElementById('fabOverlay').classList.toggle('active');
    document.querySelector('.fab').classList.toggle('active');
}

function yeniKartAc(tip) {
    toggleFabMenu();
    if (tip === 'Kredi Kartı') {
        showScreen('yeniKrediKarti');
    } else {
        showScreen('yeniKredi');
    }
}

// PIN Authentication System
let currentPinEntry = '';
let isAuthenticated = false;

// Authentication state kontrolü
function checkAuthenticationState() {
    const isSetupDone = localStorage.getItem('isSetupDone');
    
    if (isSetupDone !== 'true') {
        // İlk kez açılıyor - setup ekranını göster
        showOnboardingScreen();
        return false;
    } else {
        // Setup yapılmış - direkt ana uygulamayı göster (geçici)
        const userName = localStorage.getItem('userName') || 'Kullanıcı';
        showApp(userName);
        return true;
    }
}

// İlk kurulum ekranını göster
function showOnboardingScreen() {
    document.getElementById('onboarding-screen').style.display = 'flex';
    document.getElementById('pin-lock-screen').style.display = 'none';
    document.getElementById('app').style.display = 'none';
}

// PIN kilit ekranını göster
function showPinLockScreen() {
    const userName = localStorage.getItem('userName') || 'Kullanıcı';
    document.getElementById('welcomeUserName').textContent = userName;
    
    document.getElementById('onboarding-screen').style.display = 'none';
    document.getElementById('pin-lock-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    
    // PIN göstergelerini sıfırla
    resetPinIndicators();
    currentPinEntry = '';
}

// İlk kurulum işlemi
function handleSetup(event) {
    event.preventDefault();
    
    const name = document.getElementById('setupName').value.trim();
    const pin = document.getElementById('setupPin').value;
    
    // Validasyon
    if (name.length < 2) {
        alert('Lütfen en az 2 karakter uzunluğunda bir isim girin');
        return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
        alert('PIN 4 haneli rakam olmalıdır');
        return;
    }
    
    // Verileri localStorage'a kaydet
    localStorage.setItem('userName', name);
    localStorage.setItem('userPin', pin);
    localStorage.setItem('isSetupDone', 'true');
    localStorage.setItem('setupDate', new Date().toISOString());
    
    console.log('Kurulum tamamlandı, showApp çağrılıyor...');
    
    // Ana uygulamayı göster
    showApp(name);
}

// Uygulamayı göster
function showApp(userName) {
    console.log('showApp çağrıldı, userName:', userName);
    
    try {
        document.getElementById('onboarding-screen').style.display = 'none';
        document.getElementById('pin-lock-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        isAuthenticated = true;
        
        // Kullanıcı adını güncelle
        if (typeof updateUserName === 'function') {
            updateUserName(userName);
        }
        
        // Kart listesini render et
        if (typeof renderKartListesi === 'function') {
            renderKartListesi();
        }
        
        // Privacy mode durumunu kontrol et
        if (typeof initializePrivacyMode === 'function') {
            initializePrivacyMode();
        }
        
        console.log('Ana uygulama başarıyla gösterildi');
    } catch (error) {
        console.error('showApp hatası:', error);
        alert('Uygulama başlatılırken hata oluştu: ' + error.message);
    }
}

// Kullanıcı adını güncelle
function updateUserName(userName) {
    const profileName = document.querySelector('.profile-name');
    const profileSubtitle = document.querySelector('.profile-subtitle');
    const greeting = document.querySelector('.greeting');
    
    if (profileName) {
        profileName.textContent = userName;
    }
    if (profileSubtitle) {
        profileSubtitle.textContent = 'Hoş geldiniz';
    }
    if (greeting) {
        greeting.textContent = `Merhaba, ${userName}!`;
    }
}

// NumPad işlemleri
function handleNumPadPress(digit) {
    if (currentPinEntry.length < 4) {
        currentPinEntry += digit;
        updatePinIndicators();
        
        // 4 haneli PIN tamamlandığında otomatik doğrula
        if (currentPinEntry.length === 4) {
            setTimeout(() => {
                validatePin();
            }, 200);
        }
    }
}

function clearPin() {
    currentPinEntry = '';
    resetPinIndicators();
    clearPinError();
}

function updatePinIndicators() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`pinDot${i}`);
        if (i <= currentPinEntry.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    }
}

function resetPinIndicators() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`pinDot${i}`);
        dot.classList.remove('filled');
    }
}

function validatePin() {
    const storedPin = localStorage.getItem('userPin');
    const userName = localStorage.getItem('userName');
    
    if (currentPinEntry === storedPin) {
        // Doğru PIN - uygulamayı aç
        showApp(userName);
    } else {
        // Yanlış PIN - hata göster
        showPinError('Yanlış PIN girdiniz');
        shakePinIndicators();
        setTimeout(() => {
            clearPin();
        }, 1000);
    }
}

function showPinError(message) {
    const errorElement = document.getElementById('pinErrorMessage');
    errorElement.textContent = message;
}

function clearPinError() {
    const errorElement = document.getElementById('pinErrorMessage');
    errorElement.textContent = '';
}

function shakePinIndicators() {
    const indicators = document.querySelector('.pin-indicators');
    indicators.classList.add('shake');
    setTimeout(() => {
        indicators.classList.remove('shake');
    }, 500);
}

// Çıkış yap (sadece sayfayı yenile - verileri silme)
function cikisYap() {
    isAuthenticated = false;
    location.reload();
}

// Sayfa yüklendiğinde
// Veri temizleme: Eski Türkçe tarihleri ISO formatına çevir
function migrateOldDates() {
    let migrated = false;
    
    kartlar.forEach(kart => {
        // Son ödeme tarihini kontrol et ve dönüştür
        if (kart.sonOdemeTarihi && !/^\d{4}-\d{2}-\d{2}$/.test(kart.sonOdemeTarihi)) {
            const converted = convertTurkishDateToISO(kart.sonOdemeTarihi);
            if (converted) {
                kart.sonOdemeTarihi = converted;
                migrated = true;
            }
        }
        
        // Hesap kesim tarihini kontrol et ve dönüştür
        if (kart.hesapKesimTarihi && !/^\d{4}-\d{2}-\d{2}$/.test(kart.hesapKesimTarihi)) {
            const converted = convertTurkishDateToISO(kart.hesapKesimTarihi);
            if (converted) {
                kart.hesapKesimTarihi = converted;
                migrated = true;
            }
        }
        
        // Ödeme geçmişindeki tarihleri kontrol et ve dönüştür
        if (kart.odemeGecmisi && kart.odemeGecmisi.length > 0) {
            kart.odemeGecmisi.forEach(odeme => {
                if (odeme.tarih && !/^\d{4}-\d{2}-\d{2}$/.test(odeme.tarih)) {
                    const converted = convertTurkishDateToISO(odeme.tarih);
                    if (converted) {
                        odeme.tarih = converted;
                        migrated = true;
                    }
                }
            });
        }
    });
    
    if (migrated) {
        console.log('Eski tarih formatları ISO formatına dönüştürüldü');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Veri temizleme: Eski tarihleri dönüştür
    migrateOldDates();
    
    // Tema yükle
    const savedTema = localStorage.getItem('tema');
    if (savedTema) {
        ayarlar.tema = savedTema;
        applyTheme(savedTema);
    }
    
    // GEÇİCİ: Onboarding'i atla, direkt ana uygulamayı göster
    skipOnboardingAndShowApp();
    
    // Tarih inputlarını bugünün tarihiyle başlat
    initializeDateInputs();
    
    // NumPad event listeners
    setupNumPadListeners();
    
    // Privacy mode yükle
    loadPrivacyMode();
});

// GEÇİCİ: Onboarding'i atla
function skipOnboardingAndShowApp() {
    // ZORLA varsayılan kullanıcı bilgileri ayarla (her seferinde)
    localStorage.setItem('userName', 'Kullanıcı');
    localStorage.setItem('userPin', '1234');
    localStorage.setItem('isSetupDone', 'true');
    localStorage.setItem('setupDate', new Date().toISOString());
    
    console.log('localStorage ayarlandı:', {
        userName: localStorage.getItem('userName'),
        isSetupDone: localStorage.getItem('isSetupDone')
    });
    
    // Tüm ekranları gizle
    document.getElementById('onboarding-screen').style.display = 'none';
    document.getElementById('pin-lock-screen').style.display = 'none';
    
    // Ana uygulamayı göster
    document.getElementById('app').style.display = 'block';
    
    isAuthenticated = true;
    
    // Kullanıcı adını güncelle
    const userName = localStorage.getItem('userName');
    if (typeof updateUserName === 'function') {
        updateUserName(userName);
    }
    if (typeof renderKartListesi === 'function') {
        renderKartListesi();
    }
    if (typeof initializePrivacyMode === 'function') {
        initializePrivacyMode();
    }
    
    console.log('Ana uygulama gösterildi');
}

// Tarih inputlarını başlat
function initializeDateInputs() {
    const today = getDynamicDateISO(0);
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

// NumPad event listeners kurulumu
function setupNumPadListeners() {
    // NumPad butonları için event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('numpad-btn')) {
            const digit = e.target.getAttribute('data-digit');
            const action = e.target.getAttribute('data-action');
            
            if (digit) {
                handleNumPadPress(digit);
            } else if (action === 'clear') {
                clearPin();
            }
        }
    });
}

// Filtre state
let aktifFiltre = 'Tümü';

// Kart listesi
function renderKartListesi(filtre = aktifFiltre) {
    const container = document.getElementById('kartListesi');
    
    // Filtreleme
    let filtrelenmisKartlar = kartlar;
    if (filtre === 'Kredi Kartı') {
        // Sadece aktif (devam eden) kredi kartlarını göster
        filtrelenmisKartlar = kartlar.filter(k => {
            return k.tip === 'Kredi Kartı' && (k.guncelBorc || 0) > 0;
        });
    } else if (filtre === 'Kredi') {
        // Sadece aktif (devam eden) kredileri göster
        filtrelenmisKartlar = kartlar.filter(k => {
            if (k.tip === 'Kredi') {
                const dinamikKalanTaksit = dinamikKalanTaksitHesapla(k);
                const kalanBorc = dinamikKalanTaksit * (k.aylikTaksit || 0);
                return kalanBorc > 0;
            }
            return false;
        });
    } else if (filtre === 'Tamamlananlar') {
        // Tamamlanan ödemeler: Borcu bitmişse VEYA tam ödendi VEYA asgari ödendi VEYA taksit ödendi
        filtrelenmisKartlar = kartlar.filter(k => {
            // Koşul 1: Durum kontrolü - tam ödendi, asgari ödendi, taksit ödendi veya kısmi ödendi
            if (k.durum === 'tam_odendi' || k.durum === 'asgari_odendi' || k.durum === 'taksit_odendi' || k.durum === 'kismi_odendi') {
                return true;
            }
            
            // Koşul 2: Eski sistem uyumluluğu - manuel ödendi işaretlenmişse
            if (k.odendi === true) {
                return true;
            }
            
            // Koşul 3: Kredi kartı için - güncel borç 0 veya negatifse
            if (k.tip === 'Kredi Kartı') {
                return (k.guncelBorc || 0) <= 0;
            }
            
            // Koşul 4: Kredi için - kalan taksit 0 veya negatifse
            if (k.tip === 'Kredi') {
                const dinamikKalanTaksit = dinamikKalanTaksitHesapla(k);
                return dinamikKalanTaksit <= 0;
            }
            
            return false;
        });
    }
    
    // 1. Toplam Ödenen ve Kalan Borç Hesapla
    let toplamOdenen = 0;
    let kalanBorc = 0;
    
    kartlar.forEach(k => {
        // Ödenen tutar (odenenTutar property'sinden)
        toplamOdenen += k.odenenTutar || 0;
        
        // Kalan borç
        if (k.tip === 'Kredi') {
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(k);
            kalanBorc += dinamikKalanTaksit * (k.aylikTaksit || 0);
        } else {
            kalanBorc += k.guncelBorc || 0;
        }
    });
    
    // 2. Genel Toplam = Toplam Ödenen + Kalan Borç
    const genelToplam = toplamOdenen + kalanBorc;
    
    // 3. İlerleme Yüzdesi: (Toplam Ödenen / Genel Toplam) * 100
    const odemeYuzdesi = genelToplam > 0 ? Math.round((toplamOdenen / genelToplam) * 100) : 0;
    
    // Özet kartını güncelle
    document.getElementById('kalanOdeme').textContent = formatTurkishLira(Math.round(kalanBorc));
    document.getElementById('toplamDonemBorcu').textContent = formatTurkishLira(Math.round(genelToplam));
    document.getElementById('progressText').textContent = `${odemeYuzdesi}%`;
    
    // Circular progress güncelle
    const progressCircle = document.getElementById('progressCircle');
    const circumference = 251.2;
    const offset = circumference - (odemeYuzdesi / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // %100 ise yeşil parlasın
    if (odemeYuzdesi === 100) {
        progressCircle.style.filter = 'drop-shadow(0 0 8px var(--accent-color))';
    } else {
        progressCircle.style.filter = 'none';
    }
    
    container.innerHTML = filtrelenmisKartlar.map(kart => {
        // Ödeme durumu hesapla (önce bunu yapalım çünkü isPaid bilgisine ihtiyacımız var)
        const kartOdenenTutar = kart.odenenTutar || 0;
        let kartToplamBorc = 0;
        if (kart.tip === 'Kredi') {
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
            kartToplamBorc = dinamikKalanTaksit * (kart.aylikTaksit || 0);
        } else {
            kartToplamBorc = kart.guncelBorc || 0;
        }
        const kartGenelToplam = kartOdenenTutar + kartToplamBorc;
        const kartOdemeYuzdesi = kartGenelToplam > 0 ? Math.round((kartOdenenTutar / kartGenelToplam) * 100) : 0;
        const isPaid = kartOdemeYuzdesi >= 100 || kart.odendi;
        
        // Kalan gün hesapla
        const kalanGun = calculateDaysLeft(kart.sonOdemeTarihi);
        const gunDurumu = getDaysLeftStatus(kalanGun, isPaid);
        
        // Durum belirleme (ikon rengi için)
        let statusClass = 'status-normal';
        if (kalanGun !== null) {
            if (kalanGun < 0 || kalanGun === 0) {
                statusClass = 'status-danger';
            } else if (kalanGun === 1) {
                statusClass = 'status-warning';
            } else if (kalanGun <= 3) {
                statusClass = 'status-warning';
            }
        }
        
        // Bu ayki ödeme tutarını belirle
        let buAykiOdeme = 0;
        let ekstraBilgi = '';
        
        if (kart.tip === 'Kredi') {
            buAykiOdeme = kart.aylikTaksit || 0;
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
            ekstraBilgi = `<div class="payment-days-left ${gunDurumu.class}">${dinamikKalanTaksit} taksit kaldı</div>`;
        } else {
            buAykiOdeme = kart.asgariTutar || 0;
            ekstraBilgi = gunDurumu.text !== '-' ? `<div class="payment-days-left ${gunDurumu.class}">${gunDurumu.text}</div>` : '';
        }
        
        // Ödeme yapılmış mı kontrolü
        const odemeYapilmis = kartOdenenTutar > 0;
        
        // Checkbox durumu ve durum metni - Kredi ve Kredi Kartı için farklı
        let checkboxClass = '';
        let tutarClass = '';
        let odemeDurumuMetni = '';
        
        if (kart.tip === 'Kredi') {
            // KREDİ İÇİN ÖZEL MANTIK
            const aylikTaksit = kart.aylikTaksit || 0;
            
            if (kart.durum === 'tam_odendi' || kartOdemeYuzdesi >= 100 || kart.odendi || kartToplamBorc <= 0) {
                // Senaryo A: Tamamı Bitti
                tutarClass = 'strikethrough completed-text';
                checkboxClass = 'checked';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-full">Tamamı Ödendi</div>';
            } else if (kart.durum === 'taksit_odendi') {
                // Senaryo B: Taksit Ödendi (Mavi)
                tutarClass = ''; // Tutarın üstünü çizme
                checkboxClass = 'checked checkbox-blue';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-installment-blue">Taksit Ödendi</div>';
            } else if (kartOdenenTutar >= aylikTaksit) {
                // Senaryo C: Eski sistem - Taksit Tamam
                tutarClass = 'strikethrough completed-text';
                checkboxClass = 'checked';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-installment">Taksit Ödendi</div>';
            } else if (kartOdenenTutar > 0 && kartOdenenTutar < aylikTaksit) {
                // Senaryo D: Eksik Ödeme
                tutarClass = 'strikethrough completed-text';
                checkboxClass = 'checked';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-partial-warning">Kısmi Ödendi</div>';
            }
        } else {
            // KREDİ KARTI İÇİN YENİ DURUM SİSTEMİ
            if (kart.durum === 'tam_odendi' || (kart.guncelBorc || 0) <= 0 || kart.odendi) {
                // Tamamı ödendi
                tutarClass = 'strikethrough completed-text';
                checkboxClass = 'checked';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-full">Tamamı Ödendi</div>';
            } else if (kart.durum === 'asgari_odendi') {
                // Asgari ödendi - Turuncu ikon ve çizili tutar
                tutarClass = 'strikethrough completed-text';
                checkboxClass = 'checked-minimum checkbox-orange';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-minimum-orange">Asgari Ödendi</div>';
            } else if (kart.durum === 'kismi_odendi') {
                // Kısmi ödendi - Mavi ikon ve normal tutar (kalan borç)
                tutarClass = '';
                checkboxClass = 'checked checkbox-blue';
                odemeDurumuMetni = '<div class="payment-status-text payment-status-partial-blue">Kısmi Ödendi</div>';
            } else if (odemeYapilmis) {
                // Eski sistem uyumluluğu - kısmi ödeme
                tutarClass = 'strikethrough completed-text';
                checkboxClass = 'checked';
                const asgariTutar = kart.asgariTutar || 0;
                if (kartOdenenTutar >= asgariTutar) {
                    odemeDurumuMetni = '<div class="payment-status-text payment-status-minimum">Asgari Ödendi</div>';
                } else {
                    odemeDurumuMetni = '<div class="payment-status-text payment-status-partial">Kısmi Ödendi</div>';
                }
            }
        }
        
        // Yeni bilgilendirici etiket sistemi
        let paymentLabel = '';
        if (kart.tip === 'Kredi Kartı') {
            if (kart.durum === 'tam_odendi' || (kart.guncelBorc || 0) <= 0 || kart.odendi) {
                // Tamamı ödendi - Yeşil etiket
                paymentLabel = '<div class="payment-label payment-label-full"><span class="label-icon">✓</span> Tamamı Ödendi</div>';
                // Tutarı 0 göster
                buAykiOdeme = 0;
            } else if (kart.durum === 'asgari_odendi') {
                // Asgari ödendi - Turuncu etiket
                paymentLabel = '<div class="payment-label payment-label-minimum"><span class="label-icon">⚠</span> Asgari Ödendi</div>';
                // Asgari tutarı göster (çizili olacak)
                buAykiOdeme = kart.asgariTutar || 0;
            } else if (kart.durum === 'kismi_odendi') {
                // Kısmi ödendi - Mavi etiket
                paymentLabel = '<div class="payment-label payment-label-partial"><span class="label-icon">💳</span> Kısmi Ödendi</div>';
                // Kalan borcu göster
                buAykiOdeme = kart.guncelBorc || 0;
            }
        } else if (kart.tip === 'Kredi') {
            // Krediler için güncellenmiş mantık
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
            if (kart.durum === 'tam_odendi' || dinamikKalanTaksit <= 0 || kart.odendi) {
                // Kredi tamamen bitti
                paymentLabel = '<div class="payment-label payment-label-full"><span class="label-icon">✓</span> Tamamı Ödendi</div>';
                buAykiOdeme = 0;
            } else if (kart.durum === 'taksit_odendi') {
                // Taksit ödendi ama kredi bitmedi - Mavi etiket
                paymentLabel = '<div class="payment-label payment-label-installment"><span class="label-icon">⏱</span> Taksit Ödendi</div>';
                // Kalan aylık taksit tutarını göster (çizili olmayacak)
                buAykiOdeme = kart.aylikTaksit || 0;
            }
        }
        
        const paidClass = kart.odendi ? 'paid' : '';
        
        return `
            <div class="payment-card ${paidClass}">
                <div class="card-icon ${statusClass}" onclick='showDetay(${JSON.stringify(kart).replace(/'/g, "&apos;")})'>
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='white' font-weight='bold'%3E${kart.bankaAdi.substring(0, 2)}%3C/text%3E%3C/svg%3E" alt="">
                </div>
                <div class="payment-info" onclick='showDetay(${JSON.stringify(kart).replace(/'/g, "&apos;")})'>
                    <div class="payment-title-row">
                        <span class="payment-title">${kart.bankaAdi}</span>
                        <span class="type-badge ${kart.tip === 'Kredi Kartı' ? 'type-badge-card' : 'type-badge-loan'}">
                            ${kart.tip === 'Kredi Kartı' ? '💳 Kredi Kartı' : '💰 Kredi'}
                        </span>
                    </div>
                    <div class="payment-date">Son Ödeme: ${formatDateTR(kart.sonOdemeTarihi)}</div>
                    ${ekstraBilgi}
                </div>
                <div class="payment-amount-wrapper">
                    <div class="payment-amount-container" onclick='showDetay(${JSON.stringify(kart).replace(/'/g, "&apos;")})'>
                        ${kart.durum === 'kismi_odendi' ? 
                            (() => {
                                // Ödenen tutarı hesapla
                                const odenenTutar = kart.odenenTutar || 
                                    (kart.eskiBorc ? (kart.eskiBorc - kart.guncelBorc) : 0);
                                return `<div class="payment-amount-text">${formatTurkishLira(buAykiOdeme)}</div>
                                        <div class="paid-amount-info">Ödenen: ${formatTurkishLira(odenenTutar)}</div>`;
                            })() :
                            `<div class="payment-amount-text ${tutarClass}">${formatTurkishLira(buAykiOdeme)}</div>`
                        }
                        ${paymentLabel}
                    </div>
                    <div class="payment-checkbox ${checkboxClass}" onclick="toggleOdeme(event, '${kart.id}')">
                        ${checkboxClass === 'checked-minimum' ? '<span class="checkbox-minimum">A</span>' : 
                          checkboxClass === 'checked checkbox-blue' ? '<span class="checkbox-check">✓</span>' :
                          (odemeYapilmis || checkboxClass === 'checked' ? '<span class="checkbox-check">✓</span>' : '')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Ödeme toggle
function toggleOdeme(event, kartId) {
    event.stopPropagation();
    const kart = kartlar.find(k => k.id === kartId);
    if (kart) {
        // Durum sistemini sıfırla
        if (kart.durum === 'tam_odendi' || kart.durum === 'asgari_odendi' || kart.durum === 'taksit_odendi' || kart.durum === 'kismi_odendi') {
            kart.durum = null;
            kart.odendi = false;
        } else {
            kart.odendi = !kart.odendi;
        }
        
        // localStorage'a kaydet
        saveKartlarToStorage();
        
        renderKartListesi();
    }
}

// Filtre değiştir
function filterOdemeler(filtre) {
    aktifFiltre = filtre;
    
    // Chip'leri güncelle
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderKartListesi(filtre);
}

// Kalan gün hesaplama (ISO formatında tarih bekler: YYYY-MM-DD)
function calculateDaysLeft(targetDate) {
    if (!targetDate) return null;
    
    // Bugünün tarihini al ve saati 00:00:00 yap
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    
    // Hedef tarihi parse et (ISO format: YYYY-MM-DD)
    const hedefTarih = new Date(targetDate);
    
    // Invalid date kontrolü
    if (isNaN(hedefTarih.getTime())) {
        console.error('Geçersiz tarih formatı:', targetDate);
        return null;
    }
    
    hedefTarih.setHours(0, 0, 0, 0);
    
    // Gün farkını hesapla (yukarı yuvarla)
    const fark = Math.ceil((hedefTarih - bugun) / (1000 * 60 * 60 * 24));
    
    return fark;
}

// Kalan gün durumu metni ve rengi
function getDaysLeftStatus(daysLeft, isPaid = false) {
    if (isPaid) {
        return {
            text: 'Ödendi',
            class: 'status-paid',
            color: 'var(--accent-color)'
        };
    }
    
    if (daysLeft === null) {
        return {
            text: '-',
            class: 'status-normal',
            color: 'var(--text-secondary)'
        };
    }
    
    if (daysLeft < 0) {
        return {
            text: `${Math.abs(daysLeft)} Gün Gecikti`,
            class: 'status-danger',
            color: '#ff5252'
        };
    } else if (daysLeft === 0) {
        return {
            text: 'Son Gün Bugün!',
            class: 'status-danger',
            color: '#ff5252'
        };
    } else if (daysLeft === 1) {
        return {
            text: 'Yarın Son Gün',
            class: 'status-warning',
            color: '#ff9800'
        };
    } else {
        return {
            text: `${daysLeft} Gün Kaldı`,
            class: 'status-normal',
            color: 'var(--text-secondary)'
        };
    }
}

// Detay menü toggle
function toggleDetailMenu() {
    document.getElementById('detailMenu').classList.toggle('active');
    document.getElementById('detailMenuOverlay').classList.toggle('active');
}

// Kart sil
function kartSil() {
    if (!secilenKart) return;
    
    if (confirm(`${secilenKart.kartAdi} kartını silmek istediğinize emin misiniz?`)) {
        const index = kartlar.findIndex(k => k.id === secilenKart.id);
        if (index > -1) {
            kartlar.splice(index, 1);
            // localStorage'a kaydet
            saveKartlarToStorage();
        }
        toggleDetailMenu();
        showToast('Kart başarıyla silindi');
        showScreen('anaSayfa');
    }
}

// Kart düzenle (Dinamik - Kredi Kartı ve Kredi için farklı)
function kartDuzenle() {
    if (!secilenKart) return;
    
    toggleDetailMenu();
    
    // Modal içeriğini dinamik olarak oluştur
    const modalBody = document.querySelector('#editModal .edit-modal-body');
    
    if (secilenKart.tip === 'Kredi') {
        // KREDİ İÇİN MODAL İÇERİĞİ
        modalBody.innerHTML = `
            <div class="input-group">
                <label>Kredi Adı</label>
                <input type="text" id="editKartAdi" placeholder="Örn: Konut Kredisi">
            </div>
            
            <div class="input-group">
                <label>Kalan Borç</label>
                <input type="text" id="editGuncelBorc" placeholder="₺0,00" oninput="formatCurrency(this)">
            </div>
            
            <div class="input-group">
                <label>Kalan Taksit Sayısı</label>
                <input type="number" id="editKalanTaksit" placeholder="12" min="0">
            </div>
            
            <div class="input-group">
                <label>Aylık Taksit Tutarı</label>
                <input type="text" id="editAsgariTutar" placeholder="₺0,00" oninput="formatCurrency(this)">
            </div>
            
            <div class="input-group">
                <label>Sonraki Ödeme Tarihi</label>
                <input type="date" id="editSonOdemeTarihi">
            </div>
        `;
        
        // Değerleri doldur
        document.getElementById('editKartAdi').value = secilenKart.kartAdi || '';
        
        // Kalan borcu hesapla
        const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
        const kalanBorc = dinamikKalanTaksit * (secilenKart.aylikTaksit || 0);
        document.getElementById('editGuncelBorc').value = formatCurrencyDisplay(Math.round(kalanBorc));
        
        document.getElementById('editKalanTaksit').value = dinamikKalanTaksit;
        document.getElementById('editAsgariTutar').value = formatCurrencyDisplay(secilenKart.aylikTaksit || 0);
    } else {
        // KREDİ KARTI İÇİN MODAL İÇERİĞİ
        modalBody.innerHTML = `
            <div class="input-group">
                <label>Kart Adı</label>
                <input type="text" id="editKartAdi" placeholder="Örn: Maaş Kartım">
            </div>
            
            <div class="input-group">
                <label>Güncel Borç</label>
                <input type="text" id="editGuncelBorc" placeholder="₺0,00" oninput="formatCurrency(this); hesaplaAsgariOdemeEdit()">
            </div>
            
            <div class="input-group">
                <label>Asgari Tutar (Otomatik Hesaplanır)</label>
                <input type="text" id="editAsgariTutar" placeholder="₺0,00" oninput="formatCurrency(this)">
                <small style="color: var(--text-tertiary); font-size: 12px; margin-top: 4px; display: block;">
                    Limit ${secilenKart.toplamLimit > 50000 ? '> 50.000 TL (Asgari %40)' : '≤ 50.000 TL (Asgari %20)'}
                </small>
            </div>
            
            <div class="input-group">
                <label>Son Ödeme Tarihi</label>
                <input type="date" id="editSonOdemeTarihi">
            </div>
        `;
        
        // Değerleri doldur
        document.getElementById('editKartAdi').value = secilenKart.kartAdi || '';
        document.getElementById('editGuncelBorc').value = formatCurrencyDisplay(secilenKart.guncelBorc || 0);
        document.getElementById('editAsgariTutar').value = formatCurrencyDisplay(secilenKart.asgariTutar || 0);
    }
    
    // Tarihi input'a yükle - ISO formatında olmalı
    if (secilenKart.sonOdemeTarihi) {
        // Eğer zaten ISO formatındaysa direkt kullan
        if (/^\d{4}-\d{2}-\d{2}$/.test(secilenKart.sonOdemeTarihi)) {
            document.getElementById('editSonOdemeTarihi').value = secilenKart.sonOdemeTarihi;
        } else {
            // Türkçe formatı ISO'ya çevir
            const isoTarih = convertTurkishDateToISO(secilenKart.sonOdemeTarihi);
            document.getElementById('editSonOdemeTarihi').value = isoTarih || getDynamicDateISO(0);
        }
    } else {
        document.getElementById('editSonOdemeTarihi').value = getDynamicDateISO(0);
    }
    
    // Modal aç
    document.getElementById('editModal').classList.add('active');
    document.getElementById('editModalOverlay').classList.add('active');
    
    // Kredi için canlı hesaplama event listener'ları ekle
    if (secilenKart.tip === 'Kredi') {
        setupLiveCalculation();
    }
}

// Canlı hesaplama kurulumu (Kredi için)
function setupLiveCalculation() {
    const kalanTaksitInput = document.getElementById('editKalanTaksit');
    const aylikTaksitInput = document.getElementById('editAsgariTutar');
    const kalanBorcInput = document.getElementById('editGuncelBorc');
    
    if (!kalanTaksitInput || !aylikTaksitInput || !kalanBorcInput) return;
    
    // Kalan Taksit veya Aylık Taksit değiştiğinde Kalan Borç'u hesapla
    function hesaplaKalanBorc() {
        const kalanTaksit = parseInt(kalanTaksitInput.value) || 0;
        const aylikTaksit = parseCurrency(aylikTaksitInput.value);
        
        if (kalanTaksit >= 0 && aylikTaksit >= 0) {
            const yeniKalanBorc = kalanTaksit * aylikTaksit;
            kalanBorcInput.value = formatCurrencyDisplay(Math.round(yeniKalanBorc));
        }
    }
    
    // Kalan Borç değiştiğinde Taksit Sayısını hesapla (tersine hesaplama)
    function hesaplaTaksitSayisi() {
        const kalanBorc = parseCurrency(kalanBorcInput.value);
        const aylikTaksit = parseCurrency(aylikTaksitInput.value);
        
        if (kalanBorc > 0 && aylikTaksit > 0) {
            const yeniTaksitSayisi = Math.round(kalanBorc / aylikTaksit);
            kalanTaksitInput.value = yeniTaksitSayisi;
        }
    }
    
    // Event listener'lar
    kalanTaksitInput.addEventListener('input', hesaplaKalanBorc);
    aylikTaksitInput.addEventListener('input', hesaplaKalanBorc);
    
    // Kalan borç değiştiğinde tersine hesaplama (opsiyonel)
    let borcInputTimeout;
    kalanBorcInput.addEventListener('input', function() {
        // Debounce - kullanıcı yazmayı bitirince hesapla
        clearTimeout(borcInputTimeout);
        borcInputTimeout = setTimeout(() => {
            // Sadece formatCurrency çalışmasından sonra hesapla
            const currentValue = parseCurrency(kalanBorcInput.value);
            if (currentValue > 0) {
                hesaplaTaksitSayisi();
            }
        }, 500);
    });
}

// Modal kapat
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editModalOverlay').classList.remove('active');
}

// Asgari ödeme hesapla (Düzenleme Modalı için) - BDDK Yönetmeliğine göre
function hesaplaAsgariOdemeEdit() {
    // Sadece kredi kartı için çalışsın
    if (!secilenKart || secilenKart.tip !== 'Kredi Kartı') return;
    
    const guncelBorc = parseCurrency(document.getElementById('editGuncelBorc').value);
    const toplamLimit = secilenKart.toplamLimit || 0;
    
    // Borç yoksa asgari de 0
    if (!guncelBorc || guncelBorc <= 0) {
        document.getElementById('editAsgariTutar').value = '0';
        return;
    }
    
    // BDDK Kuralı: Limit > 50.000 TL ise %40, değilse %20
    let asgariOran = 0.20; // Varsayılan %20
    
    if (toplamLimit > 50000) {
        asgariOran = 0.40; // %40
    }
    
    const asgariOdeme = guncelBorc * asgariOran;
    
    // Formatlanmış olarak göster
    document.getElementById('editAsgariTutar').value = formatCurrencyDisplay(Math.round(asgariOdeme));
}

// Düzenlemeyi kaydet
function kaydetDuzenle() {
    if (!secilenKart) return;
    
    const yeniKartAdi = document.getElementById('editKartAdi').value.trim();
    const yeniGuncelBorc = parseCurrency(document.getElementById('editGuncelBorc').value);
    const yeniAsgariTutar = parseCurrency(document.getElementById('editAsgariTutar').value);
    const yeniTarihISO = document.getElementById('editSonOdemeTarihi').value;
    
    if (!yeniKartAdi) {
        showToast('Lütfen kart adını girin');
        return;
    }
    
    // Tarih formatı kontrolü - ISO formatında kalsın
    if (!yeniTarihISO) {
        showToast('Lütfen son ödeme tarihini girin');
        return;
    }
    
    // Tarihin geçerli olduğunu kontrol et
    const tarihKontrol = new Date(yeniTarihISO);
    if (isNaN(tarihKontrol.getTime())) {
        showToast('Geçersiz tarih formatı');
        return;
    }
    
    // Kartı güncelle - Kredi ve Kredi Kartı için farklı
    const kart = kartlar.find(k => k.id === secilenKart.id);
    if (kart) {
        kart.kartAdi = yeniKartAdi;
        kart.sonOdemeTarihi = yeniTarihISO; // ISO formatında kaydet (YYYY-MM-DD)
        
        if (kart.tip === 'Kredi') {
            // KREDİ İÇİN GÜNCELLEME
            const yeniKalanTaksit = parseInt(document.getElementById('editKalanTaksit').value) || 0;
            const yeniAylikTaksit = yeniAsgariTutar; // Aylık taksit tutarı
            
            // Aylık taksit tutarını güncelle
            kart.aylikTaksit = yeniAylikTaksit;
            kart.asgariTutar = yeniAylikTaksit;
            
            // Güncel borcu güncelle
            kart.guncelBorc = yeniKalanTaksit * yeniAylikTaksit;
            
            // Bitiş tarihini yeniden hesapla
            if (yeniKalanTaksit > 0) {
                const bugun = new Date();
                const bitisTarihi = new Date(bugun);
                bitisTarihi.setMonth(bitisTarihi.getMonth() + yeniKalanTaksit);
                bitisTarihi.setDate(kart.sonOdemeGunu || 1);
                kart.bitisTarihi = bitisTarihi.toISOString().split('T')[0];
            }
        } else {
            // KREDİ KARTI İÇİN GÜNCELLEME
            kart.guncelBorc = yeniGuncelBorc;
            kart.asgariTutar = yeniAsgariTutar;
        }
        
        // Seçilen kartı da güncelle
        secilenKart = kart;
        
        // localStorage'a kaydet
        saveKartlarToStorage();
        
        // Modal kapat
        closeEditModal();
        
        // Detay sayfasını yenile - Bu çok önemli!
        showDetay(kart);
        
        // Ana sayfayı da yenile (liste güncellensin)
        renderKartListesi();
        
        // Başarı mesajı
        showToast('Bilgiler güncellendi');
    }
}

// Detay göster
function showDetay(kart) {
    secilenKart = kart;
    
    // Kredi için dinamik hesaplama
    let gosterilecekBorc = kart.guncelBorc;
    let detayBilgi = '';
    
    if (kart.tip === 'Kredi') {
        const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
        gosterilecekBorc = dinamikKalanTaksit * (kart.aylikTaksit || 0);
        
        detayBilgi = `
            <div class="detail-card">
                <div class="card-title">${kart.kartAdi}</div>
                <div class="amount-label">Toplam Kalan Borç</div>
                <div class="amount">${formatTurkishLira(gosterilecekBorc)}</div>
                
                <div class="info-row">
                    <div class="info-item">
                        <span>📊</span>
                        <div class="info-text">
                            <div class="info-label">Kalan Taksit</div>
                            <div class="info-value">${dinamikKalanTaksit} Ay</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <span>💰</span>
                        <div class="info-text">
                            <div class="info-label">Aylık Taksit</div>
                            <div class="info-value">${formatTurkishLira(kart.aylikTaksit || 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-row">
                    <div class="detail-label">Sonraki Ödeme</div>
                    <div class="detail-value">${formatDateTR(kart.sonOdemeTarihi)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Tahmini Bitiş</div>
                    <div class="detail-value">${formatDateTR(kart.bitisTarihi)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Ödeme Günü</div>
                    <div class="detail-value">Her Ayın ${kart.sonOdemeGunu}. Günü</div>
                </div>
                
                ${kart.sonOdemeTarihi ? `
                <div class="calendar-reminder-section">
                    <button class="calendar-reminder-btn" onclick="addToCalendar('${kart.id}')" title="Takvime Hatırlatıcı Ekle">
                        <span class="calendar-icon">📅</span>
                        <span class="calendar-text">Takvime Ekle</span>
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    } else {
        // Ödeme durumu kontrolü
        const kartOdenenTutar = kart.odenenTutar || 0;
        const kartToplamBorc = kart.guncelBorc || 0;
        const kartGenelToplam = kartOdenenTutar + kartToplamBorc;
        const kartOdemeYuzdesi = kartGenelToplam > 0 ? Math.round((kartOdenenTutar / kartGenelToplam) * 100) : 0;
        const isPaid = kartOdemeYuzdesi >= 100 || kart.odendi;
        
        const kalanGun = calculateDaysLeft(kart.sonOdemeTarihi);
        const gunDurumu = getDaysLeftStatus(kalanGun, isPaid);
        
        detayBilgi = `
            <div class="detail-card">
                <div class="card-title">${kart.kartAdi}</div>
                <div class="amount-label">Toplam Kredi Kartı Borcu</div>
                <div class="amount">${formatTurkishLira(kart.guncelBorc)}</div>
                
                <div class="info-row">
                    <div class="info-item">
                        <span>📅</span>
                        <div class="info-text">
                            <div class="info-label">Son Ödeme Tarihi</div>
                            <div class="info-value">${formatDateTR(kart.sonOdemeTarihi)}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <span>⏰</span>
                        <div class="info-text">
                            <div class="info-label">Durum</div>
                            <div class="info-value" style="color: ${gunDurumu.color}">${gunDurumu.text}</div>
                        </div>
                    </div>
                </div>
                
                ${kart.sonOdemeTarihi ? `
                <div class="calendar-reminder-section">
                    <button class="calendar-reminder-btn" onclick="addToCalendar('${kart.id}')" title="Takvime Hatırlatıcı Ekle">
                        <span class="calendar-icon">📅</span>
                        <span class="calendar-text">Takvime Ekle</span>
                    </button>
                </div>
                ` : ''}
            </div>
            
            <div class="detail-card">
                <div class="detail-row">
                    <div class="detail-label">Toplam Borç</div>
                    <div class="detail-value">${formatTurkishLira(kart.guncelBorc)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Asgari Tutar</div>
                    <div class="detail-value">${formatTurkishLira(kart.asgariTutar)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Hesap Kesim Tarihi</div>
                    <div class="detail-value">${formatDateTR(kart.hesapKesimTarihi)}</div>
                </div>
            </div>
        `;
    }
    
    // Buton durumu ve rengi belirleme
    let buttonClass = 'pay-button';
    let buttonText = 'Ödendi Olarak İşaretle';
    let buttonDisabled = '';
    
    if (kart.tip === 'Kredi Kartı') {
        if (kart.durum === 'tam_odendi' || (kart.guncelBorc || 0) <= 0 || kart.odendi) {
            // Tam ödendi - Yeşil pasif buton
            buttonClass = 'pay-button pay-button-completed';
            buttonText = 'Bu Ay Tamamlandı';
            buttonDisabled = 'disabled';
        } else if (kart.durum === 'asgari_odendi') {
            // Asgari ödendi - Turuncu buton
            buttonClass = 'pay-button pay-button-orange';
            buttonText = 'Asgari Ödendi (Kalanı Tamamla)';
        }
    } else if (kart.tip === 'Kredi') {
        if (kart.durum === 'tam_odendi' || gosterilecekBorc <= 0 || kart.odendi) {
            // Tam ödendi - Yeşil pasif buton
            buttonClass = 'pay-button pay-button-completed';
            buttonText = 'Bu Ay Tamamlandı';
            buttonDisabled = 'disabled';
        } else if (kart.durum === 'taksit_odendi') {
            // Taksit ödendi - Mavi buton
            buttonClass = 'pay-button pay-button-blue';
            buttonText = 'Taksit Ödendi (Devam Et)';
        }
    }
    
    // Eğer tam ödendi ise borcu 0 göster ama butonu göster
    const showButton = gosterilecekBorc > 0 || kart.durum === 'tam_odendi' || kart.durum === 'asgari_odendi' || kart.durum === 'taksit_odendi' || kart.durum === 'kismi_odendi';
    
    document.getElementById('detayContent').innerHTML = `
        ${detayBilgi}
        
        <div class="history-section">
            <div class="history-title">Ödeme Geçmişi</div>
            ${kart.odemeGecmisi && kart.odemeGecmisi.length > 0 ? 
                kart.odemeGecmisi.map(odeme => `
                    <div class="history-item clickable" onclick='editPaymentHistory(${JSON.stringify(odeme).replace(/'/g, "&apos;")})'>
                        <div class="history-icon">✓</div>
                        <div class="history-info">
                            <div class="history-month">${odeme.ay}</div>
                            <div class="history-date">${formatDateTR(odeme.tarih)}</div>
                        </div>
                        <div class="history-amount">${formatTurkishLira(odeme.tutar)}</div>
                    </div>
                `).join('') : 
                '<div class="empty-state">Henüz ödeme geçmişi bulunmuyor</div>'
            }
        </div>
        
        ${showButton ? `
            <button class="${buttonClass}" onclick="hizliOdemeIsaretle()" ${buttonDisabled}>${buttonText}</button>
        ` : ''}
    `;
    
    showScreen('odemeDetay');
}

// Ödeme geçmişini düzenle
let secilenOdeme = null;

function editPaymentHistory(odeme) {
    secilenOdeme = odeme;
    
    // Modal footer'ını dinamik olarak güncelle
    const modalFooter = document.querySelector('#historyEditModal .edit-modal-footer');
    modalFooter.innerHTML = `
        <button class="edit-modal-btn edit-modal-btn-delete" id="btn-delete-payment">🗑️ Sil</button>
        <button class="edit-modal-btn edit-modal-btn-cancel" onclick="closeHistoryEditModal()">İptal</button>
        <button class="edit-modal-btn edit-modal-btn-save" onclick="saveHistoryEdit()">Kaydet</button>
    `;
    
    // Sil butonuna event listener ekle
    document.getElementById('btn-delete-payment').addEventListener('click', function() {
        if (confirm('Bu ödemeyi silmek ve tutarı borca geri eklemek istiyor musunuz?')) {
            deletePaymentHistory();
        }
    });
    
    // Modal aç
    document.getElementById('historyEditModal').classList.add('active');
    document.getElementById('historyEditModalOverlay').classList.add('active');
    
    // Mevcut tutarı göster (formatlanmış)
    document.getElementById('historyEditAmount').value = formatCurrencyDisplay(Math.round(odeme.tutar));
}

function closeHistoryEditModal() {
    document.getElementById('historyEditModal').classList.remove('active');
    document.getElementById('historyEditModalOverlay').classList.remove('active');
    secilenOdeme = null;
}

// Ödeme geçmişini sil
function deletePaymentHistory() {
    if (!secilenOdeme || !secilenKart) return;
    
    // Kartı bul
    const kart = kartlar.find(k => k.id === secilenKart.id);
    if (kart) {
        // Silinecek ödeme tutarını al
        const silinenTutar = secilenOdeme.tutar || 0;
        
        // Ödeme geçmişinden kaydı sil
        const odemeIndex = kart.odemeGecmisi.findIndex(o => o.id === secilenOdeme.id);
        if (odemeIndex !== -1) {
            kart.odemeGecmisi.splice(odemeIndex, 1);
        }
        
        // 1. YENİDEN HESAPLAMA - Silinen tutar borcu artırır
        // Kalan ödemeleri topla
        let toplamOdenen = 0;
        if (kart.odemeGecmisi && kart.odemeGecmisi.length > 0) {
            toplamOdenen = kart.odemeGecmisi.reduce((sum, odeme) => sum + (odeme.tutar || 0), 0);
        }
        
        // Silinen tutarı borçtan çıkar (borcu artır)
        kart.guncelBorc = (kart.guncelBorc || 0) + silinenTutar;
        kart.odenenTutar = toplamOdenen;
        
        // 2. DURUM GÜNCELLEMESİ - Borç arttığı için durumu sıfırla
        const asgariTutar = kart.asgariTutar || 0;
        const yeniKalanBorc = kart.guncelBorc;
        
        if (yeniKalanBorc <= 0) {
            // Hala borç yoksa tam ödendi durumunu koru
            kart.durum = 'tam_odendi';
            kart.odendi = true;
            kart.guncelBorc = 0;
        } else if (toplamOdenen >= asgariTutar && asgariTutar > 0) {
            // Asgari tutar hala karşılanıyorsa asgari ödendi
            if (kart.tip === 'Kredi Kartı') {
                kart.durum = 'asgari_odendi';
                kart.odendi = false;
            } else if (kart.tip === 'Kredi') {
                const aylikTaksit = kart.aylikTaksit || 0;
                if (toplamOdenen >= aylikTaksit) {
                    kart.durum = 'taksit_odendi';
                } else {
                    kart.durum = null; // Bekliyor
                }
                kart.odendi = false;
            }
        } else {
            // Asgari tutar karşılanmıyorsa bekliyor durumu
            kart.durum = null;
            kart.odendi = false;
        }
        
        // Seçilen kartı güncelle
        secilenKart = kart;
        
        // 3. ARAYÜZ YENİLEME
        // localStorage'a kaydet
        localStorage.setItem('kartlar', JSON.stringify(kartlar));
        
        // Modal kapat
        closeHistoryEditModal();
        
        // Hem detay sayfasını hem ana sayfayı yenile
        showDetay(kart);
        renderKartListesi();
        
        // Başarı mesajı
        showToast(`Ödeme kaydı silindi - ${formatTurkishLira(silinenTutar)} borçtan düşüldü`);
    }
}

function saveHistoryEdit() {
    if (!secilenOdeme || !secilenKart) return;
    
    const yeniTutar = parseCurrency(document.getElementById('historyEditAmount').value);
    
    if (!yeniTutar || yeniTutar <= 0) {
        showToast('Lütfen geçerli bir tutar girin');
        return;
    }
    
    // Kartı bul
    const kart = kartlar.find(k => k.id === secilenKart.id);
    if (kart) {
        // Ödeme geçmişindeki kaydı güncelle
        const odemeIndex = kart.odemeGecmisi.findIndex(o => o.id === secilenOdeme.id);
        if (odemeIndex !== -1) {
            kart.odemeGecmisi[odemeIndex].tutar = yeniTutar;
        }
        
        // 1. YENİDEN HESAPLAMA TETİKLEYİCİSİ
        // ÖNCE ESKİ TOPLAM ÖDENENİ HESAPLA (düzenleme öncesi)
        const eskiToplamOdenen = kart.odenenTutar || 0;
        
        // ŞİMDİ YENİ TOPLAM ÖDENENİ HESAPLA (düzenleme sonrası)
        let yeniToplamOdenen = 0;
        if (kart.odemeGecmisi && kart.odemeGecmisi.length > 0) {
            yeniToplamOdenen = kart.odemeGecmisi.reduce((sum, odeme) => sum + (odeme.tutar || 0), 0);
        }
        
        // ORİJİNAL TOPLAM BORCU HESAPLA
        // Orijinal Borç = Mevcut Kalan Borç + Eski Toplam Ödenen
        const orijinalToplamBorc = (kart.guncelBorc || 0) + eskiToplamOdenen;
        
        // YENİ KALAN BORCU HESAPLA
        // Yeni Kalan Borç = Orijinal Toplam Borç - Yeni Toplam Ödenen
        const yeniKalanBorc = Math.max(0, orijinalToplamBorc - yeniToplamOdenen);
        
        // KARTTIN BORÇ BİLGİLERİNİ GÜNCELLE
        kart.guncelBorc = yeniKalanBorc;
        kart.odenenTutar = yeniToplamOdenen;
        
        // EĞER KISMI ÖDEME DURUMUNDAYSA ESKİ BORCU GÜNCELLE
        if (kart.durum === 'kismi_odendi') {
            kart.eskiBorc = orijinalToplamBorc;
        }
        
        // 2. DURUM GÜNCELLEMESİ (YENİ ÖNCELİK SIRALAMASINA GÖRE)
        const asgariTutar = kart.asgariTutar || 0;
        
        // 1. ÖNCELİK: TAMAMLANDI KONTROLÜ (En Önemli)
        if (yeniKalanBorc <= 0) {
            kart.durum = 'tam_odendi';
            kart.odendi = true;
            kart.guncelBorc = 0; // Negatif borç olmasın
            kart.eskiBorc = null; // Eski borç bilgisini temizle
        }
        // 2. ÖNCELİK: KISMI/ARA ÖDEME KONTROLÜ (Yeni Mantık)
        else if (yeniToplamOdenen > asgariTutar && yeniKalanBorc > 0) {
            // Ödenen > Asgari VE Kalan Borç > 0 → Kısmi Ödeme
            kart.durum = 'kismi_odendi';
            kart.odendi = false;
            kart.eskiBorc = orijinalToplamBorc; // Eski borcu sakla
        }
        // 3. ÖNCELİK: ASGARİ ÖDEME KONTROLÜ
        else if (Math.abs(yeniToplamOdenen - asgariTutar) <= 10 && asgariTutar > 0) {
            // Ödenen ≈ Asgari (10 TL tolerans) → Asgari Ödeme
            kart.durum = 'asgari_odendi';
            kart.odendi = false;
            kart.eskiBorc = null;
        }
        // 4. VARSAYILAN: BEKLİYOR DURUMU
        else {
            kart.durum = null;
            kart.odendi = false;
            kart.eskiBorc = null;
        }
        
        // KREDİ İÇİN ÖZEL MANTIK
        if (kart.tip === 'Kredi') {
            const aylikTaksit = kart.aylikTaksit || 0;
            if (yeniKalanBorc <= 0) {
                kart.durum = 'tam_odendi';
                kart.odendi = true;
            } else if (yeniToplamOdenen >= aylikTaksit) {
                kart.durum = 'taksit_odendi';
                kart.odendi = false;
            } else {
                kart.durum = null;
                kart.odendi = false;
            }
        }
        
        // Seçilen kartı güncelle
        secilenKart = kart;
        
        // 3. ARAYÜZ YENİLEME
        // localStorage'a kaydet
        localStorage.setItem('kartlar', JSON.stringify(kartlar));
        
        // Modal kapat
        closeHistoryEditModal();
        
        // Hem detay sayfasını hem ana sayfayı yenile
        showDetay(kart);
        renderKartListesi();
        
        // Başarı mesajı
        showToast('Ödeme geçmişi güncellendi - Kart durumu yeniden hesaplandı');
    }
}

// Hızlı ödeme işaretle (Tip bazlı modal seçimi)
function hizliOdemeIsaretle() {
    if (!secilenKart) return;
    
    if (secilenKart.tip === 'Kredi Kartı') {
        // Kredi kartları için asgari/tamamı seçimi
        const asgariTutar = secilenKart.asgariTutar || 0;
        const guncelBorc = secilenKart.guncelBorc || 0;
        
        if (asgariTutar > 0 && guncelBorc > asgariTutar) {
            // Modal ile seçim yap
            openPaymentChoiceModal(guncelBorc, asgariTutar);
        } else {
            // Sadece tam ödeme mümkün - direkt işle
            processPaymentChoice('full');
        }
    } else if (secilenKart.tip === 'Kredi') {
        // Krediler için taksit ödeme modalı
        openLoanPaymentModal();
    }
}

// Ödeme seçimi modalını aç
function openPaymentChoiceModal(totalDebt, minAmount) {
    // Modal bilgilerini güncelle
    document.getElementById('choiceTotalDebt').textContent = formatTurkishLira(totalDebt);
    document.getElementById('choiceMinAmount').textContent = formatTurkishLira(minAmount);
    
    // Modalı göster
    const modal = document.getElementById('payment-choice-modal');
    modal.style.display = 'flex';
    
    // Animasyon için kısa gecikme
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Ödeme seçimi modalını kapat
function closePaymentChoiceModal() {
    const modal = document.getElementById('payment-choice-modal');
    modal.classList.remove('active');
    
    // Animasyon bitince gizle
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Ödeme seçimi işle
function selectPaymentChoice(choice) {
    closePaymentChoiceModal();
    
    // Kısa gecikme ile işlemi yap (modal kapanma animasyonu için)
    setTimeout(() => {
        processPaymentChoice(choice);
    }, 100);
}

// Manuel tutar girişini göster
function showCustomAmountInput() {
    document.getElementById('paymentChoiceButtons').style.display = 'none';
    document.getElementById('customAmountSection').style.display = 'block';
    document.getElementById('customAmountInput').focus();
}

// Manuel tutar girişini gizle
function hideCustomAmountInput() {
    document.getElementById('paymentChoiceButtons').style.display = 'block';
    document.getElementById('customAmountSection').style.display = 'none';
    document.getElementById('customAmountInput').value = '';
}

// Manuel tutarı onayla
function confirmCustomAmount() {
    const customAmount = parseCurrency(document.getElementById('customAmountInput').value);
    
    if (!customAmount || customAmount <= 0) {
        showToast('Lütfen geçerli bir tutar girin');
        return;
    }
    
    const guncelBorc = secilenKart.guncelBorc || 0;
    
    if (customAmount > guncelBorc) {
        showToast('Ödeme tutarı mevcut borçtan fazla olamaz');
        return;
    }
    
    closePaymentChoiceModal();
    
    // Kısa gecikme ile işlemi yap
    setTimeout(() => {
        processCustomPayment(customAmount);
    }, 100);
}

// Manuel ödeme işlemini gerçekleştir
function processCustomPayment(amount) {
    if (!secilenKart) return;
    
    // Kartı kartlar dizisinde bul
    const kartIndex = kartlar.findIndex(k => k.id === secilenKart.id);
    if (kartIndex === -1) return;
    
    const kart = kartlar[kartIndex];
    const eskiBorc = kart.guncelBorc || 0;
    
    // Borcu güncelle
    const yeniKalanBorc = Math.max(0, eskiBorc - amount);
    kart.guncelBorc = yeniKalanBorc;
    
    // DURUM BELİRLEME (YENİ ÖNCELİK SIRALAMASINA GÖRE)
    const asgariTutar = kart.asgariTutar || 0;
    
    // 1. ÖNCELİK: TAMAMLANDI KONTROLÜ
    if (yeniKalanBorc <= 0) {
        kart.durum = 'tam_odendi';
        kart.odendi = true;
        kart.eskiBorc = null;
    }
    // 2. ÖNCELİK: KISMI ÖDEME KONTROLÜ
    else if (amount > asgariTutar && yeniKalanBorc > 0) {
        kart.durum = 'kismi_odendi';
        kart.odendi = false;
        kart.eskiBorc = eskiBorc; // Eski borcu sakla
    }
    // 3. ÖNCELİK: ASGARİ ÖDEME KONTROLÜ
    else if (Math.abs(amount - asgariTutar) <= 10 && asgariTutar > 0) {
        kart.durum = 'asgari_odendi';
        kart.odendi = false;
        kart.eskiBorc = null;
    }
    // 4. VARSAYILAN: BEKLİYOR
    else {
        kart.durum = null;
        kart.odendi = false;
        kart.eskiBorc = null;
    }
    
    // odenenTutar'ı güncelle
    if (!kart.odenenTutar) kart.odenenTutar = 0;
    kart.odenenTutar += amount;
    
    // Ödeme geçmişine ekle
    if (!kart.odemeGecmisi) kart.odemeGecmisi = [];
    kart.odemeGecmisi.unshift({
        id: Date.now().toString(),
        ay: 'Bu Ay Ekstresi',
        tarih: getDynamicDateISO(0),
        tutar: amount,
        durum: 'Ödendi (Kısmi)'
    });
    
    // Seçilen kartı güncelle
    secilenKart = kart;
    
    // localStorage'a kaydet
    localStorage.setItem('kartlar', JSON.stringify(kartlar));
    
    showToast(`✓ ${formatTurkishLira(amount)} kısmi ödeme yapıldı!`);
    
    // Sayfaları yenile
    showDetay(kart);
    renderKartListesi();
}

// Ödeme işlemini gerçekleştir
function processPaymentChoice(choice) {
    if (!secilenKart) return;
    
    const asgariTutar = secilenKart.asgariTutar || 0;
    const guncelBorc = secilenKart.guncelBorc || 0;
    
    // Kartı kartlar dizisinde bul
    const kartIndex = kartlar.findIndex(k => k.id === secilenKart.id);
    if (kartIndex === -1) return;
    
    if (choice === 'full') {
        // Tamamı ödendi
        kartlar[kartIndex].guncelBorc = 0;
        kartlar[kartIndex].asgariTutar = 0;
        kartlar[kartIndex].durum = 'tam_odendi';
        kartlar[kartIndex].odendi = true;
        
        // odenenTutar'ı güncelle
        if (!kartlar[kartIndex].odenenTutar) kartlar[kartIndex].odenenTutar = 0;
        kartlar[kartIndex].odenenTutar += guncelBorc;
        
        // Ödeme geçmişine ekle
        if (!kartlar[kartIndex].odemeGecmisi) kartlar[kartIndex].odemeGecmisi = [];
        kartlar[kartIndex].odemeGecmisi.unshift({
            id: Date.now().toString(),
            ay: 'Bu Ay Ekstresi',
            tarih: getDynamicDateISO(0),
            tutar: guncelBorc,
            durum: 'Ödendi (Tam)'
        });
        
        // Seçilen kartı güncelle
        secilenKart = kartlar[kartIndex];
        
        showToast('✓ Borcun tamamı ödendi olarak işaretlendi!');
        
    } else if (choice === 'minimum') {
        // Asgari ödendi
        const yeniKalanBorc = Math.max(0, guncelBorc - asgariTutar);
        kartlar[kartIndex].guncelBorc = yeniKalanBorc;
        
        // Durum belirleme
        if (yeniKalanBorc <= 0) {
            kartlar[kartIndex].durum = 'tam_odendi';
            kartlar[kartIndex].odendi = true;
        } else {
            kartlar[kartIndex].durum = 'asgari_odendi';
            kartlar[kartIndex].odendi = false;
        }
        
        // odenenTutar'ı güncelle
        if (!kartlar[kartIndex].odenenTutar) kartlar[kartIndex].odenenTutar = 0;
        kartlar[kartIndex].odenenTutar += asgariTutar;
        
        // Ödeme geçmişine ekle
        if (!kartlar[kartIndex].odemeGecmisi) kartlar[kartIndex].odemeGecmisi = [];
        kartlar[kartIndex].odemeGecmisi.unshift({
            id: Date.now().toString(),
            ay: 'Bu Ay Ekstresi',
            tarih: getDynamicDateISO(0),
            tutar: asgariTutar,
            durum: 'Ödendi (Asgari)'
        });
        
        // Seçilen kartı güncelle
        secilenKart = kartlar[kartIndex];
        
        showToast('✓ Asgari tutar ödendi olarak işaretlendi!');
    }
    
    // localStorage'a kaydet
    saveKartlarToStorage();
    
    // Sayfaları yenile
    showDetay(secilenKart);
    renderKartListesi();
}

// Kredi taksit ödeme modalını aç
function openLoanPaymentModal() {
    if (!secilenKart || secilenKart.tip !== 'Kredi') return;
    
    const aylikTaksit = secilenKart.aylikTaksit || 0;
    const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
    
    // Modal bilgilerini güncelle
    document.getElementById('loanMonthlyAmount').textContent = formatTurkishLira(aylikTaksit);
    document.getElementById('loanRemainingCount').textContent = dinamikKalanTaksit;
    
    // Input değerini sıfırla ve maksimum değeri ayarla
    const installmentInput = document.getElementById('installmentCount');
    installmentInput.value = 1;
    installmentInput.max = dinamikKalanTaksit;
    
    // Toplam tutarı hesapla
    updateLoanPaymentTotal();
    
    // Modalı göster
    const modal = document.getElementById('loan-payment-modal');
    modal.style.display = 'flex';
    
    // Animasyon için kısa gecikme
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Kredi ödeme modalını kapat
function closeLoanPaymentModal() {
    const modal = document.getElementById('loan-payment-modal');
    modal.classList.remove('active');
    
    // Animasyon bitince gizle
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Kredi ödeme toplamını güncelle
function updateLoanPaymentTotal() {
    if (!secilenKart || secilenKart.tip !== 'Kredi') return;
    
    const aylikTaksit = secilenKart.aylikTaksit || 0;
    const installmentCount = parseInt(document.getElementById('installmentCount').value) || 0;
    const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
    
    // Maksimum kontrol
    if (installmentCount > dinamikKalanTaksit) {
        document.getElementById('installmentCount').value = dinamikKalanTaksit;
        return;
    }
    
    const totalPayment = aylikTaksit * installmentCount;
    document.getElementById('loanTotalPayment').textContent = formatTurkishLira(totalPayment);
}

// Kredi ödemesini onayla
function confirmLoanPayment() {
    if (!secilenKart || secilenKart.tip !== 'Kredi') return;
    
    const installmentCount = parseInt(document.getElementById('installmentCount').value) || 0;
    const aylikTaksit = secilenKart.aylikTaksit || 0;
    const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
    
    if (installmentCount <= 0 || installmentCount > dinamikKalanTaksit) {
        showToast('Geçersiz taksit sayısı!');
        return;
    }
    
    // Ödeme tutarını hesapla
    const odemeTutari = aylikTaksit * installmentCount;
    
    // Kredi bilgilerini güncelle
    const mevcutKalanBorc = dinamikKalanTaksit * aylikTaksit;
    const yeniKalanBorc = mevcutKalanBorc - odemeTutari;
    const yeniKalanTaksit = dinamikKalanTaksit - installmentCount;
    
    // Bitiş tarihini güncelle
    if (secilenKart.bitisTarihi) {
        const bitisTarihi = new Date(secilenKart.bitisTarihi);
        bitisTarihi.setMonth(bitisTarihi.getMonth() - installmentCount);
        secilenKart.bitisTarihi = bitisTarihi.toISOString().split('T')[0];
    }
    
    // Kartı kartlar dizisinde bul ve güncelle
    const kartIndex = kartlar.findIndex(k => k.id === secilenKart.id);
    if (kartIndex !== -1) {
        // odenenTutar'ı güncelle
        if (!kartlar[kartIndex].odenenTutar) kartlar[kartIndex].odenenTutar = 0;
        kartlar[kartIndex].odenenTutar += odemeTutari;
        
        // Ödeme geçmişine ekle
        if (!kartlar[kartIndex].odemeGecmisi) kartlar[kartIndex].odemeGecmisi = [];
        kartlar[kartIndex].odemeGecmisi.unshift({
            id: Date.now().toString(),
            ay: 'Bu Ay Taksiti',
            tarih: getDynamicDateISO(0),
            tutar: odemeTutari,
            durum: `${installmentCount} Taksit Ödendi`
        });
        
        // Kredi durumunu güncelle
        if (yeniKalanTaksit <= 0 || yeniKalanBorc <= 0) {
            // Kredi tamamen bitti
            kartlar[kartIndex].durum = 'tam_odendi';
            kartlar[kartIndex].odendi = true;
            kartlar[kartIndex].kalanTaksit = 0;
            showToast(`✓ Kredi tamamen kapandı! ${installmentCount} taksit ödendi.`);
        } else {
            // Taksit ödendi ama kredi bitmedi - 'kısmi_odendi' yerine 'taksit_odendi' kullan
            kartlar[kartIndex].durum = 'taksit_odendi';
            showToast(`✓ ${installmentCount} taksit ödendi. ${yeniKalanTaksit} taksit kaldı.`);
        }
        
        // Seçilen kartı güncelle
        secilenKart = kartlar[kartIndex];
    }
    
    // localStorage'a kaydet
    saveKartlarToStorage();
    
    // Modalı kapat
    closeLoanPaymentModal();
    
    // Sayfaları yenile
    setTimeout(() => {
        showDetay(secilenKart);
        renderKartListesi();
    }, 100);
}

// Ödeme modalını aç (Dinamik - Kredi Kartı ve Kredi için farklı)
function odemeYap() {
    if (!secilenKart) return;
    
    // Modal aç
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentModalOverlay').classList.add('active');
    
    // Toplam borcu hesapla
    let toplamBorc = secilenKart.guncelBorc;
    let aylikTaksit = 0;
    
    if (secilenKart.tip === 'Kredi') {
        const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
        toplamBorc = dinamikKalanTaksit * (secilenKart.aylikTaksit || 0);
        aylikTaksit = secilenKart.aylikTaksit || 0;
    }
    
    // Hızlı seçim butonlarını dinamik olarak oluştur
    const quickSelectContainer = document.querySelector('.payment-quick-select');
    
    if (secilenKart.tip === 'Kredi Kartı') {
        // Kredi Kartı için butonlar
        quickSelectContainer.innerHTML = `
            <button class="payment-chip active" onclick="selectPaymentAmount('full')">Borcun Tamamı</button>
            <button class="payment-chip" onclick="selectPaymentAmount('minimum')">Asgari Tutar</button>
            <button class="payment-chip" onclick="selectPaymentAmount('custom')">Farklı Tutar</button>
        `;
        
        // Bilgi kartı - Kredi Kartı
        document.querySelector('.payment-info-card').innerHTML = `
            <div class="payment-info-row">
                <span>Toplam Borç:</span>
                <span id="paymentTotalDebt">${formatTurkishLira(Math.round(toplamBorc))}</span>
            </div>
            <div class="payment-info-row">
                <span>Asgari Tutar:</span>
                <span id="paymentMinAmount">${formatTurkishLira(Math.round(secilenKart.asgariTutar || 0))}</span>
            </div>
        `;
    } else {
        // Kredi için butonlar
        quickSelectContainer.innerHTML = `
            <button class="payment-chip active" onclick="selectPaymentAmount('installment')">Taksidi Öde</button>
            <button class="payment-chip" onclick="selectPaymentAmount('full')">Borcu Kapat</button>
            <button class="payment-chip" onclick="selectPaymentAmount('custom')">Farklı Tutar</button>
        `;
        
        // Bilgi kartı - Kredi
        document.querySelector('.payment-info-card').innerHTML = `
            <div class="payment-info-row">
                <span>Kalan Borç:</span>
                <span id="paymentTotalDebt">${formatTurkishLira(Math.round(toplamBorc))}</span>
            </div>
            <div class="payment-info-row">
                <span>Aylık Taksit:</span>
                <span id="paymentMinAmount">${formatTurkishLira(Math.round(aylikTaksit))}</span>
            </div>
        `;
    }
    
    // Varsayılan tutarı ayarla
    if (secilenKart.tip === 'Kredi') {
        // Kredi için varsayılan aylık taksit
        document.getElementById('paymentAmount').value = formatCurrencyDisplay(Math.round(aylikTaksit));
    } else {
        // Kredi kartı için varsayılan toplam borç
        document.getElementById('paymentAmount').value = formatCurrencyDisplay(Math.round(toplamBorc));
    }
}

// Ödeme modalını kapat
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.getElementById('paymentModalOverlay').classList.remove('active');
}

// Hızlı ödeme tutarı seç (Dinamik - Kredi Kartı ve Kredi için farklı)
function selectPaymentAmount(type) {
    if (!secilenKart) return;
    
    // Chip'leri güncelle
    document.querySelectorAll('.payment-chip').forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
    
    let toplamBorc = secilenKart.guncelBorc;
    let aylikTaksit = 0;
    
    if (secilenKart.tip === 'Kredi') {
        const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
        toplamBorc = dinamikKalanTaksit * (secilenKart.aylikTaksit || 0);
        aylikTaksit = secilenKart.aylikTaksit || 0;
    }
    
    const input = document.getElementById('paymentAmount');
    
    if (type === 'full') {
        // Borcun tamamı / Borcu kapat
        input.value = formatCurrencyDisplay(Math.round(toplamBorc));
    } else if (type === 'minimum') {
        // Asgari tutar (sadece kredi kartı için)
        input.value = formatCurrencyDisplay(Math.round(secilenKart.asgariTutar || 0));
    } else if (type === 'installment') {
        // Taksidi öde (sadece kredi için)
        input.value = formatCurrencyDisplay(Math.round(aylikTaksit));
    } else if (type === 'custom') {
        // Farklı tutar
        input.value = '';
        input.focus();
    }
}

// Ödemeyi işle
function processPayment() {
    if (!secilenKart) return;
    
    const odemeTutari = parseCurrency(document.getElementById('paymentAmount').value);
    
    if (!odemeTutari || odemeTutari <= 0) {
        showToast('Lütfen geçerli bir tutar girin');
        return;
    }
    
    let toplamBorc = secilenKart.guncelBorc;
    if (secilenKart.tip === 'Kredi') {
        const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
        toplamBorc = dinamikKalanTaksit * (secilenKart.aylikTaksit || 0);
    }
    
    if (odemeTutari > toplamBorc) {
        showToast('Ödeme tutarı toplam borçtan fazla olamaz');
        return;
    }
    
    // Ödeme kaydı oluştur
    const yeniOdeme = {
        id: Date.now().toString(),
        ay: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) + ' Ödemesi',
        tarih: getDynamicDateISO(0), // ISO format
        tutar: odemeTutari,
        durum: 'Ödendi'
    };
    
    const kart = kartlar.find(k => k.id === secilenKart.id);
    if (kart) {
        // Ödeme geçmişine ekle
        if (!kart.odemeGecmisi) {
            kart.odemeGecmisi = [];
        }
        kart.odemeGecmisi.unshift(yeniOdeme);
        
        // odenenTutar'ı artır
        if (!kart.odenenTutar) {
            kart.odenenTutar = 0;
        }
        kart.odenenTutar += odemeTutari;
        
        // Tam ödeme mi kısmi ödeme mi?
        if (odemeTutari >= toplamBorc) {
            // Tam ödeme
            kart.guncelBorc = 0;
            kart.asgariTutar = 0;
            kart.odendi = true;
            showToast('Ödeme tamamlandı! Borç sıfırlandı.');
        } else {
            // Kısmi ödeme
            const yeniBorc = toplamBorc - odemeTutari;
            kart.guncelBorc = yeniBorc;
            
            // Asgari tutarı BDDK kuralına göre güncelle
            if (kart.tip === 'Kredi Kartı') {
                if (kart.toplamLimit > 50000) {
                    kart.asgariTutar = yeniBorc * 0.40; // %40
                } else {
                    kart.asgariTutar = yeniBorc * 0.20; // %20
                }
            }
            
            showToast(`Kalan borcunuz: ${formatTurkishLira(Math.round(yeniBorc))} olarak güncellendi`);
        }
        
        // Seçilen kartı güncelle
        secilenKart = kart;
        
        // Detay sayfasını yenile
        showDetay(kart);
        
        // Modal kapat
        closePaymentModal();
    }
}

// Son ödeme günü hesapla (Kredi Kartı)
function hesaplaSonOdemeGunu1() {
    const hesapKesimGunu = parseInt(document.getElementById('hesapKesimTarihi1').value);
    if (!hesapKesimGunu) {
        document.getElementById('sonOdemeGunu1').value = '';
        return;
    }
    
    // Şu anki ay ve yıl
    const bugun = new Date();
    const yil = bugun.getFullYear();
    const ay = bugun.getMonth();
    
    // Hesap kesim tarihi
    const hesapKesimTarihi = new Date(yil, ay, hesapKesimGunu);
    
    // +10 gün ekle
    const sonOdemeTarihi = new Date(hesapKesimTarihi);
    sonOdemeTarihi.setDate(sonOdemeTarihi.getDate() + 10);
    
    // Hafta sonu kontrolü
    const gun = sonOdemeTarihi.getDay(); // 0=Pazar, 6=Cumartesi
    
    if (gun === 6) { // Cumartesi
        sonOdemeTarihi.setDate(sonOdemeTarihi.getDate() + 2); // Pazartesiye at
    } else if (gun === 0) { // Pazar
        sonOdemeTarihi.setDate(sonOdemeTarihi.getDate() + 1); // Pazartesiye at
    }
    
    document.getElementById('sonOdemeGunu1').value = sonOdemeTarihi.getDate();
}

// Asgari ödeme hesapla (Kredi Kartı) - BDDK Yönetmeliğine göre
function hesaplaAsgariOdeme1() {
    const toplamLimit = parseCurrency(document.getElementById('toplamLimit1').value);
    const guncelBorc = parseCurrency(document.getElementById('guncelBorc1').value);
    
    // Borç yoksa asgari de 0
    if (!guncelBorc || guncelBorc <= 0) {
        document.getElementById('asgariOdeme1').value = '0';
        return;
    }
    
    // BDDK Kuralı: Limit > 50.000 TL ise %40, değilse %20
    let asgariOran = 0.20; // Varsayılan %20
    
    if (toplamLimit > 50000) {
        asgariOran = 0.40; // %40
    }
    
    const asgariOdeme = guncelBorc * asgariOran;
    
    // Formatlanmış olarak göster
    document.getElementById('asgariOdeme1').value = formatCurrencyDisplay(Math.round(asgariOdeme));
}

// Kredi kartı kaydet
function krediKartiKaydet() {
    const bankaAdi = document.getElementById('bankaAdi1').value;
    let kartAdi = document.getElementById('kartAdi1').value.trim();
    const toplamLimit = parseCurrency(document.getElementById('toplamLimit1').value);
    const guncelBorc = parseCurrency(document.getElementById('guncelBorc1').value);
    const hesapKesimGunu = parseInt(document.getElementById('hesapKesimTarihi1').value) || 0;
    const sonOdemeGunu = parseInt(document.getElementById('sonOdemeGunu1').value) || 0;
    const asgariOdeme = parseCurrency(document.getElementById('asgariOdeme1').value);
    
    if (!bankaAdi) {
        showToast('Lütfen banka adını girin');
        return;
    }
    
    // Kart adı boşsa varsayılan isim ata
    if (!kartAdi) {
        kartAdi = 'Kredi Kartım';
    }
    
    // Döngüsel tarih hesaplama: Günden tam ISO tarihi oluştur
    const hesapKesimTarihiISO = calculateCyclicalDate(hesapKesimGunu);
    const sonOdemeTarihiISO = calculateCyclicalDate(sonOdemeGunu);
    
    kartlar.push({
        id: Date.now().toString(),
        tip: 'Kredi Kartı',
        bankaAdi,
        kartAdi,
        toplamLimit,
        guncelBorc,
        asgariTutar: asgariOdeme,
        sonOdemeGunu,
        sonOdemeTarihi: sonOdemeTarihiISO || '', // ISO format (YYYY-MM-DD)
        hesapKesimTarihi: hesapKesimTarihiISO || '', // ISO format (YYYY-MM-DD)
        renk: '#' + Math.floor(Math.random()*16777215).toString(16),
        odenenTutar: 0, // Toplam ödenen tutar
        odemeGecmisi: []
    });
    
    // localStorage'a kaydet
    saveKartlarToStorage();
    
    showToast('Kredi kartı başarıyla eklendi');
    
    document.getElementById('bankaAdi1').value = '';
    document.getElementById('kartAdi1').value = '';
    document.getElementById('toplamLimit1').value = '';
    document.getElementById('guncelBorc1').value = '';
    document.getElementById('sonOdemeGunu1').value = '';
    document.getElementById('hesapKesimTarihi1').value = '';
    document.getElementById('asgariOdeme1').value = '';
    
    showScreen('anaSayfa');
}

// Kredi detay hesapla (Yeni mantık - sadece ileriye dönük)
function hesaplaKrediDetay() {
    const kalanTaksit = parseInt(document.getElementById('kalanTaksit2').value) || 0;
    const aylikTaksit = parseCurrency(document.getElementById('aylikTaksit2').value);
    const sonOdemeGunu = parseInt(document.getElementById('sonOdemeGunu2').value) || 1;
    
    // Toplam kalan borç hesapla
    const kalanBorc = kalanTaksit * aylikTaksit;
    document.getElementById('guncelBorc2').value = formatCurrencyDisplay(Math.round(kalanBorc));
    
    if (kalanTaksit > 0) {
        // Bitiş tarihini hesapla: Bugün + N ay
        const bugun = new Date();
        const bitisTarihi = new Date(bugun);
        bitisTarihi.setMonth(bitisTarihi.getMonth() + kalanTaksit);
        bitisTarihi.setDate(sonOdemeGunu);
        
        const bitisAy = bitisTarihi.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
        
        document.getElementById('krediBitisInfo').innerHTML = `
            <div style="color: #00e676; font-size: 14px; margin-top: 10px;">
                ℹ️ ${kalanTaksit} taksit kaldı • Tahmini bitiş: ${bitisAy}
            </div>
        `;
    } else {
        document.getElementById('krediBitisInfo').innerHTML = '';
    }
}

// Dinamik kalan taksit hesapla (Dashboard için)
function dinamikKalanTaksitHesapla(kredi) {
    if (!kredi.bitisTarihi) return kredi.kalanTaksit || 0;
    
    const bugun = new Date();
    const bitisTarihi = new Date(kredi.bitisTarihi);
    
    // Ay farkını hesapla
    const yilFark = bitisTarihi.getFullYear() - bugun.getFullYear();
    const ayFark = bitisTarihi.getMonth() - bugun.getMonth();
    const kalanAy = (yilFark * 12) + ayFark;
    
    return Math.max(0, kalanAy);
}

// Kredi kaydet (Yeni mantık)
function krediKaydet() {
    const bankaAdi = document.getElementById('bankaAdi2').value;
    let kartAdi = document.getElementById('kartAdi2').value.trim();
    const kalanTaksit = parseInt(document.getElementById('kalanTaksit2').value) || 0;
    const aylikTaksit = parseCurrency(document.getElementById('aylikTaksit2').value);
    const sonOdemeGunu = parseInt(document.getElementById('sonOdemeGunu2').value) || 1;
    const guncelBorc = parseCurrency(document.getElementById('guncelBorc2').value);
    
    if (!bankaAdi) {
        showToast('Lütfen banka adını girin');
        return;
    }
    
    if (kalanTaksit <= 0 || aylikTaksit <= 0) {
        showToast('Lütfen taksit bilgilerini girin');
        return;
    }
    
    // Kredi adı boşsa varsayılan isim ata
    if (!kartAdi) {
        kartAdi = 'Kredim';
    }
    
    // Bitiş tarihini hesapla ve kaydet (ISO format)
    const bugun = new Date();
    const bitisTarihi = new Date(bugun);
    bitisTarihi.setMonth(bitisTarihi.getMonth() + kalanTaksit);
    bitisTarihi.setDate(sonOdemeGunu);
    const bitisTarihiISO = bitisTarihi.toISOString().split('T')[0];
    
    // Sonraki ödeme tarihini döngüsel olarak hesapla
    const sonOdemeTarihiISO = calculateCyclicalDate(sonOdemeGunu);
    
    kartlar.push({
        id: Date.now().toString(),
        tip: 'Kredi',
        bankaAdi,
        kartAdi,
        toplamLimit: 0,
        guncelBorc,
        asgariTutar: aylikTaksit,
        sonOdemeGunu,
        sonOdemeTarihi: sonOdemeTarihiISO || '', // ISO format (YYYY-MM-DD)
        hesapKesimTarihi: '',
        kalanTaksit,
        aylikTaksit,
        bitisTarihi: bitisTarihiISO, // ISO format (YYYY-MM-DD)
        renk: '#' + Math.floor(Math.random()*16777215).toString(16),
        odenenTutar: 0, // Toplam ödenen tutar
        odemeGecmisi: []
    });
    
    // localStorage'a kaydet
    saveKartlarToStorage();
    
    showToast('Kredi başarıyla eklendi');
    
    // Formu temizle
    document.getElementById('bankaAdi2').value = '';
    document.getElementById('kartAdi2').value = '';
    document.getElementById('kalanTaksit2').value = '';
    document.getElementById('aylikTaksit2').value = '';
    document.getElementById('guncelBorc2').value = '';
    document.getElementById('sonOdemeGunu2').value = '1';
    document.getElementById('krediBitisInfo').innerHTML = '';
    
    showScreen('anaSayfa');
}

// Kredi kartlarını göster
function showKrediKartlari() {
    const krediKartlari = kartlar.filter(k => k.tip === 'Kredi Kartı');
    const container = document.getElementById('krediKartlariContent');
    
    if (krediKartlari.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><div>Henüz kredi kartı eklenmemiş</div></div>';
    } else {
        container.innerHTML = krediKartlari.map(kart => {
            const kalanGun = kalanGunHesapla(kart.sonOdemeTarihi);
            return `
                <div class="payment-card" onclick='showDetay(${JSON.stringify(kart).replace(/'/g, "&apos;")})'>
                    <div class="card-icon" style="background: ${kart.renk}"></div>
                    <div class="payment-info">
                        <div class="payment-title">${kart.bankaAdi}</div>
                        <div class="payment-date">${kart.kartAdi}</div>
                        ${kalanGun > 0 ? `<div class="payment-days-left">${kalanGun} gün kaldı</div>` : ''}
                    </div>
                    <div class="payment-amount">
                        <div class="payment-amount-text">${formatTurkishLira(kart.guncelBorc)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    showScreen('krediKartlari');
}

// Kredileri göster
function showKrediler() {
    const krediler = kartlar.filter(k => k.tip === 'Kredi');
    const container = document.getElementById('kredilerContent');
    
    if (krediler.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">💰</div><div>Henüz kredi eklenmemiş</div></div>';
    } else {
        container.innerHTML = krediler.map(kart => {
            const kalanGun = kalanGunHesapla(kart.sonOdemeTarihi);
            // Dinamik kalan taksit hesapla
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
            const dinamikKalanBorc = dinamikKalanTaksit * (kart.aylikTaksit || 0);
            
            return `
                <div class="payment-card" onclick='showDetay(${JSON.stringify(kart).replace(/'/g, "&apos;")})'>
                    <div class="card-icon" style="background: ${kart.renk}"></div>
                    <div class="payment-info">
                        <div class="payment-title">${kart.bankaAdi}</div>
                        <div class="payment-date">${kart.kartAdi}</div>
                        <div class="payment-days-left">${dinamikKalanTaksit} taksit kaldı</div>
                    </div>
                    <div class="payment-amount">
                        <div class="payment-amount-text">${formatTurkishLira(dinamikKalanBorc)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    showScreen('krediler');
}

// Geçmiş state
let secilenAy = new Date();

// Ay değiştir
function changeMonth(direction) {
    secilenAy.setMonth(secilenAy.getMonth() + direction);
    renderGecmis();
}

// Ay seçici aç
function openMonthPicker() {
    // Basit bir prompt ile ay seçimi (gelişmiş bir modal da yapılabilir)
    const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                   'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const secim = prompt(`Ay seçin (1-12):\n${aylar.map((a, i) => `${i+1}. ${a}`).join('\n')}`);
    
    if (secim && secim >= 1 && secim <= 12) {
        secilenAy.setMonth(parseInt(secim) - 1);
        renderGecmis();
    }
}

// Geçmiş
function renderGecmis() {
    const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                   'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    // Seçili ayı göster
    const ayAdi = aylar[secilenAy.getMonth()];
    const yil = secilenAy.getFullYear();
    document.getElementById('selectedMonth').textContent = `${ayAdi} ${yil}`;
    
    // Ödenen kartları ve geçmiş ödemeleri birleştir
    const odemeler = [];
    
    // Ödendi olarak işaretlenmiş kartlar
    kartlar.forEach(kart => {
        if (kart.odendi) {
            const odemeAy = new Date().getMonth();
            const odemeYil = new Date().getFullYear();
            
            if (odemeAy === secilenAy.getMonth() && odemeYil === secilenAy.getFullYear()) {
                let tutar = kart.asgariTutar;
                if (kart.tip === 'Kredi') {
                    tutar = kart.aylikTaksit || 0;
                }
                
                odemeler.push({
                    bankaAdi: kart.bankaAdi,
                    kartAdi: kart.kartAdi,
                    tutar: tutar,
                    tarih: new Date().toLocaleDateString('tr-TR'),
                    renk: kart.renk,
                    tip: kart.tip
                });
            }
        }
    });
    
    // Geçmiş ödemeler
    kartlar.forEach(kart => {
        if (kart.odemeGecmisi && kart.odemeGecmisi.length > 0) {
            kart.odemeGecmisi.forEach(odeme => {
                const odemeTarihi = new Date(odeme.tarih);
                if (odemeTarihi.getMonth() === secilenAy.getMonth() && 
                    odemeTarihi.getFullYear() === secilenAy.getFullYear()) {
                    odemeler.push({
                        bankaAdi: kart.bankaAdi,
                        kartAdi: odeme.ay || kart.kartAdi,
                        tutar: odeme.tutar,
                        tarih: odeme.tarih,
                        renk: kart.renk,
                        tip: kart.tip
                    });
                }
            });
        }
    });
    
    // Tarihe göre sırala
    odemeler.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
    
    // Toplam hesapla
    const toplamOdeme = odemeler.reduce((sum, o) => sum + o.tutar, 0);
    const odemeSayisi = odemeler.length;
    
    document.getElementById('aylikToplamOdeme').textContent = formatTurkishLira(toplamOdeme);
    document.getElementById('aylikOdemeSayisi').textContent = `${odemeSayisi} ödeme tamamlandı`;
    
    // Liste render
    const liste = document.getElementById('gecmisListesi');
    
    if (odemeler.length > 0) {
        liste.innerHTML = odemeler.map(odeme => `
            <div class="history-card">
                <div class="history-card-icon" style="background: ${odeme.renk}">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='white' font-weight='bold'%3E${odeme.bankaAdi.substring(0, 2)}%3C/text%3E%3C/svg%3E" alt="">
                </div>
                <div class="history-card-info">
                    <div class="history-card-title">${odeme.bankaAdi}</div>
                    <div class="history-card-subtitle">${odeme.kartAdi}</div>
                    <div class="history-card-date">${formatDateTR(odeme.tarih)}</div>
                </div>
                <div class="history-card-amount">
                    <div class="history-card-amount-text">${formatTurkishLira(odeme.tutar)}</div>
                    <div class="history-card-status">Ödendi</div>
                </div>
            </div>
        `).join('');
    } else {
        liste.innerHTML = '<div class="empty-state"><div class="empty-icon">🕐</div><div>Bu ay için ödeme kaydı bulunmuyor</div></div>';
    }
}

// Analiz
function renderAnaliz() {
    // Toplam borç hesapla (dinamik)
    const toplamBorc = kartlar.reduce((sum, k) => {
        if (k.tip === 'Kredi') {
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(k);
            return sum + (dinamikKalanTaksit * (k.aylikTaksit || 0));
        }
        return sum + k.guncelBorc;
    }, 0);
    
    // Toplam limit hesapla (sadece kredi kartları)
    const toplamLimit = kartlar.reduce((sum, k) => {
        if (k.tip === 'Kredi Kartı') {
            return sum + k.toplamLimit;
        }
        return sum;
    }, 0);
    
    // Kullanılabilir limit
    const kullanimBorc = kartlar.reduce((sum, k) => {
        if (k.tip === 'Kredi Kartı') {
            return sum + k.guncelBorc;
        }
        return sum;
    }, 0);
    const kullanilabilirLimit = toplamLimit - kullanimBorc;
    
    // Kredi kartı ve kredi borçları
    const krediKartiBorcu = kartlar.reduce((sum, k) => {
        if (k.tip === 'Kredi Kartı') {
            return sum + k.guncelBorc;
        }
        return sum;
    }, 0);
    
    const krediBorcu = kartlar.reduce((sum, k) => {
        if (k.tip === 'Kredi') {
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(k);
            return sum + (dinamikKalanTaksit * (k.aylikTaksit || 0));
        }
        return sum;
    }, 0);
    
    // Yüzdeler
    const krediKartiYuzde = toplamBorc > 0 ? Math.round((krediKartiBorcu / toplamBorc) * 100) : 0;
    const krediYuzde = toplamBorc > 0 ? Math.round((krediBorcu / toplamBorc) * 100) : 0;
    
    // Donut chart güncelle
    const donutChart = document.getElementById('donutChart');
    if (donutChart) {
        const krediKartiDerece = (krediKartiYuzde / 100) * 360;
        donutChart.style.background = `conic-gradient(
            #ff9800 0deg ${krediKartiDerece}deg,
            #2196f3 ${krediKartiDerece}deg 360deg
        )`;
    }
    
    // Değerleri güncelle
    document.getElementById('analizToplamBorc').textContent = formatTurkishLira(toplamBorc);
    document.getElementById('analizKullLimit').textContent = formatTurkishLira(kullanilabilirLimit);
    document.getElementById('krediKartiYuzde').textContent = `${krediKartiYuzde}%`;
    document.getElementById('krediYuzde').textContent = `${krediYuzde}%`;
    
    // Borç liderleri
    const siraliKartlar = [...kartlar].sort((a, b) => {
        const borcA = a.tip === 'Kredi' ? dinamikKalanTaksitHesapla(a) * (a.aylikTaksit || 0) : a.guncelBorc;
        const borcB = b.tip === 'Kredi' ? dinamikKalanTaksitHesapla(b) * (b.aylikTaksit || 0) : b.guncelBorc;
        return borcB - borcA;
    }).slice(0, 2);
    
    const liderlerHTML = siraliKartlar.map((kart, index) => {
        const borc = kart.tip === 'Kredi' ? 
            dinamikKalanTaksitHesapla(kart) * (kart.aylikTaksit || 0) : 
            kart.guncelBorc;
        
        return `
            <div class="leader-item">
                <div class="leader-rank">${index + 1}</div>
                <div class="leader-info">
                    <div class="leader-name">${kart.kartAdi}</div>
                    <div class="leader-type">${kart.bankaAdi} - ${kart.tip}</div>
                </div>
                <div class="leader-amount">${formatTurkishLira(borc)}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('borcLiderleri').innerHTML = liderlerHTML || '<div class="empty-state">Henüz borç bulunmuyor</div>';
}

// Ayarlar state
let ayarlar = {
    tema: 'Karanlık Mod',
    paraBirimi: '₺',
    bildirimler: true,
    hatirlatmaZamani: '1 Gün Önce',
    hatirlatmaSaati: '09:00',
    appLock: false,
    balanceBlur: false
};

// Bottom Sheet
function openBottomSheet(title, items, onSelect) {
    document.getElementById('bottomSheetTitle').textContent = title;
    const content = document.getElementById('bottomSheetContent');
    
    content.innerHTML = items.map((item, index) => `
        <div class="bottom-sheet-item" onclick="selectBottomSheetItem(${index})">
            <span class="bottom-sheet-item-text">${item.label}</span>
            ${item.selected ? '<span class="bottom-sheet-item-check">✓</span>' : ''}
        </div>
    `).join('');
    
    window.currentBottomSheetCallback = (index) => {
        onSelect(items[index]);
        closeBottomSheet();
    };
    
    document.getElementById('bottomSheet').classList.add('active');
    document.getElementById('bottomSheetOverlay').classList.add('active');
}

function selectBottomSheetItem(index) {
    if (window.currentBottomSheetCallback) {
        window.currentBottomSheetCallback(index);
    }
}

function closeBottomSheet() {
    document.getElementById('bottomSheet').classList.remove('active');
    document.getElementById('bottomSheetOverlay').classList.remove('active');
}

// Modal
function openModal(title, text, buttons) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    
    const buttonsHtml = buttons.map(btn => `
        <button class="modal-btn ${btn.className}" onclick="${btn.onClick}">${btn.text}</button>
    `).join('');
    
    document.getElementById('modalButtons').innerHTML = buttonsHtml;
    document.getElementById('modal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

// Ayarlar
function renderAyarlar() {
    document.getElementById('ayarlarContent').innerHTML = `
        <h3 class="section-title">Genel</h3>
        <div class="settings-item" onclick="temaSecimi()">
            <span class="settings-icon">🎨</span>
            <span class="settings-text">Tema Seçimi</span>
            <span class="settings-value" id="temaValue">${ayarlar.tema}</span>
            <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="paraBirimiSecimi()">
            <span class="settings-icon">💱</span>
            <span class="settings-text">Para Birimi</span>
            <span class="settings-value" id="paraBirimiValue">${ayarlar.paraBirimi}</span>
            <span class="settings-arrow">›</span>
        </div>
        
        <h3 class="section-title">Hesap</h3>
        <div class="settings-item" onclick="profilDuzenle()">
            <span class="settings-icon">👤</span>
            <span class="settings-text">Profil Bilgileri</span>
            <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="guvenlikSayfasi()">
            <span class="settings-icon">🔒</span>
            <span class="settings-text">Güvenlik</span>
            <span class="settings-arrow">›</span>
        </div>
        
        <h3 class="section-title">Bildirimler</h3>
        <div class="settings-item" onclick="toggleBildirimler(event)">
            <span class="settings-icon">🔔</span>
            <span class="settings-text">Bildirim Ayarları</span>
            <div class="toggle-switch ${ayarlar.bildirimler ? 'active' : ''}" id="bildirimToggle">
                <div class="toggle-switch-handle"></div>
            </div>
        </div>
        <div class="settings-item" onclick="hatirlatmaZamaniSecimi()">
            <span class="settings-icon">⏰</span>
            <span class="settings-text">Hatırlatma Zamanlaması</span>
            <span class="settings-value" id="hatirlatmaZamaniValue">${ayarlar.hatirlatmaZamani}</span>
            <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="hatirlatmaSaatiSecimi()">
            <span class="settings-icon">🕐</span>
            <span class="settings-text">Hatırlatma Saati</span>
            <span class="settings-value" id="hatirlatmaSaatiValue">${ayarlar.hatirlatmaSaati}</span>
            <span class="settings-arrow">›</span>
        </div>
        
        <h3 class="section-title">Veri ve Depolama</h3>
        <div class="settings-item" onclick="verileriDisaAktar()">
            <span class="settings-icon">📊</span>
            <span class="settings-text">Verileri Dışa Aktar</span>
            <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="yedekleGeriYukle()">
            <span class="settings-icon">💾</span>
            <span class="settings-text">Yedekle / Geri Yükle</span>
            <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item settings-item-danger" onclick="tumVerileriTemizle()">
            <span class="settings-icon">🗑️</span>
            <span class="settings-text settings-text-danger">Tüm Verileri Temizle</span>
            <span class="settings-arrow">›</span>
        </div>
        
        <h3 class="section-title">Diğer</h3>
        <div class="settings-item" onclick="yardimDestek()">
            <span class="settings-icon">❓</span>
            <span class="settings-text">Yardım & Destek</span>
            <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="hakkinda()">
            <span class="settings-icon">ℹ️</span>
            <span class="settings-text">Hakkında</span>
            <span class="settings-arrow">›</span>
        </div>
        
        <button class="logout-btn" onclick="cikisYap()">Çıkış Yap</button>
        
        <div class="version-info">Versiyon 1.0.0</div>
    `;
}

// Tema seçimi
function temaSecimi() {
    const items = [
        { label: 'Sistem Varsayılanı', value: 'Sistem', selected: ayarlar.tema === 'Sistem' },
        { label: 'Aydınlık Mod', value: 'Aydınlık Mod', selected: ayarlar.tema === 'Aydınlık Mod' },
        { label: 'Karanlık Mod', value: 'Karanlık Mod', selected: ayarlar.tema === 'Karanlık Mod' }
    ];
    
    openBottomSheet('Tema Seçimi', items, (item) => {
        ayarlar.tema = item.value;
        document.getElementById('temaValue').textContent = item.value;
        applyTheme(item.value);
        localStorage.setItem('tema', item.value);
    });
}

// Tema uygula
function applyTheme(tema) {
    if (tema === 'Aydınlık Mod') {
        document.body.classList.add('light-mode');
    } else if (tema === 'Karanlık Mod') {
        document.body.classList.remove('light-mode');
    } else {
        // Sistem varsayılanı
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }
}

// Para birimi seçimi
function paraBirimiSecimi() {
    const items = [
        { label: 'Türk Lirası (₺)', value: '₺', selected: ayarlar.paraBirimi === '₺' },
        { label: 'Dolar ($)', value: '$', selected: ayarlar.paraBirimi === '$' },
        { label: 'Euro (€)', value: '€', selected: ayarlar.paraBirimi === '€' },
        { label: 'Sterlin (£)', value: '£', selected: ayarlar.paraBirimi === '£' }
    ];
    
    openBottomSheet('Para Birimi', items, (item) => {
        ayarlar.paraBirimi = item.value;
        document.getElementById('paraBirimiValue').textContent = item.value;
    });
}

// Bildirim toggle
function toggleBildirimler(event) {
    event.stopPropagation();
    ayarlar.bildirimler = !ayarlar.bildirimler;
    const toggle = document.getElementById('bildirimToggle');
    if (ayarlar.bildirimler) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
}

// Hatırlatma zamanı
function hatirlatmaZamaniSecimi() {
    const items = [
        { label: 'Son Ödeme Günü', value: 'Son Ödeme Günü', selected: ayarlar.hatirlatmaZamani === 'Son Ödeme Günü' },
        { label: '1 Gün Önce', value: '1 Gün Önce', selected: ayarlar.hatirlatmaZamani === '1 Gün Önce' },
        { label: '2 Gün Önce', value: '2 Gün Önce', selected: ayarlar.hatirlatmaZamani === '2 Gün Önce' },
        { label: '3 Gün Önce', value: '3 Gün Önce', selected: ayarlar.hatirlatmaZamani === '3 Gün Önce' },
        { label: '1 Hafta Önce', value: '1 Hafta Önce', selected: ayarlar.hatirlatmaZamani === '1 Hafta Önce' }
    ];
    
    openBottomSheet('Hatırlatma Zamanlaması', items, (item) => {
        ayarlar.hatirlatmaZamani = item.value;
        document.getElementById('hatirlatmaZamaniValue').textContent = item.value;
    });
}

// Hatırlatma saati
function hatirlatmaSaatiSecimi() {
    const saat = prompt('Hatırlatma saatini girin (Örn: 09:00):', ayarlar.hatirlatmaSaati);
    if (saat) {
        ayarlar.hatirlatmaSaati = saat;
        document.getElementById('hatirlatmaSaatiValue').textContent = saat;
    }
}

// Verileri dışa aktar
function verileriDisaAktar() {
    const items = [
        { label: 'Excel Olarak İndir (.xlsx)', value: 'excel', selected: false },
        { label: 'PDF Olarak İndir (.pdf)', value: 'pdf', selected: false }
    ];
    
    openBottomSheet('Verileri Dışa Aktar', items, (item) => {
        exportData(item.value);
    });
}

// Export data function
function exportData(format) {
    // Check if required libraries are loaded
    if (format === 'excel' && typeof XLSX === 'undefined') {
        showToast('Excel kütüphanesi yüklenemedi. Sayfayı yenileyin.');
        return;
    }
    
    if (format === 'pdf' && (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined')) {
        showToast('PDF kütüphanesi yüklenemedi. Sayfayı yenileyin.');
        return;
    }
    
    try {
        // Check if there's data to export
        if (!kartlar || kartlar.length === 0) {
            showToast('Dışa aktarılacak veri bulunamadı');
            return;
        }
        
        // Prepare data for export
        const exportData = [];
        
        kartlar.forEach(kart => {
            const row = {
                'Tip': kart.tip,
                'Banka': kart.bankaAdi,
                'Kart/Kredi Adı': kart.kartAdi || '-',
                'Toplam Limit': kart.toplamLimit ? formatTurkishLira(kart.toplamLimit) : '-',
                'Güncel Borç': formatTurkishLira(kart.guncelBorc || 0),
                'Asgari Tutar': formatTurkishLira(kart.asgariTutar || 0),
                'Ödenen Tutar': formatTurkishLira(kart.odenenTutar || 0),
                'Son Ödeme Tarihi': formatDateTR(kart.sonOdemeTarihi),
                'Hesap Kesim Tarihi': formatDateTR(kart.hesapKesimTarihi),
                'Durum': (kart.odenenTutar || 0) > 0 ? 'Ödeme Yapıldı' : 'Bekliyor'
            };
            
            // Kredi için ek bilgiler
            if (kart.tip === 'Kredi') {
                const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
                row['Kalan Taksit'] = dinamikKalanTaksit;
                row['Aylık Taksit'] = formatTurkishLira(kart.aylikTaksit || 0);
                row['Kredi Bitiş Tarihi'] = formatDateTR(kart.bitisTarihi);
            }
            
            exportData.push(row);
        });
        
        if (format === 'excel') {
            exportToExcel(exportData);
        } else if (format === 'pdf') {
            exportToPDF(exportData);
        }
        
        showToast(`${format.toUpperCase()} dosyası başarıyla indirildi`);
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Dışa aktarma sırasında hata oluştu');
    }
}

// Export to Excel
function exportToExcel(data) {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const colWidths = [
        { wch: 15 }, // Tip
        { wch: 20 }, // Banka
        { wch: 25 }, // Kart/Kredi Adı
        { wch: 15 }, // Toplam Limit
        { wch: 15 }, // Güncel Borç
        { wch: 15 }, // Asgari Tutar
        { wch: 15 }, // Ödenen Tutar
        { wch: 18 }, // Son Ödeme Tarihi
        { wch: 18 }, // Hesap Kesim Tarihi
        { wch: 15 }, // Durum
        { wch: 12 }, // Kalan Taksit
        { wch: 15 }, // Aylık Taksit
        { wch: 18 }  // Kredi Bitiş Tarihi
    ];
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Kredi Takip Verileri');
    
    // Generate filename with current date
    const today = new Date();
    const excelDateStr = today.toISOString().split('T')[0];
    const filename = `kredi-takip-${excelDateStr}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
}

// Export to PDF
function exportToPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    
    // Add title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Kredi Takip Raporu', 20, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const today = new Date();
    const dateStr = today.toLocaleDateString('tr-TR');
    doc.text(`Rapor Tarihi: ${dateStr}`, 20, 30);
    
    // Prepare table data
    const tableColumns = [
        'Tip',
        'Banka',
        'Kart/Kredi Adı',
        'Güncel Borç',
        'Asgari Tutar',
        'Ödenen Tutar',
        'Son Ödeme Tarihi',
        'Durum'
    ];
    
    const tableRows = data.map(row => [
        row['Tip'],
        row['Banka'],
        row['Kart/Kredi Adı'],
        row['Güncel Borç'],
        row['Asgari Tutar'],
        row['Ödenen Tutar'],
        row['Son Ödeme Tarihi'],
        row['Durum']
    ]);
    
    // Add table
    doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [0, 230, 118], // Neon green
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { left: 20, right: 20 }
    });
    
    // Add summary at the bottom
    const finalY = doc.lastAutoTable.finalY + 20;
    
    // Calculate totals
    let toplamBorc = 0;
    let toplamOdenen = 0;
    
    kartlar.forEach(kart => {
        if (kart.tip === 'Kredi') {
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
            toplamBorc += dinamikKalanTaksit * (kart.aylikTaksit || 0);
        } else {
            toplamBorc += kart.guncelBorc || 0;
        }
        toplamOdenen += kart.odenenTutar || 0;
    });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Özet:', 20, finalY);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Toplam Kalan Borç: ${formatTurkishLira(toplamBorc)}`, 20, finalY + 10);
    doc.text(`Toplam Ödenen: ${formatTurkishLira(toplamOdenen)}`, 20, finalY + 20);
    doc.text(`Genel Toplam: ${formatTurkishLira(toplamBorc + toplamOdenen)}`, 20, finalY + 30);
    
    // Generate filename with current date
    const pdfDateStr = today.toISOString().split('T')[0];
    const filename = `kredi-takip-${pdfDateStr}.pdf`;
    
    // Save file
    doc.save(filename);
}

// Yedekle / Geri yükle
function yedekleGeriYukle() {
    openModal('Yedekleme', '', [
        { text: 'Yedek Oluştur', className: 'modal-btn-primary', onClick: 'yedekOlustur()' },
        { text: 'Yedeği Geri Yükle', className: 'modal-btn-primary', onClick: 'yedekGeriYukle()' },
        { text: 'İptal', className: 'modal-btn-cancel', onClick: 'closeModal()' }
    ]);
}

function yedekOlustur() {
    closeModal();
    alert('Yedek başarıyla oluşturuldu');
}

function yedekGeriYukle() {
    closeModal();
    alert('Yedek geri yükleme özelliği yakında eklenecek');
}

// Tüm verileri temizle
function tumVerileriTemizle() {
    openModal(
        'Emin misiniz?',
        'Tüm kayıtlı kartlarınız, kredileriniz ve geçmiş verileriniz silinecektir. Bu işlem geri alınamaz!',
        [
            { text: 'İptal', className: 'modal-btn-cancel', onClick: 'closeModal()' },
            { text: 'Evet, Sil', className: 'modal-btn-danger', onClick: 'verileriSil()' }
        ]
    );
}

function verileriSil() {
    kartlar = [];
    closeModal();
    alert('Tüm veriler başarıyla temizlendi');
    showScreen('anaSayfa');
}

// Yardım & Destek
function yardimDestek() {
    window.location.href = 'mailto:destek@kreditakip.com?subject=Yardım Talebi';
}

// Hakkında
function hakkinda() {
    openModal(
        'Kredi Takip',
        'Versiyon 1.0.0\n\nKredi kartı ve kredi borçlarınızı kolayca takip edin.\n\n© 2024 Kredi Takip',
        [
            { text: 'Tamam', className: 'modal-btn-primary', onClick: 'closeModal()' }
        ]
    );
}

// Profil düzenleme
function profilDuzenle() {
    // Mevcut bilgileri yükle
    const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || '';
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || '';
    const userPhone = localStorage.getItem('userPhone') || '';
    const userAvatar = localStorage.getItem('userAvatar') || '';
    
    document.getElementById('profileName').value = userName;
    document.getElementById('profileEmail').value = userEmail;
    document.getElementById('profilePhone').value = userPhone;
    
    // Avatar güncelle
    updateProfileAvatar(userName, userAvatar);
    
    showScreen('profilDuzenle');
}

// Avatar güncelle
function updateProfileAvatar(name, avatarUrl) {
    const avatarText = document.getElementById('profileAvatarText');
    const avatarImg = document.getElementById('profileAvatarImg');
    
    if (avatarUrl) {
        avatarImg.src = avatarUrl;
        avatarImg.style.display = 'block';
        avatarText.style.display = 'none';
    } else {
        const initial = name ? name.charAt(0).toUpperCase() : 'A';
        avatarText.textContent = initial;
        avatarText.style.display = 'block';
        avatarImg.style.display = 'none';
    }
}

// Avatar yükleme
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarUrl = e.target.result;
            localStorage.setItem('userAvatar', avatarUrl);
            updateProfileAvatar('', avatarUrl);
        };
        reader.readAsDataURL(file);
    }
}

// Profil kaydet
function saveProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    
    // localStorage veya sessionStorage'a kaydet
    const isRemembered = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isRemembered) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
    } else {
        sessionStorage.setItem('userName', name);
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userPhone', phone);
    }
    
    // UI'ı güncelle
    updateUserName(name);
    
    // Toast göster
    showToast('Profiliniz başarıyla güncellendi');
    
    setTimeout(() => {
        showScreen('ayarlar');
    }, 1500);
}

// Toast göster
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Takvime hatırlatıcı ekle (.ics dosyası oluştur ve indir)
function addToCalendar(kartId) {
    const kart = kartlar.find(k => k.id === kartId);
    if (!kart || !kart.sonOdemeTarihi) {
        showToast('Ödeme tarihi bulunamadı!');
        return;
    }
    
    try {
        // Tarih formatını düzenle (ISO formatından Date objesine)
        const paymentDate = new Date(kart.sonOdemeTarihi);
        
        // Geçersiz tarih kontrolü
        if (isNaN(paymentDate.getTime())) {
            showToast('Geçersiz ödeme tarihi!');
            return;
        }
        
        // ICS formatı için tarih (YYYYMMDD formatında)
        const formatDateForICS = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        };
        
        // Etkinlik tarihi (tüm gün etkinliği)
        const eventDate = formatDateForICS(paymentDate);
        
        // Bugünün tarihi (oluşturulma tarihi)
        const now = new Date();
        const createdDate = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        // Etkinlik başlığı ve açıklaması
        const eventTitle = `${kart.kartAdi || kart.bankaAdi} Ödemesi`;
        const eventDescription = `Ödeme Tutarı: ${formatTurkishLira(kart.asgariTutar || kart.guncelBorc || 0)}\\nBanka: ${kart.bankaAdi}\\nTip: ${kart.tip}`;
        
        // Benzersiz ID oluştur
        const eventId = `payment-${kart.id}-${Date.now()}@kreditakip.app`;
        
        // ICS dosya içeriği oluştur
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Kredi Takip//Ödeme Hatırlatıcısı//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${eventId}`,
            `DTSTAMP:${createdDate}`,
            `DTSTART;VALUE=DATE:${eventDate}`,
            `DTEND;VALUE=DATE:${eventDate}`,
            `SUMMARY:${eventTitle}`,
            `DESCRIPTION:${eventDescription}`,
            'STATUS:CONFIRMED',
            'TRANSP:TRANSPARENT',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            `DESCRIPTION:Yarın ${eventTitle} ödeme günü!`,
            'END:VALARM',
            'BEGIN:VALARM',
            'TRIGGER:PT0M',
            'ACTION:DISPLAY',
            `DESCRIPTION:Bugün ${eventTitle} ödeme günü!`,
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        
        // Blob oluştur ve indir
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        
        // Sanal link oluştur ve tıkla
        const link = document.createElement('a');
        link.href = url;
        link.download = `${kart.kartAdi || kart.bankaAdi}_odeme_hatirlatici.ics`;
        document.body.appendChild(link);
        link.click();
        
        // Temizlik
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showToast('📅 Takvim hatırlatıcısı indirildi!');
        
    } catch (error) {
        console.error('Takvim hatırlatıcısı oluşturma hatası:', error);
        showToast('Hatırlatıcı oluşturulurken hata oluştu!');
    }
}

// Gizlilik Modu (Privacy Mode)
function togglePrivacyMode() {
    const body = document.body;
    const privacyToggle = document.getElementById('privacyToggle');
    const privacyIcon = privacyToggle.querySelector('.privacy-icon');
    
    // Privacy mode durumunu toggle et
    const isPrivacyActive = body.classList.contains('privacy-active');
    
    if (isPrivacyActive) {
        // Privacy mode'u kapat
        body.classList.remove('privacy-active');
        privacyToggle.classList.remove('active');
        privacyIcon.textContent = '👁️'; // Açık göz
        localStorage.setItem('privacyMode', 'false');
        showToast('Gizlilik modu kapatıldı');
    } else {
        // Privacy mode'u aç
        body.classList.add('privacy-active');
        privacyToggle.classList.add('active');
        privacyIcon.textContent = '🙈'; // Kapalı göz
        localStorage.setItem('privacyMode', 'true');
        showToast('Gizlilik modu açıldı - Tutarlar gizlendi');
    }
}

// Sayfa yüklendiğinde privacy mode durumunu kontrol et
function initializePrivacyMode() {
    const savedPrivacyMode = localStorage.getItem('privacyMode');
    
    if (savedPrivacyMode === 'true') {
        const body = document.body;
        const privacyToggle = document.getElementById('privacyToggle');
        const privacyIcon = privacyToggle.querySelector('.privacy-icon');
        
        body.classList.add('privacy-active');
        privacyToggle.classList.add('active');
        privacyIcon.textContent = '🙈'; // Kapalı göz
    }
}

// Güvenlik sayfası
function guvenlikSayfasi() {
    // Mevcut ayarları yükle
    const appLock = localStorage.getItem('appLock') === 'true';
    const balanceBlur = localStorage.getItem('balanceBlur') === 'true';
    
    ayarlar.appLock = appLock;
    ayarlar.balanceBlur = balanceBlur;
    
    showScreen('guvenlik');
    
    // Toggle'ları güncelle
    setTimeout(() => {
        const appLockToggle = document.getElementById('appLockToggle');
        const balanceBlurToggle = document.getElementById('balanceBlurToggle');
        
        if (appLock && appLockToggle) {
            appLockToggle.classList.add('active');
        }
        if (balanceBlur && balanceBlurToggle) {
            balanceBlurToggle.classList.add('active');
        }
    }, 100);
}

// Şifre güncelle
function updatePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Mevcut şifreyi kontrol et
    const savedPassword = localStorage.getItem('userPassword');
    if (savedPassword && savedPassword !== currentPassword) {
        showToast('Mevcut şifre yanlış!');
        return;
    }
    
    // Yeni şifrelerin eşleşmesini kontrol et
    if (newPassword !== confirmPassword) {
        showToast('Yeni şifreler eşleşmiyor!');
        return;
    }
    
    // Şifre uzunluğu kontrolü
    if (newPassword.length < 6) {
        showToast('Şifre en az 6 karakter olmalıdır!');
        return;
    }
    
    // Şifreyi kaydet
    localStorage.setItem('userPassword', newPassword);
    
    // Formu temizle
    document.getElementById('passwordForm').reset();
    
    showToast('Şifreniz başarıyla güncellendi');
}

// Uygulama kilidi toggle
function toggleAppLock(event) {
    event.stopPropagation();
    
    const toggle = document.getElementById('appLockToggle');
    const isActive = toggle.classList.contains('active');
    
    if (!isActive) {
        // PIN belirleme modalı
        const pin = prompt('Lütfen 4 haneli bir PIN belirleyin:');
        
        if (pin && pin.length === 4 && /^\d+$/.test(pin)) {
            localStorage.setItem('appPin', pin);
            localStorage.setItem('appLock', 'true');
            ayarlar.appLock = true;
            toggle.classList.add('active');
            showToast('Uygulama kilidi aktif edildi');
        } else if (pin) {
            showToast('PIN 4 haneli rakam olmalıdır!');
        }
    } else {
        // PIN'i kaldır
        const savedPin = localStorage.getItem('appPin');
        const enteredPin = prompt('PIN kodunuzu girin:');
        
        if (enteredPin === savedPin) {
            localStorage.removeItem('appPin');
            localStorage.setItem('appLock', 'false');
            ayarlar.appLock = false;
            toggle.classList.remove('active');
            showToast('Uygulama kilidi kapatıldı');
        } else {
            showToast('Yanlış PIN!');
        }
    }
}

// Bakiye gizleme toggle
function toggleBalanceBlur(event) {
    event.stopPropagation();
    
    const toggle = document.getElementById('balanceBlurToggle');
    const isActive = toggle.classList.contains('active');
    
    if (isActive) {
        toggle.classList.remove('active');
        localStorage.setItem('balanceBlur', 'false');
        ayarlar.balanceBlur = false;
        showToast('Bakiyeler artık görünür olacak');
    } else {
        toggle.classList.add('active');
        localStorage.setItem('balanceBlur', 'true');
        ayarlar.balanceBlur = true;
        showToast('Bakiyeler başlangıçta gizlenecek');
    }
}

function showAyarlar() {
    renderAyarlar();
    showScreen('ayarlar');
}

// Global Event Delegation - Dinamik butonlar için
document.addEventListener('click', function(e) {
    // Ödeme Kaydet butonu
    if (e.target && e.target.id === 'savePaymentBtn') {
        e.preventDefault();
        
        if (!secilenKart) {
            showToast('Lütfen bir kart seçin');
            return;
        }
        
        // Input değerini al ve temizle
        const inputValue = document.getElementById('paymentAmount').value;
        
        // Noktalı formatı temizle (5.800 -> 5800)
        const cleanValue = inputValue.replace(/\./g, '');
        const odemeTutari = parseFloat(cleanValue);
        
        if (!odemeTutari || odemeTutari <= 0 || isNaN(odemeTutari)) {
            showToast('Lütfen geçerli bir tutar girin');
            return;
        }
        
        // Toplam borcu hesapla
        let toplamBorc = secilenKart.guncelBorc;
        if (secilenKart.tip === 'Kredi') {
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(secilenKart);
            toplamBorc = dinamikKalanTaksit * (secilenKart.aylikTaksit || 0);
        }
        
        if (odemeTutari > toplamBorc) {
            showToast('Ödeme tutarı toplam borçtan fazla olamaz');
            return;
        }
        
        // Kartı bul
        const kart = kartlar.find(k => k.id === secilenKart.id);
        if (!kart) {
            showToast('Kart bulunamadı');
            return;
        }
        
        // Ödeme kaydı oluştur
        const yeniOdeme = {
            id: Date.now().toString(),
            ay: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) + ' Ödemesi',
            tarih: getDynamicDateISO(0),
            tutar: odemeTutari,
            durum: 'Ödendi'
        };
        
        // Ödeme geçmişine ekle
        if (!kart.odemeGecmisi) {
            kart.odemeGecmisi = [];
        }
        kart.odemeGecmisi.unshift(yeniOdeme);
        
        // odenenTutar'ı artır
        if (!kart.odenenTutar) {
            kart.odenenTutar = 0;
        }
        kart.odenenTutar += odemeTutari;
        
        // Borcu güncelle - Kredi Kartı ve Kredi için farklı mantık
        if (kart.tip === 'Kredi') {
            // KREDİ İÇİN ÖZEL MANTIK
            const aylikTaksit = kart.aylikTaksit || 0;
            const dinamikKalanTaksit = dinamikKalanTaksitHesapla(kart);
            
            if (odemeTutari >= toplamBorc) {
                // Borç tamamen kapandı
                kart.guncelBorc = 0;
                kart.asgariTutar = 0;
                kart.odendi = true;
                kart.kalanTaksit = 0;
                showToast('✓ Ödeme başarıyla alındı! Kredi tamamen kapandı.');
            } else {
                // Kısmi ödeme
                const yeniBorc = toplamBorc - odemeTutari;
                kart.guncelBorc = yeniBorc;
                
                // Eğer ödenen tutar >= Aylık Taksit ise
                if (odemeTutari >= aylikTaksit) {
                    // Kaç taksit ödendi hesapla
                    const odenenTaksitSayisi = Math.floor(odemeTutari / aylikTaksit);
                    
                    // Kalan taksit sayısını azalt
                    const yeniKalanTaksit = Math.max(0, dinamikKalanTaksit - odenenTaksitSayisi);
                    
                    // Bitiş tarihini güncelle
                    if (kart.bitisTarihi) {
                        const bitisTarihi = new Date(kart.bitisTarihi);
                        bitisTarihi.setMonth(bitisTarihi.getMonth() - odenenTaksitSayisi);
                        kart.bitisTarihi = bitisTarihi.toISOString().split('T')[0];
                    }
                    
                    // Sonraki ödeme tarihini 1 ay ileri at
                    if (kart.sonOdemeTarihi) {
                        const sonrakiOdeme = new Date(kart.sonOdemeTarihi);
                        sonrakiOdeme.setMonth(sonrakiOdeme.getMonth() + odenenTaksitSayisi);
                        kart.sonOdemeTarihi = sonrakiOdeme.toISOString().split('T')[0];
                    }
                    
                    showToast(`✓ ${odenenTaksitSayisi} taksit ödendi! Kalan: ${yeniKalanTaksit} taksit`);
                } else {
                    // Taksit tutarından az ödeme yapıldı
                    showToast(`✓ Ödeme alındı! Kalan borç: ${formatTurkishLira(Math.round(yeniBorc))}`);
                }
            }
        } else {
            // KREDİ KARTI İÇİN MEVCUT MANTIK
            if (odemeTutari >= toplamBorc) {
                // Tam ödeme
                kart.guncelBorc = 0;
                kart.asgariTutar = 0;
                kart.odendi = true;
                showToast('✓ Ödeme başarıyla alındı! Borç sıfırlandı.');
            } else {
                // Kısmi ödeme
                const yeniBorc = toplamBorc - odemeTutari;
                kart.guncelBorc = yeniBorc;
                
                // Asgari tutarı BDDK kuralına göre güncelle
                if (kart.toplamLimit > 50000) {
                    kart.asgariTutar = yeniBorc * 0.40; // %40
                } else {
                    kart.asgariTutar = yeniBorc * 0.20; // %20
                }
                
                showToast(`✓ Ödeme başarıyla alındı! Kalan borç: ${formatTurkishLira(Math.round(yeniBorc))}`);
            }
        }
        
        // Seçilen kartı güncelle
        secilenKart = kart;
        
        // Modal kapat
        closePaymentModal();
        
        // Sayfaları yenile
        showDetay(kart);
        renderKartListesi();
    }
    
    // Ödeme İptal butonu
    if (e.target && e.target.id === 'cancelPaymentBtn') {
        e.preventDefault();
        closePaymentModal();
    }
});
// Privacy Mode Functions
let isPrivacyMode = false;

// Privacy mode'u toggle et
function togglePrivacyMode() {
    isPrivacyMode = !isPrivacyMode;
    
    const body = document.body;
    const toggleBtn = document.getElementById('privacyToggle');
    const icon = toggleBtn.querySelector('.privacy-icon');
    
    if (isPrivacyMode) {
        // Privacy mode aktif
        body.classList.add('privacy-active');
        toggleBtn.classList.add('active');
        icon.textContent = '🙈'; // Kapalı göz
        localStorage.setItem('privacyMode', 'true');
        showToast('🔒 Gizlilik modu aktif');
    } else {
        // Privacy mode pasif
        body.classList.remove('privacy-active');
        toggleBtn.classList.remove('active');
        icon.textContent = '👁️'; // Açık göz
        localStorage.setItem('privacyMode', 'false');
        showToast('👁️ Gizlilik modu kapalı');
    }
}

// Privacy mode durumunu yükle
function loadPrivacyMode() {
    const savedPrivacyMode = localStorage.getItem('privacyMode');
    
    if (savedPrivacyMode === 'true') {
        isPrivacyMode = false; // togglePrivacyMode fonksiyonu tersine çevirecek
        togglePrivacyMode();
    }
}

