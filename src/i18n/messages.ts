/** UI-only copy (Arabic RTL / English). Product names & API payloads stay untranslated. */

export type Locale = 'en' | 'ar'

export type MessageKey =
  /** Breadcrumb */
  | 'crumb.homepage'
  | 'crumb.women'
  | 'crumb.fashionFallback'
  | 'crumb.sneakersFallback'
  | 'crumb.productDetailFallback'
  /** Cart drawer */
  | 'cart.title'
  | 'cart.close'
  | 'cart.empty'
  | 'cart.remove'
  | 'cart.subtotal'
  | 'cart.checkoutNote'
  | 'cart.checkoutButton'
  | 'cart.decLineQty'
  | 'cart.incLineQty'
  /** Checkout modal (generic demo purchase flow) */
  | 'checkout.title'
  | 'checkout.closeAria'
  | 'checkout.summaryHeading'
  | 'checkout.contactHeading'
  | 'checkout.labelFullName'
  | 'checkout.labelEmail'
  | 'checkout.labelAddress'
  | 'checkout.labelCity'
  | 'checkout.labelPostcode'
  | 'checkout.demoDisclaimer'
  | 'checkout.emptyTitle'
  | 'checkout.emptyBody'
  | 'checkout.backToBasket'
  | 'checkout.placeOrder'
  | 'checkout.successTitle'
  | 'checkout.successBody'
  | 'checkout.orderRef'
  | 'checkout.done'
  /** PDP load error */
  | 'error.productNotFound'
  | 'error.feedUnreachableBody'
  | 'error.retryButton'
  /** Error boundary */
  | 'fatal.title'
  | 'fatal.genericMessage'
  | 'fatal.tryAgain'
  | 'fatal.reload'
  /** Favourites drawer */
  | 'fav.title'
  | 'fav.close'
  | 'fav.empty'
  | 'fav.remove'
  /** Footer */
  | 'brand.anyday'
  | 'footer.copyrightBrand'
  | 'footer.langMenu'
  | 'footer.langEnglish'
  | 'footer.langArabic'
  | 'footer.currencyUsd'
  | 'footer.newsletterAria'
  | 'footer.newsletterPlaceholder'
  | 'footer.newsletterLabel'
  | 'footer.newsletterSubmit'
  | 'footer.col.shop'
  | 'footer.link.myAccount'
  | 'footer.link.login'
  | 'footer.link.wishlist'
  | 'footer.link.cart'
  | 'footer.col.information'
  | 'footer.link.shippingPolicy'
  | 'footer.link.returnsRefunds'
  | 'footer.link.cookiesPolicy'
  | 'footer.link.frequentlyAsked'
  | 'footer.col.company'
  | 'footer.link.aboutUs'
  | 'footer.link.privacyPolicy'
  | 'footer.link.termsConditions'
  | 'footer.link.contactUs'
  | 'footer.localeEnglishShort'
  | 'footer.localeArabicShort'
  /** PDP gallery */
  | 'gallery.enlarge'
  | 'gallery.share'
  | 'gallery.saveLater'
  | 'gallery.removeSaved'
  | 'gallery.controls'
  | 'gallery.carouselNav'
  | 'gallery.prevSlide'
  | 'gallery.nextSlide'
  | 'gallery.closeZoom'
  | 'gallery.enlargedAltSuffix'
  /** Go to top */
  | 'gotoTop'
  /** Header */
  | 'header.promo'
  | 'header.localTimeAria'
  | 'header.search'
  | 'header.categories'
  | 'header.signIn'
  | 'header.savedItems'
  | 'header.basket'
  | 'header.menuOpen'
  | 'header.menuClose'
  | 'header.mobilePrimaryNav'
  | 'header.signInRegister'
  | 'header.nav.shopHeading'
  | 'header.link.womenNav'
  | 'header.link.beauty'
  | 'header.link.homeGarden'
  | 'header.link.babyChild'
  | 'header.link.menNav'
  | 'header.link.offers'
  | 'header.nav.informationHeading'
  | 'header.footerLink.delivery'
  | 'header.footerLink.returns'
  | 'header.footerLink.contact'
  | 'header.footerLink.trackOrder'
  | 'header.nav.companyHeading'
  | 'header.footerLink.about'
  | 'header.footerLink.careers'
  | 'header.footerLink.press'
  | 'header.footerLink.sustainability'
  | 'headerCLUSTER.shop.links.women'
  | 'headerCLUSTER.shop.links.men'
  | 'headerCLUSTER.shop.links.kids'
  | 'headerCLUSTER.shop.links.home'
  /* skip duplicate - use numbered */
  /** Product rails prop titles from keys */
  | 'rails.relatedProduct'
  | 'rails.popularThisWeek'
  | 'rails.viewAll'
  | 'rails.viewAllAz'
  | 'rails.favAriaRemove'
  | 'rails.favAriaAdd'
  | 'rails.favTipSaved'
  | 'rails.favTipAdd'
  | 'rails.addToCartAria'
  /** PDP buying */
  | 'pdp.soldSuffix'
  | 'pdp.categoriesAria'
  | 'pdp.stockInStock'
  | 'pdp.stockOut'
  | 'pdp.stockLowPrefix'
  | 'pdp.stockInStockPrefix'
  | 'pdp.availableSuffix'
  | 'pdp.chooseOption'
  | 'pdp.quantity'
  | 'pdp.decQty'
  | 'pdp.incQty'
  | 'pdp.qtyMaxHint'
  | 'pdp.validationIncomplete'
  | 'pdp.validationRestock'
  | 'pdp.addToCart'
  | 'pdp.checkoutNow'
  | 'pdp.descriptionHeading'
  | 'pdp.seeMore'
  | 'pdp.showLess'
  | 'pdp.sizeChart'
  | 'pdp.sizeGuideBadge'
  | 'pdp.sizeGuideBody'
  | 'pdp.sizeColTag'
  | 'pdp.sizeColUk'
  | 'pdp.sizeColMeaning'
  | 'pdp.sizeFootnote'
  | 'pdp.deliveryTc'
  | 'pdp.deliveryHeading'
  | 'pdp.deliveryBullets.note'
  | 'pdp.deliveryBullets.point1'
  | 'pdp.deliveryBullets.point2'
  /** Reviews */
  | 'reviews.sectionTitle'
  | 'reviews.filterHeading'
  | 'reviews.filterRating'
  | 'reviews.filterTopics'
  | 'reviews.topicFacetHint'
  | 'reviews.listsHeading'
  | 'reviews.tab.all'
  | 'reviews.tab.photo'
  | 'reviews.tab.desc'
  | 'reviews.emptyFilters'
  | 'reviews.subtitleReviews'
  | 'reviews.subtitleReviewsK'
  | 'reviews.avgRingAria'
  | 'reviews.paginationNav'
  | 'reviews.pagePrev'
  | 'reviews.pageNext'
  | 'reviews.helpful.tooltipYes'
  | 'reviews.helpful.tooltipNo'
  | 'reviews.helpful.ariaYes'
  | 'reviews.helpful.ariaNo'
  | 'reviews.helpful.ariaYesSelected'
  | 'reviews.helpful.ariaNoSelected'
  | 'reviews.closeFilters'
  /** Skip link */
  | 'skipToMain'
  /** Accessibility/UI meta */
  | 'a11y.breadcrumbNav'
  | 'doc.titleProduct'
  /** Toast */
  | 'toast.addedTitle'
  | 'toast.oneItemBasket'
  | 'toast.multiItemsBasket'
  | 'toast.checkoutShortcut'

