# Payload collections proposées

## 1) pages
Usage : pages éditoriales et institutionnelles.

Champs recommandés :
- title : text, required, localized
- slug : text, required, unique per locale
- localeGroup : text, required
- status : select(draft,published)
- hero : group
  - eyebrow : text, localized
  - title : text, localized
  - subtitle : textarea, localized
  - backgroundImage : upload -> media
  - ctaPrimaryLabel : text, localized
  - ctaPrimaryUrl : text
  - ctaSecondaryLabel : text, localized
  - ctaSecondaryUrl : text
- layout : blocks
  - richTextSection
  - imageTextSplit
  - gallery
  - cardsGrid
  - faq
  - ctaBanner
  - bookingTeaser
- seo : group
  - metaTitle : text, localized
  - metaDescription : textarea, localized
  - noIndex : checkbox
  - socialImage : upload -> media
- featuredImage : upload -> media
- migratedFrom : group
  - wordpressId : text
  - wordpressSlug : text
  - originalUrl : text

## 2) media
Usage : images, logos, icônes, PDFs, vidéos courtes si nécessaire.

Champs recommandés :
- alt : text, localized
- caption : textarea, localized
- credit : text
- tags : array(text)
- focalX : number
- focalY : number
- migratedFromUrl : text

## 3) menus
Usage : navigation header/footer par langue.

Champs recommandés :
- name : text
- location : select(header,footer,legal)
- locale : select(fr,en,ja)
- items : array
  - label : text
  - type : select(page,url,anchor)
  - page : relationship -> pages
  - url : text
  - anchor : text
  - children : array (same shape, one level max recommended)
  - highlight : checkbox

## 4) bookableProducts
Usage : prestations réservables et offres à devis.

Champs recommandés :
- title : text, required, localized
- slug : text, required
- localeGroup : text, required
- status : select(draft,published)
- category : relationship or select(show-dinner,live-show,wedding,private-event,addon)
- summary : textarea, localized
- content : richText, localized
- heroImage : upload -> media
- gallery : relationship[] -> media
- priceType : select(fixed,per_person,per_group,custom_quote)
- basePrice : number
- currency : select(XPF,EUR,USD)
- options : array
  - key : text
  - label : text, localized
  - type : select(checkbox,radio,select,quantity)
  - required : checkbox
  - priceDelta : number
  - maxQuantity : number
  - values : array
    - value : text
    - label : text, localized
    - priceDelta : number
- attributes : array
  - name : text
  - value : text, localized
- bookingRuleSet : relationship -> bookingRuleSets
- paymentMode : select(online,quote_request,mixed)
- seo : group
  - metaTitle : text, localized
  - metaDescription : textarea, localized

## 5) bookingRuleSets
Usage : disponibilités et logique de réservation, sans historiques clients.

Champs recommandés :
- title : text
- code : text, unique
- active : checkbox
- timezone : text (Pacific/Tahiti)
- availabilityType : select(recurring,dated,mixed)
- openDays : array(select monday...sunday)
- slots : array
  - startTime : text (HH:mm)
  - endTime : text (HH:mm)
  - capacity : number
  - label : text
- blockedDates : array(date)
- seasonalRules : array
  - startDate : date
  - endDate : date
  - openDays : array
  - priceModifier : number
  - notes : text
- constraints : group
  - minParticipants : number
  - maxParticipants : number
  - leadTimeHours : number
  - cutoffTime : text
- notes : textarea

## 6) siteSettings
Usage : paramètres globaux du site.

Champs recommandés :
- siteName : text
- defaultLocale : select(fr,en,ja)
- supportedLocales : array(select fr,en,ja)
- logo : upload -> media
- favicon : upload -> media
- socialLinks : array
  - platform : text
  - url : text
- companyInfo : group
  - legalName : text
  - address : textarea
  - phone : text
  - email : email
- footerContent : richText, localized
- bookingCTA : group
  - label : text, localized
  - url : text

## 7) paymentSettings
Usage : structure fonctionnelle PayZen/OSB sans secrets critiques.

Champs recommandés :
- provider : select(payzen)
- enabled : checkbox
- mode : select(test,production)
- shopId : text
- currency : select(XPF,EUR,USD)
- successUrl : text
- failureUrl : text
- notifyUrl : text
- enabledMethods : array(text)
- notes : textarea

## Variables à mettre en .env et pas en collection
- PAYZEN_MODE
- PAYZEN_SHOP_ID
- PAYZEN_CERTIFICATE
- PAYZEN_ENDPOINT
- PAYZEN_SUCCESS_URL
- PAYZEN_FAILURE_URL
- PAYZEN_NOTIFY_URL
