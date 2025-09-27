# Discord Social Bot

Discord.js v14 ile yazılmış, prefix tabanlı bir Discord botu. Coin sistemi, sandık etkinlikleri, ship kartları ve tweet oluşturma özelliklerine sahip.

## Özellikler

### 💰 Coin Sistemi
- `.coin` - Coin durumunuzu görüntüleyin
- `.profil` - Detaylı profil bilgilerinizi görüntüleyin
- `.coin-gönder @kullanıcı miktar` - Başka kullanıcılara coin gönderin
- `.liderlik` - Sunucudaki en zengin 10 kullanıcıyı görüntüleyin

### 🎁 Sandık Etkinliği
- Her 25 mesajda otomatik olarak çıkar
- 5 butondan doğru olanı seçen +5000 coin kazanır
- 30 saniye süre sınırı

### 💕 Ship Kartları
- `.ship @kullanıcı1 @kullanıcı2` - İki kullanıcı arasında ship kartı oluşturun
- Rastgele uyumluluk yüzdesi
- Görsel API entegrasyonu

### 🐦 Tweet Sistemi
- `.tweet` - Tweet sistemi menüsünü açar
- Modal ile tweet oluşturma
- Like ve yeniden oluştur butonları
- Görsel API entegrasyonu

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd discord-social-bot
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Bot token'ınızı ayarlayın:
   - Discord Developer Portal'dan bot oluşturun
   - Token'ı `config.json` dosyasındaki `YOUR_BOT_TOKEN_HERE` yerine yazın

4. Botu başlatın:
```bash
npm start
```

## Gereksinimler

- Node.js 16.9.0 veya üzeri
- Discord.js v14
- Axios

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `.coin` | Coin durumunuzu görüntüleyin |
| `.profil` | Profil bilgilerinizi görüntüleyin |
| `.coin-gönder @kullanıcı miktar` | Coin gönderin |
| `.liderlik` | Liderlik tablosunu görüntüleyin |
| `.ship @kullanıcı1 @kullanıcı2` | Ship kartı oluşturun |
| `.tweet` | Tweet sistemi menüsünü açın |
| `.yardım` | Tüm komutları listeler |

## Veri Saklama

Bot, coin verilerini `coins.json` dosyasında saklar. Bu dosya otomatik olarak oluşturulur ve güncellenir.

## Lisans

MIT