/** English source of truth for keys — keep `messagesAr` aligned. */
export const messagesEn: Record<MessageKey, string> = {
  'crumb.homepage': 'Homepage',
  'crumb.women': 'Women',
  'crumb.fashionFallback': 'Fashion',
  'crumb.sneakersFallback': "Women's Sneakers Lab",
  'crumb.productDetailFallback': 'Product detail',

  'cart.title': 'Your basket',
  'cart.close': 'Close basket',
  'cart.empty': 'Your basket is resting for now.',
  'cart.remove': 'Remove',
  'cart.subtotal': 'Subtotal',
  'cart.checkoutNote':
    'Taxes and delivery are confirmed at checkout · Free click & collect applies to most stores.',
  'cart.checkoutButton': 'Secure checkout',
  'cart.decLineQty': 'Decrease line quantity',
  'cart.incLineQty': 'Increase line quantity',

  'checkout.title': 'Checkout',
  'checkout.closeAria': 'Close checkout',
  'checkout.summaryHeading': 'Order summary',
  'checkout.contactHeading': 'Shipping details',
  'checkout.labelFullName': 'Full name',
  'checkout.labelEmail': 'Email',
  'checkout.labelAddress': 'Street address',
  'checkout.labelCity': 'Town / City',
  'checkout.labelPostcode': 'Postcode',
  'checkout.demoDisclaimer':
    'This checkout is for demonstration only. No card is charged and no orders are submitted.',
  'checkout.emptyTitle': 'Your basket is empty',
  'checkout.emptyBody': 'Add an item before completing checkout.',
  'checkout.backToBasket': 'View basket',
  'checkout.placeOrder': 'Pay now',
  'checkout.successTitle': 'Thank you for your order',
  'checkout.successBody':
    "We've received your demo order. You'll get a confirmation email when a real storefront is connected.",
  'checkout.orderRef': 'Order reference',
  'checkout.done': 'Continue shopping',

  'error.productNotFound': 'We could not find that product anymore.',
  'error.feedUnreachableBody':
    'The Easy Orders reference feed may be unreachable. Confirm connectivity in devtools networking or retry.',
  'error.retryButton': 'Retry retrieval',

  'fatal.title': 'Something broke in the UI',
  'fatal.genericMessage': 'An unexpected error occurred. You can retry or reload the page.',
  'fatal.tryAgain': 'Try again',
  'fatal.reload': 'Reload',

  'fav.title': 'Favourites',
  'fav.close': 'Close Favourite Items',
  'fav.empty': "Save pieces you love by tapping the heart on a product's gallery.",
  'fav.remove': 'Remove from favourites',

  'brand.anyday': 'John Lewis ANYDAY',

  'footer.copyrightBrand': 'John Lewis plc',
  'footer.langMenu': 'Choose language',
  'footer.langEnglish': 'English',
  'footer.langArabic': 'العربية',
  'footer.currencyUsd': 'USD',
  'footer.newsletterAria': 'Newsletter signup',
  'footer.newsletterPlaceholder': 'Get latest offers to your inbox',
  'footer.newsletterLabel': 'Email address — get latest offers to your inbox',
  'footer.newsletterSubmit': 'Submit newsletter signup',

  'footer.col.shop': 'Shop',
  'footer.link.myAccount': 'My account',
  'footer.link.login': 'Login',
  'footer.link.wishlist': 'Wishlist',
  'footer.link.cart': 'Cart',

  'footer.col.information': 'Information',
  'footer.link.shippingPolicy': 'Shipping Policy',
  'footer.link.returnsRefunds': 'Returns & Refunds',
  'footer.link.cookiesPolicy': 'Cookies Policy',
  'footer.link.frequentlyAsked': 'Frequently asked',

  'footer.col.company': 'Company',
  'footer.link.aboutUs': 'About us',
  'footer.link.privacyPolicy': 'Privacy Policy',
  'footer.link.termsConditions': 'Terms & Conditions',
  'footer.link.contactUs': 'Contact Us',

  'footer.localeEnglishShort': 'English',
  'footer.localeArabicShort': 'عربي',

  'gallery.enlarge': 'Enlarge product image',
  'gallery.share': 'Share this product',
  'gallery.saveLater': 'Save for later',
  'gallery.removeSaved': 'Remove from saved items',
  'gallery.controls': 'Gallery controls',
  'gallery.carouselNav': 'Carousel navigation',
  'gallery.prevSlide': 'Show previous slide',
  'gallery.nextSlide': 'Show next slide',
  'gallery.closeZoom': 'Close zoom',
  'gallery.enlargedAltSuffix': ', enlarged',

  'gotoTop': 'Back to top',

  'header.promo': 'New season coming! Discount 10% for all product! Checkout Now!',
  'header.localTimeAria': 'Local time',
  'header.search': 'Search',
  'header.categories': 'Categories',
  'header.signIn': 'Sign in',
  'header.savedItems': 'Saved items',
  'header.basket': 'Basket',
  'header.menuOpen': 'Open menu',
  'header.menuClose': 'Close menu',
  'header.mobilePrimaryNav': 'Primary',
  'header.signInRegister': 'Sign in · Register',

  'header.nav.shopHeading': 'Shop',
  'header.link.womenNav': 'Women',
  'header.link.beauty': 'Beauty',
  'header.link.homeGarden': 'Home & Garden',
  'header.link.babyChild': 'Baby & Child',
  'header.link.menNav': 'Men',
  'header.link.offers': 'Offers',

  'header.nav.informationHeading': 'Information',
  'header.footerLink.delivery': 'Delivery',
  'header.footerLink.returns': 'Returns',
  'header.footerLink.contact': 'Contact',
  'header.footerLink.trackOrder': 'Track order',

  'header.nav.companyHeading': 'Company',
  'header.footerLink.about': 'About',
  'header.footerLink.careers': 'Careers',
  'header.footerLink.press': 'Press',
  'header.footerLink.sustainability': 'Sustainability',

  'headerCLUSTER.shop.links.women': 'Women',
  'headerCLUSTER.shop.links.men': 'Men',
  'headerCLUSTER.shop.links.kids': 'Kids',
  'headerCLUSTER.shop.links.home': 'Home',

  'rails.relatedProduct': 'Related Product',
  'rails.popularThisWeek': 'Popular this week',
  'rails.viewAll': 'View all',
  'rails.viewAllAz': 'View all · A–Z',

  'rails.favAriaRemove': 'Remove from favorites',
  'rails.favAriaAdd': 'Add to Favorite',
  'rails.favTipSaved': 'Saved',
  'rails.favTipAdd': 'Add to Favorite',
  'rails.addToCartAria': 'Add to cart',

  'pdp.soldSuffix': 'Sold',
  'pdp.categoriesAria': 'Product categories',
  'pdp.stockInStock': 'In stock',
  'pdp.stockOut': 'Out of stock',
  'pdp.stockLowPrefix': 'Low stock — ',
  'pdp.stockInStockPrefix': 'In stock — ',
  'pdp.availableSuffix': 'available',
  'pdp.chooseOption': 'Choose',
  'pdp.quantity': 'Quantity',
  'pdp.decQty': 'Decrease quantity',
  'pdp.incQty': 'Increase quantity',
  'pdp.qtyMaxHint': 'Maximum {{n}} for this selection',
  'pdp.validationIncomplete': 'Select every variation before continuing.',
  'pdp.validationRestock': 'This pairing is awaiting restock.',
  'pdp.addToCart': 'Add To Cart',
  'pdp.checkoutNow': 'Checkout Now',
  'pdp.descriptionHeading': 'Description:',
  'pdp.seeMore': 'See More....',
  'pdp.showLess': 'Show less',
  'pdp.sizeChart': 'View size chart',
  'pdp.sizeGuideBadge': 'Size guide',
  'pdp.sizeGuideBody':
    'Tag numbers follow continental EU lasts. Half-sizes bridge UK fittings; lace styles tighten for narrow feet.',
  'pdp.sizeColTag': 'Size tag',
  'pdp.sizeColUk': 'UK (approx.)',
  'pdp.sizeColMeaning': 'Meaning',
  'pdp.sizeFootnote':
    'Measure barefoot at evening; standing weight on paper. Sizes vary by maker—swap in store if between rows.',

  'pdp.deliveryTc': 'Delivery T&C',
  'pdp.deliveryHeading': 'Delivery info',
  'pdp.deliveryBullets.note': 'Taxes and delivery options are confirmed at checkout.',
  'pdp.deliveryBullets.point1': '£3.95 click & collect from store',
  'pdp.deliveryBullets.point2': 'Next-day delivery (£6.95)',

  'reviews.sectionTitle': 'Product Reviews',
  'reviews.filterHeading': 'Reviews Filter',
  'reviews.filterRating': 'Rating',
  'reviews.filterTopics': 'Review Topics',
  'reviews.topicFacetHint':
    'Topic filters need per-review tags from the API (for example topicTags matching these labels). They are not applied until the backend returns that data.',
  'reviews.listsHeading': 'Review Lists',
  'reviews.tab.all': 'All Reviews',
  'reviews.tab.photo': 'With Photo & Video',
  'reviews.tab.desc': 'With Description',
  'reviews.emptyFilters': 'No reviews match your filters.',
  'reviews.subtitleReviews': 'from {{count}} reviews',
  'reviews.subtitleReviewsK': 'from {{part}}k reviews',
  'reviews.avgRingAria': 'Average rating {{label}} out of 5',
  'reviews.paginationNav': 'Review pagination',
  'reviews.pagePrev': 'Previous page',
  'reviews.pageNext': 'Next page',
  'reviews.helpful.tooltipYes': 'Like',
  'reviews.helpful.tooltipNo': 'Dislike',
  'reviews.helpful.ariaYes': 'Mark helpful ({{count}})',
  'reviews.helpful.ariaNo': 'Mark not helpful ({{count}})',
  'reviews.helpful.ariaYesSelected':
    'Helpful selected ({{count}}), press to remove',
  'reviews.helpful.ariaNoSelected':
    'Not helpful selected ({{count}}), press to remove',
  'reviews.closeFilters': 'Close review filters',

  'skipToMain': 'Skip to main content',
  'a11y.breadcrumbNav': 'Breadcrumb',
  'doc.titleProduct': 'John Lewis & Partners — Product',

  'toast.addedTitle': 'Added to cart',
  'toast.oneItemBasket': '{{count}} item in your basket',
  'toast.multiItemsBasket': '{{count}} items in your basket',
  'toast.checkoutShortcut': 'Checkout Now',
}

