import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Image, SafeAreaView, TextInput, ActivityIndicator,
  Dimensions, Animated, Platform, Linking, RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP = SCREEN_WIDTH > 768;

const SUPABASE_URL = 'https://svaqquywnidqecbcwaqe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YXFxdXl3bmlkcWVjYmN3YXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDgxNTIsImV4cCI6MjA4OTUyNDE1Mn0.dpSaYruBAUArI6OldUcbxHNm-WbicGckGh3-5eSybD4';
const ADMIN_SIFRE = 'Etk!nL!nk#2024$';
const ADMIN_TIKLAMA_SAYISI = 5;
const LEAD_UCRETI = 50;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

async function apiFetch(endpoint) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, { headers: HEADERS });
    return r.json();
  } catch (e) {
    console.log('apiFetch hata:', e.message);
    return [];
  }
}
async function apiPost(endpoint, body) {
  return fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  });
}
async function apiPatch(endpoint, body) {
  return fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method: 'PATCH',
    headers: { ...HEADERS, 'Prefer': 'return=minimal' },
    body: JSON.stringify(body),
  });
}
async function apiDelete(endpoint) {
  return fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, { method: 'DELETE', headers: HEADERS });
}

const C = {
  bg: '#FAFAF8', bgCard: '#FFFFFF',
  gold: '#B8973A', goldLight: '#F0E6C8', goldSoft: '#FBF7EE',
  midnight: '#1A1F36', midnightSoft: '#2D3561',
  text: '#1A1A1A', textMid: '#555555', textSoft: '#999999',
  border: '#EBEBEB', romantic: '#8B2252', romanticSoft: '#FDF0F5',
  success: '#2D6A4F', successSoft: '#D8F3DC', white: '#FFFFFF',
  danger: '#C0392B', dangerSoft: '#FDECEA',
  whatsapp: '#25D366',
};

const ANA_KATEGORILER = [
  { id: 'hepsi',           etiket: 'Tümü',          emoji: '✦' },
  { id: 'ozel_gunler',     etiket: 'Özel Günler',   emoji: '💍' },
  { id: 'kurumsal',        etiket: 'Kurumsal',       emoji: '🏛' },
  { id: 'sosyal_kulturel', etiket: 'Sosyal',         emoji: '🎭' },
  { id: 'populer',         etiket: 'Popüler Şimdi', emoji: '🔥' },
];

const ALT_KATEGORILER = {
  ozel_gunler: [
    { id: 'dugun',           etiket: 'Düğün',           emoji: '🌸' },
    { id: 'nisan',           etiket: 'Nişan',           emoji: '💍' },
    { id: 'mezuniyet',       etiket: 'Mezuniyet',       emoji: '🎓' },
    { id: 'dogum_gunu',      etiket: 'Doğum Günü',      emoji: '🎂' },
    { id: 'evlenme_teklifi', etiket: 'Evlenme Teklifi', emoji: '💝' },
    { id: 'bekarliga_veda',  etiket: 'Bekarlığa Veda',  emoji: '🥂' },
  ],
  kurumsal: [
    { id: 'sirket_toplantisi',   etiket: 'Şirket Toplantısı',   emoji: '💼' },
    { id: 'yatirimci_bulusmasi', etiket: 'Yatırımcı Buluşması', emoji: '📊' },
    { id: 'sirket_etkinligi',    etiket: 'Şirket Etkinliği',    emoji: '🏢' },
    { id: 'yilbasi_partisi',     etiket: 'Yılbaşı Partisi',     emoji: '🎊' },
  ],
  sosyal_kulturel: [
    { id: 'panel',  etiket: 'Panel/Konferans', emoji: '🎤' },
    { id: 'zirve',  etiket: 'Zirve',           emoji: '⭐' },
    { id: 'fuar',   etiket: 'Fuar',            emoji: '🏪' },
    { id: 'konser', etiket: 'Konser',          emoji: '🎵' },
  ],
};

const FIZIKSEL_FILTRELER = [
  { id: 'Teras',        etiket: 'Teras',        emoji: '🌅' },
  { id: 'Bahçe',        etiket: 'Bahçe',        emoji: '🌿' },
  { id: 'Deniz Kenarı', etiket: 'Deniz Kenarı', emoji: '🌊' },
  { id: 'Havuz',        etiket: 'Havuz',        emoji: '🏊' },
  { id: 'Kapalı Alan',  etiket: 'Kapalı',       emoji: '🏛' },
  { id: 'Özel Oda',     etiket: 'Özel Oda',     emoji: '🚪' },
];

const ILETISIM_TURLERI = [
  { id: 'whatsapp', etiket: 'WhatsApp',     emoji: '💬', renk: '#25D366' },
  { id: 'telefon',  etiket: 'Telefon',      emoji: '📞', renk: C.midnight },
  { id: 'email',    etiket: 'E-posta',      emoji: '📧', renk: C.midnightSoft },
  { id: 'form',     etiket: 'Teklif Formu', emoji: '📋', renk: C.gold },
];

const ARAMA_ONERILERI = [
  'İstanbul düğün', 'Ankara nişan', 'İzmir doğum günü',
  'İstanbul kurumsal', 'Antalya düğün', 'Bodrum nişan',
  'İstanbul mezuniyet', 'Ankara toplantı', 'İstanbul evlenme teklifi',
];

// ── YARDIMCI FONKSİYONLAR ───────────────────────────────
async function fotografYukle(setUrl, setYukleniyor) {
  if (Platform.OS === 'web') {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setYukleniyor(true);
      try {
        const dosyaAdi = `mekan_${Date.now()}.jpg`;
        const response = await fetch(
          `${SUPABASE_URL}/storage/v1/object/mekan-fotograflar/${dosyaAdi}`,
          { method: 'POST', headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': file.type, 'x-upsert': 'true' }, body: file }
        );
        if (response.ok) {
          setUrl(`${SUPABASE_URL}/storage/v1/object/public/mekan-fotograflar/${dosyaAdi}`);
          alert('✅ Fotoğraf yüklendi!');
        }
      } catch (err) { alert('Hata: ' + err.message); }
      setYukleniyor(false);
    };
    input.click();
  }
}

function youtubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  return url;
}

