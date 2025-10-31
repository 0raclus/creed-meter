#!/usr/bin/env python3
import json

# Load schools
with open('src/data/schools.json', 'r', encoding='utf-8') as f:
    schools = json.load(f)

print(f"📊 Başlangıç: {len(schools)} mezhep\n")

# 1. DUPLICATE MEZHEPLER SİL
print("1️⃣ DUPLICATE MEZHEPLER SİLİYORUM...")
seen_ids = set()
unique_schools = []
duplicates = []

for school in schools:
    if school['id'] not in seen_ids:
        seen_ids.add(school['id'])
        unique_schools.append(school)
    else:
        duplicates.append(school['id'])

print(f"   ✅ {len(duplicates)} duplicate silindi: {', '.join(set(duplicates))}")
print(f"   📊 Kalan: {len(unique_schools)} mezhep\n")

schools = unique_schools

# 2. ZENGİNLEŞTİRİLMİŞ PROFİLLER EKLE
print("2️⃣ ZENGİNLEŞTİRİLMİŞ PROFİLLER EKLİYORUM...")

# Soft Contrast renk paleti
colors = {
    'esari': 'rgb(170 198 173)',      # Mint
    'maturidi': 'rgb(168 185 119)',   # Cucumber
    'hanafi': 'rgb(228 208 133)',     # Lemon
    'shafii': 'rgb(235 153 119)',     # Grapefruit
    'maliki': 'rgb(170 198 173)',     # Mint
    'hanbeli': 'rgb(220 49 47)',      # Strawberry
    'selefi': 'rgb(168 185 119)',     # Cucumber
    'sufi': 'rgb(170 198 173)',       # Mint
    'mutazila': 'rgb(235 153 119)',   # Grapefruit
    'twelver_shia': 'rgb(228 208 133)' # Lemon
}