export const messagesAr: Record<MessageKey, string> = {
  'crumb.homepage': 'الصفحة الرئيسية',
  'crumb.women': 'نساء',
  'crumb.fashionFallback': 'أزياء',
  'crumb.sneakersFallback': 'معمل أحذية رياضية للنساء',
  'crumb.productDetailFallback': 'تفاصيل المنتج',

  'cart.title': 'سلة التسوق',
  'cart.close': 'إغلاق السلة',
  'cart.empty': 'سلة التسوق فارغة حاليًا.',
  'cart.remove': 'إزالة',
  'cart.subtotal': 'المجموع الفرعي',
  'cart.checkoutNote':
    'تُحدَّد الضرائب والتوصيل عند الدفع · الاستلام من المتجر متاح بدون رسوم في أغلب الفروع.',
  'cart.checkoutButton': 'إتمام الدفع بأمان',
  'cart.decLineQty': 'تقليل كمية السطر',
  'cart.incLineQty': 'زيادة كمية السطر',

  'checkout.title': 'الدفع',
  'checkout.closeAria': 'إغلاق الدفع',
  'checkout.summaryHeading': 'ملخص الطلب',
  'checkout.contactHeading': 'تفاصيل الشحن',
  'checkout.labelFullName': 'الاسم الكامل',
  'checkout.labelEmail': 'البريد الإلكتروني',
  'checkout.labelAddress': 'عنوان الشارع',
  'checkout.labelCity': 'المدينة',
  'checkout.labelPostcode': 'الرمز البريدي',
  'checkout.demoDisclaimer':
    'هذا نموذج توضيحي فقط. لا يتم خصم أي مبلغ ولا يُرسل طلب حقيقي.',
  'checkout.emptyTitle': 'السلة فارغة',
  'checkout.emptyBody': 'أضف منتجًا قبل إتمام الدفع.',
  'checkout.backToBasket': 'عرض السلة',
  'checkout.placeOrder': 'ادفع الآن',
  'checkout.successTitle': 'شكرًا لطلبك',
  'checkout.successBody':
    'تلقّينا الطلب التجريبي. ستصل رسالة تأكيد عند ربط متجر حقيقي.',
  'checkout.orderRef': 'رقم الطلب',
  'checkout.done': 'متابعة التسوق',

  'error.productNotFound': 'تعذّر العثور على هذا المنتج.',
  'error.feedUnreachableBody':
    'قد يكون خادم المرجع غير متاح. تحقق من الاتصال في أدوات المطور ثم حاول مجددًا.',
  'error.retryButton': 'إعادة المحاولة',

  'fatal.title': 'حدث خطأ في الواجهة',
  'fatal.genericMessage':
    'حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو تحديث الصفحة.',
  'fatal.tryAgain': 'حاول مجددًا',
  'fatal.reload': 'تحديث الصفحة',

  'fav.title': 'المفضلة',
  'fav.close': 'إغلاق المفضلة',
  'fav.empty': 'احفظ القطع التي تعجبك عبر النقر على أيقونة القلب في معرض الصور.',
  'fav.remove': 'إزالة من المفضلة',

  'brand.anyday': 'John Lewis ANYDAY',

  'footer.copyrightBrand': 'John Lewis plc',
  'footer.langMenu': 'اختيار اللغة',
  'footer.langEnglish': 'English',
  'footer.langArabic': 'العربية',
  'footer.currencyUsd': 'دولار',
  'footer.newsletterAria': 'الاشتراك في النشرة',
  'footer.newsletterPlaceholder': 'احصل على أحدث العروض في بريدك',
  'footer.newsletterLabel': 'البريد الإلكتروني — أحدث العروض إلى صندوقك',
  'footer.newsletterSubmit': 'إرسال الاشتراك',

  'footer.col.shop': 'تسوق',
  'footer.link.myAccount': 'حسابي',
  'footer.link.login': 'تسجيل الدخول',
  'footer.link.wishlist': 'قائمة الأمنيات',
  'footer.link.cart': 'السلة',

  'footer.col.information': 'معلومات',
  'footer.link.shippingPolicy': 'سياسة الشحن',
  'footer.link.returnsRefunds': 'الإرجاع والاسترداد',
  'footer.link.cookiesPolicy': 'سياسة ملفات تعريف الارتباط',
  'footer.link.frequentlyAsked': 'أسئلة شائعة',

  'footer.col.company': 'الشركة',
  'footer.link.aboutUs': 'من نحن',
  'footer.link.privacyPolicy': 'سياسة الخصوصية',
  'footer.link.termsConditions': 'الشروط والأحكام',
  'footer.link.contactUs': 'اتصل بنا',

  'footer.localeEnglishShort': 'English',
  'footer.localeArabicShort': 'عربي',

  'gallery.enlarge': 'تكبير صورة المنتج',
  'gallery.share': 'مشاركة المنتج',
  'gallery.saveLater': 'احفظ لوقت لاحق',
  'gallery.removeSaved': 'إزالة من المحفوظات',
  'gallery.controls': 'عناصر التحكم في المعرض',
  'gallery.carouselNav': 'التنقل في المعرض',
  'gallery.prevSlide': 'العرض السابق',
  'gallery.nextSlide': 'العرض التالي',
  'gallery.closeZoom': 'إغلاق التكبير',
  'gallery.enlargedAltSuffix': '، عرض مكبّر',

  'gotoTop': 'العودة للأعلى',

  'header.promo':
    'الموسم الجديد قادم! خصم 10٪ على جميع المنتجات! تسوّق الآن!',
  'header.localTimeAria': 'التوقيت المحلي',
  'header.search': 'بحث',
  'header.categories': 'التصنيفات',
  'header.signIn': 'تسجيل الدخول',
  'header.savedItems': 'المحفوظات',
  'header.basket': 'السلة',
  'header.menuOpen': 'فتح القائمة',
  'header.menuClose': 'إغلاق القائمة',
  'header.mobilePrimaryNav': 'التنقل الرئيسي',
  'header.signInRegister': 'تسجيل الدخول · إنشاء حساب',

  'header.nav.shopHeading': 'تسوق',
  'header.link.womenNav': 'نساء',
  'header.link.beauty': 'الجمال',
  'header.link.homeGarden': 'المنزل والحديقة',
  'header.link.babyChild': 'الرضع والأطفال',
  'header.link.menNav': 'رجال',
  'header.link.offers': 'عروض',

  'header.nav.informationHeading': 'معلومات',
  'header.footerLink.delivery': 'التوصيل',
  'header.footerLink.returns': 'الإرجاع',
  'header.footerLink.contact': 'الاتصال',
  'header.footerLink.trackOrder': 'تتبع الطلب',

  'header.nav.companyHeading': 'الشركة',
  'header.footerLink.about': 'عن المتجر',
  'header.footerLink.careers': 'الوظائف',
  'header.footerLink.press': 'الصحافة',
  'header.footerLink.sustainability': 'الاستدامة',

  'headerCLUSTER.shop.links.women': 'نساء',
  'headerCLUSTER.shop.links.men': 'رجال',
  'headerCLUSTER.shop.links.kids': 'أطفال',
  'headerCLUSTER.shop.links.home': 'المنزل',

  'rails.relatedProduct': 'منتجات ذات صلة',
  'rails.popularThisWeek': 'الأكثر رواجًا هذا الأسبوع',
  'rails.viewAll': 'عرض الكل',
  'rails.viewAllAz': 'عرض الكل · أ–ي',

  'rails.favAriaRemove': 'إزالة من المفضلة',
  'rails.favAriaAdd': 'إضافة إلى المفضلة',
  'rails.favTipSaved': 'تم الحفظ',
  'rails.favTipAdd': 'إضافة إلى المفضلة',
  'rails.addToCartAria': 'أضف إلى السلة',

  'pdp.soldSuffix': 'مبيع',
  'pdp.categoriesAria': 'فئات المنتج',
  'pdp.stockInStock': 'متوفر',
  'pdp.stockOut': 'غير متوفر',
  'pdp.stockLowPrefix': 'مخزون منخفض — ',
  'pdp.stockInStockPrefix': 'متوفر — ',
  'pdp.availableSuffix': 'قطعة متوفرة',
  'pdp.chooseOption': 'اختر',
  'pdp.quantity': 'الكمية',
  'pdp.decQty': 'تقليل الكمية',
  'pdp.incQty': 'زيادة الكمية',
  'pdp.qtyMaxHint': 'الحد الأقصى {{n}} لهذا الخيار',
  'pdp.validationIncomplete': 'حدِّد كل الخيارات قبل المتابعة.',
  'pdp.validationRestock': 'هذا المزيج بانتظار إعادة التوريد.',
  'pdp.addToCart': 'أضف إلى السلة',
  'pdp.checkoutNow': 'إتمام الشراء الآن',
  'pdp.descriptionHeading': 'الوصف:',
  'pdp.seeMore': 'عرض المزيد…',
  'pdp.showLess': 'عرض أقل',
  'pdp.sizeChart': 'عرض جدول المقاسات',
  'pdp.sizeGuideBadge': 'دليل المقاس',
  'pdp.sizeGuideBody':
    'الأرقام وفقًا لمقاييس أوروبا. الأرقام النصفية تربط بتقاليد المقاسات البريطانية؛ الشدّ يضبط ضيق القدم.',
  'pdp.sizeColTag': 'مقاس الوسم',
  'pdp.sizeColUk': 'بريطانيا (تقريبي)',
  'pdp.sizeColMeaning': 'معنى',
  'pdp.sizeFootnote':
    'قياس بدون حذاء مع تحميل وزن مساءً. الأحجام تختلف حسب الصانع؛ جرّب في المتجر عند نقطة بين مقاسين.',

  'pdp.deliveryTc': 'شروط التوصيل',
  'pdp.deliveryHeading': 'معلومات التوصيل',
  'pdp.deliveryBullets.note': 'تُؤكَّد الضرائب وخيارات التوصيل عند الدفع.',
  'pdp.deliveryBullets.point1': 'استلام من المتجر (£3.95)',
  'pdp.deliveryBullets.point2': 'توصيل في اليوم التالي (£6.95)',

  'reviews.sectionTitle': 'مراجعات المنتج',
  'reviews.filterHeading': 'تصفية المراجعات',
  'reviews.filterRating': 'التقييم',
  'reviews.filterTopics': 'محاور المراجعات',
  'reviews.topicFacetHint':
    'تصفية المواضيع تحتاج وسومًا لكل مراجعة من الـAPI (مثل topicTags المطابقة لهذه العناوين). لا تُفعَّل قبل عودة البيانات من الخلفية.',
  'reviews.listsHeading': 'قوائم المراجعات',
  'reviews.tab.all': 'جميع المراجعات',
  'reviews.tab.photo': 'مع صور أو فيديو',
  'reviews.tab.desc': 'مع وصف',
  'reviews.emptyFilters': 'لا توجد مراجعات تطابق التصفية.',
  'reviews.subtitleReviews': 'من {{count}} مراجعة',
  'reviews.subtitleReviewsK': 'من ‎{{part}}‎k مراجعة',
  'reviews.avgRingAria': 'متوسط التقييم {{label}} من ٥',
  'reviews.paginationNav': 'صفحات المراجعات',
  'reviews.pagePrev': 'الصفحة السابقة',
  'reviews.pageNext': 'الصفحة التالية',
  'reviews.helpful.tooltipYes': 'أعجبني',
  'reviews.helpful.tooltipNo': 'لا يعجبني',
  'reviews.helpful.ariaYes': 'تعليق مُفيد ({{count}})',
  'reviews.helpful.ariaNo': 'تعليق غير مفيد ({{count}})',
  'reviews.helpful.ariaYesSelected': 'تم اختيار مفيد ({{count}})؛ اضغط للإلغاء',
  'reviews.helpful.ariaNoSelected': 'تم اختيار غير مفيد ({{count}})؛ اضغط للإلغاء',
  'reviews.closeFilters': 'إغلاق تصفية المراجعات',

  'skipToMain': 'تخطّي إلى المحتوى الرئيسي',
  'a11y.breadcrumbNav': 'مسار التنقل',
  'doc.titleProduct': 'John Lewis & Partners — المنتج',

  'toast.addedTitle': 'تمت الإضافة إلى السلة',
  'toast.oneItemBasket': '{{count}} قطعة في سلتك',
  'toast.multiItemsBasket': '{{count}} قطع في سلتك',
  'toast.checkoutShortcut': 'إتمام الشراء',
}
