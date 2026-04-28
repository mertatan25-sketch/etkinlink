import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
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
    if (!r.ok) {
      const errText = await r.text();
      console.log('apiFetch HTTP hata:', r.status, errText);
      return [];
    }
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
// Güvenli POST — hata durumunda { ok, error, data } döner
async function apiPostSafe(endpoint, body) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'return=representation' },
      body: JSON.stringify(body),
    });
    let json;
    try { json = await r.json(); } catch { json = null; }
    if (!r.ok) {
      const msg = json?.message || json?.error || json?.hint || `HTTP ${r.status}`;
      return { ok: false, error: msg, data: null };
    }
    return { ok: true, error: null, data: Array.isArray(json) ? json[0] : json };
  } catch (e) {
    return { ok: false, error: e.message, data: null };
  }
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
  bg: '#F5F7FA', bgCard: '#FFFFFF',
  gold: '#B8973A', goldLight: '#F0E6C8', goldSoft: '#FBF7EE',
  midnight: '#1A1F36', midnightSoft: '#2D3561',
  accent: '#0A66C2', accentSoft: '#EBF4FF',   // Kurumsal mavi aksan
  text: '#1A1A1A', textMid: '#555555', textSoft: '#999999',
  border: '#E8ECF0', romantic: '#0A66C2', romanticSoft: '#EBF4FF', // romantic artık kurumsal mavi
  success: '#2D6A4F', successSoft: '#D8F3DC', white: '#FFFFFF',
  danger: '#C0392B', dangerSoft: '#FDECEA',
  whatsapp: '#25D366',
};

const ANA_KATEGORILER = [
  { id: 'hepsi',     etiket: 'Tümü',          emoji: '✦' },
  { id: 'dis_pazarlama', etiket: 'Pazarlama & Lansman', emoji: '🚀' },
  { id: 'ic_iletisim',   etiket: 'İç İletişim & Çalışan', emoji: '👥' },
  { id: 'finansal',      etiket: 'Finansal & Stratejik', emoji: '📊' },
  { id: 'kss_odulller',  etiket: 'KSS & Ödül',     emoji: '🏆' },
  { id: 'populer',       etiket: 'Öne Çıkan',       emoji: '✦' },
];

const ALT_KATEGORILER = {
  dis_pazarlama: [
    { id: 'urun_lansmanı',       etiket: 'Ürün Lansmanı',       emoji: '🚀' },
    { id: 'konferans_seminer',   etiket: 'Konferans & Seminer',  emoji: '🎤' },
    { id: 'bayi_toplantisi',     etiket: 'Bayi Toplantısı',      emoji: '🤝' },
    { id: 'vip_musteri_gunu',    etiket: 'VIP Müşteri Günü',     emoji: '💎' },
    { id: 'fuar',                etiket: 'Fuar & Sergi',         emoji: '🏪' },
    { id: 'basın_toplantisi',    etiket: 'Basın Toplantısı',     emoji: '📰' },
  ],
  ic_iletisim: [
    { id: 'team_building',       etiket: 'Team Building',        emoji: '🎯' },
    { id: 'town_hall',           etiket: 'Town Hall & Motivasyon', emoji: '🏛' },
    { id: 'sirket_yildonumu',    etiket: 'Şirket Yıldönümü',     emoji: '🎊' },
    { id: 'egitim_calistay',     etiket: 'Eğitim & Çalıştay',    emoji: '📚' },
    { id: 'yilsonu_yemegi',      etiket: 'Yılsonu Yemeği',       emoji: '🍽' },
    { id: 'issagliği_refahı',    etiket: 'Çalışan Refahı',       emoji: '🌿' },
  ],
  finansal: [
    { id: 'ipo_roadshow',        etiket: 'IPO & Roadshow',       emoji: '📈' },
    { id: 'yillik_genel_kurul',  etiket: 'Genel Kurul',          emoji: '⚖️' },
    { id: 'yatirimci_toplantisi', etiket: 'Yatırımcı Toplantısı', emoji: '💼' },
    { id: 'stratejik_ortaklik',  etiket: 'Stratejik Ortaklık',   emoji: '🔗' },
  ],
  kss_odulller: [
    { id: 'surdurulebilirlik',   etiket: 'Sürdürülebilirlik & KSS', emoji: '🌍' },
    { id: 'odul_toreni',         etiket: 'Ödül Töreni',           emoji: '🏆' },
    { id: 'sponsorluk',          etiket: 'Sponsorluk Etkinliği',  emoji: '🤲' },
    { id: 'zirve_panel',         etiket: 'Zirve & Panel',         emoji: '⭐' },
  ],
};

const ILETISIM_TURLERI = [
  { id: 'form',     etiket: 'Teklif Formu', emoji: '📋', renk: C.midnight },
  { id: 'whatsapp', etiket: 'WhatsApp',     emoji: '💬', renk: '#25D366' },
  { id: 'telefon',  etiket: 'Telefon',      emoji: '📞', renk: '#2D3561' },
  { id: 'email',    etiket: 'E-posta',      emoji: '📧', renk: '#0A66C2' },
];

const FIZIKSEL_FILTRELER = [
  { id: 'Konferans Salonu', etiket: 'Konferans Salonu', emoji: '🎤' },
  { id: 'Brifing Odası',    etiket: 'Brifing Odası',    emoji: '📋' },
  { id: 'Teras',            etiket: 'Teras',            emoji: '🌅' },
  { id: 'Bahçe',            etiket: 'Bahçe',            emoji: '🌿' },
  { id: 'Gala Salonu',      etiket: 'Gala Salonu',      emoji: '✨' },
  { id: 'Hibrit Uyumlu',    etiket: 'Hibrit Uyumlu',    emoji: '💻' },
];

const TEKNIK_FILTRELER = [
  { id: 'Simultane Çeviri', etiket: 'Simultane Çeviri', emoji: '🗣' },
  { id: 'LED Ekran',        etiket: 'LED Ekran',         emoji: '📺' },
  { id: 'Hızlı WiFi',       etiket: 'Hızlı WiFi',        emoji: '📶' },
  { id: 'Canlı Yayın',      etiket: 'Canlı Yayın',       emoji: '📡' },
  { id: 'Projeksiyon',      etiket: 'Projeksiyon',        emoji: '🎥' },
  { id: 'Ses Sistemi',      etiket: 'Ses Sistemi',        emoji: '🔊' },
];

const ARAMA_ONERILERI = [
  'İstanbul ürün lansmanı', 'Ankara konferans', 'İzmir team building',
  'İstanbul genel kurul', 'Antalya bayi toplantısı', 'İstanbul VIP müşteri',
  'İstanbul IPO roadshow', 'Ankara ödül töreni', 'İstanbul zirve',
  'İzmir eğitim çalıştay', 'İstanbul gala gecesi', 'Ankara motivasyon toplantısı',
];

// ── YARDIMCI FONKSİYONLAR ───────────────────────────────
async function fotografYukle(setUrl, setYukleniyor) {
  if (Platform.OS !== 'web') {
    alert('Fotoğraf yüklemek için URL yapıştırın veya web tarayıcısını kullanın.');
    return;
  }
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Fotoğraf 5MB\'dan küçük olmalı!'); return; }
    setYukleniyor(true);
    try {
      const dosyaAdi = `mekan_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/mekan-fotograflar/${dosyaAdi}`,
        { method: 'POST', headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': file.type, 'x-upsert': 'true' }, body: file }
      );
      if (response.ok) {
        setUrl(`${SUPABASE_URL}/storage/v1/object/public/mekan-fotograflar/${dosyaAdi}`);
        alert('✅ Fotoğraf yüklendi!');
      } else {
        const errText = await response.text();
        alert('Yükleme hatası: ' + errText);
      }
    } catch (err) { alert('Hata: ' + err.message); }
    setYukleniyor(false);
  };
  input.click();
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

// ── 6. SEO META TAG YÖNETİMİ ─────────────────────────────
function seoGuncelle({ title, description, image } = {}) {
  if (Platform.OS !== 'web') return;
  const siteName = 'etkinlink';
  const defaultTitle = 'etkinlink — Kurumsal etkinlikleriniz için doğru mekan';
  const defaultDesc = 'Ürün lansmanı, konferans, team building, genel kurul ve daha fazlası için Türkiye\'nin seçkin kurumsal mekanlarını keşfet. Ücretsiz teklif al.';
  const defaultImage = 'https://svaqquywnidqecbcwaqe.supabase.co/storage/v1/object/public/mekan-fotograflar/og-default.jpg';

  const t = title ? `${title} | ${siteName}` : defaultTitle;
  const d = description || defaultDesc;
  const img = image || defaultImage;

  document.title = t;

  const setMeta = (sel, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement('meta'); const attr = sel.includes('property') ? sel.match(/"([^"]+)"/)[1] : sel.match(/"([^"]+)"/)[1]; el.setAttribute(sel.includes('property') ? 'property' : 'name', attr); document.head.appendChild(el); }
    el.setAttribute('content', val);
  };

  setMeta('meta[name="description"]', d);
  setMeta('meta[property="og:title"]', t);
  setMeta('meta[property="og:description"]', d);
  setMeta('meta[property="og:image"]', img);
  setMeta('meta[property="og:type"]', 'website');
  setMeta('meta[property="og:site_name"]', siteName);
  setMeta('meta[name="twitter:card"]', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', t);
  setMeta('meta[name="twitter:description"]', d);
  setMeta('meta[name="twitter:image"]', img);
}

// ── LOGO BİLEŞENİ (Gerçek logo görseli) ─────────────────
const ETKINLINK_LOGO = require('./assets/logo_etkinlink2.png');