enrichments = {
    'esari': {
        'keyFigures': ['İmam Ebu\'l-Hasan el-Eş\'arî', 'İmam Gazali', 'Fahreddin er-Razi', 'İmam Cüveynî', 'İmam Bâkıllânî'],
        'keyBooks': ['İhya-u Ulumiddin (Gazali)', 'Mefatih\'ul-Gayb (Razi)', 'el-Luma\' (Eş\'arî)', 'el-İrşad (Cüveynî)', 'Kitab\'ut-Temhid (Bâkıllânî)'],
        'modernCommunities': ['Türkiye', 'Mısır', 'Suriye', 'Ürdün', 'Fas', 'Cezayir'],
        'estimatedFollowers': '200-300 milyon',
        'relatedSchools': ['Şâfiî', 'Mâlikî'],
        'commonMisconceptions': [
            'Eş\'arîler akılcı değildir (YANLIŞ - Akıl ve nakil dengesini savunurlar)',
            'Eş\'arîler cebriyedir (YANLIŞ - Kesb teorisi ile özgür iradeyi kabul ederler)',
            'Eş\'arîler Mu\'tezile\'dir (YANLIŞ - Mu\'tezile\'nin aşırı akılcılığına karşı çıkarlar)'
        ],
        'faqs': [
            {'q': 'Eş\'arî ile Mâtürîdî farkı nedir?', 'a': 'Her ikisi de Ehl-i Sünnet akaidini savunur ancak bazı detaylarda farklılaşırlar. Eş\'arîler sıfatlarda te\'vil yaparken, Mâtürîdîler tefviz yolunu tercih eder. Mâtürîdîler akla biraz daha fazla yer verir.'},
            {'q': 'Eş\'arîler hangi fıkıh mezhebini takip eder?', 'a': 'Eş\'arî akidesi genellikle Şâfiî ve Mâlikî fıkıh mezhepleriyle birlikte görülür. Ancak bu zorunlu değildir.'},
            {'q': 'Kesb teorisi nedir?', 'a': 'İnsan fiillerinin Allah tarafından yaratıldığını ama insanın bu fiilleri "kesb" (kazanma) yoluyla kendine mal ettiğini savunan teoridir. Böylece hem ilahi takdir hem de insan sorumluluğu korunur.'}
        ],
        'icon': '/icons/esari.svg',
        'color': colors['esari'],
        'pattern': 'geometric'
    },
    'maturidi': {
        'keyFigures': ['İmam Ebu Mansur el-Mâtürîdî', 'Ebu\'l-Muîn en-Nesefî', 'Nureddin es-Sâbûnî', 'Alâeddin es-Semerkandî'],
        'keyBooks': ['Kitab\'ut-Tevhid (Mâtürîdî)', 'Tebsırat\'ul-Edille (Nesefî)', 'el-Bidâye (Sâbûnî)', 'Şerh\'ul-Akaid (Taftazânî)'],
        'modernCommunities': ['Türkiye', 'Orta Asya', 'Hindistan', 'Pakistan', 'Afganistan', 'Balkanlar'],
        'estimatedFollowers': '400-500 milyon',
        'relatedSchools': ['Hanefî'],
        'commonMisconceptions': [
            'Mâtürîdîler Eş\'arî\'den farklı değildir (YANLIŞ - Önemli farklar vardır)',
            'Mâtürîdîler sadece Türkiye\'de vardır (YANLIŞ - Orta Asya ve Hindistan\'da da yaygındır)',
            'Mâtürîdîlik yeni bir mezheptir (YANLIŞ - 10. yüzyıldan beri vardır)'
        ],
        'faqs': [
            {'q': 'Mâtürîdî ile Eş\'arî arasındaki temel fark nedir?', 'a': 'Mâtürîdîler akla daha fazla yer verir ve sıfatlarda tefviz (Allah\'a havale) yolunu tercih eder. Eş\'arîler ise te\'vil (yorumlama) yapar.'},
            {'q': 'Mâtürîdîlik neden Hanefî fıkhıyla birlikte görülür?', 'a': 'Her ikisi de Orta Asya\'da ortaya çıkmış ve Osmanlı İmparatorluğu tarafından benimsenmiştir. Ancak bu zorunlu bir ilişki değildir.'},
            {'q': 'Türkiye Diyanet hangi akideyi benimser?', 'a': 'Türkiye Diyanet İşleri Başkanlığı resmi olarak Mâtürîdî akidesini benimser.'}
        ],
        'icon': '/icons/maturidi.svg',
        'color': colors['maturidi'],
        'pattern': 'floral'
    },
    'hanafi': {
        'keyFigures': ['İmam Ebu Hanife', 'İmam Ebu Yusuf', 'İmam Muhammed eş-Şeybânî', 'İmam Tahâvî', 'İbn Âbidîn'],
        'keyBooks': ['el-Mebsût (Serahsî)', 'Hidâye (Merginânî)', 'Redd\'ul-Muhtâr (İbn Âbidîn)', 'Fetâvâ-yı Hindiyye', 'el-Muhît (Burhâneddîn)'],
        'modernCommunities': ['Türkiye', 'Pakistan', 'Hindistan', 'Afganistan', 'Orta Asya', 'Balkanlar', 'Mısır'],
        'estimatedFollowers': '500-600 milyon (en yaygın fıkıh mezhebi)',
        'relatedSchools': ['Mâtürîdî'],
        'commonMisconceptions': [
            'Hanefîler rey\'i hadisten üstün tutar (YANLIŞ - Rey sadece hadis yoksa kullanılır)',
            'Hanefîler bid\'atçıdır (YANLIŞ - Usul konusunda esnek ama akide konusunda muhafazakardır)',
            'Hanefîlik sadece Osmanlı mezhebıdir (YANLIŞ - Orta Asya ve Hindistan\'da da çok yaygındır)'
        ],
        'faqs': [
            {'q': 'Hanefî mezhebinin en önemli özelliği nedir?', 'a': 'Rey (akıl yürütme) ve kıyasa geniş yer vermesi. Bu sayede değişen şartlara uyum sağlayan esnek bir fıkıh anlayışı geliştirilmiştir.'},
            {'q': 'Hanefî mezhebı neden en yaygın mezheptir?', 'a': 'Osmanlı İmparatorluğu\'nun resmi mezhebi olması ve Orta Asya ile Hindistan\'da yaygınlaşması nedeniyle.'},
            {'q': 'Hanefîler hangi akideyi benimser?', 'a': 'Genellikle Mâtürîdî akidesini benimserler.'}
        ],
        'icon': '/icons/hanafi.svg',
        'color': colors['hanafi'],
        'pattern': 'geometric'
    },
    'shafii': {
        'keyFigures': ['İmam Şâfiî', 'İmam Nevevî', 'İmam Suyûtî', 'İmam Gazzâlî', 'İmam Râzî'],
        'keyBooks': ['er-Risâle (Şâfiî)', 'el-Umm (Şâfiî)', 'el-Mecmû\' (Nevevî)', 'Minhâc\'ut-Tâlibîn (Nevevî)', 'el-Muhazzab (Şîrâzî)'],
        'modernCommunities': ['Mısır', 'Yemen', 'Endonezya', 'Malezya', 'Doğu Afrika', 'Güneydoğu Asya'],
        'estimatedFollowers': '200-300 milyon',
        'relatedSchools': ['Eş\'arî'],
        'commonMisconceptions': [
            'Şâfiîler sadece hadis takipçisidir (YANLIŞ - Hadis ve rey dengesini savunurlar)',
            'Şâfiîler Hanbelîlerle aynıdır (YANLIŞ - Metodolojik olarak farklıdırlar)',
            'Şâfiîlik sadece Arap dünyasında vardır (YANLIŞ - Güneydoğu Asya\'da çok yaygındır)'
        ],
        'faqs': [
            {'q': 'Şâfiî mezhebinin en önemli özelliği nedir?', 'a': 'Fıkıh metodolojisinde sistematiklik ve kesinlik arayışı. İmam Şâfiî, fıkıh usulünü ilk sistematize eden kişidir.'},
            {'q': 'Şâfiîler hangi akideyi benimser?', 'a': 'Genellikle Eş\'arî akidesini benimserler.'},
            {'q': 'Şâfiî mezhebı neden Güneydoğu Asya\'da yaygındır?', 'a': 'Ticaret yolları ve Arap tüccarlar aracılığıyla bu bölgeye yayılmıştır.'}
        ],
        'icon': '/icons/shafii.svg',
        'color': colors['shafii'],
        'pattern': 'floral'
    },
    'maliki': {
        'keyFigures': ['İmam Mâlik bin Enes', 'İmam Şâtıbî', 'Kādî İyâz', 'İbn Rüşd (Hafîd)', 'İbn Abdilberr'],
        'keyBooks': ['el-Muvatta\' (Mâlik)', 'el-Mudavvene (Sahnûn)', 'el-Muvâfakāt (Şâtıbî)', 'Bidâyet\'ul-Müctehid (İbn Rüşd)'],
        'modernCommunities': ['Fas', 'Cezayir', 'Tunus', 'Libya', 'Moritanya', 'Mali', 'Senegal', 'Sudan'],
        'estimatedFollowers': '100-150 milyon',
        'relatedSchools': ['Eş\'arî'],
        'commonMisconceptions': [
            'Mâlikîler sadece Mağrib\'de vardır (YANLIŞ - Batı Afrika\'da da çok yaygındır)',
            'Mâlikîler maslahatı nasslardan üstün tutar (YANLIŞ - Maslahat nasslarla çelişmez)',
            'Mâlikîlik en eski mezheptir (YANLIŞ - Hanefî mezhebı daha eskidir)'
        ],
        'faqs': [
            {'q': 'Mâlikî mezhebinin en önemli özelliği nedir?', 'a': 'Maslahat (kamu yararı) kavramını merkeze alması ve Medine\'nin uygulamalarına önem vermesi.'},
            {'q': 'Mâlikîler hangi akideyi benimser?', 'a': 'Genellikle Eş\'arî akidesini benimserler.'},
            {'q': 'İstislah nedir?', 'a': 'Nassda açık hüküm olmayan konularda kamu yararını gözetme yöntemidir.'}
        ],
        'icon': '/icons/maliki.svg',
        'color': colors['maliki'],
        'pattern': 'geometric'
    },
    'hanbeli': {
        'keyFigures': ['İmam Ahmed bin Hanbel', 'İbn Teymiyye', 'İbn Kayyim el-Cevziyye', 'İbn Kudâme', 'Muvaffakuddîn İbn Kudâme'],
        'keyBooks': ['el-Müsned (Ahmed bin Hanbel)', 'el-Muğnî (İbn Kudâme)', 'Mecmû\'ul-Fetâvâ (İbn Teymiyye)', 'İ\'lâm\'ul-Muvakkıîn (İbn Kayyim)'],
        'modernCommunities': ['Suudi Arabistan', 'Katar', 'BAE', 'Suriye', 'Filistin'],
        'estimatedFollowers': '50-100 milyon',
        'relatedSchools': ['Selefî', 'Atharî'],
        'commonMisconceptions': [
            'Hanbelîler kıyası tamamen reddeder (YANLIŞ - Sınırlı kullanırlar)',
            'Hanbelîler Selefîlerle aynıdır (YANLIŞ - Hanbelî bir fıkıh mezhebi, Selefîlik bir harekettir)',
            'Hanbelîler teşbih yapar (YANLIŞ - Sıfatlarda zahiri anlayışı benimserler ama teşbih yapmazlar)'
        ],
        'faqs': [
            {'q': 'Hanbelî mezhebinin en önemli özelliği nedir?', 'a': 'Nassalara (Kur\'an ve Sünnet) sıkı bağlılık ve rey\'e karşı tutumlu olmak.'},
            {'q': 'Hanbelîler hangi akideyi benimser?', 'a': 'Atharî (Selef) akidesini benimserler.'},
            {'q': 'İbn Teymiyye Hanbelî miydi?', 'a': 'Evet, İbn Teymiyye Hanbelî mezhebine mensuptu ancak bazı konularda bağımsız içtihat da yapmıştır.'}
        ],
        'icon': '/icons/hanbeli.svg',
        'color': colors['hanbeli'],
        'pattern': 'geometric'
    },
    'selefi': {
        'keyFigures': ['Muhammed bin Abdulvehhab', 'Şeyh Albânî', 'İbn Bâz', 'İbn Useymîn', 'Muhammed Sâlih el-Muneccid'],
        'keyBooks': ['Kitab\'ut-Tevhid (Muhammed bin Abdulvehhab)', 'Feth\'ul-Mecîd (Abdurrahman bin Hasan)', 'Silsilet\'ul-Ehâdîs\'is-Sahîha (Albânî)'],
        'modernCommunities': ['Suudi Arabistan', 'Mısır', 'Körfez ülkeleri', 'Kuzey Afrika', 'Batı (diaspora)'],
        'estimatedFollowers': '50-100 milyon',
        'relatedSchools': ['Hanbelî', 'Atharî'],
        'commonMisconceptions': [
            'Selefîler mezhep karşıtıdır (KISMEN DOĞRU - Mezhep taklidi karşıtıdırlar ama Hanbelî fıkhına yakındırlar)',
            'Selefîler Vehhâbîdir (KISMEN DOĞRU - Vehhâbîlik Selefîliğin bir koludur)',
            'Selefîler şiddet yanlısıdır (YANLIŞ - Çoğunluk apolitik ve barışçıldır)'
        ],
        'faqs': [
            {'q': 'Selefîlik nedir?', 'a': 'Kur\'an ve Sünnet\'e doğrudan dönüş yaparak, ilk üç neslin (Selef) yolunu takip etmeyi amaçlayan bir harekettir.'},
            {'q': 'Selefîler hangi fıkıh mezhebini takip eder?', 'a': 'Mezhep taklidi yapmamayı tercih ederler ama pratikte Hanbelî fıkhına yakındırlar.'},
            {'q': 'Selefîlik ile Vehhâbîlik arasındaki fark nedir?', 'a': 'Vehhâbîlik, Muhammed bin Abdulvehhab tarafından kurulan ve Suudi Arabistan\'da yaygın olan Selefîliğin bir koludur.'}
        ],
        'icon': '/icons/selefi.svg',
        'color': colors['selefi'],
        'pattern': 'geometric'
    },
    'sufi': {
        'keyFigures': ['Hasan el-Basrî', 'Rabia el-Adeviyye', 'İmam Gazali', 'İbn Arabî', 'Mevlânâ Celâleddîn Rûmî', 'Abdulkadir Geylânî'],
        'keyBooks': ['İhya-u Ulumiddin (Gazali)', 'Fusûs\'ul-Hikem (İbn Arabî)', 'Mesnevî (Mevlânâ)', 'Risâle-i Kuşeyriyye (Kuşeyrî)', 'Kimyâ-yı Saâdet (Gazali)'],
        'modernCommunities': ['Tüm İslam dünyası (özellikle Türkiye, Pakistan, Mısır, Fas, Endonezya)'],
        'estimatedFollowers': '200-300 milyon',
        'relatedSchools': ['Hanefî', 'Şâfiî', 'Mâlikî'],
        'commonMisconceptions': [
            'Tasavvuf bid\'attir (YANLIŞ - Zühd ve takva İslam\'ın özündendir)',
            'Sûfîler şeriatı terk eder (YANLIŞ - Hakiki tasavvuf şeriat üzerine kuruludur)',
            'Tasavvuf sadece tarikat demektir (YANLIŞ - Tasavvuf bir iç hayat ve maneviyat anlayışıdır)'
        ],
        'faqs': [
            {'q': 'Tasavvuf nedir?', 'a': 'İslam\'ın iç boyutu, maneviyat, zühd, takva ve ihlas vurgusu yapan bir gelenektir.'},
            {'q': 'Tarikat nedir?', 'a': 'Tasavvufi eğitim ve pratiklerin organize edildiği yapılardır. Şeyh-mürid ilişkisi üzerine kuruludur.'},
            {'q': 'Selefîler tasavvufu neden reddeder?', 'a': 'Selefîler tasavvufun bazı pratiklerini (tarikat, zikir, türbe ziyareti) bid\'at olarak görürler. Ancak zühd ve takvayı kabul ederler.'}
        ],
        'icon': '/icons/sufi.svg',
        'color': colors['sufi'],
        'pattern': 'floral'
    },
    'mutazila': {
        'keyFigures': ['Vâsıl bin Atâ', 'Amr bin Ubeyd', 'Nazzâm', 'Câhiz', 'Kādî Abdülcebbâr'],
        'keyBooks': ['Şerh\'ul-Usûl\'il-Hamse (Kādî Abdülcebbâr)', 'el-Muğnî (Kādî Abdülcebbâr)', 'Kitâb\'ul-Hayevân (Câhiz)'],
        'modernCommunities': ['Çok az (modernist İslam hareketleri tarafından yeniden değerlendiriliyor)'],
        'estimatedFollowers': '1-5 milyon (çoğunlukla akademik ilgi)',
        'relatedSchools': ['Modernist İslam', 'Liberal İslam'],
        'commonMisconceptions': [
            'Mu\'tezile kâfirdir (YANLIŞ - Ehl-i Sünnet\'ten farklı ama Müslümandır)',
            'Mu\'tezile tamamen yok olmuştur (KISMEN DOĞRU - Klasik Mu\'tezile yok ama fikirleri yaşıyor)',
            'Mu\'tezile akılcılığı İslam\'a aykırıdır (YANLIŞ - Akıl İslam\'da önemlidir)'
        ],
        'faqs': [
            {'q': 'Mu\'tezile\'nin beş ilkesi nedir?', 'a': 'Tevhid (Allah\'ın birliği), Adl (adalet), Va\'d ve Vaîd (vaat ve tehdit), Menzile beyne\'l-menzileteyn (iki durum arası), Emr-i bi\'l-ma\'rûf ve nehy-i ani\'l-münker (iyiliği emretme kötülükten sakındırma).'},
            {'q': 'Mu\'tezile neden Kur\'an\'ın yaratılmış olduğunu savunur?', 'a': 'Allah\'ın birliğini (tevhid) korumak için. Eğer Kur\'an ezeli olsaydı, Allah\'la birlikte ezeli bir varlık olurdu.'},
            {'q': 'Mu\'tezile günümüzde var mı?', 'a': 'Klasik Mu\'tezile yok ama fikirleri modernist İslam hareketleri tarafından yeniden değerlendiriliyor.'}
        ],
        'icon': '/icons/mutazila.svg',
        'color': colors['mutazila'],
        'pattern': 'geometric'
    },
    'twelver_shia': {
        'keyFigures': ['İmam Cafer es-Sâdık', 'Şeyh Mufîd', 'Şeyh Tûsî', 'Allâme Hillî', 'Ayetullah Sistânî', 'Ayetullah Hâmeneî'],
        'keyBooks': ['el-Kâfî (Küleynî)', 'Men lâ Yahduruhu\'l-Fakīh (Sadûk)', 'Tehzîb\'ul-Ahkâm (Tûsî)', 'el-İstibsâr (Tûsî)'],
        'modernCommunities': ['İran', 'Irak', 'Lübnan', 'Bahreyn', 'Azerbaycan', 'Pakistan (Hazara)'],
        'estimatedFollowers': '150-200 milyon',
        'relatedSchools': ['Zeydî Şia', 'İsmâilî Şia'],
        'commonMisconceptions': [
            'Şiîler Kur\'an\'ı değiştirmiştir (YANLIŞ - Aynı Kur\'an\'ı kullanırlar)',
            'Şiîler sahabeye küfreder (KISMEN YANLIŞ - Bazı sahabeyi eleştirirler ama hepsine küfretmezler)',
            'Şiîler Ali\'yi peygamberden üstün tutar (YANLIŞ - Ali\'yi çok severler ama peygamberden üstün tutmazlar)'
        ],
        'faqs': [
            {'q': 'On İki İmam kimlerdir?', 'a': 'Ali, Hasan, Hüseyin, Zeynelâbidîn, Muhammed el-Bâkır, Cafer es-Sâdık, Musa el-Kâzım, Ali er-Rızâ, Muhammed el-Cevâd, Ali el-Hâdî, Hasan el-Askerî, Muhammed el-Mehdî.'},
            {'q': 'Velâyet-i Fakīh nedir?', 'a': 'İmam Humeyni tarafından geliştirilen, İslam âlimlerinin (fakihlerin) siyasi liderlik yapması gerektiğini savunan teoridir.'},
            {'q': 'Şiîler ile Sünnîler arasındaki temel fark nedir?', 'a': 'Şiîler Hz. Peygamber\'in vefatından sonra Hz. Ali\'nin halife olması gerektiğini savunurlar ve İmamet konseptine inanırlar.'}
        ],
        'icon': '/icons/twelver_shia.svg',
        'color': colors['twelver_shia'],
        'pattern': 'floral'
    }
}

enriched_count = 0
for school in schools:
    if school['id'] in enrichments:
        school.update(enrichments[school['id']])
        print(f"   ✅ {school['name']}: Zenginleştirildi")
        enriched_count += 1

print(f"   📊 Toplam {enriched_count} mezhep zenginleştirildi\n")

# Save
with open('src/data/schools.json', 'w', encoding='utf-8') as f:
    json.dump(schools, f, ensure_ascii=False, indent=2)

print("✅ DÜZELTMELER TAMAMLANDI!")
print(f"📁 Dosya kaydedildi: src/data/schools.json")
print(f"📊 Toplam mezhep: {len(schools)}")

