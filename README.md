# VocabSwipe: A Microservices-Based Spaced Repetition Learning Platform

## Özet (Abstract)
Bu proje, kullanıcıların yabancı dil kelime dağarcıklarını genişletmelerini optimize etmek amacıyla tasarlanmış, Aralıklı Tekrar Sistemi (Spaced Repetition System - SRS) ve modern mobil arayüz paradigmalarını birleştiren tam yığın (full-stack) bir web/mobil uygulamasıdır. Sistem; arka uçta Next.js ve Clean Architecture prensipleri, ön uçta Flutter ve Riverpod, veri tabanı katmanında Prisma ve PostgreSQL kullanılarak inşa edilmiştir. Uygulamanın tüm bileşenleri Docker ile konteynerleştirilmiş ve Nginx ters vekili (reverse proxy) ile entegre edilmiştir.

## 1. Giriş (Introduction)
Öğrenme süreçlerinde bilginin kalıcılığını artırmak için geliştirilen Aralıklı Tekrar (SRS) algoritmaları, özellikle dil öğreniminde büyük başarı göstermektedir. "VocabSwipe" projesi, geleneksel Anki benzeri uygulamaların güçlü SRS algoritmalarını (SM-2) temel alırken, kullanıcı deneyimini modern, "Tinder tarzı" kart kaydırma (swipe) mekanikleriyle yenilikçi bir seviyeye taşımaktadır.

## 2. Sistem Mimarisi (System Architecture)

Sistem, ayrıştırılmış (decoupled) bir mimari üzerine kurulmuştur. Ön uç ve arka uç süreçleri birbirinden bağımsız konteynerlerde çalışmaktadır.

### 2.1 Backend Mimarisi (Clean Architecture)
Arka uç uygulaması, Next.js (App Router) altyapısı üzerinde kurumsal mimari kalıplarından olan Temiz Mimari (Clean Architecture) kurallarına göre tasarlanmıştır:
- **Domain Katmanı:** Hiçbir dış kütüphaneye bağımlılığı olmayan, saf TypeScript ile yazılmış `SrsData` ve `SrsAlgorithm` nesnelerini içerir.
- **Application Katmanı:** İş akışlarını (Use Cases) ve Data Transfer Object (DTO) dönüşümlerini yönetir. (Örn: `ReviewCardUseCase`)
- **Infrastructure Katmanı:** Prisma ORM, Global Error Handler (`apiHandler.ts`) ve dış bağlantıları içerir.

### 2.2 Frontend Mimarisi (Flutter & Riverpod)
Kullanıcı arayüzü Flutter ile web platformu (dart2js / CanvasKit) hedeflenerek geliştirilmiştir:
- **Durum Yönetimi (State Management):** Uygulama içi durumlar (Auth, Kartlar vb.) `flutter_riverpod` ile asenkron (FutureProvider / Notifier) olarak yönetilmektedir.
- **Yönlendirme (Routing):** `go_router` kullanılarak, kimlik doğrulama durumuna (AuthState) dayalı otomatik güvenlik kalkanları (Redirect Guards) implemente edilmiştir.
- **Kullanıcı Arayüzü (UI):** Zümrüt Yeşili (Emerald) tonlarında, Glassmorphism detaylarına sahip modern bir kart kaydırma (`flutter_card_swiper`) ekranı tasarlanmıştır.

### 2.3 Aralıklı Tekrar Algoritması (SM-2)
Projede kullanılan SM-2 algoritması, kartın ne kadar kolay hatırlandığına bağlı olarak bir sonraki gösterim tarihini dinamik olarak hesaplar. Sağa kaydırma (Kolay) ve Sola kaydırma (Zor) eylemleri spesifik puanlara (Grade) dönüştürülerek formüle sokulur:
- **Interval (Aralık):** Kartın kaç gün sonra tekrar gösterileceği.
- **Repetitions (Tekrar):** Peş peşe doğru bilinme serisi.
- **Ease Factor (Kolaylık Faktörü):** Öğrenme hızının asimptotik katsayısı.

## 3. Güvenlik ve Kimlik Doğrulama (Security)
Uygulamanın yetkilendirme mekanizması JWT (JSON Web Token) ve Google Sign-In tabanlıdır. İstemci tarafında tokenlar, `flutter_secure_storage` kullanılarak şifrelenmiş belleklerde tutulur. Tüm dış istekler (API Calls), Dio Interceptor mimarisi üzerinden geçerek otomatik yetkilendirme (Bearer Token) ve `401 Unauthorized` durumlarında sessiz yenileme işlemlerini uygular.

## 4. Konteynerleştirme ve Dağıtım (Containerization)
Tüm servisler (PostgreSQL, Next.js API, Flutter Web, Nginx) Docker kullanılarak mikroservis mimarisine uygun şekilde ayağa kaldırılmıştır. 
- `nginx_dispatcher`: Dışarıdan gelen HTTP isteklerini yönlendiren Reverse Proxy. API isteklerini `nextjs_api` konteynerine, diğer tüm statik kaynak isteklerini ise `flutter_web` konteynerine iletir.

## 5. Sonuç (Conclusion)
Bu proje, modern yazılım mimarisi prensiplerinin (Separation of Concerns, Dependency Injection, Containerization) pratik bir uygulamasını sergilerken, bilişsel psikoloji temelli öğrenme modellerini eğlenceli ve akıcı bir kullanıcı arayüzü ile başarılı bir şekilde son kullanıcıya sunmaktadır.

---