function EtkinlinkLogo({ size = 36 }) {
  const s = size;
  if (Platform.OS === 'web') {
    return (
      <img
        src={ETKINLINK_LOGO}
        alt="etkinlink logo"
        style={{
          width: s,
          height: s,
          borderRadius: Math.round(s * 0.26),
          objectFit: 'contain',
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }
  return (
    <Image
      source={ETKINLINK_LOGO}
      style={{
        width: s,
        height: s,
        borderRadius: Math.round(s * 0.26),
      }}
      resizeMode="contain"
    />
  );
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
              icerik: 'Platformumuzda teklif formu doldurduğunuzda şu bilgileri topluyoruz:\n\n• Ad ve soyadınız\n• Firma / Şirket adınız (opsiyonel)\n• Telefon numaranız\n• E-posta adresiniz (opsiyonel)\n• Etkinlik tarihi, türü ve katılımcı sayısı\n• Teknik gereksinimler ve özel istekler',
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
              icerik: 'KVKK kapsamındaki haklarınızı kullanmak veya sorularınız için bizimle iletişime geçebilirsiniz:\n\nE-posta: mert.atan@etkinlink.tech\nAdres: İstanbul, Türkiye',
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
          <Text style={{ color: C.gold }}>mert.atan@etkinlink.tech</Text> adresine yazın.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

// ── ARAMA ÇUBUĞU ─────────────────────────────────────────
function AramaCubugu({ arama, setArama }) {
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
  const isRomantik = false; // Kurumsal platform
  const tur = mekan.iletisim_turu || 'form';

  function iletisimKur() {
    const numara = (mekan.iletisim_numarasi || '').replace(/\D/g, '');
    const mekanAdi = mekan.isim;
    if (tur === 'whatsapp' && numara) {
      const mesaj = mekan.whatsapp_mesaj_sablonu ||
        `Merhaba! etkinlink üzerinden ${mekanAdi} için kurumsal etkinlik teklifi almak istiyorum.`;
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

  const bgRenk = tur === 'whatsapp' ? C.whatsapp
    : tur === 'telefon' ? C.midnight
    : tur === 'email' ? C.midnightSoft
    : C.midnight;

  const butonYazi = tur === 'whatsapp' ? '💬 WhatsApp\'tan Yaz'
    : tur === 'telefon' ? '📞 Hemen Ara'
    : tur === 'email' ? '📧 E-posta Gönder'
    : '📋 Teklif Talebi Al';

  return (
    <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: bgRenk }, style]} onPress={iletisimKur}>
      <Text style={styles.teklifBtnText}>{butonYazi}</Text>
    </TouchableOpacity>
  );
}

// ── KULLANICI GİRİŞ/KAYIT ────────────────────────────────
function KullaniciGirisEkrani({ onGiris, onKapat, onGizlilikAc }) {
  const [mod, setMod] = useState('giris');
  const [adSoyad, setAdSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [kvkkHata, setKvkkHata] = useState(false);
  const [sifreSifirlamaModu, setSifreSifirlamaModu] = useState(false);
  const [sifreSifirlamaGonderildi, setSifreSifirlamaGonderildi] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  }, []);

  function temizTelefon(tel) {
    return tel.replace(/\s|-|\(|\)/g, '').trim();
  }

  async function girisYap() {
    if (!email.trim()) { setHata('E-posta zorunlu!'); return; }
    if (!sifre) { setHata('Şifre zorunlu!'); return; }
    setYukleniyor(true); setHata('');
    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: sifre,
      });
      if (authErr) {
        if (authErr.message.includes('Invalid login')) {
          setHata('E-posta veya şifre hatalı.');
        } else if (authErr.message.includes('Email not confirmed')) {
          setHata('E-postanızı doğrulamanız gerekiyor. Gelen kutunuzu kontrol edin.');
        } else {
          setHata('Giriş hatası: ' + authErr.message);
        }
        setYukleniyor(false); return;
      }
      // auth_id ile kullanicilar tablosundan profil çek
      const profil = await apiFetch(`kullanicilar?auth_id=eq.${authData.user.id}&select=*`);
      if (Array.isArray(profil) && profil[0]) {
        onGiris(profil[0]);
      } else {
        // Profil yoksa oluştur (ilk giriş senaryosu)
        const { ok, data } = await apiPostSafe('kullanicilar', {
          auth_id: authData.user.id,
          ad_soyad: authData.user.user_metadata?.ad_soyad || email.split('@')[0],
          email: email.trim().toLowerCase(),
          telefon: null,
          telefon_dogrulandi: false,
        });
        if (ok && data) onGiris(data);
        else onGiris({ id: authData.user.id, auth_id: authData.user.id, ad_soyad: email.split('@')[0], email: email.trim().toLowerCase() });
      }
    } catch (e) {
      setHata('Bağlantı hatası: ' + e.message);
    }
    setYukleniyor(false);
  }

  async function kayitOl() {
    if (!adSoyad.trim()) { setHata('Ad soyad zorunlu!'); return; }
    if (!email.trim() || !email.includes('@')) { setHata('Geçerli bir e-posta adresi girin.'); return; }
    if (!sifre || sifre.length < 6) { setHata('Şifre en az 6 karakter olmalı!'); return; }
    if (!kvkkOnay) { setKvkkHata(true); return; }
    setKvkkHata(false);
    setYukleniyor(true); setHata('');
    try {
      const tel = temizTelefon(telefon);
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: sifre,
        options: { data: { ad_soyad: adSoyad.trim() } },
      });
      if (authErr) {
        if (
          authErr.message.includes('already registered') ||
          authErr.message.includes('User already registered')
        ) {
          // Kayıtlı ama doğrulanmamış olabilir — giriş yapmayı dene
          const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: sifre,
          });
          if (!loginErr && loginData?.user) {
            // Giriş başarılı — profil çek veya oluştur
            const profil = await apiFetch(`kullanicilar?auth_id=eq.${loginData.user.id}&select=*`);
            if (Array.isArray(profil) && profil[0]) {
              onGiris(profil[0]); setYukleniyor(false); return;
            }
            // Profil yoksa ekle
            const { ok, data: pd } = await apiPostSafe('kullanicilar', {
              auth_id: loginData.user.id,
              ad_soyad: adSoyad.trim(),
              email: email.trim().toLowerCase(),
              telefon: tel || null,
              telefon_dogrulandi: false,
            });
            onGiris(pd || { id: loginData.user.id, auth_id: loginData.user.id, ad_soyad: adSoyad.trim(), email: email.trim().toLowerCase() });
            setYukleniyor(false); return;
          } else if (loginErr?.message?.includes('Email not confirmed')) {
            setHata('Bu e-posta kayıtlı ama henüz doğrulanmamış. Gelen kutunuzu kontrol edin veya farklı bir e-posta deneyin.');
          } else {
            setHata('Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.');
          }
        } else {
          setHata('Kayıt hatası: ' + authErr.message);
        }
        setYukleniyor(false); return;
      }
      if (!authData.user) {
        setHata('Kayıt oluşturulamadı. Lütfen tekrar deneyin.');
        setYukleniyor(false); return;
      }
      // kullanicilar tablosuna profil ekle
      const { ok, error: profilErr, data: profilData } = await apiPostSafe('kullanicilar', {
        auth_id: authData.user.id,
        ad_soyad: adSoyad.trim(),
        email: email.trim().toLowerCase(),
        telefon: tel || null,
        telefon_dogrulandi: false,
      });
      if (!ok) {
        // Profil eklenemese bile auth başarılı — devam et
        console.log('Profil kayıt hatası:', profilErr);
      }
      // E-posta doğrulama gerekiyor mu kontrol et
      if (authData.session) {
        // Doğrulama gerekmedi, direkt giriş
        const kullanici = profilData || {
          id: authData.user.id, auth_id: authData.user.id,
          ad_soyad: adSoyad.trim(), email: email.trim().toLowerCase(), telefon: tel || null,
        };
        onGiris(kullanici);
      } else {
        // E-posta doğrulama gerekiyor
        setHata('');
        setYukleniyor(false);
        setMod('dogrulama');
      }
    } catch (e) {
      setHata('Bağlantı hatası: ' + e.message);
    }
    setYukleniyor(false);
  }

  async function sifreSifirla() {
    if (!email.trim()) { setHata('E-posta adresinizi girin.'); return; }
    setYukleniyor(true); setHata('');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: Platform.OS === 'web' ? window.location.origin : 'https://etkinlink.tech',
    });
    setYukleniyor(false);
    if (error) { setHata('Hata: ' + error.message); return; }
    setSifreSifirlamaGonderildi(true);
  }

  // Şifre sıfırlama ekranı
  if (sifreSifirlamaModu) {
    return (
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }], maxHeight: '90%' }]}>
          <View style={[styles.modalBar, { backgroundColor: C.gold }]} />
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => { setSifreSifirlamaModu(false); setSifreSifirlamaGonderildi(false); setHata(''); }}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: C.midnight, marginRight: 6 }}>←</Text>
              <Text style={{ fontSize: 13, color: C.midnight, fontWeight: '600' }}>Geri Dön</Text>
            </TouchableOpacity>
            <Text style={[styles.modalBaslik, { textAlign: 'center' }]}>🔑 Şifre Sıfırla</Text>
            {sifreSifirlamaGonderildi ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 40, marginBottom: 16 }}>📧</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.success, marginBottom: 8 }}>E-posta Gönderildi!</Text>
                <Text style={{ color: C.textMid, textAlign: 'center', lineHeight: 22, fontSize: 14, marginBottom: 24 }}>
                  <Text style={{ fontWeight: '700' }}>{email}</Text> adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunuzu ve spam klasörünüzü kontrol edin.
                </Text>
                <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight, paddingHorizontal: 32 }]}
                  onPress={() => { setSifreSifirlamaModu(false); setSifreSifirlamaGonderildi(false); }}>
                  <Text style={styles.teklifBtnText}>Giriş Sayfasına Dön</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={{ color: C.textMid, textAlign: 'center', marginBottom: 20, fontSize: 14, lineHeight: 20 }}>
                  Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
                </Text>
                <TextInput style={styles.formInput} placeholder="E-posta *" placeholderTextColor={C.textSoft}
                  value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                {hata ? <Text style={{ color: C.danger, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{hata}</Text> : null}
                <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={sifreSifirla} disabled={yukleniyor}>
                  <Text style={styles.teklifBtnText}>{yukleniyor ? 'Gönderiliyor...' : '📧 Sıfırlama Bağlantısı Gönder'}</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={onKapat} style={{ marginTop: 14, alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: C.textSoft, fontSize: 14 }}>Kapat</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  // E-posta doğrulama bekleniyor ekranı
  if (mod === 'dogrulama') {
    return (
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
          <View style={[styles.modalBar, { backgroundColor: C.gold }]} />
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📧</Text>
            <Text style={[styles.modalBaslik, { textAlign: 'center' }]}>E-postanızı Doğrulayın</Text>
            <Text style={{ color: C.textMid, textAlign: 'center', lineHeight: 22, fontSize: 14, marginBottom: 8 }}>
              <Text style={{ fontWeight: '700' }}>{email}</Text> adresine doğrulama e-postası gönderdik.
            </Text>
            <Text style={{ color: C.textSoft, textAlign: 'center', fontSize: 13, marginBottom: 24, paddingHorizontal: 8 }}>
              E-postayı onayladıktan sonra aşağıdan giriş yapabilirsiniz.{'\n'}
              Spam/junk klasörünü de kontrol edin.
            </Text>
            <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight, paddingHorizontal: 32, marginBottom: 12 }]}
              onPress={() => setMod('giris')}>
              <Text style={styles.teklifBtnText}>🔐 Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() });
                alert(error ? 'Hata: ' + error.message : '✅ Doğrulama e-postası tekrar gönderildi!');
              }}
              style={{ paddingVertical: 10 }}>
              <Text style={{ color: C.gold, fontSize: 13, fontWeight: '600' }}>E-postayı tekrar gönder →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onKapat} style={{ marginTop: 4, alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: C.textSoft, fontSize: 14 }}>Kapat</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.modalOverlay}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }], maxHeight: '94%' }]}>
        <View style={[styles.modalBar, { backgroundColor: C.gold }]} />
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalBaslik}>{mod === 'giris' ? '👤 Giriş Yap' : '👤 Kayıt Ol'}</Text>
          <Text style={styles.modalAlt}>Teklif almak ve başvurularınızı takip etmek için</Text>

          {/* Tab */}
          <View style={{ flexDirection: 'row', backgroundColor: C.border, borderRadius: 12, padding: 3, marginBottom: 20 }}>
            {[{ id: 'giris', etiket: 'Giriş Yap' }, { id: 'kayit', etiket: 'Kayıt Ol' }].map(t => (
              <TouchableOpacity key={t.id}
                style={[{ flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' }, mod === t.id && { backgroundColor: C.white }]}
                onPress={() => { setMod(t.id); setHata(''); setKvkkHata(false); }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: mod === t.id ? C.midnight : C.textSoft }}>{t.etiket}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Kayıt: ek alanlar */}
          {mod === 'kayit' && (
            <>
              <TextInput style={styles.formInput} placeholder="Ad Soyad *" placeholderTextColor={C.textSoft}
                value={adSoyad} onChangeText={setAdSoyad} />
              <TextInput style={styles.formInput} placeholder="Telefon (opsiyonel)" placeholderTextColor={C.textSoft}
                value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
            </>
          )}

          {/* Ortak: e-posta */}
          <TextInput style={styles.formInput} placeholder="E-posta *" placeholderTextColor={C.textSoft}
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          {/* Ortak: şifre */}
          <View style={{ position: 'relative', marginBottom: 0 }}>
            <TextInput style={[styles.formInput, { paddingRight: 48 }]}
              placeholder={mod === 'giris' ? 'Şifre *' : 'Şifre * (en az 6 karakter)'}
              placeholderTextColor={C.textSoft}
              value={sifre} onChangeText={setSifre}
              secureTextEntry={!sifreGoster} />
            <TouchableOpacity
              onPress={() => setSifreGoster(g => !g)}
              style={{ position: 'absolute', right: 14, top: 14 }}>
              <Text style={{ fontSize: 18 }}>{sifreGoster ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Şifremi unuttum */}
          {mod === 'giris' && (
            <TouchableOpacity
              onPress={() => { setSifreSifirlamaModu(true); setHata(''); }}
              style={{ alignSelf: 'flex-end', marginBottom: 16, marginTop: 6 }}>
              <Text style={{ color: C.gold, fontSize: 13, fontWeight: '600' }}>Şifremi unuttum →</Text>
            </TouchableOpacity>
          )}

          {/* Hata */}
          {hata ? (
            <View style={{ backgroundColor: C.dangerSoft, borderRadius: 10, padding: 12, marginBottom: 12, marginTop: 8, borderWidth: 1, borderColor: C.danger + '40' }}>
              <Text style={{ color: C.danger, fontSize: 13, textAlign: 'center' }}>{hata}</Text>
            </View>
          ) : null}

          {/* KVKK */}
          {mod === 'kayit' && (
            <>
              <KVKKOnayKutusu
                onayVerildi={kvkkOnay}
                setOnayVerildi={(val) => { setKvkkOnay(val); if (val) setKvkkHata(false); }}
                onGizlilikAc={onGizlilikAc || (() => {})}
              />
              {kvkkHata && (
                <Text style={{ color: C.danger, fontSize: 12, marginBottom: 10, marginTop: -4 }}>
                  ⚠️ Devam etmek için gizlilik politikasını onaylamanız gerekiyor.
                </Text>
              )}
            </>
          )}

          <TouchableOpacity
            style={[styles.teklifBtn, { backgroundColor: C.midnight, marginTop: 4 }]}
            onPress={mod === 'giris' ? girisYap : kayitOl}
            disabled={yukleniyor}>
            <Text style={styles.teklifBtnText}>
              {yukleniyor ? 'Lütfen bekleyin...' : mod === 'giris' ? '🔐 Giriş Yap' : '✓ Kayıt Ol'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onKapat} style={{ marginTop: 14, alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}


// ── KULLANICI PANELİ ──────────────────────────────────────
function KullaniciPaneli({ kullanici, onKapat, onCikis, onGizlilikAc, favorilerDis, karsilastirmaListesiDis, onFavoriKaldir, onKarsilastirmaGuncelle }) {
  const [basvurular, setBasvurular] = useState([]);
  const [favoriMekanlar, setFavoriMekanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenileniyor, setYenileniyor] = useState(false);
  const [aktifTab, setAktifTab] = useState('basvurular');

  // App'taki global state'i doğrudan kullanalım (prop olarak geliyor)
  const favoriler = favorilerDis || [];
  const karsilastirmaListesi = karsilastirmaListesiDis || [];

  useEffect(() => {
    veriGetir();
  }, []);

  useEffect(() => {
    if (favoriler.length > 0) {
      favoriMekanGetir();
    } else {
      setFavoriMekanlar([]);
    }
  }, [favoriler]);

  async function favoriMekanGetir() {
    if (favoriler.length === 0) return;
    const idler = favoriler.join(',');
    const data = await apiFetch(`mekanlar?id=in.(${idler})&select=*`);
    setFavoriMekanlar(Array.isArray(data) ? data : []);
  }

  async function veriGetir(yenile = false) {
    if (yenile) setYenileniyor(true); else setYukleniyor(true);
    const data = await apiFetch(`leads?kullanici_id=eq.${kullanici.id}&select=*&order=created_at.desc`);
    setBasvurular(Array.isArray(data) ? data : []);
    setYukleniyor(false);
    setYenileniyor(false);
  }

  function favoriKaldir(mekanId) {
    // App'taki favoriToggle'ı çağır — App state'ini günceller ve localStorage'a yazar
    if (onFavoriKaldir) onFavoriKaldir(mekanId);
  }

  function karsilastirmadanKaldir(mekan) {
    const yeni = karsilastirmaListesi.filter(m => m.id !== mekan.id);
    if (onKarsilastirmaGuncelle) {
      onKarsilastirmaGuncelle(yeni);
      if (Platform.OS === 'web') {
        try {
          const key = `etkinlink_karsilastirma_${kullanici.id}`;
          localStorage.setItem(key, JSON.stringify(yeni));
        } catch(e) {}
      }
    }
  }

  function karsilastirmaListesiTemizle() {
    if (onKarsilastirmaGuncelle) {
      onKarsilastirmaGuncelle([]);
      if (Platform.OS === 'web') {
        try { localStorage.removeItem(`etkinlink_karsilastirma_${kullanici.id}`); } catch(e) {}
      }
    }
  }

  const durumRenk = (d) => d === 'tamamlandı' ? C.success : d === 'aranıyor' ? C.gold : C.textSoft;
  const durumEmoji = (d) => d === 'tamamlandı' ? '✅' : d === 'aranıyor' ? '📞' : '⏳';

  // Karşılaştırma tablosu bileşeni
  const KarsilastirmaTablosu = () => {
    if (karsilastirmaListesi.length === 0) {
      return (
        <View style={styles.bosEkran}>
          <Text style={styles.bosEkranEmoji}>⚖️</Text>
          <Text style={styles.bosEkranText}>Karşılaştırma listesi boş.</Text>
          <Text style={{ color: C.textSoft, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
            Mekan kartlarındaki "Karşılaştırmaya Ekle" butonunu kullanın.
          </Text>
        </View>
      );
    }
    const alanlar = [
      { key: 'kapasite',    label: '👥 Kapasite', fmt: v => v ? `${v} kişi` : '—' },
      { key: 'fiyat_aralik',label: '💰 Fiyat',    fmt: v => v || '—' },
      { key: 'puan',        label: '★ Puan',       fmt: v => v ? String(v) : '—' },
      { key: 'sehir',       label: '📍 Şehir',     fmt: v => v || '—' },
    ];
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ padding: 4 }}>
          {/* Mekan başlıkları */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={{ width: 100 }} />
            {karsilastirmaListesi.map((m, i) => (
              <View key={i} style={{ width: 130, alignItems: 'center' }}>
                <Image source={{ uri: m.fotograf_url }} style={{ width: 130, height: 80, borderRadius: 12 }} resizeMode="cover" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center', marginTop: 6, lineHeight: 16 }} numberOfLines={2}>{m.isim}</Text>
                <TouchableOpacity
                  onPress={() => karsilastirmadanKaldir(m)}
                  style={{ marginTop: 6, backgroundColor: C.dangerSoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 11, color: C.danger, fontWeight: '600' }}>✕ Çıkar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* Karşılaştırma satırları */}
          {alanlar.map((alan, ai) => (
            <View key={ai} style={{ flexDirection: 'row', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, alignItems: 'center' }}>
              <Text style={{ width: 100, fontSize: 12, color: C.textSoft, fontWeight: '600' }}>{alan.label}</Text>
              {karsilastirmaListesi.map((m, mi) => {
                const isNum = alan.key === 'kapasite' || alan.key === 'puan';
                const best = isNum ? Math.max(...karsilastirmaListesi.map(x => Number(x[alan.key]) || 0)) : null;
                const isBest = isNum && Number(m[alan.key]) === best && best > 0;
                return (
                  <View key={mi} style={{ width: 130, alignItems: 'center', backgroundColor: isBest ? C.gold + '15' : C.bg, borderRadius: 8, padding: 8 }}>
                    <Text style={{ fontSize: 13, fontWeight: isBest ? '700' : '500', color: isBest ? C.gold : C.text, textAlign: 'center' }}>
                      {alan.fmt(m[alan.key])}
                    </Text>
                    {isBest && <Text style={{ fontSize: 9, color: C.gold, fontWeight: '700', marginTop: 2 }}>EN İYİ ✓</Text>}
                  </View>
                );
              })}
            </View>
          ))}
          {/* Özellikler satırı */}
          <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, alignItems: 'flex-start' }}>
            <Text style={{ width: 100, fontSize: 12, color: C.textSoft, fontWeight: '600' }}>🏷️ Özellikler</Text>
            {karsilastirmaListesi.map((m, mi) => (
              <View key={mi} style={{ width: 130 }}>
                {(m.fiziksel_ozellikler || []).slice(0, 3).map((o, oi) => (
                  <View key={oi} style={{ backgroundColor: C.goldSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 4, borderWidth: 1, borderColor: C.goldLight }}>
                    <Text style={{ fontSize: 10, color: C.gold, fontWeight: '600' }}>{o}</Text>
                  </View>
                ))}
                {(m.fiziksel_ozellikler || []).length === 0 && <Text style={{ fontSize: 12, color: C.textSoft }}>—</Text>}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.adminHeader}>
        <View>
          <Text style={[styles.logo, { color: C.midnight, fontSize: 20 }]}>Merhaba 👋</Text>
          <Text style={{ color: C.textSoft, fontSize: 12 }}>{kullanici.ad_soyad}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={onKapat} style={[styles.pill, { backgroundColor: C.bg }]}>
            <Text style={{ color: C.textMid, fontSize: 13 }}>← Ana Sayfa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCikis} style={[styles.pill, { backgroundColor: C.dangerSoft, borderColor: C.danger + '40' }]}>
            <Text style={{ color: C.danger, fontSize: 13, fontWeight: '600' }}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52 }}>
        <View style={[styles.tabRow, { paddingHorizontal: 16 }]}>
          {[
            { id: 'basvurular', etiket: '📋 Teklif Taleplerim' },
            { id: 'favoriler', etiket: `❤️ Beğendiklerim${favoriler.length > 0 ? ` (${favoriler.length})` : ''}` },
            { id: 'karsilastirma', etiket: `⚖️ Karşılaştır${karsilastirmaListesi.length > 0 ? ` (${karsilastirmaListesi.length})` : ''}` },
          ].map(t => (
            <TouchableOpacity key={t.id}
              style={[styles.tabBtn, { marginRight: 8, paddingHorizontal: 14 }, aktifTab === t.id && { backgroundColor: C.midnight, borderColor: C.midnight }]}
              onPress={() => setAktifTab(t.id)}>
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
        {/* BAŞVURULARIM */}
        {aktifTab === 'basvurular' && (
          <View style={{ padding: 16 }}>
            {yukleniyor
              ? <ActivityIndicator size="large" color={C.midnight} style={{ marginTop: 40 }} />
              : basvurular.length === 0
                ? (
                  <View style={styles.bosEkran}>
                    <Text style={styles.bosEkranEmoji}>📋</Text>
                    <Text style={styles.bosEkranText}>Henüz teklif talebiniz yok.</Text>
                    <Text style={{ color: C.textSoft, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                      Mekan detay sayfasından teklif alabilirsiniz.
                    </Text>
                  </View>
                )
                : basvurular.map(b => (
                  <View key={b.id} style={[styles.adminKart, { borderLeftWidth: 3, borderLeftColor: durumRenk(b.durum) }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminKartIsim}>{b.mekan_isim}</Text>
                      {b.kisi_sayisi ? <Text style={styles.adminKartDetay}>👥 {b.kisi_sayisi} katılımcı</Text> : null}
                      {b.etkinlik_tarihi ? <Text style={styles.adminKartDetay}>📅 {b.etkinlik_tarihi}</Text> : null}
                      {b.alt_kategori ? <Text style={styles.adminKartDetay}>🏢 {b.alt_kategori}</Text> : null}
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
        )}

        {/* BEĞENDİKLERİM */}
        {aktifTab === 'favoriler' && (
          <View style={{ padding: 16 }}>
            {favoriMekanlar.length === 0 ? (
              <View style={styles.bosEkran}>
                <Text style={styles.bosEkranEmoji}>❤️</Text>
                <Text style={styles.bosEkranText}>Henüz beğenilen mekan yok.</Text>
                <Text style={{ color: C.textSoft, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                  Mekan kartlarındaki ♡ butonuna tıklayarak mekanları beğenebilirsiniz.
                </Text>
              </View>
            ) : (
              favoriMekanlar.map(m => (
                <View key={m.id} style={[styles.adminKart, { flexDirection: 'column', padding: 0, overflow: 'hidden' }]}>
                  <Image source={{ uri: m.fotograf_url }} style={{ width: '100%', height: 140, borderRadius: 0 }} resizeMode="cover" />
                  <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.adminKartIsim}>{m.isim}</Text>
                        <Text style={styles.adminKartDetay}>📍 {m.sehir} · 👥 {m.kapasite} kişi</Text>
                        {m.fiyat_aralik ? <Text style={[styles.adminKartDetay, { color: C.gold, fontWeight: '700' }]}>💰 {m.fiyat_aralik}</Text> : null}
                        <Text style={{ color: C.gold, fontWeight: '600', fontSize: 12, marginTop: 2 }}>★ {m.puan}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => favoriKaldir(m.id)}
                        style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFCCCC' }}>
                        <Text style={{ fontSize: 18, color: '#FF6B6B' }}>♥</Text>
                      </TouchableOpacity>
                    </View>
                    {(m.fiziksel_ozellikler || []).length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                        {m.fiziksel_ozellikler.slice(0, 4).map((o, i) => (
                          <View key={i} style={{ backgroundColor: C.goldSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: C.goldLight }}>
                            <Text style={{ fontSize: 11, color: C.gold, fontWeight: '600' }}>{o}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* KARŞILAŞTIRMA */}
        {aktifTab === 'karsilastirma' && (
          <View style={{ padding: 16 }}>
            {karsilastirmaListesi.length > 1 && (
              <View style={{ backgroundColor: C.goldSoft, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: C.goldLight }}>
                <Text style={{ color: C.gold, fontWeight: '700', fontSize: 13 }}>
                  ⚖️ {karsilastirmaListesi.length} mekan karşılaştırılıyor
                </Text>
                <Text style={{ color: C.textMid, fontSize: 12, marginTop: 4 }}>
                  En iyi değerler altın rengiyle vurgulanmıştır.
                </Text>
              </View>
            )}
            <KarsilastirmaTablosu />
            {karsilastirmaListesi.length > 0 && (
              <TouchableOpacity
                onPress={karsilastirmaListesiTemizle}
                style={{ marginTop: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                <Text style={{ color: C.textMid, fontSize: 13, fontWeight: '600' }}>🗑️ Listeyi Temizle</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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
      redirectTo: 'https://etkinlink.tech/sifre-sifirla',
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
          <Text style={[styles.logoText, { textAlign: 'center', fontSize: 28, color: C.midnight, marginBottom: 4 }]}>etkinlink</Text>
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
              <Text style={{ color: C.textMid, fontSize: 13 }}>Kayıt olduğunuzda <Text style={{ fontWeight: '700', color: C.gold }}>250 ₺</Text> hediye bakiye ve öncelikli listeleme avantajı kazanın.</Text>
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
  const [anaKat, setAnaKat] = useState('dis_pazarlama');
  const [altKat, setAltKat] = useState('konferans_seminer'); // kurumsal varsayılan
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
      fotograf_url: foto || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
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
          { label: 'Mekan Adı *', val: isim, set: setIsim, ph: 'İstanbul Convention Center' },
          { label: 'Şehir *', val: sehir, set: setSehir, ph: 'İstanbul' },
          { label: 'Kapasite *', val: kapasite, set: setKapasite, ph: '500', kb: 'numeric' },
          { label: 'Fiyat Aralığı', val: fiyat, set: setFiyat, ph: '100.000₺ - 500.000₺' },
          { label: 'Video URL (YouTube)', val: video, set: setVideo, ph: 'https://youtube.com/...' },
          { label: 'Fiziksel Özellikler (virgülle)', val: ozellik, set: setOzellik, ph: 'Konferans Salonu, Gala Salonu, Hibrit Uyumlu' },
          { label: 'Teknik Altyapı (virgülle)', val: teknik, set: setTeknik, ph: 'LED Ekran, Simultane Çeviri, Hızlı WiFi' },
        ].map((f, i) => (
          <View key={i}>
            <Text style={styles.inputEtiket}>{f.label}</Text>
            <TextInput style={styles.formInput} placeholder={f.ph} placeholderTextColor={C.textSoft} value={f.val} onChangeText={f.set} keyboardType={f.kb || 'default'} />
          </View>
        ))}
        <Text style={styles.inputEtiket}>Açıklama</Text>
        <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Kurumsal etkinlikler için mekanınızı tanıtın..." placeholderTextColor={C.textSoft} value={aciklama} onChangeText={setAciklama} multiline />

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

    // sahip_id ile eşleşen leadler
    const { data: leadsBySahip } = await supabase
      .from('leads').select('*')
      .eq('sahip_id', kullanici.id)
      .order('created_at', { ascending: false });

    // mekan_id ile eşleşen leadler (sahip_id null olabilir)
    let leadsByMekan = [];
    if (mekanIdleri.length > 0) {
      const { data } = await supabase
        .from('leads').select('*')
        .in('mekan_id', mekanIdleri)
        .order('created_at', { ascending: false });
      leadsByMekan = data || [];
    }

    // Tekil birleştir
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
              <Text style={styles.teklifBtnText}>🏢 Yeni Mekan Ekle</Text>
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
    <View style={[styles.adminKart, bekliyor && { borderColor: C.gold, borderWidth: 1.5 }, { flexDirection: 'column' }]}>
      {/* Başlık satırı */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
        paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: bekliyor ? C.gold + '20' : C.bg,
            justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: bekliyor ? C.gold : C.border }}>
            <Text style={{ fontSize: 16 }}>📋</Text>
          </View>
          <View>
            <Text style={{ fontSize: 11, color: C.textSoft, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {bekliyor ? 'YENİ TEKLİF TALEBİ!' : 'Teklif Talebi'}
            </Text>
            <Text style={styles.adminKartTarih}>{formatTarih(l.created_at)}</Text>
          </View>
        </View>
        {bekliyor && (
          <View style={{ backgroundColor: C.gold, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontSize: 10, color: C.white, fontWeight: '700' }}>YENİ</Text>
          </View>
        )}
      </View>

      {/* Lead detayları — mail formatında */}
      <View style={{ gap: 8, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, width: 20 }}>👤</Text>
          <Text style={{ fontSize: 13, color: C.textSoft, width: 80 }}>Ad Soyad:</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.text, flex: 1 }}>{l.ad_soyad}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, width: 20 }}>📞</Text>
          <Text style={{ fontSize: 13, color: C.textSoft, width: 80 }}>Telefon:</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.text, flex: 1 }}>{l.telefon}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, width: 20 }}>🏢</Text>
          <Text style={{ fontSize: 13, color: C.textSoft, width: 80 }}>Mekan:</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.midnight, flex: 1 }}>{l.mekan_isim}</Text>
        </View>
        {l.kisi_sayisi ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 14, width: 20 }}>👥</Text>
            <Text style={{ fontSize: 13, color: C.textSoft, width: 80 }}>Kişi Sayısı:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, flex: 1 }}>{l.kisi_sayisi}</Text>
          </View>
        ) : null}
        {l.etkinlik_tarihi ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 14, width: 20 }}>📅</Text>
            <Text style={{ fontSize: 13, color: C.textSoft, width: 80 }}>Tarih:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, flex: 1 }}>{l.etkinlik_tarihi}</Text>
          </View>
        ) : null}
        {l.alt_kategori ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 14, width: 20 }}>🎉</Text>
            <Text style={{ fontSize: 13, color: C.textSoft, width: 80 }}>Etkinlik:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, flex: 1 }}>{l.alt_kategori}</Text>
          </View>
        ) : null}
        {l.notlar ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Text style={{ fontSize: 14, width: 20, marginTop: 1 }}>💬</Text>
            <Text style={{ fontSize: 13, color: C.textSoft, width: 80, marginTop: 1 }}>Not:</Text>
            <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.textMid, lineHeight: 20, fontStyle: 'italic' }}>"{l.notlar}"</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* Aksiyon butonları */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <TouchableOpacity
          style={[styles.durumBtn, { borderColor: C.whatsapp, flex: 1, alignItems: 'center', paddingVertical: 10 }]}
          onPress={() => {
            const numara = l.telefon.replace(/\D/g, '');
            const url = `https://wa.me/90${numara}`;
            if (Platform.OS === 'web') window.open(url, '_blank');
            else Linking.openURL(url);
          }}>
          <Text style={[styles.durumBtnText, { color: C.whatsapp }]}>💬 WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.durumBtn, { borderColor: C.midnight, flex: 1, alignItems: 'center', paddingVertical: 10 }]}
          onPress={() => {
            const url = `tel:${l.telefon}`;
            if (Platform.OS === 'web') window.location.href = url;
            else Linking.openURL(url);
          }}>
          <Text style={[styles.durumBtnText, { color: C.midnight }]}>📞 Ara</Text>
        </TouchableOpacity>
      </View>

      {/* Durum güncelleme */}
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        {['bekliyor', 'aranıyor', 'tamamlandı'].map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.durumBtn, { flex: 1 }, l.durum === d && {
              backgroundColor: d === 'tamamlandı' ? C.success : d === 'aranıyor' ? C.gold : C.midnight
            }]}
            onPress={() => onDurumGuncelle(d)}>
            <Text style={[styles.durumBtnText, { textAlign: 'center' }, l.durum === d && { color: C.white }]}>
              {d === 'bekliyor' ? '⏳' : d === 'aranıyor' ? '📞' : '✅'} {d}
            </Text>
          </TouchableOpacity>
        ))}
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

  const [firma, setFirma] = useState('');
  const [etkinlikTuru, setEtkinlikTuru] = useState('');

  async function gonder() {
    if (!ad || !telefon) { alert('Lütfen ad ve telefon giriniz.'); return; }
    if (!kvkkOnay) { setKvkkHata(true); return; }
    setKvkkHata(false);
    setGonderiliyor(true);
    const notlarTam = [
      firma ? `Firma: ${firma}` : '',
      etkinlikTuru ? `Etkinlik türü: ${etkinlikTuru}` : '',
      notlar,
    ].filter(Boolean).join('\n');
    await onGonder({ ad, telefon, kisi, notlar: notlarTam, tarih });
    setGonderiliyor(false);
  }

  return (
    <View style={styles.modalOverlay}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }], maxHeight: '94%' }]}>
        <View style={[styles.modalBar, { backgroundColor: C.midnight }]} />
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalBaslik}>📋 Teklif Talebi</Text>
          <Text style={styles.modalAlt}>{mekan.isim}</Text>
          <TextInput style={styles.formInput} placeholder="Ad Soyad *" placeholderTextColor={C.textSoft} value={ad} onChangeText={setAd} />
          <TextInput style={styles.formInput} placeholder="Firma / Şirket Adı" placeholderTextColor={C.textSoft} value={firma} onChangeText={setFirma} />
          <TextInput style={styles.formInput} placeholder="Telefon *" placeholderTextColor={C.textSoft} value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
          <TextInput style={styles.formInput} placeholder="Katılımcı Sayısı (tahmini)" placeholderTextColor={C.textSoft} value={kisi} onChangeText={setKisi} keyboardType="numeric" />
          <TextInput style={styles.formInput} placeholder="Etkinlik Tarihi (gg.aa.yyyy)" placeholderTextColor={C.textSoft} value={tarih} onChangeText={setTarih} />
          <TextInput style={styles.formInput} placeholder="Etkinlik Türü (ör: Ürün Lansmanı, Team Building)" placeholderTextColor={C.textSoft} value={etkinlikTuru} onChangeText={setEtkinlikTuru} />
          <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Teknik gereksinimler, özel istekler..."
            placeholderTextColor={C.textSoft} value={notlar} onChangeText={setNotlar} multiline />
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
            style={[styles.teklifBtn, { backgroundColor: C.midnight, opacity: kvkkOnay ? 1 : 0.7 }]}
            onPress={gonder}
            disabled={gonderiliyor}>
            <Text style={styles.teklifBtnText}>{gonderiliyor ? 'Gönderiliyor...' : '✓ Teklif Talebini Gönder'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onKapat} style={{ marginTop: 14, alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── MEKAN DETAY ───────────────────────────────────────────
function MekanDetay({ mekan, onGeri, onTeklif, kullanici, favoriler, onFavoriToggle }) {
  const [aktifIndex, setAktifIndex] = useState(0);
  const [tamEkran, setTamEkran] = useState(false);
  const [yorumMetni, setYorumMetni] = useState('');
  const [yorumPuan, setYorumPuan] = useState(5);
  const [yorumlar, setYorumlar] = useState([]);
  const [yorumGonderiliyor, setYorumGonderiliyor] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const detayScrollRef = useRef(null);
  const isRomantik = false; // Kurumsal platform
  const accentRenk = C.midnight;
  const tumFotolar = [mekan.fotograf_url, ...(mekan.fotograf_galeri || [])].filter(Boolean);
  const isFavori = (favoriler || []).includes(mekan.id);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    seoGuncelle({
      title: `${mekan.isim} — ${mekan.sehir}`,
      description: mekan.aciklama || `${mekan.isim}, ${mekan.sehir}. ${mekan.kapasite} kişiye kadar kurumsal etkinlik. etkinlink üzerinden ücretsiz teklif alın.`,
      image: mekan.fotograf_url,
    });
    yorumlariGetir();
    return () => seoGuncelle();
  }, []);

  async function yorumlariGetir() {
    try {
      const data = await apiFetch(`mekan_yorumlar?mekan_id=eq.${mekan.id}&order=created_at.desc&select=*`);
      if (Array.isArray(data)) setYorumlar(data);
    } catch(e) {}
  }

  async function yorumGonder() {
    if (!kullanici) { alert('Yorum yapmak için giriş yapmalısınız.'); return; }
    if (!yorumMetni.trim()) { alert('Lütfen bir yorum yazın.'); return; }
    setYorumGonderiliyor(true);
    try {
      const yeniYorum = {
        mekan_id: mekan.id,
        kullanici_id: kullanici.auth_id || kullanici.id,
        kullanici_ad: kullanici.ad_soyad,
        puan: yorumPuan,
        yorum: yorumMetni.trim(),
        created_at: new Date().toISOString(),
      };
      const res = await apiPost('mekan_yorumlar', yeniYorum);
      if (!res.ok) {
        const errText = await res.text();
        alert('Yorum gönderilemedi: ' + errText);
        setYorumGonderiliyor(false);
        return;
      }
      // Optimistic: hemen listeye ekle
      const tumYorumlar = [yeniYorum, ...yorumlar];
      setYorumlar(tumYorumlar);
      // Puan ortalamasını güncelle
      const ort = tumYorumlar.reduce((s, y) => s + y.puan, 0) / tumYorumlar.length;
      await apiPatch(`mekanlar?id=eq.${mekan.id}`, { puan: Math.round(ort * 10) / 10 });
      setYorumMetni('');
      setYorumPuan(5);
      // Sunucudan taze veriyi çek
      await yorumlariGetir();
    } catch (e) { alert('Hata: ' + e.message); }
    setYorumGonderiliyor(false);
  }

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: C.bg }, { opacity: fadeAnim }]}>
      {tamEkran && (
        <View style={[styles.tamEkranOverlay, { zIndex: 9999 }]}>
          {/* Swipe edilebilir tam ekran scroll — önce render et ki altta kalsın */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, width: SCREEN_WIDTH }}
            contentOffset={{ x: aktifIndex * SCREEN_WIDTH, y: 0 }}
            onMomentumScrollEnd={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setAktifIndex(i);
            }}
          >
            {tumFotolar.map((foto, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: foto }}
                  style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.85 }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* Sol ok */}
          {tumFotolar.length > 1 && aktifIndex > 0 && (
            <TouchableOpacity
              onPress={() => setAktifIndex(i => Math.max(0, i - 1))}
              style={[styles.tamEkranNavBtn, { position: 'absolute', left: 16, top: '50%', marginTop: -22, zIndex: 10001 }]}>
              <Text style={styles.tamEkranNavText}>‹</Text>
            </TouchableOpacity>
          )}
          {/* Sağ ok */}
          {tumFotolar.length > 1 && aktifIndex < tumFotolar.length - 1 && (
            <TouchableOpacity
              onPress={() => setAktifIndex(i => Math.min(tumFotolar.length - 1, i + 1))}
              style={[styles.tamEkranNavBtn, { position: 'absolute', right: 16, top: '50%', marginTop: -22, zIndex: 10001 }]}>
              <Text style={styles.tamEkranNavText}>›</Text>
            </TouchableOpacity>
          )}

          {/* Alt nokta indikatörler */}
          {tumFotolar.length > 1 && (
            <View style={{ position: 'absolute', bottom: 44, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8, alignItems: 'center', zIndex: 10001 }}>
              {tumFotolar.map((_, di) => (
                <View key={di} style={{
                  width: di === aktifIndex ? 20 : 7, height: 7, borderRadius: 4,
                  backgroundColor: di === aktifIndex ? C.white : 'rgba(255,255,255,0.35)',
                }} />
              ))}
            </View>
          )}

          {/* Sayaç — en üstte */}
          <View style={{ position: 'absolute', top: 52, left: 0, right: 0, alignItems: 'center', zIndex: 10002, pointerEvents: 'none' }}>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '600' }}>
              {aktifIndex + 1} / {tumFotolar.length}
            </Text>
          </View>

          {/* Kapatma butonu — her şeyin üzerinde, en son render */}
          <TouchableOpacity
            onPress={() => setTamEkran(false)}
            style={{
              position: 'absolute', top: 44, right: 20,
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center', alignItems: 'center',
              zIndex: 10003,
            }}>
            <Text style={{ color: C.white, fontSize: 20, fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── DETAY CAROUSEL ── */}
        <View style={{ position: 'relative', height: 320, backgroundColor: C.midnight }}>
          <ScrollView
            ref={detayScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate="fast"
            style={{ height: 320 }}
            onMomentumScrollEnd={(e) => {
              const newIdx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setAktifIndex(newIdx);
            }}
            onScroll={(e) => {
              // Web'de smooth scroll tracking
              if (Platform.OS === 'web') {
                const newIdx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                if (newIdx !== aktifIndex) setAktifIndex(newIdx);
              }
            }}
          >
            {tumFotolar.map((foto, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.97}
                onPress={() => { setAktifIndex(i); setTamEkran(true); }}
                style={{ width: SCREEN_WIDTH, height: 320 }}
              >
                <Image source={{ uri: foto }} style={{ width: SCREEN_WIDTH, height: 320 }} resizeMode="cover" />
                {/* Gradient overlay for bottom info readability */}
                <View style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                }} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Geri butonu */}
          <TouchableOpacity style={styles.geriBtnDetay} onPress={onGeri}>
            <Text style={styles.geriBtnText}>←</Text>
          </TouchableOpacity>

          {/* Puan badge */}
          <View style={[styles.puanBadge, { backgroundColor: accentRenk, top: 14, right: 14 }]}>
            <Text style={styles.puanText}>★ {mekan.puan}</Text>
          </View>

          {/* Sol ok */}
          {tumFotolar.length > 1 && aktifIndex > 0 && (
            <TouchableOpacity
              onPress={() => {
                const yeni = aktifIndex - 1;
                setAktifIndex(yeni);
                detayScrollRef.current?.scrollTo({ x: yeni * SCREEN_WIDTH, animated: true });
              }}
              style={{
                position: 'absolute', left: 12, top: '50%', marginTop: -24,
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center', alignItems: 'center',
              }}>
              <Text style={{ color: C.white, fontSize: 24, fontWeight: '700' }}>‹</Text>
            </TouchableOpacity>
          )}
          {/* Sağ ok */}
          {tumFotolar.length > 1 && aktifIndex < tumFotolar.length - 1 && (
            <TouchableOpacity
              onPress={() => {
                const yeni = aktifIndex + 1;
                setAktifIndex(yeni);
                detayScrollRef.current?.scrollTo({ x: yeni * SCREEN_WIDTH, animated: true });
              }}
              style={{
                position: 'absolute', right: 12, top: '50%', marginTop: -24,
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center', alignItems: 'center',
              }}>
              <Text style={{ color: C.white, fontSize: 24, fontWeight: '700' }}>›</Text>
            </TouchableOpacity>
          )}

          {/* Alt: nokta indikatörler + sayaç */}
          {tumFotolar.length > 1 && (
            <View style={{
              position: 'absolute', bottom: 14, left: 0, right: 0,
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5,
            }}>
              {tumFotolar.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setAktifIndex(i);
                    detayScrollRef.current?.scrollTo({ x: i * SCREEN_WIDTH, animated: true });
                  }}
                  style={{
                    width: i === aktifIndex ? 20 : 7,
                    height: 7, borderRadius: 4,
                    backgroundColor: i === aktifIndex ? C.white : 'rgba(255,255,255,0.45)',
                  }}
                />
              ))}
            </View>
          )}

          {/* Fotoğraf sayacı ve "büyüt" ipucu */}
          {tumFotolar.length > 1 && (
            <View style={[styles.galeriBadge, { bottom: 12, right: 12 }]}>
              <Text style={styles.galeriBadgeText}>🔍 {aktifIndex + 1}/{tumFotolar.length}</Text>
            </View>
          )}
        </View>

        {/* Thumbnail strip */}
        {tumFotolar.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: C.midnight, paddingVertical: 10 }}
            contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}
          >
            {tumFotolar.map((foto, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setAktifIndex(i);
                  detayScrollRef.current?.scrollTo({ x: i * SCREEN_WIDTH, animated: true });
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: i === aktifIndex ? 2.5 : 1.5,
                  borderColor: i === aktifIndex ? C.gold : 'rgba(255,255,255,0.25)',
                  overflow: 'hidden',
                  opacity: i === aktifIndex ? 1 : 0.6,
                }}>
                <Image
                  source={{ uri: foto }}
                  style={{ width: 68, height: 52 }}
                  resizeMode="cover"
                />
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

          {/* 7. YORUM & PUANLAMA BÖLÜMÜ */}
          <View style={styles.detayBolum}>
            <Text style={styles.detayBolumBaslik}>Yorumlar & Puanlar</Text>
            {yorumlar.length === 0 && (
              <Text style={{ color: C.textSoft, fontSize: 13, marginBottom: 12 }}>Henüz yorum yok. İlk yorumu sen yap!</Text>
            )}
            {yorumlar.map((y, i) => (
              <View key={i} style={{ backgroundColor: C.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontWeight: '700', color: C.text, fontSize: 14 }}>{y.kullanici_ad || 'Anonim'}</Text>
                  <Text style={{ color: C.gold, fontWeight: '700' }}>{'★'.repeat(y.puan)}{'☆'.repeat(5 - y.puan)}</Text>
                </View>
                <Text style={{ color: C.textMid, fontSize: 13, lineHeight: 20 }}>{y.yorum}</Text>
              </View>
            ))}
            {kullanici ? (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.inputEtiket, { marginBottom: 8 }]}>Puanın:</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                  {[1,2,3,4,5].map(p => (
                    <TouchableOpacity key={p} onPress={() => setYorumPuan(p)}
                      style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: yorumPuan >= p ? C.gold : C.bg, borderWidth: 1, borderColor: yorumPuan >= p ? C.gold : C.border }}>
                      <Text style={{ color: yorumPuan >= p ? C.white : C.textSoft, fontWeight: '700' }}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Deneyiminizi paylaşın..."
                  placeholderTextColor={C.textSoft}
                  value={yorumMetni}
                  onChangeText={setYorumMetni}
                  multiline
                />
                <TouchableOpacity
                  style={[styles.teklifBtn, { backgroundColor: accentRenk }]}
                  onPress={yorumGonder}
                  disabled={yorumGonderiliyor}>
                  <Text style={styles.teklifBtnText}>{yorumGonderiliyor ? 'Gönderiliyor...' : '✓ Yorum Gönder'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: C.textSoft, fontSize: 13, fontStyle: 'italic' }}>Yorum yapmak için giriş yapın.</Text>
            )}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={[styles.stickyCta, isRomantik && { backgroundColor: C.romanticSoft }]}>
        <TouchableOpacity
          onPress={() => onFavoriToggle && onFavoriToggle(mekan.id)}
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: isFavori ? C.gold + '20' : C.bg,
            borderWidth: 1.5, borderColor: isFavori ? C.gold : C.border, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>{isFavori ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {mekan.fiyat_aralik && <Text style={[styles.stickyFiyat, { color: accentRenk }]}>{mekan.fiyat_aralik}</Text>}
          <Text style={styles.stickyKapasite}>👥 {mekan.kapasite} kişiye kadar</Text>
        </View>
        <IletisimButonu mekan={mekan} kullanici={kullanici} onFormAc={onTeklif} style={{ flex: 1 }} />
      </View>
    </Animated.View>
  );
}