function formatTarih(tarih) {
  return new Date(tarih).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── 1. KVKK ONAY KUTUSU BİLEŞENİ ────────────────────────
function KVKKOnayKutusu({ onayVerildi, setOnayVerildi, onGizlilikAc }) {
  return (
    <TouchableOpacity
      style={styles.kvkkRow}
      onPress={() => setOnayVerildi(!onayVerildi)}
      activeOpacity={0.7}
    >
      <View style={[styles.kvkkCheckbox, onayVerildi && styles.kvkkCheckboxAktif]}>
        {onayVerildi && <Text style={styles.kvkkCheckMark}>✓</Text>}
      </View>
      <Text style={styles.kvkkText}>
        <Text style={styles.kvkkTextNormal}>Kişisel verilerimin işlenmesini, </Text>
        <Text
          style={styles.kvkkLink}
          onPress={(e) => { e.stopPropagation?.(); onGizlilikAc(); }}
        >
          Gizlilik Politikası
        </Text>
        <Text style={styles.kvkkTextNormal}> kapsamında onaylıyorum.</Text>
        <Text style={{ color: C.danger }}> *</Text>
      </Text>
    </TouchableOpacity>
  );
}

// ── 2. GİZLİLİK POLİTİKASI SAYFASI ──────────────────────
function GizlilikPolitikasi({ onKapat }) {
  const slideAnim = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 12, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }], maxHeight: '92%', paddingHorizontal: 0 }]}>
        <View style={[styles.modalBar, { backgroundColor: C.midnight }]} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 }}>
          <Text style={[styles.modalBaslik, { marginBottom: 0 }]}>🔒 Gizlilik Politikası</Text>
          <TouchableOpacity onPress={onKapat} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20, color: C.textSoft }}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.gizlilikTarih}>Son güncelleme: Ocak 2025</Text>

          {[
            {
              baslik: '1. Veri Sorumlusu',
              icerik: 'etkinlink ("Şirket", "biz") olarak, kişisel verilerinizin güvenliği konusunda azami özen göstermekteyiz. Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmıştır.',
            },
            {
              baslik: '2. Toplanan Kişisel Veriler',
              icerik: 'Platformumuzda teklif formu doldurduğunuzda şu bilgileri topluyoruz:\n\n• Ad ve soyadınız\n• Telefon numaranız\n• E-posta adresiniz (opsiyonel)\n• Etkinlik tarihi ve kişi sayısı bilgisi\n• İletişim notlarınız',
            },
            {
              baslik: '3. Verilerin İşlenme Amacı',
              icerik: 'Toplanan kişisel veriler yalnızca şu amaçlarla işlenmektedir:\n\n• Talep ettiğiniz mekan hakkında size fiyat teklifi sunulması\n• Mekan sahiplerinin başvurunuza geri dönebilmesi\n• Başvuru sürecinizin takip edilebilmesi\n• Yasal yükümlülüklerin yerine getirilmesi',
            },
            {
              baslik: '4. Veri Paylaşımı',
              icerik: 'Kişisel verileriniz yalnızca teklif talep ettiğiniz mekanın sahibiyle paylaşılır. Üçüncü taraflarla, iş ortaklarıyla veya reklam şirketleriyle kesinlikle paylaşılmaz. Yasal zorunluluk olmadıkça hiçbir kurumla paylaşılmaz.',
            },
            {
              baslik: '5. Veri Saklama Süresi',
              icerik: 'Kişisel verileriniz, amacın gerektirdiği süre boyunca ve ilgili mevzuatın öngördüğü süreler dahilinde saklanır. Talep formlarındaki bilgiler en fazla 2 yıl saklanmaktadır.',
            },
            {
              baslik: '6. KVKK Kapsamındaki Haklarınız',
              icerik: '6698 sayılı Kanun\'un 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:\n\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• İşlenmişse buna ilişkin bilgi talep etme\n• İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme\n• Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme\n• Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme\n• Kişisel verilerinizin silinmesini veya yok edilmesini isteme',
            },
            {
              baslik: '7. İletişim',
              icerik: 'KVKK kapsamındaki haklarınızı kullanmak veya sorularınız için bizimle iletişime geçebilirsiniz:\n\nE-posta: kvkk@etkinlink.com\nAdres: İstanbul, Türkiye',
            },
            {
              baslik: '8. Çerezler',
              icerik: 'Uygulamamız oturum bilgilerini cihazınızda yerel olarak saklar. Bu veriler yalnızca giriş durumunuzu hatırlamak için kullanılır ve hiçbir analiz veya reklam amacıyla işlenmez.',
            },
          ].map((b, i) => (
            <View key={i} style={styles.gizlilikBolum}>
              <Text style={styles.gizlilikBaslik}>{b.baslik}</Text>
              <Text style={styles.gizlilikIcerik}>{b.icerik}</Text>
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border }}>
          <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={onKapat}>
            <Text style={styles.teklifBtnText}>Anladım, Kapat</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ── 5. HATA SAYFASI ──────────────────────────────────────
function HataSayfasi({ hata, onYeniden }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <Animated.View style={{ alignItems: 'center', paddingHorizontal: 40, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.hataIkonContainer}>
          <Text style={styles.hataIkon}>📡</Text>
        </View>
        <Text style={styles.hataBaslik}>Bağlantı Sorunu</Text>
        <Text style={styles.hataAciklama}>
          {hata || 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.'}
        </Text>
        <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight, paddingHorizontal: 32, marginTop: 24 }]} onPress={onYeniden}>
          <Text style={styles.teklifBtnText}>🔄 Tekrar Dene</Text>
        </TouchableOpacity>
        <Text style={{ color: C.textSoft, fontSize: 12, marginTop: 20, textAlign: 'center', lineHeight: 18 }}>
          Sorun devam ederse{'\n'}
          <Text style={{ color: C.gold }}>destek@etkinlink.com</Text> adresine yazın.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

// ── ARAMA ÇUBUĞU ─────────────────────────────────────────
function AramaComubugu({ arama, setArama }) {
  const [odakta, setOdakta] = useState(false);
  const [oneriIndex, setOneriIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOneriIndex(i => (i + 1) % ARAMA_ONERILERI.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const filtreliOneriler = arama.length > 0
    ? ARAMA_ONERILERI.filter(o => o.toLowerCase().includes(arama.toLowerCase()))
    : [];

  return (
    <View style={{ marginHorizontal: 16, marginTop: 12, zIndex: 100 }}>
      <View style={styles.aramaContainer}>
        <Text style={styles.aramaIcon}>⌕</Text>
        <TextInput
          style={styles.aramaInput}
          placeholder={odakta ? 'Şehir, mekan veya etkinlik türü...' : ARAMA_ONERILERI[oneriIndex]}
          placeholderTextColor={C.textSoft}
          value={arama}
          onChangeText={setArama}
          onFocus={() => setOdakta(true)}
          onBlur={() => setTimeout(() => setOdakta(false), 200)}
        />
        {arama.length > 0 && (
          <TouchableOpacity onPress={() => setArama('')} style={{ padding: 8 }}>
            <Text style={{ color: C.textSoft, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {odakta && filtreliOneriler.length > 0 && (
        <View style={styles.aramaOneriContainer}>
          {filtreliOneriler.slice(0, 5).map((o, i) => (
            <TouchableOpacity key={i} style={styles.aramaOneriItem} onPress={() => { setArama(o); setOdakta(false); }}>
              <Text style={styles.aramaOneriIcon}>🔍</Text>
              <Text style={styles.aramaOneriText}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {odakta && arama.length === 0 && (
        <View style={styles.aramaOneriContainer}>
          <Text style={[styles.inputEtiket, { padding: 12, paddingBottom: 4 }]}>Popüler Aramalar</Text>
          {ARAMA_ONERILERI.slice(0, 6).map((o, i) => (
            <TouchableOpacity key={i} style={styles.aramaOneriItem} onPress={() => { setArama(o); setOdakta(false); }}>
              <Text style={styles.aramaOneriIcon}>🔥</Text>
              <Text style={styles.aramaOneriText}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ── İLETİŞİM BUTONU ──────────────────────────────────────
function IletisimButonu({ mekan, kullanici, onFormAc, style }) {
  const isRomantik = mekan.alt_kategori?.includes('evlenme_teklifi');
  const tur = mekan.iletisim_turu || 'form';

  function iletisimKur() {
    const numara = (mekan.iletisim_numarasi || '').replace(/\D/g, '');
    const mekanAdi = mekan.isim;
    if (tur === 'whatsapp' && numara) {
      const mesaj = mekan.whatsapp_mesaj_sablonu ||
        `Merhaba! etkinlink üzerinden ${mekanAdi} için fiyat teklifi almak istiyorum.`;
      const url = `https://wa.me/90${numara}?text=${encodeURIComponent(mesaj)}`;
      if (Platform.OS === 'web') window.open(url, '_blank');
      else Linking.openURL(url);
    } else if (tur === 'telefon' && numara) {
      const url = `tel:+90${numara}`;
      if (Platform.OS === 'web') window.location.href = url;
      else Linking.openURL(url);
    } else if (tur === 'email' && mekan.iletisim_email) {
      const url = `mailto:${mekan.iletisim_email}?subject=etkinlink - ${mekanAdi} Fiyat Teklifi`;
      if (Platform.OS === 'web') window.open(url);
      else Linking.openURL(url);
    } else {
      onFormAc(mekan);
    }
  }

  const bgRenk = isRomantik ? C.romantic
    : tur === 'whatsapp' ? C.whatsapp
    : tur === 'telefon' ? C.midnight
    : tur === 'email' ? C.midnightSoft
    : C.midnight;

  const butonYazi = tur === 'whatsapp' ? '💬 WhatsApp\'tan Yaz'
    : tur === 'telefon' ? '📞 Hemen Ara'
    : tur === 'email' ? '📧 E-posta Gönder'
    : isRomantik ? '💝 Özel Paket'
    : '💬 Fiyat Teklifi Al';

  return (
    <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: bgRenk }, style]} onPress={iletisimKur}>
      <Text style={styles.teklifBtnText}>{butonYazi}</Text>
    </TouchableOpacity>
  );
}

// ── KULLANICI GİRİŞ/KAYIT ────────────────────────────────
function KullaniciGirisEkrani({ onGiris, onKapat }) {
  const [mod, setMod] = useState('giris');
  const [adSoyad, setAdSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  }, []);

  async function girisYap() {
    if (!telefon || !sifre) { setHata('Telefon ve şifre zorunlu!'); return; }
    setYukleniyor(true); setHata('');
    try {
      const data = await apiFetch(`kullanicilar?telefon=eq.${encodeURIComponent(telefon)}&select=*`);
      if (!Array.isArray(data) || data.length === 0) { setHata('Bu telefon ile kayıtlı kullanıcı bulunamadı!'); setYukleniyor(false); return; }
      if (data[0].sifre !== sifre) { setHata('Şifre hatalı!'); setYukleniyor(false); return; }
      onGiris(data[0]);
    } catch (e) { setHata('Giriş hatası: ' + e.message); }
    setYukleniyor(false);
  }

  async function kayitOl() {
    if (!adSoyad || !telefon || !sifre) { setHata('Ad soyad, telefon ve şifre zorunlu!'); return; }
    if (sifre.length < 6) { setHata('Şifre en az 6 karakter olmalı!'); return; }
    setYukleniyor(true); setHata('');
    try {
      const mevcutKullanici = await apiFetch(`kullanicilar?telefon=eq.${encodeURIComponent(telefon)}&select=id`);
      if (Array.isArray(mevcutKullanici) && mevcutKullanici.length > 0) {
        setHata('Bu telefon zaten kayıtlı! Giriş yapın.'); setYukleniyor(false); return;
      }
      const r = await apiPost('kullanicilar', { ad_soyad: adSoyad, telefon, email: email || null, sifre });
      const yeniKullanici = await r.json();
      if (Array.isArray(yeniKullanici) && yeniKullanici[0]) {
        onGiris(yeniKullanici[0]);
      } else {
        setHata('Kayıt başarısız, lütfen tekrar deneyin.');
      }
    } catch (e) { setHata('Kayıt hatası: ' + e.message); }
    setYukleniyor(false);
  }

  return (
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }], maxHeight: '90%' }]}>
        <View style={[styles.modalBar, { backgroundColor: C.gold }]} />
        <Text style={styles.modalBaslik}>{mod === 'giris' ? '👤 Giriş Yap' : '👤 Kayıt Ol'}</Text>
        <Text style={styles.modalAlt}>Teklif almak ve başvurularınızı takip etmek için</Text>
        <View style={{ flexDirection: 'row', backgroundColor: C.border, borderRadius: 12, padding: 3, marginBottom: 20 }}>
          {[{ id: 'giris', etiket: 'Giriş Yap' }, { id: 'kayit', etiket: 'Kayıt Ol' }].map(t => (
            <TouchableOpacity key={t.id}
              style={[{ flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' }, mod === t.id && { backgroundColor: C.white }]}
              onPress={() => { setMod(t.id); setHata(''); }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: mod === t.id ? C.midnight : C.textSoft }}>{t.etiket}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {mod === 'kayit' && (
          <>
            <TextInput style={styles.formInput} placeholder="Ad Soyad *" placeholderTextColor={C.textSoft} value={adSoyad} onChangeText={setAdSoyad} />
            <TextInput style={styles.formInput} placeholder="E-posta (opsiyonel)" placeholderTextColor={C.textSoft} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </>
        )}
        <TextInput style={styles.formInput} placeholder="Telefon * (05XX...)" placeholderTextColor={C.textSoft} value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
        <TextInput style={styles.formInput} placeholder="Şifre * (en az 6 karakter)" placeholderTextColor={C.textSoft} value={sifre} onChangeText={setSifre} secureTextEntry />
        {hata ? <Text style={{ color: C.danger, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{hata}</Text> : null}
        <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]}
          onPress={mod === 'giris' ? girisYap : kayitOl} disabled={yukleniyor}>
          <Text style={styles.teklifBtnText}>{yukleniyor ? 'Lütfen bekleyin...' : mod === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onKapat} style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── KULLANICI PANELİ ──────────────────────────────────────
function KullaniciPaneli({ kullanici, onCikis }) {
  const [basvurular, setBasvurular] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenileniyor, setYenileniyor] = useState(false);

  useEffect(() => { veriGetir(); }, []);

  async function veriGetir(yenile = false) {
    if (yenile) setYenileniyor(true); else setYukleniyor(true);
    const data = await apiFetch(`leads?kullanici_id=eq.${kullanici.id}&select=*&order=created_at.desc`);
    setBasvurular(Array.isArray(data) ? data : []);
    setYukleniyor(false);
    setYenileniyor(false);
  }

  const durumRenk = (d) => d === 'tamamlandı' ? C.success : d === 'aranıyor' ? C.gold : C.textSoft;
  const durumEmoji = (d) => d === 'tamamlandı' ? '✅' : d === 'aranıyor' ? '📞' : '⏳';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.adminHeader}>
        <View>
          <Text style={[styles.logo, { color: C.midnight, fontSize: 20 }]}>Merhaba 👋</Text>
          <Text style={{ color: C.textSoft, fontSize: 12 }}>{kullanici.ad_soyad}</Text>
        </View>
        <TouchableOpacity onPress={onCikis} style={[styles.pill, { backgroundColor: C.bg }]}>
          <Text style={{ color: C.textMid, fontSize: 13 }}>← Ana Sayfa</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={yenileniyor} onRefresh={() => veriGetir(true)} tintColor={C.midnight} />}
      >
        <View style={{ padding: 16 }}>
          <Text style={[styles.formBaslik, { fontSize: 18, marginBottom: 16 }]}>Başvurularım</Text>
          {yukleniyor
            ? <ActivityIndicator size="large" color={C.midnight} style={{ marginTop: 40 }} />
            : basvurular.length === 0
              ? (
                <View style={styles.bosEkran}>
                  <Text style={styles.bosEkranEmoji}>📋</Text>
                  <Text style={styles.bosEkranText}>Henüz başvurunuz yok.</Text>
                  <Text style={{ color: C.textSoft, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                    Mekan detay sayfasından teklif alabilirsiniz.
                  </Text>
                </View>
              )
              : basvurular.map(b => (
                <View key={b.id} style={styles.adminKart}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adminKartIsim}>{b.mekan_isim}</Text>
                    {b.kisi_sayisi ? <Text style={styles.adminKartDetay}>👥 {b.kisi_sayisi} kişi</Text> : null}
                    {b.etkinlik_tarihi ? <Text style={styles.adminKartDetay}>📅 {b.etkinlik_tarihi}</Text> : null}
                    {b.alt_kategori ? <Text style={styles.adminKartDetay}>🎉 {b.alt_kategori}</Text> : null}
                    {b.notlar ? <Text style={styles.adminKartDetay}>💬 {b.notlar}</Text> : null}
                    <Text style={styles.adminKartTarih}>{formatTarih(b.created_at)}</Text>
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ fontSize: 12, color: durumRenk(b.durum), fontWeight: '600' }}>
                        {durumEmoji(b.durum)} {b.durum === 'tamamlandı' ? 'Tamamlandı' : b.durum === 'aranıyor' ? 'Aranıyor' : 'Bekliyor'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
          }
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── MEKAN SAHİBİ GİRİŞ/KAYIT ─────────────────────────────
function SahipGirisEkrani({ onGiris, onKapat }) {
  const [mod, setMod] = useState('giris');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [firmaAdi, setFirmaAdi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  // 4. Şifre sıfırlama state
  const [sifreSifirlamaModu, setSifreSifirlamaModu] = useState(false);
  const [sifreSifirlamaEmail, setSifreSifirlamaEmail] = useState('');
  const [sifreSifirlamaGonderildi, setSifreSifirlamaGonderildi] = useState(false);

  async function girisYap() {
    if (!email || !sifre) { setHata('E-posta ve şifre zorunlu!'); return; }
    setYukleniyor(true); setHata('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: sifre });
    if (error) { setHata('Giriş başarısız: ' + error.message); setYukleniyor(false); return; }
    onGiris(data.user);
    setYukleniyor(false);
  }

  async function kayitOl() {
    if (!email || !sifre || !adSoyad) { setHata('Ad soyad, e-posta ve şifre zorunlu!'); return; }
    if (sifre.length < 6) { setHata('Şifre en az 6 karakter olmalı!'); return; }
    setYukleniyor(true); setHata('');
    const { data, error } = await supabase.auth.signUp({ email, password: sifre });
    if (error) { setHata('Kayıt başarısız: ' + error.message); setYukleniyor(false); return; }
    if (data.user) {
      await supabase.from('mekan_sahipleri').insert({ id: data.user.id, ad_soyad: adSoyad, telefon, firma_adi: firmaAdi, bakiye: 250 });
      await supabase.from('bakiye_hareketleri').insert({ sahip_id: data.user.id, miktar: 250, aciklama: 'Hoş geldiniz hediyesi 🎁', tur: 'hediye' });
      onGiris(data.user);
    }
    setYukleniyor(false);
  }

  // 4. Şifre sıfırlama fonksiyonu
  async function sifreSifirla() {
    if (!sifreSifirlamaEmail) { setHata('E-posta adresinizi girin.'); return; }
    setYukleniyor(true); setHata('');
    const { error } = await supabase.auth.resetPasswordForEmail(sifreSifirlamaEmail, {
      redirectTo: 'https://etkinlink.com/sifre-sifirla',
    });
    setYukleniyor(false);
    if (error) { setHata('Hata: ' + error.message); return; }
    setSifreSifirlamaGonderildi(true);
  }

  // Şifre sıfırlama ekranı
  if (sifreSifirlamaModu) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
        <TouchableOpacity onPress={() => { setSifreSifirlamaModu(false); setHata(''); setSifreSifirlamaGonderildi(false); }}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 18, color: C.midnight, marginRight: 8 }}>←</Text>
          <Text style={{ fontSize: 14, color: C.midnight, fontWeight: '600' }}>Geri Dön</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: C.white, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>🔑</Text>
            <Text style={[styles.formBaslik, { textAlign: 'center', fontSize: 20 }]}>Şifre Sıfırla</Text>
            {sifreSifirlamaGonderildi ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 40, marginBottom: 16 }}>📧</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.success, marginBottom: 8 }}>E-posta Gönderildi!</Text>
                <Text style={{ color: C.textMid, textAlign: 'center', lineHeight: 22, fontSize: 14 }}>
                  <Text style={{ fontWeight: '700' }}>{sifreSifirlamaEmail}</Text> adresine şifre sıfırlama bağlantısı gönderdik.
                  {'\n\n'}Gelen kutunuzu ve spam klasörünüzü kontrol edin.
                </Text>
                <TouchableOpacity
                  style={[styles.teklifBtn, { backgroundColor: C.midnight, marginTop: 24, paddingHorizontal: 32 }]}
                  onPress={() => { setSifreSifirlamaModu(false); setSifreSifirlamaGonderildi(false); }}>
                  <Text style={styles.teklifBtnText}>Giriş Sayfasına Dön</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={{ color: C.textMid, textAlign: 'center', marginBottom: 24, fontSize: 14, lineHeight: 20 }}>
                  Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
                </Text>
                <Text style={styles.inputEtiket}>E-posta Adresi</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="email@ornek.com"
                  placeholderTextColor={C.textSoft}
                  value={sifreSifirlamaEmail}
                  onChangeText={setSifreSifirlamaEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {hata ? <Text style={{ color: C.danger, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{hata}</Text> : null}
                <TouchableOpacity
                  style={[styles.teklifBtn, { backgroundColor: C.midnight }]}
                  onPress={sifreSifirla}
                  disabled={yukleniyor}>
                  <Text style={styles.teklifBtnText}>{yukleniyor ? 'Gönderiliyor...' : '📧 Sıfırlama Bağlantısı Gönder'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <TouchableOpacity onPress={onKapat} style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 }}>
        <Text style={{ fontSize: 18, color: C.midnight, marginRight: 8 }}>←</Text>
        <Text style={{ fontSize: 14, color: C.midnight, fontWeight: '600' }}>Ana Sayfa</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
          <Image source={require('./assets/logo.png')} style={{ width: 160, height: 44, alignSelf: 'center', marginBottom: 8 }} resizeMode="contain" />
          <Text style={{ color: C.textSoft, textAlign: 'center', marginBottom: 32, fontSize: 14 }}>
            {mod === 'giris' ? 'Mekan Sahibi Girişi' : 'Mekan Sahibi Kaydı'}
          </Text>
          <View style={{ flexDirection: 'row', backgroundColor: C.border, borderRadius: 14, padding: 4, marginBottom: 28 }}>
            {[{ id: 'giris', etiket: 'Giriş Yap' }, { id: 'kayit', etiket: 'Kayıt Ol' }].map(t => (
              <TouchableOpacity key={t.id}
                style={[{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }, mod === t.id && { backgroundColor: C.white }]}
                onPress={() => { setMod(t.id); setHata(''); }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: mod === t.id ? C.midnight : C.textSoft }}>{t.etiket}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {mod === 'kayit' && (
            <>
              <Text style={styles.inputEtiket}>Ad Soyad *</Text>
              <TextInput style={styles.formInput} placeholder="Ahmet Yılmaz" placeholderTextColor={C.textSoft} value={adSoyad} onChangeText={setAdSoyad} />
              <Text style={styles.inputEtiket}>Firma / Mekan Adı</Text>
              <TextInput style={styles.formInput} placeholder="Grand Hotel" placeholderTextColor={C.textSoft} value={firmaAdi} onChangeText={setFirmaAdi} />
              <Text style={styles.inputEtiket}>Telefon</Text>
              <TextInput style={styles.formInput} placeholder="05XX XXX XX XX" placeholderTextColor={C.textSoft} value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
            </>
          )}
          <Text style={styles.inputEtiket}>E-posta *</Text>
          <TextInput style={styles.formInput} placeholder="email@ornek.com" placeholderTextColor={C.textSoft} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Text style={styles.inputEtiket}>Şifre *</Text>
          <TextInput style={styles.formInput} placeholder="En az 6 karakter" placeholderTextColor={C.textSoft} value={sifre} onChangeText={setSifre} secureTextEntry />
          {hata ? <Text style={{ color: C.danger, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{hata}</Text> : null}

          {/* 4. Şifremi Unuttum butonu — sadece giriş modunda */}
          {mod === 'giris' && (
            <TouchableOpacity
              onPress={() => { setSifreSifirlamaModu(true); setHata(''); setSifreSifirlamaEmail(email); }}
              style={{ alignSelf: 'flex-end', marginBottom: 16, marginTop: -4 }}>
              <Text style={{ color: C.gold, fontSize: 13, fontWeight: '600' }}>Şifremi unuttum →</Text>
            </TouchableOpacity>
          )}

          {mod === 'kayit' && (
            <View style={{ backgroundColor: C.goldSoft, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: C.goldLight }}>
              <Text style={{ color: C.gold, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>🎁 Hoş Geldiniz Hediyesi!</Text>
              <Text style={{ color: C.textMid, fontSize: 13 }}>Kayıt olduğunuzda <Text style={{ fontWeight: '700', color: C.gold }}>250 TL</Text> hediye bakiye tanımlanacak.</Text>
            </View>
          )}
          <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]}
            onPress={mod === 'giris' ? girisYap : kayitOl} disabled={yukleniyor}>
            <Text style={styles.teklifBtnText}>{yukleniyor ? 'Lütfen bekleyin...' : mod === 'giris' ? 'Giriş Yap' : '🎁 Kayıt Ol & 250 TL Kazan'}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── MEKAN SAHİBİ MEKAN EKLEME FORMU ──────────────────────
function SahipMekanEkleFormu({ kullaniciId, onKaydet, onIptal }) {
  const [isim, setIsim] = useState('');
  const [sehir, setSehir] = useState('');
  const [kapasite, setKapasite] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [foto, setFoto] = useState('');
  const [galeri, setGaleri] = useState([]);
  const [video, setVideo] = useState('');
  const [ozellik, setOzellik] = useState('');
  const [teknik, setTeknik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [anaKat, setAnaKat] = useState('ozel_gunler');
  const [altKat, setAltKat] = useState('dugun');
  const [iletisimTuru, setIletisimTuru] = useState('whatsapp');
  const [iletisimNumarasi, setIletisimNumarasi] = useState('');
  const [iletisimEmail, setIletisimEmail] = useState('');
  const [whatsappMesaj, setWhatsappMesaj] = useState('');
  const [ekleniyor, setEkleniyor] = useState(false);
  const [fotografYukleniyor, setFotografYukleniyor] = useState(false);

  async function kaydet() {
    if (!isim || !sehir || !kapasite) { alert('İsim, şehir ve kapasite zorunlu!'); return; }
    if ((iletisimTuru === 'whatsapp' || iletisimTuru === 'telefon') && !iletisimNumarasi) { alert('İletişim numarası zorunlu!'); return; }
    setEkleniyor(true);
    const { error } = await supabase.from('mekanlar').insert({
      isim, sehir, kapasite: parseInt(kapasite),
      ana_kategori: anaKat, alt_kategori: [altKat],
      fotograf_url: foto || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
      fotograf_galeri: galeri, video_url: video || null,
      fiyat_aralik: fiyat, aciklama,
      fiziksel_ozellikler: ozellik ? ozellik.split(',').map(s => s.trim()) : [],
      teknik_altyapi: teknik ? teknik.split(',').map(s => s.trim()) : [],
      iletisim_turu: iletisimTuru, iletisim_numarasi: iletisimNumarasi,
      iletisim_email: iletisimEmail, whatsapp_mesaj_sablonu: whatsappMesaj,
      sahip_id: kullaniciId, aktif: false, onay_durumu: 'beklemede', puan: 0,
    });
    setEkleniyor(false);
    if (!error) onKaydet();
    else alert('Hata: ' + error.message);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16 }}>
        <Text style={styles.formBaslik}>Yeni Mekan Ekle</Text>
        <View style={{ backgroundColor: C.goldSoft, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: C.goldLight }}>
          <Text style={{ color: C.gold, fontWeight: '600', fontSize: 13 }}>ℹ️ Mekanınız admin onayından sonra yayına girecek.</Text>
        </View>
        {[
          { label: 'Mekan Adı *', val: isim, set: setIsim, ph: 'Grand Ballroom' },
          { label: 'Şehir *', val: sehir, set: setSehir, ph: 'İstanbul' },
          { label: 'Kapasite *', val: kapasite, set: setKapasite, ph: '500', kb: 'numeric' },
          { label: 'Fiyat Aralığı', val: fiyat, set: setFiyat, ph: '50.000₺ - 150.000₺' },
          { label: 'Video URL (YouTube)', val: video, set: setVideo, ph: 'https://youtube.com/...' },
          { label: 'Fiziksel Özellikler (virgülle)', val: ozellik, set: setOzellik, ph: 'Teras, Bahçe' },
          { label: 'Teknik Altyapı (virgülle)', val: teknik, set: setTeknik, ph: 'Projeksiyon, Ses' },
        ].map((f, i) => (
          <View key={i}>
            <Text style={styles.inputEtiket}>{f.label}</Text>
            <TextInput style={styles.formInput} placeholder={f.ph} placeholderTextColor={C.textSoft} value={f.val} onChangeText={f.set} keyboardType={f.kb || 'default'} />
          </View>
        ))}
        <Text style={styles.inputEtiket}>Açıklama</Text>
        <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Mekanınız hakkında..." placeholderTextColor={C.textSoft} value={aciklama} onChangeText={setAciklama} multiline />

        <Text style={[styles.inputEtiket, { marginTop: 8 }]}>İletişim Tercihi *</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {ILETISIM_TURLERI.map(t => (
            <TouchableOpacity key={t.id} style={[styles.pill, iletisimTuru === t.id && { backgroundColor: t.renk, borderColor: t.renk }]} onPress={() => setIletisimTuru(t.id)}>
              <Text style={styles.pillEmoji}>{t.emoji}</Text>
              <Text style={[styles.pillText, iletisimTuru === t.id && { color: C.white, fontWeight: '700' }]}>{t.etiket}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {(iletisimTuru === 'whatsapp' || iletisimTuru === 'telefon') && (
          <View>
            <Text style={styles.inputEtiket}>{iletisimTuru === 'whatsapp' ? 'WhatsApp Numarası *' : 'Telefon Numarası *'}</Text>
            <TextInput style={styles.formInput} placeholder="5XX XXX XX XX" placeholderTextColor={C.textSoft} value={iletisimNumarasi} onChangeText={setIletisimNumarasi} keyboardType="phone-pad" />
          </View>
        )}
        {iletisimTuru === 'whatsapp' && (
          <View>
            <Text style={styles.inputEtiket}>Karşılama Mesajı (opsiyonel)</Text>
            <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Merhaba! fiyat teklifi almak istiyorum..." placeholderTextColor={C.textSoft} value={whatsappMesaj} onChangeText={setWhatsappMesaj} multiline />
          </View>
        )}
        {iletisimTuru === 'email' && (
          <View>
            <Text style={styles.inputEtiket}>E-posta Adresi *</Text>
            <TextInput style={styles.formInput} placeholder="info@mekanim.com" placeholderTextColor={C.textSoft} value={iletisimEmail} onChangeText={setIletisimEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
        )}

        <Text style={styles.inputEtiket}>Ana Fotoğraf</Text>
        <TouchableOpacity style={[styles.yukleBtn, { backgroundColor: fotografYukleniyor ? C.textSoft : C.midnightSoft }]} onPress={() => fotografYukle(setFoto, setFotografYukleniyor)} disabled={fotografYukleniyor}>
          <Text style={styles.yukleBtnText}>{fotografYukleniyor ? '⏳ Yükleniyor...' : '📷 Ana Fotoğraf Seç'}</Text>
        </TouchableOpacity>
        {foto
          ? <Image source={{ uri: foto }} style={{ width: '100%', height: 160, borderRadius: 14, marginBottom: 12 }} resizeMode="cover" />
          : <TextInput style={styles.formInput} placeholder="veya URL yapıştırın" placeholderTextColor={C.textSoft} value={foto} onChangeText={setFoto} />
        }

        <Text style={styles.inputEtiket}>Ana Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {ANA_KATEGORILER.filter(k => k.id !== 'hepsi' && k.id !== 'populer').map(k => (
            <TouchableOpacity key={k.id} style={[styles.pill, { marginRight: 8 }, anaKat === k.id && { backgroundColor: C.midnight, borderColor: C.midnight }]} onPress={() => setAnaKat(k.id)}>
              <Text style={[styles.pillText, anaKat === k.id && { color: C.white }]}>{k.etiket}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.inputEtiket}>Alt Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {(ALT_KATEGORILER[anaKat] || []).map(k => (
            <TouchableOpacity key={k.id} style={[styles.pill, { marginRight: 8 }, altKat === k.id && { backgroundColor: C.gold, borderColor: C.gold }]} onPress={() => setAltKat(k.id)}>
              <Text style={styles.pillEmoji}>{k.emoji}</Text>
              <Text style={[styles.pillText, altKat === k.id && { color: C.white }]}>{k.etiket}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={kaydet} disabled={ekleniyor}>
          <Text style={styles.teklifBtnText}>{ekleniyor ? 'Gönderiliyor...' : '📤 Onay İçin Gönder'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }} onPress={onIptal}>
          <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </View>
    </ScrollView>
  );
}

// ── MEKAN SAHİBİ PANELİ ──────────────────────────────────
function SahipPaneli({ kullanici, onCikis }) {
  const [profil, setProfil] = useState(null);
  const [mekanlar, setMekanlar] = useState([]);
  const [leadler, setLeadler] = useState([]);
  const [hareketler, setHareketler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenileniyor, setYenileniyor] = useState(false);
  const [aktifTab, setAktifTab] = useState('genel');
  const [mekanEklemeAcik, setMekanEklemeAcik] = useState(false);
  const [duzenlenenMekan, setDuzenlenenMekan] = useState(null);

  useEffect(() => { veriGetir(); }, []);

  async function veriGetir(yenile = false) {
    if (yenile) setYenileniyor(true); else setYukleniyor(true);

    const { data: profilData } = await supabase
      .from('mekan_sahipleri').select('*').eq('id', kullanici.id).single();
    setProfil(profilData);

    const { data: mekanData } = await supabase
      .from('mekanlar').select('*').eq('sahip_id', kullanici.id)
      .order('created_at', { ascending: false });
    setMekanlar(mekanData || []);

    const mekanIdleri = (mekanData || []).map(m => m.id);

    const { data: leadsBySahip } = await supabase
      .from('leads').select('*')
      .eq('sahip_id', kullanici.id)
      .order('created_at', { ascending: false });

    let leadsByMekan = [];
    if (mekanIdleri.length > 0) {
      const { data } = await supabase
        .from('leads').select('*')
        .in('mekan_id', mekanIdleri)
        .order('created_at', { ascending: false });
      leadsByMekan = data || [];
    }

    const tumLeadler = [...(leadsBySahip || []), ...leadsByMekan];
    const tekLeadler = Array.from(new Map(tumLeadler.map(l => [l.id, l])).values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setLeadler(tekLeadler);

    const { data: hareketData } = await supabase
      .from('bakiye_hareketleri').select('*').eq('sahip_id', kullanici.id)
      .order('created_at', { ascending: false });
    setHareketler(hareketData || []);

    setYukleniyor(false);
    setYenileniyor(false);
  }

  if (yukleniyor) return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.midnight} />
      <Text style={{ color: C.textSoft, marginTop: 12 }}>Yükleniyor...</Text>
    </SafeAreaView>
  );

  if (mekanEklemeAcik) return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.adminHeader}>
        <Text style={[styles.logo, { color: C.midnight, fontSize: 20 }]}>Mekan Ekle</Text>
        <TouchableOpacity onPress={() => setMekanEklemeAcik(false)} style={[styles.pill, { backgroundColor: C.bg }]}>
          <Text style={{ color: C.textMid, fontSize: 13 }}>← Geri</Text>
        </TouchableOpacity>
      </View>
      <SahipMekanEkleFormu
        kullaniciId={kullanici.id}
        onKaydet={() => { setMekanEklemeAcik(false); veriGetir(); alert('✅ Admin onayına gönderildi!'); }}
        onIptal={() => setMekanEklemeAcik(false)}
      />
    </SafeAreaView>
  );

  if (duzenlenenMekan) return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.adminHeader}>
        <Text style={[styles.logo, { color: C.midnight, fontSize: 20 }]}>Mekan Düzenle</Text>
        <TouchableOpacity onPress={() => setDuzenlenenMekan(null)} style={[styles.pill, { backgroundColor: C.bg }]}>
          <Text style={{ color: C.textMid, fontSize: 13 }}>← Geri</Text>
        </TouchableOpacity>
      </View>
      <DuzenlemeFormu
        mekan={duzenlenenMekan}
        onKaydet={async (g) => {
          await supabase.from('mekanlar').update({ ...g, onay_durumu: 'beklemede', aktif: false }).eq('id', duzenlenenMekan.id);
          veriGetir(); setDuzenlenenMekan(null);
          alert('✅ Değişiklikler onaya gönderildi!');
        }}
        onIptal={() => setDuzenlenenMekan(null)}
      />
    </SafeAreaView>
  );

  const bekleyenLeadler = leadler.filter(l => l.durum === 'bekliyor' || !l.durum).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.adminHeader}>
        <View>
          <Text style={[styles.logo, { color: C.midnight, fontSize: 20 }]}>Merhaba 👋</Text>
          <Text style={{ color: C.textSoft, fontSize: 12 }}>{profil?.ad_soyad}</Text>
        </View>
        <TouchableOpacity onPress={async () => { await supabase.auth.signOut(); onCikis(); }} style={[styles.pill, { backgroundColor: C.bg }]}>
          <Text style={{ color: C.textMid, fontSize: 13 }}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bakiyeKart}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bakiyeEtiket}>Mevcut Bakiye</Text>
          <Text style={styles.bakiyeMiktar}>{profil?.bakiye || 0} ₺</Text>
          <Text style={styles.bakiyeAciklama}>Her lead {LEAD_UCRETI} ₺ • {Math.floor((profil?.bakiye || 0) / LEAD_UCRETI)} lead hakkı</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {bekleyenLeadler > 0 && (
            <View style={{ backgroundColor: C.danger, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 8 }}>
              <Text style={{ color: C.white, fontSize: 12, fontWeight: '700' }}>🔔 {bekleyenLeadler} yeni</Text>
            </View>
          )}
          <Text style={{ fontSize: 32 }}>💰</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52 }}>
        <View style={[styles.tabRow, { paddingHorizontal: 16 }]}>
          {[
            { id: 'genel', etiket: 'Genel' },
            { id: 'mekanlar', etiket: 'Mekanlarım' },
            { id: 'leadler', etiket: bekleyenLeadler > 0 ? `Talepler 🔴` : 'Talepler' },
            { id: 'bakiye', etiket: 'Bakiye' },
          ].map(t => (
            <TouchableOpacity key={t.id} style={[styles.tabBtn, { marginRight: 8 }, aktifTab === t.id && { backgroundColor: C.midnight, borderColor: C.midnight }]} onPress={() => setAktifTab(t.id)}>
              <Text style={[styles.tabBtnText, aktifTab === t.id && { color: C.white }]}>{t.etiket}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={yenileniyor} onRefresh={() => veriGetir(true)} tintColor={C.midnight} />}
      >
        {aktifTab === 'genel' && (
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {[
                { sayi: mekanlar.filter(m => m.aktif).length, etiket: 'Aktif Mekan', emoji: '🏢' },
                { sayi: leadler.length, etiket: 'Toplam Lead', emoji: '📋' },
                { sayi: bekleyenLeadler, etiket: 'Bekleyen', emoji: '⏳' },
              ].map((s, i) => (
                <View key={i} style={[styles.statKart, { borderTopColor: C.gold, flex: 1 }]}>
                  <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
                  <Text style={[styles.statSayi, { color: C.midnight, fontSize: 22 }]}>{s.sayi}</Text>
                  <Text style={styles.statEtiket}>{s.etiket}</Text>
                </View>
              ))}
            </View>
            {leadler.length > 0 && (
              <>
                <Text style={[styles.inputEtiket, { marginBottom: 10, fontSize: 14, fontWeight: '700', color: C.text }]}>Son Talepler</Text>
                {leadler.slice(0, 3).map(l => (
                  <LeadKarti key={l.id} lead={l} onDurumGuncelle={async (d) => {
                    await supabase.from('leads').update({ durum: d }).eq('id', l.id);
                    veriGetir();
                  }} />
                ))}
                {leadler.length > 3 && (
                  <TouchableOpacity onPress={() => setAktifTab('leadler')} style={{ alignItems: 'center', padding: 12 }}>
                    <Text style={{ color: C.gold, fontWeight: '600', fontSize: 14 }}>Tümünü Gör ({leadler.length}) →</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {leadler.length === 0 && (
              <View style={styles.bosEkran}>
                <Text style={styles.bosEkranEmoji}>📭</Text>
                <Text style={styles.bosEkranText}>Henüz talep gelmedi.</Text>
              </View>
            )}
          </View>
        )}

        {aktifTab === 'mekanlar' && (
          <View style={{ padding: 16 }}>
            <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight, marginBottom: 16 }]} onPress={() => setMekanEklemeAcik(true)}>
              <Text style={styles.teklifBtnText}>+ Yeni Mekan Ekle</Text>
            </TouchableOpacity>
            {mekanlar.length === 0 && (
              <View style={styles.bosEkran}>
                <Text style={styles.bosEkranEmoji}>🏢</Text>
                <Text style={styles.bosEkranText}>Henüz mekan eklenmedi.</Text>
              </View>
            )}
            {mekanlar.map(m => (
              <View key={m.id} style={styles.adminKart}>
                {m.fotograf_url && <Image source={{ uri: m.fotograf_url }} style={{ width: 80, height: 80, borderRadius: 12, marginRight: 12 }} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminKartIsim}>{m.isim}</Text>
                  <Text style={styles.adminKartDetay}>📍 {m.sehir} · 👥 {m.kapasite} kişi</Text>
                  {m.iletisim_turu && (
                    <Text style={styles.adminKartDetay}>
                      {m.iletisim_turu === 'whatsapp' ? '💬 WhatsApp' : m.iletisim_turu === 'telefon' ? '📞 Telefon' : m.iletisim_turu === 'email' ? '📧 E-posta' : '📋 Form'}
                    </Text>
                  )}
                  <Text style={[styles.adminKartDetay, { fontWeight: '700',
                    color: m.onay_durumu === 'onaylandi' ? C.success : m.onay_durumu === 'reddedildi' ? C.danger : C.gold }]}>
                    {m.onay_durumu === 'onaylandi' ? '✅ Yayında' : m.onay_durumu === 'reddedildi' ? '❌ Reddedildi' : '⏳ Onay Bekliyor'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.durumBtn, { borderColor: C.gold, marginTop: 8, alignSelf: 'flex-start' }]}
                    onPress={() => setDuzenlenenMekan(m)}>
                    <Text style={[styles.durumBtnText, { color: C.gold }]}>✏️ Düzenle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {aktifTab === 'leadler' && (
          <View style={{ padding: 16 }}>
            {leadler.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {[
                  { sayi: leadler.filter(l => !l.durum || l.durum === 'bekliyor').length, etiket: 'Bekliyor', renk: C.textSoft },
                  { sayi: leadler.filter(l => l.durum === 'aranıyor').length, etiket: 'Aranıyor', renk: C.gold },
                  { sayi: leadler.filter(l => l.durum === 'tamamlandı').length, etiket: 'Tamam', renk: C.success },
                ].map((s, i) => (
                  <View key={i} style={[styles.statKart, { flex: 1, borderTopColor: s.renk }]}>
                    <Text style={[styles.statSayi, { color: s.renk, fontSize: 18 }]}>{s.sayi}</Text>
                    <Text style={styles.statEtiket}>{s.etiket}</Text>
                  </View>
                ))}
              </View>
            )}
            {leadler.length === 0
              ? (
                <View style={styles.bosEkran}>
                  <Text style={styles.bosEkranEmoji}>📭</Text>
                  <Text style={styles.bosEkranText}>Henüz talep yok.</Text>
                </View>
              )
              : leadler.map(l => (
                <LeadKarti key={l.id} lead={l} onDurumGuncelle={async (d) => {
                  await supabase.from('leads').update({ durum: d }).eq('id', l.id);
                  veriGetir();
                }} />
              ))
            }
          </View>
        )}

        {aktifTab === 'bakiye' && (
          <View style={{ padding: 16 }}>
            <View style={[styles.bakiyeKart, { marginBottom: 20 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bakiyeEtiket}>Mevcut Bakiye</Text>
                <Text style={styles.bakiyeMiktar}>{profil?.bakiye || 0} ₺</Text>
                <Text style={styles.bakiyeAciklama}>{Math.floor((profil?.bakiye || 0) / LEAD_UCRETI)} lead hakkı</Text>
              </View>
              <Text style={{ fontSize: 40 }}>💰</Text>
            </View>
            <View style={{ backgroundColor: C.goldSoft, borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: C.goldLight }}>
              <Text style={{ color: C.gold, fontWeight: '700', marginBottom: 12 }}>📦 Bakiye Paketleri</Text>
              {[
                { miktar: 500, lead: 10, etiket: 'Başlangıç' },
                { miktar: 1000, lead: 22, etiket: 'Popüler ⭐', indirim: '10% indirim' },
                { miktar: 2500, lead: 60, etiket: 'Pro 🚀', indirim: '20% indirim' },
              ].map((p, i) => (
                <View key={i} style={{ backgroundColor: C.white, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{p.etiket}</Text>
                    <Text style={{ fontSize: 13, color: C.textMid }}>{p.lead} lead hakkı</Text>
                    {p.indirim && <Text style={{ fontSize: 12, color: C.success, fontWeight: '600' }}>{p.indirim}</Text>}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: C.midnight }}>{p.miktar} ₺</Text>
                    <TouchableOpacity
                      style={[styles.teklifBtn, { backgroundColor: C.gold, paddingVertical: 8, paddingHorizontal: 16, marginTop: 4 }]}
                      onPress={() => alert('Ödeme sistemi yakında!')}>
                      <Text style={[styles.teklifBtnText, { fontSize: 13 }]}>Satın Al</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            <Text style={[styles.formBaslik, { fontSize: 16, marginBottom: 12 }]}>Bakiye Hareketleri</Text>
            {hareketler.length === 0 && (
              <Text style={{ color: C.textSoft, textAlign: 'center', marginTop: 20 }}>Henüz hareket yok.</Text>
            )}
            {hareketler.map(h => (
              <View key={h.id} style={[styles.adminKart, { alignItems: 'center' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminKartIsim}>{h.aciklama}</Text>
                  <Text style={styles.adminKartTarih}>{formatTarih(h.created_at)}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: h.miktar > 0 ? C.success : C.danger }}>
                  {h.miktar > 0 ? '+' : ''}{h.miktar} ₺
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── LEAD KARTI ────────────────────────────────────────────
function LeadKarti({ lead: l, onDurumGuncelle }) {
  const bekliyor = !l.durum || l.durum === 'bekliyor';
  return (
    <View style={[styles.adminKart, bekliyor && { borderColor: C.gold, borderWidth: 1.5 }]}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={styles.adminKartIsim}>{l.ad_soyad}</Text>
          {bekliyor && (
            <View style={{ backgroundColor: C.gold + '20', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 10, color: C.gold, fontWeight: '700' }}>YENİ</Text>
            </View>
          )}
        </View>
        <Text style={styles.adminKartDetay}>📞 {l.telefon}</Text>
        <Text style={styles.adminKartDetay}>🏢 {l.mekan_isim}</Text>
        {l.kisi_sayisi ? <Text style={styles.adminKartDetay}>👥 {l.kisi_sayisi} kişi</Text> : null}
        {l.etkinlik_tarihi ? <Text style={styles.adminKartDetay}>📅 {l.etkinlik_tarihi}</Text> : null}
        {l.alt_kategori ? <Text style={styles.adminKartDetay}>🎉 {l.alt_kategori}</Text> : null}
        {l.notlar ? <Text style={styles.adminKartDetay}>💬 {l.notlar}</Text> : null}
        <Text style={styles.adminKartTarih}>{formatTarih(l.created_at)}</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 4 }}>
          <TouchableOpacity
            style={[styles.durumBtn, { borderColor: C.whatsapp, flex: 1, alignItems: 'center' }]}
            onPress={() => {
              const numara = l.telefon.replace(/\D/g, '');
              const url = `https://wa.me/90${numara}`;
              if (Platform.OS === 'web') window.open(url, '_blank');
              else Linking.openURL(url);
            }}>
            <Text style={[styles.durumBtnText, { color: C.whatsapp }]}>💬 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.durumBtn, { borderColor: C.midnight, flex: 1, alignItems: 'center' }]}
            onPress={() => {
              const url = `tel:${l.telefon}`;
              if (Platform.OS === 'web') window.location.href = url;
              else Linking.openURL(url);
            }}>
            <Text style={[styles.durumBtnText, { color: C.midnight }]}>📞 Ara</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {['bekliyor', 'aranıyor', 'tamamlandı'].map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.durumBtn, l.durum === d && {
                backgroundColor: d === 'tamamlandı' ? C.success : d === 'aranıyor' ? C.gold : C.midnight
              }]}
              onPress={() => onDurumGuncelle(d)}>
              <Text style={[styles.durumBtnText, l.durum === d && { color: C.white }]}>
                {d === 'bekliyor' ? '⏳' : d === 'aranıyor' ? '📞' : '✅'} {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ── SEZON BANNER ──────────────────────────────────────────
function SezonBanner({ banner }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start(); }, []);
  if (!banner) return null;
  return (
    <Animated.View style={[styles.banner, { opacity: fadeAnim, backgroundColor: banner.renk + '18', borderColor: banner.renk + '40' }]}>
      <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.bannerBaslik, { color: banner.renk }]}>{banner.baslik}</Text>
        {banner.alt_baslik ? <Text style={styles.bannerAlt}>{banner.alt_baslik}</Text> : null}
      </View>
    </Animated.View>
  );
}

function KategoriPill({ kat, aktif, onPress, romantikMod }) {
  const bgRenk = romantikMod ? C.romantic : C.midnight;
  return (
    <TouchableOpacity style={[styles.pill, aktif && { backgroundColor: bgRenk, borderColor: bgRenk }]} onPress={onPress}>
      <Text style={styles.pillEmoji}>{kat.emoji}</Text>
      <Text style={[styles.pillText, aktif && { color: C.white, fontWeight: '700' }]}>{kat.etiket}</Text>
    </TouchableOpacity>
  );
}

function VideoOynatici({ url }) {
  const embedUrl = youtubeEmbedUrl(url);
  if (!embedUrl) return null;
  if (Platform.OS === 'web') {
    return (
      <View style={styles.videoContainer}>
        <iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 16 }} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </View>
    );
  }
  return <View style={styles.videoContainer}><Text style={{ color: C.textSoft, textAlign: 'center', padding: 20 }}>Video için tarayıcıda açın.</Text></View>;
}

// ── TEKLİF FORMU (KVKK Onaylı) ───────────────────────────
function TeklifFormu({ mekan, onKapat, onGonder, kullanici, onGizlilikAc }) {
  const [ad, setAd] = useState(kullanici?.ad_soyad || '');
  const [telefon, setTelefon] = useState(kullanici?.telefon || '');
  const [kisi, setKisi] = useState('');
  const [notlar, setNotlar] = useState('');
  const [tarih, setTarih] = useState('');
  const [kvkkOnay, setKvkkOnay] = useState(false);  // 1. KVKK state
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [kvkkHata, setKvkkHata] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  }, []);

  const isRomantik = mekan.alt_kategori?.includes('evlenme_teklifi');

  async function gonder() {
    if (!ad || !telefon) { alert('Lütfen ad ve telefon giriniz.'); return; }
    // 1. KVKK kontrolü
    if (!kvkkOnay) { setKvkkHata(true); return; }
    setKvkkHata(false);
    setGonderiliyor(true);
    await onGonder({ ad, telefon, kisi, notlar, tarih });
    setGonderiliyor(false);
  }

  return (
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }, isRomantik && { borderTopColor: C.romantic }]}>
        <View style={[styles.modalBar, { backgroundColor: isRomantik ? C.romantic : C.gold }]} />
        <Text style={styles.modalBaslik}>{isRomantik ? '💝 Özel Romantik Paket' : 'Fiyat Teklifi Al'}</Text>
        <Text style={styles.modalAlt}>{mekan.isim}</Text>
        <TextInput style={styles.formInput} placeholder="Ad Soyad *" placeholderTextColor={C.textSoft} value={ad} onChangeText={setAd} />
        <TextInput style={styles.formInput} placeholder="Telefon *" placeholderTextColor={C.textSoft} value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
        <TextInput style={styles.formInput} placeholder="Kişi Sayısı" placeholderTextColor={C.textSoft} value={kisi} onChangeText={setKisi} keyboardType="numeric" />
        {/* 3. Etkinlik tarihi — artık Supabase'de kolonu var */}
        <TextInput style={styles.formInput} placeholder="Etkinlik Tarihi (gg.aa.yyyy)" placeholderTextColor={C.textSoft} value={tarih} onChangeText={setTarih} />
        <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
          placeholder={isRomantik ? 'Sürpriz detaylar...' : 'Notlar (opsiyonel)'}
          placeholderTextColor={C.textSoft} value={notlar} onChangeText={setNotlar} multiline />

        {/* 1. KVKK Onay Kutusu */}
        <KVKKOnayKutusu
          onayVerildi={kvkkOnay}
          setOnayVerildi={(val) => { setKvkkOnay(val); if (val) setKvkkHata(false); }}
          onGizlilikAc={onGizlilikAc}
        />
        {kvkkHata && (
          <Text style={{ color: C.danger, fontSize: 12, marginBottom: 10, marginTop: -4 }}>
            ⚠️ Devam etmek için gizlilik politikasını onaylamanız gerekiyor.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.teklifBtn, { backgroundColor: isRomantik ? C.romantic : C.midnight, opacity: kvkkOnay ? 1 : 0.7 }]}
          onPress={gonder}
          disabled={gonderiliyor}>
          <Text style={styles.teklifBtnText}>{gonderiliyor ? 'Gönderiliyor...' : '✓ Talebi Gönder'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onKapat} style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── MEKAN DETAY ───────────────────────────────────────────
function MekanDetay({ mekan, onGeri, onTeklif, kullanici }) {
  const [aktifIndex, setAktifIndex] = useState(0);
  const [tamEkran, setTamEkran] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isRomantik = mekan.alt_kategori?.includes('evlenme_teklifi');
  const accentRenk = isRomantik ? C.romantic : C.gold;
  const tumFotolar = [mekan.fotograf_url, ...(mekan.fotograf_galeri || [])].filter(Boolean);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: isRomantik ? C.romanticSoft : C.bg }, { opacity: fadeAnim }]}>
      {tamEkran && (
        <View style={styles.tamEkranOverlay}>
          <Image source={{ uri: tumFotolar[aktifIndex] }} style={styles.tamEkranGorsel} resizeMode="contain" />
          <TouchableOpacity style={styles.tamEkranKapat} onPress={() => setTamEkran(false)}>
            <Text style={styles.tamEkranKapatText}>✕</Text>
          </TouchableOpacity>
          {tumFotolar.length > 1 && (
            <View style={styles.tamEkranNavRow}>
              <TouchableOpacity onPress={() => setAktifIndex(Math.max(0, aktifIndex - 1))} style={styles.tamEkranNavBtn}>
                <Text style={styles.tamEkranNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={{ color: C.white, fontSize: 14 }}>{aktifIndex + 1} / {tumFotolar.length}</Text>
              <TouchableOpacity onPress={() => setAktifIndex(Math.min(tumFotolar.length - 1, aktifIndex + 1))} style={styles.tamEkranNavBtn}>
                <Text style={styles.tamEkranNavText}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ position: 'relative' }}>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            style={{ width: SCREEN_WIDTH, height: 320 }}
            onMomentumScrollEnd={(e) => setAktifIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}>
            {tumFotolar.map((foto, i) => (
              <TouchableOpacity key={i} onPress={() => { setAktifIndex(i); setTamEkran(true); }} activeOpacity={0.95}>
                <Image source={{ uri: foto }} style={{ width: SCREEN_WIDTH, height: 320 }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.geriBtnDetay} onPress={onGeri}>
            <Text style={styles.geriBtnText}>←</Text>
          </TouchableOpacity>
          {tumFotolar.length > 1 && (
            <View style={styles.fotoDots}>
              {tumFotolar.map((_, i) => <View key={i} style={[styles.fotoDot, aktifIndex === i && { backgroundColor: C.white, width: 16 }]} />)}
            </View>
          )}
          {tumFotolar.length > 1 && (
            <View style={styles.galeriBadge}>
              <Text style={styles.galeriBadgeText}>📷 {aktifIndex + 1}/{tumFotolar.length}</Text>
            </View>
          )}
          <View style={[styles.puanBadge, { backgroundColor: accentRenk }]}>
            <Text style={styles.puanText}>★ {mekan.puan}</Text>
          </View>
          {isRomantik && (
            <View style={[styles.oneCikanBadge, { backgroundColor: C.romantic }]}>
              <Text style={styles.oneCikanText}>💝 Romantik</Text>
            </View>
          )}
        </View>

        {tumFotolar.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 12, paddingHorizontal: 16 }} contentContainerStyle={{ gap: 8 }}>
            {tumFotolar.map((foto, i) => (
              <TouchableOpacity key={i} onPress={() => setAktifIndex(i)}>
                <Image source={{ uri: foto }} style={[styles.thumbnail, aktifIndex === i && { borderColor: accentRenk, borderWidth: 2.5 }]} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.detayIcerik}>
          <View style={styles.detayBaslikRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detayIsim}>{mekan.isim}</Text>
              <Text style={styles.detaySehir}>📍 {mekan.sehir}</Text>
            </View>
            {mekan.fiyat_aralik && (
              <View style={[styles.fiyatBadge, { backgroundColor: accentRenk + '15', borderColor: accentRenk + '40' }]}>
                <Text style={[styles.fiyatText, { color: accentRenk }]}>{mekan.fiyat_aralik}</Text>
              </View>
            )}
          </View>

          <View style={styles.hizliBilgiRow}>
            <View style={styles.hizliBilgiKart}>
              <Text style={styles.hizliBilgiEmoji}>👥</Text>
              <Text style={styles.hizliBilgiDeger}>{mekan.kapasite}</Text>
              <Text style={styles.hizliBilgiEtiket}>Kişi</Text>
            </View>
            {mekan.valet && (
              <View style={styles.hizliBilgiKart}>
                <Text style={styles.hizliBilgiEmoji}>🚗</Text>
                <Text style={styles.hizliBilgiDeger}>Var</Text>
                <Text style={styles.hizliBilgiEtiket}>Valet</Text>
              </View>
            )}
            {mekan.otopark && (
              <View style={styles.hizliBilgiKart}>
                <Text style={styles.hizliBilgiEmoji}>🅿️</Text>
                <Text style={styles.hizliBilgiDeger}>Var</Text>
                <Text style={styles.hizliBilgiEtiket}>Otopark</Text>
              </View>
            )}
            <View style={styles.hizliBilgiKart}>
              <Text style={styles.hizliBilgiEmoji}>★</Text>
              <Text style={styles.hizliBilgiDeger}>{mekan.puan}</Text>
              <Text style={styles.hizliBilgiEtiket}>Puan</Text>
            </View>
          </View>

          {mekan.aciklama && (
            <View style={styles.detayBolum}>
              <Text style={styles.detayBolumBaslik}>Hakkında</Text>
              <Text style={styles.detayAciklama}>{mekan.aciklama}</Text>
            </View>
          )}

          {mekan.video_url && (
            <View style={styles.detayBolum}>
              <Text style={styles.detayBolumBaslik}>▶️ Mekan Videosu</Text>
              <VideoOynatici url={mekan.video_url} />
            </View>
          )}

          {(mekan.fiziksel_ozellikler || []).length > 0 && (
            <View style={styles.detayBolum}>
              <Text style={styles.detayBolumBaslik}>Mekan Özellikleri</Text>
              <View style={styles.ozellikGrid}>
                {mekan.fiziksel_ozellikler.map((o, i) => (
                  <View key={i} style={[styles.detayOzellikKart, { borderColor: accentRenk + '30' }]}>
                    <Text style={[styles.detayOzellikText, { color: accentRenk }]}>{o}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(mekan.teknik_altyapi || []).length > 0 && (
            <View style={styles.detayBolum}>
              <Text style={styles.detayBolumBaslik}>Teknik Altyapı</Text>
              <View style={styles.ozellikGrid}>
                {mekan.teknik_altyapi.map((t, i) => (
                  <View key={i} style={styles.teknikDetayKart}>
                    <Text style={styles.teknikDetayText}>⚡ {t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={[styles.stickyCta, isRomantik && { backgroundColor: C.romanticSoft }]}>
        <View style={{ flex: 1 }}>
          {mekan.fiyat_aralik && <Text style={[styles.stickyFiyat, { color: accentRenk }]}>{mekan.fiyat_aralik}</Text>}
          <Text style={styles.stickyKapasite}>👥 {mekan.kapasite} kişiye kadar</Text>
        </View>
        <IletisimButonu mekan={mekan} kullanici={kullanici} onFormAc={onTeklif} style={{ flex: 1 }} />
      </View>
    </Animated.View>
  );
}

// ── MEKAN KARTI ───────────────────────────────────────────
function MekanKarti({ mekan, onTeklif, onDetay, romantikMod, index, kullanici }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const isRomantik = romantikMod || mekan.alt_kategori?.includes('evlenme_teklifi');
  const accentRenk = isRomantik ? C.romantic : C.gold;
  const toplamMedya = (mekan.fotograf_galeri || []).length + (mekan.video_url ? 1 : 0);

  return (
    <Animated.View style={[
      styles.kart,
      IS_DESKTOP && styles.kartDesktop,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      isRomantik && { borderColor: C.romantic + '30' },
    ]}>
      <TouchableOpacity onPress={() => onDetay(mekan)} activeOpacity={0.95}>
        <Image source={{ uri: mekan.fotograf_url }} style={styles.kartGorsel} />
        <View style={[styles.puanBadge, { backgroundColor: accentRenk }]}>
          <Text style={styles.puanText}>★ {mekan.puan}</Text>
        </View>
        {mekan.one_cikan && (
          <View style={styles.oneCikanBadge}>
            <Text style={styles.oneCikanText}>✦ Öne Çıkan</Text>
          </View>
        )}
        {isRomantik && (
          <View style={[styles.oneCikanBadge, { backgroundColor: C.romantic, left: 14, right: 'auto' }]}>
            <Text style={styles.oneCikanText}>💝 Romantik</Text>
          </View>
        )}
        {toplamMedya > 0 && (
          <View style={styles.galeriBadge}>
            <Text style={styles.galeriBadgeText}>{mekan.video_url ? '▶️ Video' : `📷 +${mekan.fotograf_galeri.length}`}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.kartIcerik}>
        <TouchableOpacity onPress={() => onDetay(mekan)}>
          <View style={styles.kartBaslikRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kartIsim} numberOfLines={1}>{mekan.isim}</Text>
              <Text style={styles.kartSehir}>📍 {mekan.sehir}</Text>
            </View>
            {mekan.fiyat_aralik && (
              <View style={[styles.fiyatBadge, { backgroundColor: accentRenk + '15', borderColor: accentRenk + '30' }]}>
                <Text style={[styles.fiyatText, { color: accentRenk }]}>{mekan.fiyat_aralik.split(' - ')[0]}</Text>
              </View>
            )}
          </View>
          <Text style={styles.kapasiteText}>👥 {mekan.kapasite} kişiye kadar</Text>
        </TouchableOpacity>

        {(mekan.fiziksel_ozellikler || []).length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {mekan.fiziksel_ozellikler.map((o, i) => (
              <View key={i} style={[styles.ozellikChip, { backgroundColor: accentRenk + '10', borderColor: accentRenk + '25' }]}>
                <Text style={[styles.ozellikChipText, { color: accentRenk }]}>{o}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {(mekan.teknik_altyapi || []).length > 0 && (
          <View style={styles.teknikRow}>
            {mekan.teknik_altyapi.slice(0, 3).map((t, i) => (
              <View key={i} style={styles.teknikChip}>
                <Text style={styles.teknikChipText}>⚡ {t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.ikonRow}>
          {mekan.valet && <Text style={styles.ikonText}>🚗 Valet</Text>}
          {mekan.otopark && <Text style={styles.ikonText}>🅿️ Otopark</Text>}
          {mekan.video_url && <Text style={styles.ikonText}>▶️ Video</Text>}
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.detayBtn, { borderColor: isRomantik ? C.romantic : C.midnight }]} onPress={() => onDetay(mekan)}>
            <Text style={[styles.detayBtnText, { color: isRomantik ? C.romantic : C.midnight }]}>Detaylar →</Text>
          </TouchableOpacity>
          <IletisimButonu mekan={mekan} kullanici={kullanici} onFormAc={onTeklif} style={{ flex: 1 }} />
        </View>
      </View>
    </Animated.View>
  );
}

// ── ADMIN GİRİŞ ──────────────────────────────────────────
function AdminGiris({ onGiris }) {
  const [sifre, setSifre] = useState('');
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 32 }}>
        <Image source={require('./assets/logo.png')} style={{ width: 180, height: 50, alignSelf: 'center', marginBottom: 8 }} resizeMode="contain" />
        <Text style={{ color: C.textSoft, textAlign: 'center', marginBottom: 40 }}>Admin Paneli</Text>
        <TextInput style={styles.formInput} placeholder="Şifre" placeholderTextColor={C.textSoft} secureTextEntry value={sifre} onChangeText={setSifre} />
        <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={() => { if (sifre === ADMIN_SIFRE) onGiris(); else alert('Hatalı şifre!'); }}>
          <Text style={styles.teklifBtnText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── DÜZENLEME FORMU ───────────────────────────────────────
function DuzenlemeFormu({ mekan, onKaydet, onIptal }) {
  const [isim, setIsim] = useState(mekan.isim || '');
  const [sehir, setSehir] = useState(mekan.sehir || '');
  const [kapasite, setKapasite] = useState(String(mekan.kapasite || ''));
  const [fiyat, setFiyat] = useState(mekan.fiyat_aralik || '');
  const [foto, setFoto] = useState(mekan.fotograf_url || '');
  const [video, setVideo] = useState(mekan.video_url || '');
  const [ozellik, setOzellik] = useState((mekan.fiziksel_ozellikler || []).join(', '));
  const [teknik, setTeknik] = useState((mekan.teknik_altyapi || []).join(', '));
  const [aciklama, setAciklama] = useState(mekan.aciklama || '');
  const [aktif, setAktif] = useState(mekan.aktif ?? true);
  const [oneCikan, setOneCikan] = useState(mekan.one_cikan ?? false);
  const [iletisimTuru, setIletisimTuru] = useState(mekan.iletisim_turu || 'form');
  const [iletisimNumarasi, setIletisimNumarasi] = useState(mekan.iletisim_numarasi || '');
  const [iletisimEmail, setIletisimEmail] = useState(mekan.iletisim_email || '');
  const [whatsappMesaj, setWhatsappMesaj] = useState(mekan.whatsapp_mesaj_sablonu || '');
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [fotografYukleniyor, setFotografYukleniyor] = useState(false);

  async function kaydet() {
    if (!isim || !sehir || !kapasite) { alert('İsim, şehir ve kapasite zorunlu!'); return; }
    setKaydediliyor(true);
    await onKaydet({
      isim, sehir, kapasite: parseInt(kapasite), fiyat_aralik: fiyat,
      fotograf_url: foto, video_url: video || null, aciklama,
      fiziksel_ozellikler: ozellik ? ozellik.split(',').map(s => s.trim()) : [],
      teknik_altyapi: teknik ? teknik.split(',').map(s => s.trim()) : [],
      aktif, one_cikan: oneCikan, iletisim_turu: iletisimTuru,
      iletisim_numarasi: iletisimNumarasi, iletisim_email: iletisimEmail,
      whatsapp_mesaj_sablonu: whatsappMesaj,
    });
    setKaydediliyor(false);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16 }}>
        <Text style={styles.formBaslik}>Mekan Düzenle</Text>
        <Text style={{ color: C.gold, fontSize: 13, marginBottom: 20, fontWeight: '600' }}>{mekan.isim}</Text>
        {[
          { label: 'Mekan Adı *', val: isim, set: setIsim, ph: 'Grand Ballroom' },
          { label: 'Şehir *', val: sehir, set: setSehir, ph: 'İstanbul' },
          { label: 'Kapasite *', val: kapasite, set: setKapasite, ph: '500', kb: 'numeric' },
          { label: 'Fiyat Aralığı', val: fiyat, set: setFiyat, ph: '50.000₺ - 150.000₺' },
          { label: 'Video URL', val: video, set: setVideo, ph: 'https://youtube.com/...' },
          { label: 'Fiziksel Özellikler (virgülle)', val: ozellik, set: setOzellik, ph: 'Teras, Bahçe' },
          { label: 'Teknik Altyapı (virgülle)', val: teknik, set: setTeknik, ph: 'Projeksiyon, Ses' },
        ].map((f, i) => (
          <View key={i}>
            <Text style={styles.inputEtiket}>{f.label}</Text>
            <TextInput style={styles.formInput} placeholder={f.ph} placeholderTextColor={C.textSoft} value={f.val} onChangeText={f.set} keyboardType={f.kb || 'default'} />
          </View>
        ))}

        <Text style={styles.inputEtiket}>Ana Fotoğraf</Text>
        <TouchableOpacity style={[styles.yukleBtn, { backgroundColor: fotografYukleniyor ? C.textSoft : C.midnightSoft }]} onPress={() => fotografYukle(setFoto, setFotografYukleniyor)} disabled={fotografYukleniyor}>
          <Text style={styles.yukleBtnText}>{fotografYukleniyor ? '⏳ Yükleniyor...' : '📷 Fotoğraf Değiştir'}</Text>
        </TouchableOpacity>
        {foto
          ? <Image source={{ uri: foto }} style={{ width: '100%', height: 160, borderRadius: 14, marginBottom: 12 }} resizeMode="cover" />
          : <TextInput style={styles.formInput} placeholder="Fotoğraf URL" placeholderTextColor={C.textSoft} value={foto} onChangeText={setFoto} />
        }

        <Text style={styles.inputEtiket}>Açıklama</Text>
        <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Mekan açıklaması..." placeholderTextColor={C.textSoft} value={aciklama} onChangeText={setAciklama} multiline />

        <Text style={styles.inputEtiket}>İletişim Tercihi</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {ILETISIM_TURLERI.map(t => (
            <TouchableOpacity key={t.id} style={[styles.pill, iletisimTuru === t.id && { backgroundColor: t.renk, borderColor: t.renk }]} onPress={() => setIletisimTuru(t.id)}>
              <Text style={styles.pillEmoji}>{t.emoji}</Text>
              <Text style={[styles.pillText, iletisimTuru === t.id && { color: C.white, fontWeight: '700' }]}>{t.etiket}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {(iletisimTuru === 'whatsapp' || iletisimTuru === 'telefon') && (
          <View>
            <Text style={styles.inputEtiket}>{iletisimTuru === 'whatsapp' ? 'WhatsApp Numarası' : 'Telefon Numarası'}</Text>
            <TextInput style={styles.formInput} placeholder="5XX XXX XX XX" placeholderTextColor={C.textSoft} value={iletisimNumarasi} onChangeText={setIletisimNumarasi} keyboardType="phone-pad" />
          </View>
        )}
        {iletisimTuru === 'whatsapp' && (
          <View>
            <Text style={styles.inputEtiket}>WhatsApp Karşılama Mesajı</Text>
            <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Merhaba! fiyat teklifi almak istiyorum..." placeholderTextColor={C.textSoft} value={whatsappMesaj} onChangeText={setWhatsappMesaj} multiline />
          </View>
        )}
        {iletisimTuru === 'email' && (
          <View>
            <Text style={styles.inputEtiket}>E-posta Adresi</Text>
            <TextInput style={styles.formInput} placeholder="info@mekanim.com" placeholderTextColor={C.textSoft} value={iletisimEmail} onChangeText={setIletisimEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16, marginTop: 8 }}>
          <TouchableOpacity
            style={[styles.durumBtn, { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: aktif ? C.success : C.bg, borderColor: C.success }]}
            onPress={() => setAktif(!aktif)}>
            <Text style={[styles.durumBtnText, { color: aktif ? C.white : C.textMid }]}>{aktif ? '✅ Aktif' : '❌ Pasif'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.durumBtn, { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: oneCikan ? C.gold : C.bg, borderColor: C.gold }]}
            onPress={() => setOneCikan(!oneCikan)}>
            <Text style={[styles.durumBtnText, { color: oneCikan ? C.white : C.textMid }]}>{oneCikan ? '✦ Öne Çıkan' : '✦ Öne Çıkar'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={kaydet} disabled={kaydediliyor}>
          <Text style={styles.teklifBtnText}>{kaydediliyor ? 'Kaydediliyor...' : '💾 Kaydet'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }} onPress={onIptal}>
          <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </View>
    </ScrollView>
  );
}

// ── ADMIN PANELİ ──────────────────────────────────────────
function AdminPanel({ onCikis }) {
  const [aktifTab, setAktifTab] = useState('onay');
  const [leads, setLeads] = useState([]);
  const [mekanlar, setMekanlar] = useState([]);
  const [sahipler, setSahipler] = useState([]);
  const [bekleyenMekanlar, setBekleyenMekanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duzenlenenMekan, setDuzenlenenMekan] = useState(null);
  const [yeniIsim, setYeniIsim] = useState('');
  const [yeniSehir, setYeniSehir] = useState('');
  const [yeniKapasite, setYeniKapasite] = useState('');
  const [yeniFoto, setYeniFoto] = useState('');
  const [yeniGaleri, setYeniGaleri] = useState([]);
  const [yeniVideo, setYeniVideo] = useState('');
  const [yeniFiyat, setYeniFiyat] = useState('');
  const [yeniOzellik, setYeniOzellik] = useState('');
  const [yeniTeknik, setYeniTeknik] = useState('');
  const [yeniAciklama, setYeniAciklama] = useState('');
  const [yeniAnaKat, setYeniAnaKat] = useState('ozel_gunler');
  const [yeniAltKat, setYeniAltKat] = useState('dugun');
  const [yeniIletisimTuru, setYeniIletisimTuru] = useState('whatsapp');
  const [yeniIletisimNumarasi, setYeniIletisimNumarasi] = useState('');
  const [yeniIletisimEmail, setYeniIletisimEmail] = useState('');
  const [ekleniyor, setEkleniyor] = useState(false);
  const [fotografYukleniyor, setFotografYukleniyor] = useState(false);

  useEffect(() => { veriGetir(); }, []);

  async function veriGetir() {
    setYukleniyor(true);
    const [l, m, s, b] = await Promise.all([
      apiFetch('leads?select=*&order=created_at.desc'),
      apiFetch('mekanlar?select=*&onay_durumu=eq.onaylandi&order=created_at.desc'),
      apiFetch('mekan_sahipleri?select=*&order=created_at.desc'),
      apiFetch('mekanlar?select=*&onay_durumu=eq.beklemede&order=created_at.desc'),
    ]);
    setLeads(Array.isArray(l) ? l : []);
    setMekanlar(Array.isArray(m) ? m : []);
    setSahipler(Array.isArray(s) ? s : []);
    setBekleyenMekanlar(Array.isArray(b) ? b : []);
    setYukleniyor(false);
  }

  async function mekanOnayla(id, sahipId) {
    await apiPatch(`mekanlar?id=eq.${id}`, { onay_durumu: 'onaylandi', aktif: true });
    veriGetir();
    alert('✅ Mekan onaylandı!');
  }

  async function mekanReddet(id) {
    await apiPatch(`mekanlar?id=eq.${id}`, { onay_durumu: 'reddedildi', aktif: false });
    veriGetir();
  }

  async function mekanEkle() {
    if (!yeniIsim || !yeniSehir || !yeniKapasite) { alert('İsim, şehir ve kapasite zorunlu!'); return; }
    setEkleniyor(true);
    await apiPost('mekanlar', {
      isim: yeniIsim, sehir: yeniSehir, kapasite: parseInt(yeniKapasite),
      ana_kategori: yeniAnaKat, alt_kategori: [yeniAltKat],
      fotograf_url: yeniFoto || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
      fotograf_galeri: yeniGaleri, video_url: yeniVideo || null,
      fiyat_aralik: yeniFiyat, aciklama: yeniAciklama,
      fiziksel_ozellikler: yeniOzellik ? yeniOzellik.split(',').map(s => s.trim()) : [],
      teknik_altyapi: yeniTeknik ? yeniTeknik.split(',').map(s => s.trim()) : [],
      iletisim_turu: yeniIletisimTuru, iletisim_numarasi: yeniIletisimNumarasi, iletisim_email: yeniIletisimEmail,
      aktif: true, onay_durumu: 'onaylandi', puan: 4.5,
    });
    setYeniIsim(''); setYeniSehir(''); setYeniKapasite(''); setYeniFoto(''); setYeniGaleri([]);
    setYeniVideo(''); setYeniFiyat(''); setYeniOzellik(''); setYeniTeknik(''); setYeniAciklama('');
    setYeniIletisimNumarasi(''); setYeniIletisimEmail('');
    setEkleniyor(false); veriGetir(); alert('✅ Mekan eklendi!');
  }

  if (yukleniyor) return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.midnight} />
    </SafeAreaView>
  );

  if (aktifTab === 'duzenle' && duzenlenenMekan) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
        <View style={styles.adminHeader}>
          <Text style={[styles.logo, { color: C.midnight, fontSize: 20 }]}>Mekan Düzenle</Text>
          <TouchableOpacity onPress={() => setAktifTab('mekanlar')} style={[styles.pill, { backgroundColor: C.bg }]}>
            <Text style={{ color: C.textMid, fontSize: 13 }}>← Geri</Text>
          </TouchableOpacity>
        </View>
        <DuzenlemeFormu
          mekan={duzenlenenMekan}
          onKaydet={async (g) => { await apiPatch(`mekanlar?id=eq.${duzenlenenMekan.id}`, g); veriGetir(); setAktifTab('mekanlar'); alert('✅ Güncellendi!'); }}
          onIptal={() => setAktifTab('mekanlar')}
        />
      </SafeAreaView>
    );
  }

  const bugunLeads = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.adminHeader}>
        <Image source={require('./assets/logo.png')} style={{ width: 120, height: 34 }} resizeMode="contain" />
        <TouchableOpacity onPress={onCikis} style={[styles.pill, { backgroundColor: C.bg }]}>
          <Text style={{ color: C.textMid, fontSize: 13 }}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statRow}>
        {[
          { sayi: leads.length, etiket: 'Lead', renk: C.midnight },
          { sayi: mekanlar.length, etiket: 'Mekan', renk: C.gold },
          { sayi: bugunLeads, etiket: 'Bugün', renk: C.success },
          { sayi: bekleyenMekanlar.length, etiket: 'Onay Bekl.', renk: C.danger },
          { sayi: sahipler.length, etiket: 'Üye', renk: C.romantic },
        ].map((s, i) => (
          <View key={i} style={[styles.statKart, { borderTopColor: s.renk }]}>
            <Text style={[styles.statSayi, { color: s.renk, fontSize: 18 }]}>{s.sayi}</Text>
            <Text style={[styles.statEtiket, { fontSize: 9 }]}>{s.etiket}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52 }}>
        <View style={[styles.tabRow, { paddingHorizontal: 16 }]}>
          {[
            { id: 'onay', etiket: bekleyenMekanlar.length > 0 ? `Onaylar 🔴` : 'Onaylar' },
            { id: 'leads', etiket: 'Leads' },
            { id: 'mekanlar', etiket: 'Mekanlar' },
            { id: 'ekle', etiket: '+ Ekle' },
            { id: 'uyeler', etiket: 'Üyeler' },
          ].map(t => (
            <TouchableOpacity key={t.id} style={[styles.tabBtn, { marginRight: 8 }, aktifTab === t.id && { backgroundColor: C.midnight, borderColor: C.midnight }]} onPress={() => setAktifTab(t.id)}>
              <Text style={[styles.tabBtnText, aktifTab === t.id && { color: C.white }]}>{t.etiket}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {aktifTab === 'onay' && (
          <View style={{ padding: 16 }}>
            {bekleyenMekanlar.length === 0
              ? <View style={styles.bosEkran}><Text style={styles.bosEkranEmoji}>✅</Text><Text style={styles.bosEkranText}>Onay bekleyen mekan yok.</Text></View>
              : bekleyenMekanlar.map(m => (
                <View key={m.id} style={[styles.adminKart, { borderColor: C.gold, borderWidth: 1.5, flexDirection: 'column' }]}>
                  {m.fotograf_url && <Image source={{ uri: m.fotograf_url }} style={{ width: '100%', height: 160, borderRadius: 12, marginBottom: 12 }} resizeMode="cover" />}
                  <Text style={styles.adminKartIsim}>{m.isim}</Text>
                  <Text style={styles.adminKartDetay}>📍 {m.sehir} · 👥 {m.kapasite} kişi</Text>
                  {m.iletisim_turu && <Text style={styles.adminKartDetay}>📱 {m.iletisim_turu} - {m.iletisim_numarasi || m.iletisim_email || ''}</Text>}
                  {m.aciklama ? <Text style={[styles.adminKartDetay, { marginTop: 4 }]}>{m.aciklama}</Text> : null}
                  <Text style={styles.adminKartTarih}>{formatTarih(m.created_at)}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                    <TouchableOpacity style={[styles.teklifBtn, { flex: 1, backgroundColor: C.success, paddingVertical: 12 }]} onPress={() => mekanOnayla(m.id, m.sahip_id)}>
                      <Text style={styles.teklifBtnText}>✅ Onayla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.teklifBtn, { flex: 1, backgroundColor: C.danger, paddingVertical: 12 }]} onPress={() => mekanReddet(m.id)}>
                      <Text style={styles.teklifBtnText}>❌ Reddet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            }
          </View>
        )}

        {aktifTab === 'leads' && (
          <View style={{ padding: 16 }}>
            {leads.length === 0
              ? <Text style={{ color: C.textSoft, textAlign: 'center', marginTop: 40 }}>Henüz lead yok.</Text>
              : leads.map(l => (
                <View key={l.id} style={styles.adminKart}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adminKartIsim}>{l.ad_soyad}</Text>
                    <Text style={styles.adminKartDetay}>📞 {l.telefon}</Text>
                    <Text style={styles.adminKartDetay}>🏢 {l.mekan_isim}</Text>
                    {l.etkinlik_tarihi ? <Text style={styles.adminKartDetay}>📅 {l.etkinlik_tarihi}</Text> : null}
                    {l.notlar ? <Text style={styles.adminKartDetay}>💬 {l.notlar}</Text> : null}
                    <Text style={styles.adminKartTarih}>{formatTarih(l.created_at)}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      {['bekliyor', 'aranıyor', 'tamamlandı'].map(d => (
                        <TouchableOpacity key={d}
                          style={[styles.durumBtn, l.durum === d && { backgroundColor: d === 'tamamlandı' ? C.success : d === 'aranıyor' ? C.gold : C.midnight }]}
                          onPress={async () => { await apiPatch(`leads?id=eq.${l.id}`, { durum: d }); veriGetir(); }}>
                          <Text style={[styles.durumBtnText, l.durum === d && { color: C.white }]}>
                            {d === 'bekliyor' ? '⏳' : d === 'aranıyor' ? '📞' : '✅'} {d}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity onPress={async () => { await apiDelete(`leads?id=eq.${l.id}`); veriGetir(); }} style={{ padding: 8 }}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
        )}

        {aktifTab === 'mekanlar' && (
          <View style={{ padding: 16 }}>
            {mekanlar.map(m => (
              <View key={m.id} style={styles.adminKart}>
                {m.fotograf_url && <Image source={{ uri: m.fotograf_url }} style={{ width: 80, height: 80, borderRadius: 12, marginRight: 12 }} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminKartIsim}>{m.isim}</Text>
                  <Text style={styles.adminKartDetay}>📍 {m.sehir}</Text>
                  {m.iletisim_turu && <Text style={styles.adminKartDetay}>📱 {m.iletisim_turu}</Text>}
                  <Text style={[styles.adminKartDetay, { color: m.aktif ? C.success : C.danger }]}>{m.aktif ? '✅ Aktif' : '❌ Pasif'}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <TouchableOpacity style={[styles.durumBtn, { borderColor: C.gold }]} onPress={() => { setDuzenlenenMekan(m); setAktifTab('duzenle'); }}>
                      <Text style={[styles.durumBtnText, { color: C.gold }]}>✏️ Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.durumBtn, { borderColor: C.danger }]} onPress={async () => { await apiDelete(`mekanlar?id=eq.${m.id}`); veriGetir(); }}>
                      <Text style={[styles.durumBtnText, { color: C.danger }]}>🗑️ Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {aktifTab === 'ekle' && (
          <View style={{ padding: 16 }}>
            <Text style={styles.formBaslik}>Yeni Mekan Ekle</Text>
            {[
              { label: 'Mekan Adı *', val: yeniIsim, set: setYeniIsim, ph: 'Grand Ballroom' },
              { label: 'Şehir *', val: yeniSehir, set: setYeniSehir, ph: 'İstanbul' },
              { label: 'Kapasite *', val: yeniKapasite, set: setYeniKapasite, ph: '500', kb: 'numeric' },
              { label: 'Fiyat Aralığı', val: yeniFiyat, set: setYeniFiyat, ph: '50.000₺ - 150.000₺' },
              { label: 'Fiziksel Özellikler (virgülle)', val: yeniOzellik, set: setYeniOzellik, ph: 'Teras, Bahçe' },
              { label: 'Teknik Altyapı (virgülle)', val: yeniTeknik, set: setYeniTeknik, ph: 'Projeksiyon, Ses' },
            ].map((f, i) => (
              <View key={i}>
                <Text style={styles.inputEtiket}>{f.label}</Text>
                <TextInput style={styles.formInput} placeholder={f.ph} placeholderTextColor={C.textSoft} value={f.val} onChangeText={f.set} keyboardType={f.kb || 'default'} />
              </View>
            ))}
            <Text style={styles.inputEtiket}>Açıklama</Text>
            <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Mekan hakkında..." placeholderTextColor={C.textSoft} value={yeniAciklama} onChangeText={setYeniAciklama} multiline />

            <Text style={styles.inputEtiket}>İletişim Tercihi</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {ILETISIM_TURLERI.map(t => (
                <TouchableOpacity key={t.id} style={[styles.pill, yeniIletisimTuru === t.id && { backgroundColor: t.renk, borderColor: t.renk }]} onPress={() => setYeniIletisimTuru(t.id)}>
                  <Text style={styles.pillEmoji}>{t.emoji}</Text>
                  <Text style={[styles.pillText, yeniIletisimTuru === t.id && { color: C.white, fontWeight: '700' }]}>{t.etiket}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {(yeniIletisimTuru === 'whatsapp' || yeniIletisimTuru === 'telefon') && (
              <View>
                <Text style={styles.inputEtiket}>Numara</Text>
                <TextInput style={styles.formInput} placeholder="5XX XXX XX XX" placeholderTextColor={C.textSoft} value={yeniIletisimNumarasi} onChangeText={setYeniIletisimNumarasi} keyboardType="phone-pad" />
              </View>
            )}
            {yeniIletisimTuru === 'email' && (
              <View>
                <Text style={styles.inputEtiket}>E-posta</Text>
                <TextInput style={styles.formInput} placeholder="info@mekan.com" placeholderTextColor={C.textSoft} value={yeniIletisimEmail} onChangeText={setYeniIletisimEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            )}
            <Text style={styles.inputEtiket}>Ana Fotoğraf</Text>
            <TouchableOpacity style={[styles.yukleBtn, { backgroundColor: fotografYukleniyor ? C.textSoft : C.midnightSoft }]} onPress={() => fotografYukle(setYeniFoto, setFotografYukleniyor)} disabled={fotografYukleniyor}>
              <Text style={styles.yukleBtnText}>{fotografYukleniyor ? '⏳ Yükleniyor...' : '📷 Ana Fotoğraf Seç'}</Text>
            </TouchableOpacity>
            {yeniFoto
              ? <Image source={{ uri: yeniFoto }} style={{ width: '100%', height: 160, borderRadius: 14, marginBottom: 12 }} resizeMode="cover" />
              : <TextInput style={styles.formInput} placeholder="veya URL yapıştırın" placeholderTextColor={C.textSoft} value={yeniFoto} onChangeText={setYeniFoto} />
            }
            <Text style={styles.inputEtiket}>Ana Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {ANA_KATEGORILER.filter(k => k.id !== 'hepsi' && k.id !== 'populer').map(k => (
                <TouchableOpacity key={k.id} style={[styles.pill, { marginRight: 8 }, yeniAnaKat === k.id && { backgroundColor: C.midnight, borderColor: C.midnight }]} onPress={() => setYeniAnaKat(k.id)}>
                  <Text style={[styles.pillText, yeniAnaKat === k.id && { color: C.white }]}>{k.etiket}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.inputEtiket}>Alt Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {(ALT_KATEGORILER[yeniAnaKat] || []).map(k => (
                <TouchableOpacity key={k.id} style={[styles.pill, { marginRight: 8 }, yeniAltKat === k.id && { backgroundColor: C.gold, borderColor: C.gold }]} onPress={() => setYeniAltKat(k.id)}>
                  <Text style={styles.pillEmoji}>{k.emoji}</Text>
                  <Text style={[styles.pillText, yeniAltKat === k.id && { color: C.white }]}>{k.etiket}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={mekanEkle} disabled={ekleniyor}>
              <Text style={styles.teklifBtnText}>{ekleniyor ? 'Ekleniyor...' : '+ Mekan Ekle'}</Text>
            </TouchableOpacity>
            <View style={{ height: 60 }} />
          </View>
        )}

        {aktifTab === 'uyeler' && (
          <View style={{ padding: 16 }}>
            {sahipler.length === 0
              ? <Text style={{ color: C.textSoft, textAlign: 'center', marginTop: 40 }}>Henüz üye yok.</Text>
              : sahipler.map(s => (
                <View key={s.id} style={styles.adminKart}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adminKartIsim}>{s.ad_soyad}</Text>
                    {s.firma_adi ? <Text style={styles.adminKartDetay}>🏢 {s.firma_adi}</Text> : null}
                    {s.telefon ? <Text style={styles.adminKartDetay}>📞 {s.telefon}</Text> : null}
                    <Text style={[styles.adminKartDetay, { color: C.gold, fontWeight: '700' }]}>💰 {s.bakiye} ₺</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.teklifBtn, { backgroundColor: C.gold, paddingVertical: 8, paddingHorizontal: 12 }]}
                    onPress={async () => {
                      const ekle = prompt('Kaç TL bakiye eklensin?');
                      if (!ekle || isNaN(ekle)) return;
                      await apiPatch(`mekan_sahipleri?id=eq.${s.id}`, { bakiye: (s.bakiye || 0) + parseInt(ekle) });
                      await apiPost('bakiye_hareketleri', { sahip_id: s.id, miktar: parseInt(ekle), aciklama: 'Admin tarafından yüklendi', tur: 'yukle' });
                      veriGetir();
                    }}>
                    <Text style={[styles.teklifBtnText, { fontSize: 12 }]}>+ Bakiye</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── ANA UYGULAMA ──────────────────────────────────────────
export default function App() {
  const [ekran, setEkran] = useState('ana');
  const [sahipKullanici, setSahipKullanici] = useState(null);
  const [kullanici, setKullanici] = useState(null);
  const [kullaniciGirisAcik, setKullaniciGirisAcik] = useState(false);
  const [seciliDetay, setSeciliDetay] = useState(null);
  const [mekanlar, setMekanlar] = useState([]);
  const [banner, setBanner] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenileniyor, setYenileniyor] = useState(false);
  const [anaKategori, setAnaKategori] = useState('hepsi');
  const [altKategori, setAltKategori] = useState(null);
  const [fizikselFiltre, setFizikselFiltre] = useState(null);
  const [arama, setArama] = useState('');
  const [seciliMekan, setSeciliMekan] = useState(null);
  const [basariMesaji, setBasariMesaji] = useState(null);
  const [logoTiklama, setLogoTiklama] = useState(0);
  // 2. & 5. Gizlilik ve hata state'leri
  const [gizlilikAcik, setGizlilikAcik] = useState(false);
  const [yuklenmeHatasi, setYuklenmeHatasi] = useState(null);

  const romantikMod = anaKategori === 'ozel_gunler' && altKategori === 'evlenme_teklifi';

  useEffect(() => {
    veriGetir();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setSahipKullanici(session.user);
    });
    if (Platform.OS === 'web') {
      try {
        const k = localStorage.getItem('etkinlink_kullanici');
        if (k) setKullanici(JSON.parse(k));
      } catch (e) {}
    }
  }, []);

  // 5. Hata yakalayan veriGetir
  async function veriGetir(yenile = false) {
    if (yenile) setYenileniyor(true); else setYukleniyor(true);
    setYuklenmeHatasi(null);
    try {
      const m = await apiFetch('mekanlar?select=*&aktif=eq.true&onay_durumu=eq.onaylandi&order=one_cikan.desc,puan.desc');
      const b = await apiFetch('sezonsal_bannerlar?select=*&aktif=eq.true&limit=1');
      if (!Array.isArray(m)) {
        setYuklenmeHatasi('Mekanlar yüklenemedi. İnternet bağlantınızı kontrol edin.');
      } else {
        setMekanlar(m);
      }
      setBanner(Array.isArray(b) && b.length > 0 ? b[0] : null);
    } catch (e) {
      setYuklenmeHatasi('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
      console.log('Hata:', e.message);
    }
    setYukleniyor(false);
    setYenileniyor(false);
  }

  function kullaniciGirisYap(k) {
    setKullanici(k);
    setKullaniciGirisAcik(false);
    if (Platform.OS === 'web') { try { localStorage.setItem('etkinlink_kullanici', JSON.stringify(k)); } catch (e) {} }
  }

  function kullaniciCikis() {
    setKullanici(null);
    if (Platform.OS === 'web') { try { localStorage.removeItem('etkinlink_kullanici'); } catch (e) {} }
    setEkran('ana');
  }

  function teklifAc(mekan) {
    if ((mekan.iletisim_turu || 'form') === 'form') setSeciliMekan(mekan);
  }

  async function leadKaydet({ ad, telefon, kisi, notlar, tarih }) {
    const mekanIsim = seciliMekan.isim;
    const mekanSahipId = seciliMekan.sahip_id;
    try {
      await apiPost('leads', {
        mekan_id: seciliMekan.id,
        mekan_isim: mekanIsim,
        ad_soyad: ad,
        telefon,
        kisi_sayisi: kisi ? parseInt(kisi) : null,
        ana_kategori: anaKategori,
        alt_kategori: altKategori,
        notlar: notlar || null,
        etkinlik_tarihi: tarih || null,  // 3. etkinlik_tarihi kolonu
        iletisim_turu: 'form',
        kullanici_id: kullanici?.id || null,
        sahip_id: mekanSahipId || null,
      });

      if (mekanSahipId) {
        const sahipData = await apiFetch(`mekan_sahipleri?id=eq.${mekanSahipId}&select=bakiye`);
        if (sahipData?.[0]?.bakiye >= LEAD_UCRETI) {
          await apiPatch(`mekan_sahipleri?id=eq.${mekanSahipId}`, { bakiye: sahipData[0].bakiye - LEAD_UCRETI });
          await apiPost('bakiye_hareketleri', { sahip_id: mekanSahipId, miktar: -LEAD_UCRETI, aciklama: `Lead: ${ad}`, tur: 'lead' });
        }
      }

      await fetch('https://svaqquywnidqecbcwaqe.supabase.co/functions/v1/lead-bildirim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ ad_soyad: ad, telefon, mekan_isim: mekanIsim, kisi_sayisi: kisi || null, alt_kategori: altKategori, notlar, etkinlik_tarihi: tarih }),
      });
    } catch (e) { console.log('Lead hatası:', e.message); }

    setSeciliMekan(null);
    setBasariMesaji(`✓ Talebiniz alındı! ${mekanIsim} en kısa sürede sizi arayacak.`);
    setTimeout(() => setBasariMesaji(null), 5000);
  }

  const filtrelenmis = mekanlar.filter(m => {
    if (anaKategori !== 'hepsi' && anaKategori !== 'populer' && m.ana_kategori !== anaKategori) return false;
    if (anaKategori === 'populer' && !m.one_cikan) return false;
    if (altKategori && !(m.alt_kategori || []).includes(altKategori)) return false;
    if (fizikselFiltre && !(m.fiziksel_ozellikler || []).includes(fizikselFiltre)) return false;
    if (arama) {
      const aramaKucuk = arama.toLowerCase();
      const kelimeler = aramaKucuk.split(' ').filter(k => k.length > 1);
      const kombineUygun = kelimeler.every(kelime =>
        m.sehir?.toLowerCase().includes(kelime) ||
        m.isim?.toLowerCase().includes(kelime) ||
        (m.alt_kategori || []).some(ak => {
          const t = Object.values(ALT_KATEGORILER).flat().find(k => k.id === ak);
          return t?.etiket?.toLowerCase().includes(kelime);
        }) ||
        (m.fiziksel_ozellikler || []).some(o => o.toLowerCase().includes(kelime)) ||
        m.aciklama?.toLowerCase().includes(kelime)
      );
      if (!kombineUygun) return false;
    }
    return true;
  });

  // Ekran yönlendirmeleri
  if (ekran === 'adminGiris') return <AdminGiris onGiris={() => setEkran('adminPanel')} />;
  if (ekran === 'adminPanel') return <AdminPanel onCikis={() => setEkran('ana')} />;
  if (ekran === 'sahipGiris') return <SahipGirisEkrani onGiris={(user) => { setSahipKullanici(user); setEkran('sahipPanel'); }} onKapat={() => setEkran('ana')} />;
  if (ekran === 'sahipPanel' && sahipKullanici) return <SahipPaneli kullanici={sahipKullanici} onCikis={() => { setSahipKullanici(null); setEkran('ana'); }} />;
  if (ekran === 'kullaniciPanel' && kullanici) return <KullaniciPaneli kullanici={kullanici} onCikis={kullaniciCikis} />;

  // 5. Hata sayfası — yalnızca ilk yükleme başarısız olursa göster
  if (yuklenmeHatasi && mekanlar.length === 0 && !yukleniyor) {
    return <HataSayfasi hata={yuklenmeHatasi} onYeniden={() => veriGetir()} />;
  }

  if (seciliDetay) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="light" />
      <MekanDetay mekan={seciliDetay} onGeri={() => setSeciliDetay(null)} onTeklif={teklifAc} kullanici={kullanici} />
      {seciliMekan && (
        <TeklifFormu
          mekan={seciliMekan}
          onKapat={() => setSeciliMekan(null)}
          onGonder={leadKaydet}
          kullanici={kullanici}
          onGizlilikAc={() => setGizlilikAcik(true)}
        />
      )}
      {gizlilikAcik && <GizlilikPolitikasi onKapat={() => setGizlilikAcik(false)} />}
      {basariMesaji && <View style={styles.toast}><Text style={styles.toastText}>{basariMesaji}</Text></View>}
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: romantikMod ? C.romanticSoft : C.bg }]}>
      <StatusBar style="dark" />
      {kullaniciGirisAcik && <KullaniciGirisEkrani onGiris={kullaniciGirisYap} onKapat={() => setKullaniciGirisAcik(false)} />}
      {basariMesaji && <View style={styles.toast}><Text style={styles.toastText}>{basariMesaji}</Text></View>}
      {seciliMekan && (
        <TeklifFormu
          mekan={seciliMekan}
          onKapat={() => setSeciliMekan(null)}
          onGonder={leadKaydet}
          kullanici={kullanici}
          onGizlilikAc={() => setGizlilikAcik(true)}
        />
      )}
      {/* 2. Gizlilik Politikası modal */}
      {gizlilikAcik && <GizlilikPolitikasi onKapat={() => setGizlilikAcik(false)} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={yenileniyor} onRefresh={() => veriGetir(true)} tintColor={C.midnight} />}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: IS_DESKTOP ? 12 : 10 }}
            onPress={() => {
              const yeni = logoTiklama + 1;
              setLogoTiklama(yeni);
              if (yeni >= ADMIN_TIKLAMA_SAYISI) { setLogoTiklama(0); setEkran('adminGiris'); }
            }}>
            <Image source={require('./assets/logo.png')}
              style={{ width: IS_DESKTOP ? 48 : 38, height: IS_DESKTOP ? 48 : 38 }}
              resizeMode="contain" />
            <View>
              <Text style={[styles.logoText, IS_DESKTOP && styles.logoTextDesktop]}>etkinlink</Text>
              <Text style={styles.slogan}>Etkinliğin için en uygun mekanı bul</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.pill, { backgroundColor: kullanici ? C.successSoft : C.white, borderColor: kullanici ? C.success : C.border }]}
              onPress={() => kullanici ? setEkran('kullaniciPanel') : setKullaniciGirisAcik(true)}>
              <Text style={{ fontSize: 13, color: kullanici ? C.success : C.textMid, fontWeight: '600' }}>
                {kullanici ? `👤 ${kullanici.ad_soyad.split(' ')[0]}` : '👤 Giriş'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pill, { backgroundColor: sahipKullanici ? C.goldSoft : C.white, borderColor: C.gold }]}
              onPress={() => sahipKullanici ? setEkran('sahipPanel') : setEkran('sahipGiris')}>
              <Text style={{ fontSize: 13, color: C.gold, fontWeight: '600' }}>
                {sahipKullanici ? '🏢 Panelim' : '🏢 Mekan Sahibi'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <SezonBanner banner={banner} />
        </View>

        {/* ARAMA */}
        <AramaComubugu arama={arama} setArama={setArama} />

        {/* KATEGORİLER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsContainer} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {ANA_KATEGORILER.map(kat => (
            <KategoriPill key={kat.id} kat={kat} aktif={anaKategori === kat.id} romantikMod={romantikMod}
              onPress={() => { setAnaKategori(kat.id); setAltKategori(null); }} />
          ))}
        </ScrollView>

        {ALT_KATEGORILER[anaKategori] && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.pillsContainer, { marginTop: 0 }]} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {ALT_KATEGORILER[anaKategori].map(kat => (
              <KategoriPill key={kat.id} kat={kat} aktif={altKategori === kat.id} romantikMod={romantikMod}
                onPress={() => setAltKategori(altKategori === kat.id ? null : kat.id)} />
            ))}
          </ScrollView>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.pillsContainer, { marginTop: 0 }]} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {FIZIKSEL_FILTRELER.map(f => (
            <TouchableOpacity key={f.id}
              style={[styles.filtrePill, fizikselFiltre === f.id && { backgroundColor: C.goldLight, borderColor: C.gold }]}
              onPress={() => setFizikselFiltre(fizikselFiltre === f.id ? null : f.id)}>
              <Text style={styles.pillEmoji}>{f.emoji}</Text>
              <Text style={[styles.filtrePillText, fizikselFiltre === f.id && { color: C.gold, fontWeight: '700' }]}>{f.etiket}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 16, marginBottom: 8 }}>
          <Text style={styles.sonucSayisi}>{filtrelenmis.length} mekan{arama ? ` "${arama}" için` : ''}</Text>
          {(arama || altKategori || fizikselFiltre) && (
            <TouchableOpacity onPress={() => { setArama(''); setAltKategori(null); setFizikselFiltre(null); }}>
              <Text style={{ color: C.gold, fontSize: 12, fontWeight: '600' }}>Filtreleri Temizle ✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 5. Bağlantı hatası bildirimi (list içinde, ama mekanlar varsa) */}
        {yuklenmeHatasi && mekanlar.length > 0 && (
          <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: C.dangerSoft, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.danger + '30' }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>⚠️</Text>
            <Text style={{ color: C.danger, fontSize: 13, flex: 1 }}>Veriler güncellenirken hata oluştu.</Text>
            <TouchableOpacity onPress={() => veriGetir(true)}>
              <Text style={{ color: C.danger, fontWeight: '700', fontSize: 13 }}>Yenile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MEKAN LİSTESİ */}
        {yukleniyor ? (
          <ActivityIndicator size="large" color={C.midnight} style={{ marginTop: 60 }} />
        ) : (
          <View style={[styles.kartGrid, IS_DESKTOP && styles.kartGridDesktop]}>
            {filtrelenmis.map((mekan, index) => (
              <MekanKarti key={mekan.id} mekan={mekan} onTeklif={teklifAc} onDetay={setSeciliDetay} romantikMod={romantikMod} index={index} kullanici={kullanici} />
            ))}
            {filtrelenmis.length === 0 && (
              <View style={styles.bosEkran}>
                <Text style={styles.bosEkranEmoji}>🔍</Text>
                <Text style={styles.bosEkranText}>Mekan bulunamadı.</Text>
                {arama && (
                  <TouchableOpacity onPress={() => setArama('')} style={{ marginTop: 12 }}>
                    <Text style={{ color: C.gold, fontWeight: '600' }}>Aramayı Temizle</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* 2. GİZLİLİK LİNKİ — Footer */}
        <TouchableOpacity
          onPress={() => setGizlilikAcik(true)}
          style={{ alignItems: 'center', padding: 20, paddingTop: 8 }}>
          <Text style={{ color: C.textSoft, fontSize: 12 }}>
            🔒 <Text style={{ textDecorationLine: 'underline' }}>Gizlilik Politikası</Text> · KVKK
          </Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── STİLLER ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container:           { flex: 1 },
  toast:               { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 999, backgroundColor: C.successSoft, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.success + '40' },
  toastText:           { color: C.success, fontWeight: '600', textAlign: 'center', fontSize: 14 },
  header:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  logo:                { fontSize: 26, fontWeight: '800', color: C.midnight, letterSpacing: -1 },
  logoText:            { fontSize: IS_DESKTOP ? 21 : 17, fontWeight: '700', color: C.midnight, letterSpacing: -0.6 },
  logoTextDesktop:     { fontSize: 23, letterSpacing: -0.8 },
  logoEtkin:           { color: C.midnight, fontWeight: '500' },
  logoLink:            { color: C.gold, fontWeight: '800' },
  slogan:              { fontSize: 11, color: C.midnight, marginTop: 2, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '500', opacity: 0.45 },
  banner:              { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1, gap: 12, marginBottom: 4 },
  bannerEmoji:         { fontSize: 24 },
  bannerBaslik:        { fontSize: 15, fontWeight: '700' },
  bannerAlt:           { fontSize: 12, color: C.textSoft, marginTop: 2 },
  aramaContainer:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  aramaIcon:           { fontSize: 18, marginRight: 8, color: C.textSoft },
  aramaInput:          { flex: 1, height: 52, color: C.text, fontSize: 15 },
  aramaOneriContainer: { backgroundColor: C.white, borderRadius: 14, marginTop: 4, borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, zIndex: 100 },
  aramaOneriItem:      { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 },
  aramaOneriIcon:      { fontSize: 16 },
  aramaOneriText:      { fontSize: 14, color: C.text, fontWeight: '500' },
  pillsContainer:      { marginTop: 14 },
  pill:                { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  pillEmoji:           { fontSize: 14 },
  pillText:            { color: C.textMid, fontSize: 13, fontWeight: '500' },
  filtrePill:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 50, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  filtrePillText:      { color: C.textSoft, fontSize: 12 },
  sonucSayisi:         { color: C.textSoft, fontSize: 12 },
  kartGrid:            { paddingHorizontal: 16, gap: 20 },
  kartGridDesktop:     { flexDirection: 'row', flexWrap: 'wrap', gap: 24, paddingHorizontal: 24 },
  kart:                { backgroundColor: C.white, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16 },
  kartDesktop:         { width: IS_DESKTOP ? '47%' : '100%' },
  kartGorsel:          { width: '100%', height: 220 },
  puanBadge:           { position: 'absolute', top: 14, right: 14, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  puanText:            { color: C.white, fontSize: 12, fontWeight: '700' },
  oneCikanBadge:       { position: 'absolute', top: 14, left: 14, backgroundColor: C.midnight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  oneCikanText:        { color: C.white, fontSize: 11, fontWeight: '600' },
  galeriBadge:         { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  galeriBadgeText:     { color: C.white, fontSize: 11, fontWeight: '600' },
  kartIcerik:          { padding: 18 },
  kartBaslikRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  kartIsim:            { fontSize: 17, fontWeight: '700', color: C.text, flex: 1, letterSpacing: -0.3 },
  kartSehir:           { fontSize: 12, color: C.textSoft, marginTop: 3 },
  fiyatBadge:          { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, marginLeft: 8 },
  fiyatText:           { fontSize: 12, fontWeight: '700' },
  kapasiteText:        { fontSize: 13, color: C.textMid, marginBottom: 4 },
  ozellikChip:         { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6, borderWidth: 1 },
  ozellikChipText:     { fontSize: 12, fontWeight: '500' },
  teknikRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  teknikChip:          { backgroundColor: C.midnight + '08', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: C.midnight + '15' },
  teknikChipText:      { fontSize: 11, color: C.midnight, fontWeight: '500' },
  ikonRow:             { flexDirection: 'row', gap: 12, marginBottom: 14 },
  ikonText:            { fontSize: 12, color: C.textSoft },
  detayBtn:            { borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, paddingHorizontal: 16 },
  detayBtnText:        { fontSize: 14, fontWeight: '600' },
  teklifBtn:           { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  teklifBtnText:       { color: C.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  modalOverlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999, justifyContent: 'flex-end' },
  modal:               { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, borderTopWidth: 3, borderTopColor: C.gold },
  modalBar:            { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalBaslik:         { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
  modalAlt:            { fontSize: 14, color: C.textSoft, marginBottom: 24 },
  formInput:           { backgroundColor: C.bg, borderRadius: 12, padding: 16, color: C.text, marginBottom: 12, borderWidth: 1, borderColor: C.border, fontSize: 15 },
  formBaslik:          { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 20 },
  inputEtiket:         { fontSize: 13, color: C.textMid, marginBottom: 6, fontWeight: '500' },
  yukleBtn:            { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  yukleBtnText:        { color: C.white, fontSize: 14, fontWeight: '700' },
  adminHeader:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  statRow:             { flexDirection: 'row', padding: 16, gap: 6 },
  statKart:            { flex: 1, backgroundColor: C.white, borderRadius: 14, padding: 10, alignItems: 'center', borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
  statSayi:            { fontSize: 28, fontWeight: '800' },
  statEtiket:          { fontSize: 10, color: C.textSoft, marginTop: 2, textAlign: 'center' },
  tabRow:              { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  tabBtn:              { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: C.white, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  tabBtnText:          { color: C.textMid, fontSize: 12, fontWeight: '600' },
  adminKart:           { backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'flex-start' },
  adminKartIsim:       { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
  adminKartDetay:      { fontSize: 13, color: C.textMid, marginBottom: 2 },
  adminKartTarih:      { fontSize: 11, color: C.textSoft, marginTop: 4 },
  durumBtn:            { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  durumBtnText:        { fontSize: 11, color: C.textMid, fontWeight: '600' },
  bosEkran:            { alignItems: 'center', paddingVertical: 60 },
  bosEkranEmoji:       { fontSize: 40, marginBottom: 12 },
  bosEkranText:        { color: C.textSoft, fontSize: 15 },
  geriBtnDetay:        { position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  geriBtnText:         { color: C.white, fontSize: 20, fontWeight: '700' },
  fotoDots:            { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  fotoDot:             { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  thumbnail:           { width: 70, height: 70, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  videoContainer:      { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: C.midnight + '10' },
  tamEkranOverlay:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 999, justifyContent: 'center', alignItems: 'center' },
  tamEkranGorsel:      { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.75 },
  tamEkranKapat:       { position: 'absolute', top: 40, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  tamEkranKapatText:   { color: C.white, fontSize: 18, fontWeight: '700' },
  tamEkranNavRow:      { position: 'absolute', bottom: 40, flexDirection: 'row', alignItems: 'center', gap: 24 },
  tamEkranNavBtn:      { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  tamEkranNavText:     { color: C.white, fontSize: 28, fontWeight: '700' },
  detayIcerik:         { padding: 24 },
  detayBaslikRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  detayIsim:           { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5, flex: 1 },
  detaySehir:          { fontSize: 14, color: C.textSoft, marginTop: 4 },
  hizliBilgiRow:       { flexDirection: 'row', gap: 12, marginBottom: 24 },
  hizliBilgiKart:      { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  hizliBilgiEmoji:     { fontSize: 20, marginBottom: 4 },
  hizliBilgiDeger:     { fontSize: 16, fontWeight: '800', color: C.text },
  hizliBilgiEtiket:    { fontSize: 11, color: C.textSoft, marginTop: 2 },
  detayBolum:          { marginBottom: 24 },
  detayBolumBaslik:    { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12, letterSpacing: -0.3 },
  detayAciklama:       { fontSize: 15, color: C.textMid, lineHeight: 24 },
  ozellikGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detayOzellikKart:    { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, backgroundColor: C.white },
  detayOzellikText:    { fontSize: 13, fontWeight: '600' },
  teknikDetayKart:     { backgroundColor: C.midnight + '08', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.midnight + '15' },
  teknikDetayText:     { fontSize: 13, color: C.midnight, fontWeight: '500' },
  stickyCta:           { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 24, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border },
  stickyFiyat:         { fontSize: 15, fontWeight: '800' },
  stickyKapasite:      { fontSize: 12, color: C.textSoft, marginTop: 2 },
  bakiyeKart:          { margin: 16, backgroundColor: C.midnight, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center' },
  bakiyeEtiket:        { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  bakiyeMiktar:        { fontSize: 36, fontWeight: '800', color: C.gold },
  bakiyeAciklama:      { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  // 1. KVKK stilleri
  kvkkRow:             { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 10 },
  kvkkCheckbox:        { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.border, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', marginTop: 1, flexShrink: 0 },
  kvkkCheckboxAktif:   { backgroundColor: C.midnight, borderColor: C.midnight },
  kvkkCheckMark:       { color: C.white, fontSize: 13, fontWeight: '700' },
  kvkkText:            { flex: 1, fontSize: 13, lineHeight: 20 },
  kvkkTextNormal:      { color: C.textMid },
  kvkkLink:            { color: C.gold, fontWeight: '600', textDecorationLine: 'underline' },
  // 2. Gizlilik stilleri
  gizlilikTarih:       { fontSize: 12, color: C.textSoft, marginBottom: 20 },
  gizlilikBolum:       { marginBottom: 20 },
  gizlilikBaslik:      { fontSize: 15, fontWeight: '700', color: C.midnight, marginBottom: 8 },
  gizlilikIcerik:      { fontSize: 14, color: C.textMid, lineHeight: 22 },
  // 5. Hata sayfası stilleri
  hataIkonContainer:   { width: 100, height: 100, borderRadius: 50, backgroundColor: C.border, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  hataIkon:            { fontSize: 44 },
  hataBaslik:          { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 12, textAlign: 'center' },
  hataAciklama:        { fontSize: 15, color: C.textMid, textAlign: 'center', lineHeight: 22 },
});