// ── KARŞILAŞTIRMA MODALI ─────────────────────────────────
function KarsilastirmaModal({ mekanlar, onKapat, onTeklif, onTopluTeklif, kullanici }) {
  const alanlar = [
    { key: 'kapasite',    label: '👥 Kapasite', fmt: v => v ? `${v} kişi` : '—' },
    { key: 'fiyat_aralik',label: '💰 Fiyat',    fmt: v => v || '—' },
    { key: 'puan',        label: '★ Puan',       fmt: v => v ? String(v) : '—' },
    { key: 'sehir',       label: '📍 Şehir',     fmt: v => v || '—' },
  ];
  const colW = mekanlar.length === 2 ? '45%' : '30%';
  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modal, { maxHeight: '92%', paddingHorizontal: 0 }]}>
        <View style={[styles.modalBar, { backgroundColor: C.midnight }]} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
          <Text style={[styles.modalBaslik, { marginBottom: 0 }]}>⚖️ Karşılaştır</Text>
          <TouchableOpacity onPress={onKapat} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20, color: C.textSoft }}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
          {/* Başlıklar */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <View style={{ width: 90 }} />
            {mekanlar.map((m, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Image source={{ uri: m.fotograf_url }} style={{ width: '100%', height: 70, borderRadius: 10 }} resizeMode="cover" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center', marginTop: 6 }} numberOfLines={2}>{m.isim}</Text>
              </View>
            ))}
          </View>
          {/* Satırlar */}
          {alanlar.map((alan, ai) => (
            <View key={ai} style={{ flexDirection: 'row', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, alignItems: 'center' }}>
              <Text style={{ width: 90, fontSize: 11, color: C.textSoft, fontWeight: '600' }}>{alan.label}</Text>
              {mekanlar.map((m, mi) => {
                const isNum = alan.key === 'kapasite' || alan.key === 'puan';
                const best = isNum ? Math.max(...mekanlar.map(x => Number(x[alan.key]) || 0)) : null;
                const isBest = isNum && Number(m[alan.key]) === best && best > 0;
                return (
                  <View key={mi} style={{ flex: 1, alignItems: 'center', backgroundColor: isBest ? C.gold + '15' : 'transparent', borderRadius: 8, padding: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: isBest ? '700' : '500', color: isBest ? C.gold : C.text, textAlign: 'center' }}>
                      {alan.fmt(m[alan.key])}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
          {/* Teklif butonları */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            <View style={{ width: 90 }} />
            {mekanlar.map((m, i) => (
              <TouchableOpacity key={i} style={[styles.teklifBtn, { flex: 1, backgroundColor: C.midnight, paddingVertical: 10 }]}
                onPress={() => { onKapat(); onTeklif(m); }}>
                <Text style={[styles.teklifBtnText, { fontSize: 12 }]}>Teklif Al</Text>
              </TouchableOpacity>
            ))}
          </View>
          {mekanlar.length > 1 && onTopluTeklif && (
            <TouchableOpacity
              style={[styles.teklifBtn, { backgroundColor: C.gold, marginTop: 10, marginHorizontal: 0 }]}
              onPress={onTopluTeklif}>
              <Text style={styles.teklifBtnText}>📋 Tümüne Aynı Anda Teklif Al</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </View>
  );
}

// ── TOPLU TEKLİF FORMU ───────────────────────────────────
function TopluTeklifFormu({ mekanlar, onKapat, onGonder, kullanici, onGizlilikAc }) {
  const [ad, setAd] = useState(kullanici?.ad_soyad || '');
  const [telefon, setTelefon] = useState(kullanici?.telefon || '');
  const [kisi, setKisi] = useState('');
  const [tarih, setTarih] = useState('');
  const [notlar, setNotlar] = useState('');
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [kvkkHata, setKvkkHata] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  }, []);

  async function gonder() {
    if (!ad || !telefon) { alert('Ad ve telefon zorunlu.'); return; }
    if (!kvkkOnay) { setKvkkHata(true); return; }
    setGonderiliyor(true);
    await onGonder({ ad, telefon, kisi, tarih, notlar, mekanlar });
    setGonderiliyor(false);
  }

  return (
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }], maxHeight: '92%', paddingHorizontal: 0 }]}>
        <View style={[styles.modalBar, { backgroundColor: C.gold }]} />
        <ScrollView style={{ paddingHorizontal: 28 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.modalBaslik}>📋 Toplu Teklif Al</Text>
          <Text style={{ color: C.textSoft, fontSize: 13, marginBottom: 16, marginTop: -2 }}>{mekanlar.length} mekandan aynı anda teklif istiyorsunuz:</Text>
          {mekanlar.map((m, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8,
              backgroundColor: C.goldSoft, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: C.goldLight }}>
              <Text style={{ fontSize: 18 }}>🏛</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: C.midnight, fontSize: 13 }}>{m.isim}</Text>
                <Text style={{ color: C.textSoft, fontSize: 11 }}>📍 {m.sehir}</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 16 }} />
          <TextInput style={styles.formInput} placeholder="Ad Soyad *" placeholderTextColor={C.textSoft} value={ad} onChangeText={setAd} />
          <TextInput style={styles.formInput} placeholder="Telefon *" placeholderTextColor={C.textSoft} value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
          <TextInput style={styles.formInput} placeholder="Kişi Sayısı" placeholderTextColor={C.textSoft} value={kisi} onChangeText={setKisi} keyboardType="numeric" />
          <TextInput style={styles.formInput} placeholder="Etkinlik Tarihi (gg.aa.yyyy)" placeholderTextColor={C.textSoft} value={tarih} onChangeText={setTarih} />
          <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Notlar (opsiyonel)" placeholderTextColor={C.textSoft} value={notlar} onChangeText={setNotlar} multiline />
          <KVKKOnayKutusu onayVerildi={kvkkOnay} setOnayVerildi={(v) => { setKvkkOnay(v); if (v) setKvkkHata(false); }} onGizlilikAc={onGizlilikAc} />
          {kvkkHata && <Text style={{ color: C.danger, fontSize: 12, marginBottom: 10, marginTop: -4 }}>⚠️ Gizlilik politikasını onaylamanız gerekiyor.</Text>}
          <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={gonder} disabled={gonderiliyor}>
            <Text style={styles.teklifBtnText}>{gonderiliyor ? 'Gönderiliyor...' : `✓ ${mekanlar.length} Mekana Teklif Gönder`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onKapat} style={{ marginTop: 14, alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: C.textSoft, fontSize: 14 }}>Vazgeç</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ── MEKAN KARTI ───────────────────────────────────────────
function MekanKarti({ mekan, onTeklif, onDetay, romantikMod, index, kullanici, favoriler, onFavoriToggle, karsilastirmaListesi, onKarsilastirmaToggle }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [kartFotoIndex, setKartFotoIndex] = useState(0);
  const kartScrollRef = useRef(null);
  const kartFotolar = [mekan.fotograf_url, ...(mekan.fotograf_galeri || [])].filter(Boolean);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  function kartFotoGit(yon) {
    const yeni = Math.max(0, Math.min(kartFotolar.length - 1, kartFotoIndex + yon));
    setKartFotoIndex(yeni);
    if (kartScrollRef.current) {
      if (Platform.OS === 'web') {
        kartScrollRef.current.scrollTo({ x: yeni * KART_GORSEL_W, animated: true });
      } else {
        kartScrollRef.current.scrollTo({ x: yeni * KART_GORSEL_W, animated: true });
      }
    }
  }

  const isRomantik = false;
  const accentRenk = C.midnight;
  const isFavori = (favoriler || []).includes(mekan.id);
  const isKarsilastirmada = (karsilastirmaListesi || []).some(m => m.id === mekan.id);
  const KART_GORSEL_W = IS_DESKTOP ? Math.floor((SCREEN_WIDTH - 64) / 2) : SCREEN_WIDTH - 32;
  const KART_GORSEL_H = 210;

  return (
    <Animated.View style={[
      styles.kart,
      IS_DESKTOP && styles.kartDesktop,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      isRomantik && { borderColor: C.romantic + '30' },
      isKarsilastirmada && { borderColor: C.gold, borderWidth: 2 },
    ]}>
      {/* KART CAROUSEL */}
      <View style={{ position: 'relative', height: KART_GORSEL_H }}>
        <ScrollView
          ref={kartScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const newIdx = Math.round(e.nativeEvent.contentOffset.x / KART_GORSEL_W);
            setKartFotoIndex(newIdx);
          }}
          style={{ height: KART_GORSEL_H }}
        >
          {kartFotolar.map((foto, fi) => (
            <TouchableOpacity
              key={fi}
              activeOpacity={0.95}
              onPress={() => onDetay(mekan)}
              style={{ width: KART_GORSEL_W, height: KART_GORSEL_H }}
            >
              <Image source={{ uri: foto }} style={{ width: KART_GORSEL_W, height: KART_GORSEL_H }} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Öne çıkan badge */}
        {mekan.one_cikan && (
          <View style={[styles.oneCikanBadge, { top: 12, left: 12 }]}>
            <Text style={styles.oneCikanText}>✦ Öne Çıkan</Text>
          </View>
        )}

        {/* Puan badge */}
        <View style={[styles.puanBadge, { backgroundColor: accentRenk, top: 12, right: 12 }]}>
          <Text style={styles.puanText}>★ {mekan.puan}</Text>
        </View>

        {/* Favori butonu */}
        <TouchableOpacity
          onPress={() => onFavoriToggle && onFavoriToggle(mekan.id)}
          style={{ position: 'absolute', bottom: 12, left: 12, width: 34, height: 34, borderRadius: 17,
            backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: isFavori ? '#FF6B6B' : C.white }}>{isFavori ? '♥' : '♡'}</Text>
        </TouchableOpacity>

        {/* Sol/Sağ ok butonları — sadece birden fazla fotoğraf varsa */}
        {kartFotolar.length > 1 && kartFotoIndex > 0 && (
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation && e.stopPropagation(); kartFotoGit(-1); }}
            style={{
              position: 'absolute', left: 8, top: '50%', marginTop: -18,
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center', alignItems: 'center',
            }}>
            <Text style={{ color: C.white, fontSize: 18, fontWeight: '700', lineHeight: 22 }}>‹</Text>
          </TouchableOpacity>
        )}
        {kartFotolar.length > 1 && kartFotoIndex < kartFotolar.length - 1 && (
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation && e.stopPropagation(); kartFotoGit(1); }}
            style={{
              position: 'absolute', right: 8, top: '50%', marginTop: -18,
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center', alignItems: 'center',
            }}>
            <Text style={{ color: C.white, fontSize: 18, fontWeight: '700', lineHeight: 22 }}>›</Text>
          </TouchableOpacity>
        )}

        {/* Nokta indikatörler */}
        {kartFotolar.length > 1 && (
          <View style={{
            position: 'absolute', bottom: 10, right: 12,
            flexDirection: 'row', gap: 4, alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10,
            paddingHorizontal: 8, paddingVertical: 4,
          }}>
            {kartFotolar.map((_, di) => (
              <View key={di} style={{
                width: di === kartFotoIndex ? 14 : 5,
                height: 5, borderRadius: 3,
                backgroundColor: di === kartFotoIndex ? C.white : 'rgba(255,255,255,0.45)',
              }} />
            ))}
          </View>
        )}
      </View>

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
          <Text style={styles.kapasiteText}>👥 {mekan.kapasite} katılımcıya kadar</Text>
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

        {/* 9. KARŞILAŞTIRMA BUTONU */}
        <TouchableOpacity
          onPress={() => onKarsilastirmaToggle && onKarsilastirmaToggle(mekan)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
            paddingVertical: 7, borderRadius: 10, marginBottom: 8,
            backgroundColor: isKarsilastirmada ? C.midnight + '10' : 'transparent',
            borderWidth: 1, borderColor: isKarsilastirmada ? C.midnight : C.border }}>
          <Text style={{ fontSize: 12, color: isKarsilastirmada ? C.midnight : C.textSoft, fontWeight: '600' }}>
            {isKarsilastirmada ? '✓ Karşılaştırmada' : '⚖️ Karşılaştırmaya Ekle'}
          </Text>
        </TouchableOpacity>
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

// ── BLOG DETAY MODAL ──────────────────────────────────────
function BlogDetayModal({ yazi, onKapat }) {
  const slideAnim = useRef(new Animated.Value(800)).current;
  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 12, useNativeDriver: true }).start();
    if (Platform.OS === 'web') {
      seoGuncelle({
        title: yazi.baslik,
        description: yazi.ozet || yazi.icerik?.substring(0, 160),
        image: yazi.kapak_foto,
      });
    }
    return () => { if (Platform.OS === 'web') seoGuncelle(); };
  }, []);

  return (
    <View style={[styles.modalOverlay, { justifyContent: 'flex-start' }]}>
      <Animated.View style={[{
        flex: 1, backgroundColor: C.white,
        transform: [{ translateY: slideAnim }],
        marginTop: 48, borderTopLeftRadius: 24, borderTopRightRadius: 24,
      }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <TouchableOpacity onPress={onKapat} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 16, color: C.midnight }}>←</Text>
            <Text style={{ fontSize: 13, color: C.midnight, fontWeight: '600' }}>Blog</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 4, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {(yazi.etiketler || []).slice(0, 3).map((e, i) => (
              <View key={i} style={{ backgroundColor: C.accentSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 10, color: C.accent, fontWeight: '700' }}>#{e}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={onKapat} style={{ padding: 4 }}>
            <Text style={{ fontSize: 20, color: C.textSoft }}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {yazi.kapak_foto && (
            <Image source={{ uri: yazi.kapak_foto }} style={{ width: '100%', height: 220 }} resizeMode="cover" />
          )}
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5, lineHeight: 30, marginBottom: 12 }}>
              {yazi.baslik}
            </Text>
            <Text style={{ fontSize: 12, color: C.textSoft, marginBottom: 20 }}>
              📅 {new Date(yazi.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              {'  ·  '}etkinlink
            </Text>
            {yazi.ozet && (
              <View style={{ backgroundColor: C.accentSoft, borderRadius: 12, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: C.accent }}>
                <Text style={{ fontSize: 14, color: C.accent, fontWeight: '600', lineHeight: 22 }}>{yazi.ozet}</Text>
              </View>
            )}
            <Text style={{ fontSize: 15, color: C.textMid, lineHeight: 26 }}>{yazi.icerik}</Text>
            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ── ADMIN GİRİŞ ──────────────────────────────────────────
function AdminGiris({ onGiris }) {
  const [sifre, setSifre] = useState('');
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 32 }}>
        <Text style={[styles.logoText, { textAlign: 'center', fontSize: 32, color: C.midnight, marginBottom: 4 }]}>etkinlink</Text>
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
          { label: 'Mekan Adı *', val: isim, set: setIsim, ph: 'İstanbul Convention Center' },
          { label: 'Şehir *', val: sehir, set: setSehir, ph: 'İstanbul' },
          { label: 'Kapasite *', val: kapasite, set: setKapasite, ph: '500', kb: 'numeric' },
          { label: 'Fiyat Aralığı', val: fiyat, set: setFiyat, ph: '100.000₺ - 500.000₺' },
          { label: 'Video URL', val: video, set: setVideo, ph: 'https://youtube.com/...' },
          { label: 'Fiziksel Özellikler (virgülle)', val: ozellik, set: setOzellik, ph: 'Konferans Salonu, Gala Salonu, Hibrit Uyumlu' },
          { label: 'Teknik Altyapı (virgülle)', val: teknik, set: setTeknik, ph: 'LED Ekran, Simultane Çeviri, Hızlı WiFi' },
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
  const [yeniAnaKat, setYeniAnaKat] = useState('dis_pazarlama');
  const [yeniAltKat, setYeniAltKat] = useState('konferans_seminer');
  const [yeniIletisimTuru, setYeniIletisimTuru] = useState('whatsapp');
  const [yeniIletisimNumarasi, setYeniIletisimNumarasi] = useState('');
  const [yeniIletisimEmail, setYeniIletisimEmail] = useState('');
  const [ekleniyor, setEkleniyor] = useState(false);
  const [fotografYukleniyor, setFotografYukleniyor] = useState(false);

  // Blog state
  const [blogYazilari, setBlogYazilari] = useState([]);
  const [blogBaslik, setBlogBaslik] = useState('');
  const [blogOzet, setBlogOzet] = useState('');
  const [blogIcerik, setBlogIcerik] = useState('');
  const [blogKapak, setBlogKapak] = useState('');
  const [blogEtiketler, setBlogEtiketler] = useState('');
  const [blogEkleniyor, setBlogEkleniyor] = useState(false);
  const [blogDuzenle, setBlogDuzenle] = useState(null);

  useEffect(() => { veriGetir(); }, []);

  async function veriGetir() {
    setYukleniyor(true);
    const [l, m, s, b, blog] = await Promise.all([
      apiFetch('leads?select=*&order=created_at.desc'),
      apiFetch('mekanlar?select=*&onay_durumu=eq.onaylandi&order=created_at.desc'),
      apiFetch('mekan_sahipleri?select=*&order=created_at.desc'),
      apiFetch('mekanlar?select=*&onay_durumu=eq.beklemede&order=created_at.desc'),
      apiFetch('blog_yazilari?select=*&order=created_at.desc'),
    ]);
    setLeads(Array.isArray(l) ? l : []);
    setMekanlar(Array.isArray(m) ? m : []);
    setSahipler(Array.isArray(s) ? s : []);
    setBekleyenMekanlar(Array.isArray(b) ? b : []);
    setBlogYazilari(Array.isArray(blog) ? blog : []);
    setYukleniyor(false);
  }

  async function mekanOnayla(id) {
    try {
      await apiPatch(`mekanlar?id=eq.${id}`, { onay_durumu: 'onaylandi', aktif: true });
      await veriGetir();
      alert('✅ Mekan onaylandı ve yayına alındı!');
    } catch (e) { alert('Hata: ' + e.message); }
  }

  async function mekanReddet(id) {
    const onay = Platform.OS === 'web' ? window.confirm('Bu mekan reddedilsin mi?') : true;
    if (!onay) return;
    try {
      await apiPatch(`mekanlar?id=eq.${id}`, { onay_durumu: 'reddedildi', aktif: false });
      await veriGetir();
    } catch (e) { alert('Hata: ' + e.message); }
  }

  async function mekanEkle() {
    if (!yeniIsim || !yeniSehir || !yeniKapasite) { alert('İsim, şehir ve kapasite zorunlu!'); return; }
    if ((yeniIletisimTuru === 'whatsapp' || yeniIletisimTuru === 'telefon') && !yeniIletisimNumarasi) {
      alert('Seçilen iletişim türü için numara zorunlu!'); return;
    }
    setEkleniyor(true);
    const { ok, error } = await apiPostSafe('mekanlar', {
      isim: yeniIsim, sehir: yeniSehir, kapasite: parseInt(yeniKapasite),
      ana_kategori: yeniAnaKat, alt_kategori: [yeniAltKat],
      fotograf_url: yeniFoto || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      fotograf_galeri: yeniGaleri, video_url: yeniVideo || null,
      fiyat_aralik: yeniFiyat, aciklama: yeniAciklama,
      fiziksel_ozellikler: yeniOzellik ? yeniOzellik.split(',').map(s => s.trim()) : [],
      teknik_altyapi: yeniTeknik ? yeniTeknik.split(',').map(s => s.trim()) : [],
      iletisim_turu: yeniIletisimTuru, iletisim_numarasi: yeniIletisimNumarasi, iletisim_email: yeniIletisimEmail,
      aktif: true, onay_durumu: 'onaylandi', puan: 4.5,
    });
    if (!ok) { alert('Hata: ' + error); setEkleniyor(false); return; }
    setYeniIsim(''); setYeniSehir(''); setYeniKapasite(''); setYeniFoto(''); setYeniGaleri([]);
    setYeniVideo(''); setYeniFiyat(''); setYeniOzellik(''); setYeniTeknik(''); setYeniAciklama('');
    setYeniIletisimNumarasi(''); setYeniIletisimEmail('');
    setEkleniyor(false);
    await veriGetir();
    alert('✅ Mekan başarıyla eklendi!');
  }

  async function blogYazisiEkle() {
    if (!blogBaslik.trim() || !blogIcerik.trim()) { alert('Başlık ve içerik zorunlu!'); return; }
    setBlogEkleniyor(true);
    const slug = blogBaslik.trim().toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const body = {
      baslik: blogBaslik.trim(),
      ozet: blogOzet.trim() || blogIcerik.trim().substring(0, 160),
      icerik: blogIcerik.trim(),
      kapak_foto: blogKapak.trim() || null,
      etiketler: blogEtiketler ? blogEtiketler.split(',').map(e => e.trim()).filter(Boolean) : [],
      slug: slug + '-' + Date.now(),
      yayinda: true,
    };
    if (blogDuzenle) {
      await apiPatch(`blog_yazilari?id=eq.${blogDuzenle.id}`, body);
      alert('✅ Blog yazısı güncellendi!');
      setBlogDuzenle(null);
    } else {
      const { ok, error } = await apiPostSafe('blog_yazilari', body);
      if (!ok) { alert('Hata: ' + error); setBlogEkleniyor(false); return; }
      alert('✅ Blog yazısı yayınlandı!');
    }
    setBlogBaslik(''); setBlogOzet(''); setBlogIcerik(''); setBlogKapak(''); setBlogEtiketler('');
    setBlogEkleniyor(false);
    await veriGetir();
  }

  async function blogYazisiSil(id) {
    const onay = Platform.OS === 'web' ? window.confirm('Bu blog yazısı silinsin mi?') : true;
    if (!onay) return;
    await apiDelete(`blog_yazilari?id=eq.${id}`);
    await veriGetir();
  }

  function blogDuzenleBaslat(yazi) {
    setBlogDuzenle(yazi);
    setBlogBaslik(yazi.baslik || '');
    setBlogOzet(yazi.ozet || '');
    setBlogIcerik(yazi.icerik || '');
    setBlogKapak(yazi.kapak_foto || '');
    setBlogEtiketler((yazi.etiketler || []).join(', '));
    setAktifTab('blog');
  }
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.midnight} />
    </SafeAreaView>
  ;

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
        <Text style={[styles.logoText, { fontSize: 18, color: C.midnight, fontWeight: '800' }]}>etkinlink</Text>
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
            { id: 'blog', etiket: '📝 Blog' },
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
                    <TouchableOpacity style={[styles.teklifBtn, { flex: 1, backgroundColor: C.success, paddingVertical: 12 }]} onPress={() => mekanOnayla(m.id)}>
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
                  <TouchableOpacity onPress={async () => {
                    const onay = Platform.OS === 'web' ? window.confirm('Bu lead silinsin mi?') : true;
                    if (!onay) return;
                    await apiDelete(`leads?id=eq.${l.id}`); veriGetir();
                  }} style={{ padding: 8 }}>
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
                    <TouchableOpacity style={[styles.durumBtn, { borderColor: C.danger }]} onPress={async () => {
                      const onay = Platform.OS === 'web' ? window.confirm(`"${m.isim}" mekanı silinsin mi? Bu işlem geri alınamaz.`) : true;
                      if (!onay) return;
                      await apiDelete(`mekanlar?id=eq.${m.id}`); veriGetir();
                    }}>
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
              { label: 'Mekan Adı *', val: yeniIsim, set: setYeniIsim, ph: 'İstanbul Convention Center' },
              { label: 'Şehir *', val: yeniSehir, set: setYeniSehir, ph: 'İstanbul' },
              { label: 'Kapasite *', val: yeniKapasite, set: setYeniKapasite, ph: '500', kb: 'numeric' },
              { label: 'Fiyat Aralığı', val: yeniFiyat, set: setYeniFiyat, ph: '50.000₺ - 150.000₺' },
              { label: 'Video URL (YouTube - opsiyonel)', val: yeniVideo, set: setYeniVideo, ph: 'https://youtube.com/...' },
              { label: 'Fiziksel Özellikler (virgülle)', val: yeniOzellik, set: setYeniOzellik, ph: 'Konferans Salonu, Gala Salonu, Hibrit Uyumlu' },
              { label: 'Teknik Altyapı (virgülle)', val: yeniTeknik, set: setYeniTeknik, ph: 'LED Ekran, Simultane Çeviri, Hızlı WiFi' },
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

        {aktifTab === 'blog' && (
          <View style={{ padding: 16 }}>
            <Text style={styles.formBaslik}>{blogDuzenle ? '✏️ Blog Yazısını Düzenle' : '📝 Yeni Blog Yazısı'}</Text>
            {blogDuzenle && (
              <TouchableOpacity onPress={() => { setBlogDuzenle(null); setBlogBaslik(''); setBlogOzet(''); setBlogIcerik(''); setBlogKapak(''); setBlogEtiketler(''); }}
                style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: C.textSoft, fontSize: 13 }}>← Yeni yazı ekle</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.inputEtiket}>Başlık *</Text>
            <TextInput style={styles.formInput} placeholder="Kurumsal Etkinliklerde Mekan Seçimi" placeholderTextColor={C.textSoft} value={blogBaslik} onChangeText={setBlogBaslik} />

            <Text style={styles.inputEtiket}>Özet (SEO için)</Text>
            <TextInput style={[styles.formInput, { height: 64, textAlignVertical: 'top' }]} placeholder="Kısa bir özet..." placeholderTextColor={C.textSoft} value={blogOzet} onChangeText={setBlogOzet} multiline />

            <Text style={styles.inputEtiket}>İçerik *</Text>
            <TextInput style={[styles.formInput, { height: 200, textAlignVertical: 'top', fontFamily: Platform.OS === 'web' ? 'monospace' : undefined }]}
              placeholder="Blog yazısının tam metni buraya yazılır..." placeholderTextColor={C.textSoft} value={blogIcerik} onChangeText={setBlogIcerik} multiline />

            <Text style={styles.inputEtiket}>Kapak Fotoğrafı URL (opsiyonel)</Text>
            <TextInput style={styles.formInput} placeholder="https://..." placeholderTextColor={C.textSoft} value={blogKapak} onChangeText={setBlogKapak} />
            {blogKapak ? <Image source={{ uri: blogKapak }} style={{ width: '100%', height: 160, borderRadius: 12, marginBottom: 12 }} resizeMode="cover" /> : null}

            <Text style={styles.inputEtiket}>Etiketler (virgülle ayırın)</Text>
            <TextInput style={styles.formInput} placeholder="mekan seçimi, kurumsal etkinlik, konferans" placeholderTextColor={C.textSoft} value={blogEtiketler} onChangeText={setBlogEtiketler} />

            <TouchableOpacity style={[styles.teklifBtn, { backgroundColor: C.midnight }]} onPress={blogYazisiEkle} disabled={blogEkleniyor}>
              <Text style={styles.teklifBtnText}>{blogEkleniyor ? 'Yayınlanıyor...' : blogDuzenle ? '💾 Güncelle' : '🚀 Yayınla'}</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 28 }}>
              <Text style={[styles.formBaslik, { fontSize: 15, marginBottom: 12 }]}>Mevcut Yazılar ({blogYazilari.length})</Text>
              {blogYazilari.length === 0 && (
                <View style={styles.bosEkran}>
                  <Text style={styles.bosEkranEmoji}>📝</Text>
                  <Text style={styles.bosEkranText}>Henüz blog yazısı yok.</Text>
                </View>
              )}
              {blogYazilari.map(yazi => (
                <View key={yazi.id} style={[styles.adminKart, { flexDirection: 'column', padding: 0, overflow: 'hidden' }]}>
                  {yazi.kapak_foto && <Image source={{ uri: yazi.kapak_foto }} style={{ width: '100%', height: 100, borderRadius: 0 }} resizeMode="cover" />}
                  <View style={{ padding: 14 }}>
                    <Text style={styles.adminKartIsim} numberOfLines={2}>{yazi.baslik}</Text>
                    {yazi.ozet ? <Text style={[styles.adminKartDetay, { marginTop: 4 }]} numberOfLines={2}>{yazi.ozet}</Text> : null}
                    {(yazi.etiketler || []).length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                        {yazi.etiketler.map((e, i) => (
                          <View key={i} style={{ backgroundColor: C.accentSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                            <Text style={{ fontSize: 10, color: C.accent, fontWeight: '600' }}>#{e}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <Text style={styles.adminKartTarih}>{formatTarih(yazi.created_at)}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                      <TouchableOpacity style={[styles.durumBtn, { flex: 1, alignItems: 'center', borderColor: C.gold }]} onPress={() => blogDuzenleBaslat(yazi)}>
                        <Text style={[styles.durumBtnText, { color: C.gold }]}>✏️ Düzenle</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.durumBtn, { flex: 1, alignItems: 'center', borderColor: C.danger }]} onPress={() => blogYazisiSil(yazi.id)}>
                        <Text style={[styles.durumBtnText, { color: C.danger }]}>🗑️ Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
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
  const [kullaniciPanelAcik, setKullaniciPanelAcik] = useState(false);
  const [seciliDetay, setSeciliDetay] = useState(null);
  const [mekanlar, setMekanlar] = useState([]);
  const [banner, setBanner] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenileniyor, setYenileniyor] = useState(false);
  const [anaKategori, setAnaKategori] = useState('hepsi');
  const [altKategori, setAltKategori] = useState(null);
  const [fizikselFiltre, setFizikselFiltre] = useState(null);
  const [teknikFiltre, setTeknikFiltre] = useState(null);
  const [arama, setArama] = useState('');
  const [seciliMekan, setSeciliMekan] = useState(null);
  const [basariMesaji, setBasariMesaji] = useState(null);
  const [logoTiklama, setLogoTiklama] = useState(0);
  // 2. & 5. Gizlilik ve hata state'leri
  const [gizlilikAcik, setGizlilikAcik] = useState(false);
  const [yuklenmeHatasi, setYuklenmeHatasi] = useState(null);
  // Favoriler ve karşılaştırma — başlangıç boş, useEffect'te kullanıcıya göre yüklenir
  const [favoriler, setFavoriler] = useState([]);
  const [karsilastirmaListesi, setKarsilastirmaListesi] = useState([]);
  const [karsilastirmaAcik, setKarsilastirmaAcik] = useState(false);
  const [topluTeklifAcik, setTopluTeklifAcik] = useState(false);
  const [blogYazilari, setBlogYazilari] = useState([]);
  const [seciliBlogYazi, setSeciliBlogYazi] = useState(null);

  const romantikMod = false; // Kurumsal platform — romantik mod kaldırıldı

  useEffect(() => {
    veriGetir();
    // Mekan sahibi session kontrolü
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setSahipKullanici(session.user);
    });
    // Kullanıcı session kontrolü (Supabase Auth)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profil = await apiFetch(`kullanicilar?auth_id=eq.${session.user.id}&select=*`);
        if (Array.isArray(profil) && profil[0]) {
          setKullanici(profil[0]);
          if (Platform.OS === 'web') {
            try {
              const f = localStorage.getItem(`etkinlink_favoriler_${profil[0].id}`);
              if (f) setFavoriler(JSON.parse(f));
              const karş = localStorage.getItem(`etkinlink_karsilastirma_${profil[0].id}`);
              if (karş) setKarsilastirmaListesi(JSON.parse(karş));
            } catch (e) {}
          }
        }
      }
    });
    // Auth değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setKullanici(null);
        setSahipKullanici(null);
      }
    });
    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  // 5. Hata yakalayan veriGetir
  async function veriGetir(yenile = false) {
    if (yenile) setYenileniyor(true); else setYukleniyor(true);
    setYuklenmeHatasi(null);
    try {
      const m = await apiFetch('mekanlar?select=*&aktif=eq.true&onay_durumu=eq.onaylandi&order=one_cikan.desc,puan.desc');
      const b = await apiFetch('sezonsal_bannerlar?select=*&aktif=eq.true&limit=1');
      const blog = await apiFetch('blog_yazilari?select=*&yayinda=eq.true&order=created_at.desc&limit=6');
      if (!Array.isArray(m)) {
        setYuklenmeHatasi('Mekanlar yüklenemedi. İnternet bağlantınızı kontrol edin.');
      } else {
        setMekanlar(m);
      }
      setBanner(Array.isArray(b) && b.length > 0 ? b[0] : null);
      setBlogYazilari(Array.isArray(blog) ? blog : []);
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
    if (Platform.OS === 'web') {
      try {
        const f = localStorage.getItem(`etkinlink_favoriler_${k.id}`);
        if (f) setFavoriler(JSON.parse(f));
        const karş = localStorage.getItem(`etkinlink_karsilastirma_${k.id}`);
        if (karş) setKarsilastirmaListesi(JSON.parse(karş));
      } catch (e) {}
    }
    setKullaniciPanelAcik(true);
  }

  async function kullaniciCikis() {
    const userId = kullanici?.id;
    setKullanici(null);
    setKullaniciPanelAcik(false);
    setFavoriler([]);
    setKarsilastirmaListesi([]);
    await supabase.auth.signOut();
    if (Platform.OS === 'web') {
      try {
        if (userId) {
          localStorage.removeItem(`etkinlink_favoriler_${userId}`);
          localStorage.removeItem(`etkinlink_karsilastirma_${userId}`);
        }
      } catch (e) {}
    }
  }

  function favoriToggle(mekanId) {
    setFavoriler(prev => {
      const yeni = prev.includes(mekanId) ? prev.filter(id => id !== mekanId) : [...prev, mekanId];
      if (Platform.OS === 'web') {
        try {
          const key = kullanici ? `etkinlink_favoriler_${kullanici.id}` : 'etkinlink_favoriler';
          localStorage.setItem(key, JSON.stringify(yeni));
        } catch(e) {}
      }
      return yeni;
    });
  }

  function karsilastirmaToggle(mekan) {
    setKarsilastirmaListesi(prev => {
      const varMi = prev.some(m => m.id === mekan.id);
      const yeni = varMi ? prev.filter(m => m.id !== mekan.id) : prev.length >= 3 ? [...prev.slice(1), mekan] : [...prev, mekan];
      if (Platform.OS === 'web') {
        try {
          const key = kullanici ? `etkinlink_karsilastirma_${kullanici.id}` : 'etkinlink_karsilastirma';
          localStorage.setItem(key, JSON.stringify(yeni));
        } catch(e) {}
      }
      return yeni;
    });
  }

  function teklifAc(mekan) {
    if ((mekan.iletisim_turu || 'form') === 'form') setSeciliMekan(mekan);
  }

  async function leadKaydet({ ad, telefon, kisi, notlar, tarih }) {
    const mekanIsim = seciliMekan.isim;
    const mekanSahipId = seciliMekan.sahip_id;
    let sahipEmail = null;

    try {
      // Lead'i kaydet
      const leadRes = await apiPost('leads', {
        mekan_id: seciliMekan.id,
        mekan_isim: mekanIsim,
        ad_soyad: ad,
        telefon,
        kisi_sayisi: kisi ? parseInt(kisi) : null,
        ana_kategori: anaKategori,
        alt_kategori: altKategori,
        notlar: notlar || null,
        etkinlik_tarihi: tarih || null,
        iletisim_turu: 'form',
        kullanici_id: kullanici?.id || null,
        sahip_id: mekanSahipId || null,
        durum: 'bekliyor',
      });
      if (!leadRes.ok) {
        const errText = await leadRes.text();
        console.log('Lead kayıt hatası:', errText);
      }

      // Mekan sahibi varsa: bakiye düş + email adresini çek
      if (mekanSahipId) {
        const sahipData = await apiFetch(`mekan_sahipleri?id=eq.${mekanSahipId}&select=bakiye,email`);
        if (Array.isArray(sahipData) && sahipData[0]) {
          sahipEmail = sahipData[0].email || null;
          if (sahipData[0].bakiye >= LEAD_UCRETI) {
            await apiPatch(`mekan_sahipleri?id=eq.${mekanSahipId}`, { bakiye: sahipData[0].bakiye - LEAD_UCRETI });
            await apiPost('bakiye_hareketleri', {
              sahip_id: mekanSahipId, miktar: -LEAD_UCRETI,
              aciklama: `Lead: ${ad} — ${mekanIsim}`, tur: 'lead',
            });
          }
        }
      }

      // Bildirim e-postası gönder (sahip emaili + mekan bilgileri ile)
      try {
        await fetch('https://svaqquywnidqecbcwaqe.supabase.co/functions/v1/lead-bildirim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({
            ad_soyad: ad,
            telefon,
            mekan_isim: mekanIsim,
            mekan_id: seciliMekan.id,
            sahip_id: mekanSahipId || null,
            sahip_email: sahipEmail,
            kisi_sayisi: kisi || null,
            alt_kategori: altKategori,
            notlar,
            etkinlik_tarihi: tarih,
          }),
        });
      } catch (mailErr) {
        console.log('Bildirim e-postası gönderilemedi:', mailErr.message);
      }
    } catch (e) {
      console.log('Lead hatası:', e.message);
    }

    setSeciliMekan(null);
    setBasariMesaji(`✓ Teklif talebiniz alındı! ${mekanIsim} ekibi en kısa sürede sizinle iletişime geçecek.`);
    setTimeout(() => setBasariMesaji(null), 5000);
  }

  const filtrelenmis = mekanlar.filter(m => {
    if (anaKategori !== 'hepsi' && anaKategori !== 'populer' && m.ana_kategori !== anaKategori) return false;
    if (anaKategori === 'populer' && !m.one_cikan) return false;
    if (altKategori && !(m.alt_kategori || []).includes(altKategori)) return false;
    if (fizikselFiltre && !(m.fiziksel_ozellikler || []).includes(fizikselFiltre)) return false;
    if (teknikFiltre && !(m.teknik_altyapi || []).includes(teknikFiltre)) return false;
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
        (m.teknik_altyapi || []).some(o => o.toLowerCase().includes(kelime)) ||
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

  // 5. Hata sayfası — yalnızca ilk yükleme başarısız olursa göster
  if (yuklenmeHatasi && mekanlar.length === 0 && !yukleniyor) {
    return <HataSayfasi hata={yuklenmeHatasi} onYeniden={() => veriGetir()} />;
  }

  if (seciliDetay) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="light" />
      <MekanDetay mekan={seciliDetay} onGeri={() => setSeciliDetay(null)} onTeklif={teklifAc} kullanici={kullanici} favoriler={favoriler} onFavoriToggle={favoriToggle} />
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
      {kullaniciGirisAcik && <KullaniciGirisEkrani onGiris={kullaniciGirisYap} onKapat={() => setKullaniciGirisAcik(false)} onGizlilikAc={() => setGizlilikAcik(true)} />}
      {kullaniciPanelAcik && kullanici && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 500, backgroundColor: C.bg }}>
          <KullaniciPaneli
            kullanici={kullanici}
            onKapat={() => setKullaniciPanelAcik(false)}
            onCikis={kullaniciCikis}
            onGizlilikAc={() => setGizlilikAcik(true)}
            favorilerDis={favoriler}
            karsilastirmaListesiDis={karsilastirmaListesi}
            onFavoriKaldir={favoriToggle}
            onKarsilastirmaGuncelle={setKarsilastirmaListesi}
          />
        </View>
      )}
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

      {/* Blog yazısı detay modal */}
      {seciliBlogYazi && (
        <BlogDetayModal yazi={seciliBlogYazi} onKapat={() => setSeciliBlogYazi(null)} />
      )}

      {/* Karşılaştırma modalı */}
      {karsilastirmaAcik && karsilastirmaListesi.length > 0 && (
        <KarsilastirmaModal
          mekanlar={karsilastirmaListesi}
          onKapat={() => setKarsilastirmaAcik(false)}
          onTeklif={(m) => { setKarsilastirmaAcik(false); teklifAc(m); }}
          onTopluTeklif={() => { setKarsilastirmaAcik(false); setTopluTeklifAcik(true); }}
          kullanici={kullanici}
        />
      )}

      {/* Toplu teklif formu */}
      {topluTeklifAcik && karsilastirmaListesi.length > 0 && (
        <TopluTeklifFormu
          mekanlar={karsilastirmaListesi}
          onKapat={() => setTopluTeklifAcik(false)}
          onGonder={async ({ ad, telefon, kisi, tarih, notlar, mekanlar: mkList }) => {
            for (const m of mkList) {
              try {
                await apiPost('leads', {
                  mekan_id: m.id, mekan_isim: m.isim,
                  ad_soyad: ad, telefon,
                  kisi_sayisi: kisi ? parseInt(kisi) : null,
                  notlar: notlar || null,
                  etkinlik_tarihi: tarih || null,
                  iletisim_turu: 'form',
                  kullanici_id: kullanici?.id || null,
                  sahip_id: m.sahip_id || null,
                });
              } catch(e) { console.log('Toplu lead hatası:', e.message); }
            }
            setTopluTeklifAcik(false);
            setBasariMesaji(`✓ ${mkList.length} mekana teklif talebiniz iletildi!`);
            setTimeout(() => setBasariMesaji(null), 5000);
          }}
          kullanici={kullanici}
          onGizlilikAc={() => setGizlilikAcik(true)}
        />
      )}

      {/* Karşılaştırma floating butonu */}
      {karsilastirmaListesi.length > 0 && !karsilastirmaAcik && !topluTeklifAcik && !kullaniciPanelAcik && !seciliDetay && (
        <TouchableOpacity
          onPress={() => setKarsilastirmaAcik(true)}
          style={{
            position: 'absolute', bottom: 24, right: 20, zIndex: 100,
            backgroundColor: C.midnight, borderRadius: 28,
            paddingHorizontal: 18, paddingVertical: 12,
            flexDirection: 'row', alignItems: 'center', gap: 8,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
          }}>
          <Text style={{ fontSize: 16 }}>⚖️</Text>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 13 }}>
            Karşılaştır ({karsilastirmaListesi.length})
          </Text>
        </TouchableOpacity>
      )}

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
            <EtkinlinkLogo size={IS_DESKTOP ? 56 : 44} />
            <View>
              <Text style={[styles.logoText, IS_DESKTOP && styles.logoTextDesktop]}>etkinlink</Text>
              <Text style={styles.slogan}>Kurumsal etkinlikleriniz için doğru mekan</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.pill, { backgroundColor: kullanici ? C.successSoft : C.white, borderColor: kullanici ? C.success : C.border }]}
              onPress={() => kullanici ? setKullaniciPanelAcik(true) : setKullaniciGirisAcik(true)}>
              <Text style={{ fontSize: 13, color: kullanici ? C.success : C.textMid, fontWeight: '600' }}>
                {kullanici ? `👤 ${kullanici.ad_soyad.split(' ')[0]}` : '👤 Giriş'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pill, { backgroundColor: sahipKullanici ? C.goldSoft : C.white, borderColor: C.gold }]}
              onPress={() => sahipKullanici ? setEkran('sahipPanel') : setEkran('sahipGiris')}>
              <Text style={{ fontSize: 13, color: C.gold, fontWeight: '600' }}>
                {sahipKullanici ? '🏢 Panelim' : '🏢 Mekan Ekle'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KURUMSAL HERO BANNER */}
        {!banner && (
          <View style={{ marginHorizontal: 16, marginBottom: 4, backgroundColor: C.midnight, borderRadius: 20, padding: 20,
            flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                KURUMSAL ETKİNLİK PLATFORMU
              </Text>
              <Text style={{ color: C.white, fontSize: 17, fontWeight: '800', lineHeight: 24, marginBottom: 8 }}>
                Etkinliğinize en{' '}uygun mekanı bulun
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 18 }}>
                Lansman · Konferans · Team Building{' '}Genel Kurul · Ödül Töreni
              </Text>
            </View>
            <Text style={{ fontSize: 48, marginLeft: 12 }}>🏛</Text>
          </View>
        )}

        {/* SEZON BANNER */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <SezonBanner banner={banner} />
        </View>

        {/* ARAMA */}
        <AramaCubugu arama={arama} setArama={setArama} />

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
          {TEKNIK_FILTRELER.map(f => (
            <TouchableOpacity key={f.id}
              style={[styles.filtrePill, teknikFiltre === f.id && { backgroundColor: C.midnight + '15', borderColor: C.midnight }]}
              onPress={() => setTeknikFiltre(teknikFiltre === f.id ? null : f.id)}>
              <Text style={styles.pillEmoji}>{f.emoji}</Text>
              <Text style={[styles.filtrePillText, teknikFiltre === f.id && { color: C.midnight, fontWeight: '700' }]}>{f.etiket}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 16, marginBottom: 8 }}>
          <Text style={styles.sonucSayisi}>{filtrelenmis.length} kurumsal mekan{arama ? ` "${arama}" için` : ''}</Text>
          {(arama || altKategori || fizikselFiltre || teknikFiltre) && (
            <TouchableOpacity onPress={() => { setArama(''); setAltKategori(null); setFizikselFiltre(null); setTeknikFiltre(null); }}>
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
              <MekanKarti key={mekan.id} mekan={mekan} onTeklif={teklifAc} onDetay={setSeciliDetay}
                romantikMod={romantikMod} index={index} kullanici={kullanici}
                favoriler={favoriler} onFavoriToggle={favoriToggle}
                karsilastirmaListesi={karsilastirmaListesi} onKarsilastirmaToggle={karsilastirmaToggle}
              />
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

        {/* BLOG KÖŞESİ */}
        {blogYazilari.length > 0 && (
          <View style={{ marginTop: 24, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, letterSpacing: -0.4 }}>📖 Blog & Rehber</Text>
                <Text style={{ fontSize: 12, color: C.textSoft, marginTop: 2 }}>Kurumsal etkinlik ipuçları</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
              {blogYazilari.map((yazi, i) => (
                <TouchableOpacity
                  key={yazi.id}
                  onPress={() => setSeciliBlogYazi(yazi)}
                  activeOpacity={0.88}
                  style={{
                    width: IS_DESKTOP ? 320 : SCREEN_WIDTH * 0.76,
                    backgroundColor: C.white, borderRadius: 16,
                    overflow: 'hidden', borderWidth: 1, borderColor: C.border,
                    shadowColor: '#1A1F36', shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.06, shadowRadius: 10,
                  }}>
                  {yazi.kapak_foto ? (
                    <Image source={{ uri: yazi.kapak_foto }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: '100%', height: 100, backgroundColor: C.midnight, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 36 }}>📝</Text>
                    </View>
                  )}
                  <View style={{ padding: 14 }}>
                    {(yazi.etiketler || []).length > 0 && (
                      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                        {yazi.etiketler.slice(0, 2).map((e, ei) => (
                          <View key={ei} style={{ backgroundColor: C.accentSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                            <Text style={{ fontSize: 10, color: C.accent, fontWeight: '700' }}>#{e}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, lineHeight: 20, marginBottom: 6 }} numberOfLines={2}>{yazi.baslik}</Text>
                    {yazi.ozet ? <Text style={{ fontSize: 12, color: C.textMid, lineHeight: 18 }} numberOfLines={2}>{yazi.ozet}</Text> : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <Text style={{ fontSize: 11, color: C.textSoft }}>{new Date(yazi.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                      <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Oku →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  header:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  logo:                { fontSize: 26, fontWeight: '800', color: C.midnight, letterSpacing: -1 },
  logoText:            { fontSize: IS_DESKTOP ? 21 : 17, fontWeight: '700', color: C.midnight, letterSpacing: -0.6 },
  logoTextDesktop:     { fontSize: 23, letterSpacing: -0.8 },
  logoEtkin:           { color: C.midnight, fontWeight: '500' },
  logoLink:            { color: C.gold, fontWeight: '800' },
  slogan:              { fontSize: 10, color: C.midnight, marginTop: 2, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '600', opacity: 0.5 },
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
  kart:                { backgroundColor: C.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border, shadowColor: '#1A1F36', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 14 },
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