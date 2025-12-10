# توثيق المشروع - نظام إدارة الاستيراد والتصدير

## نظرة عامة
هذا المشروع هو نظام إدارة شامل للاستيراد والتصدير مبني باستخدام React و TypeScript و Supabase. يوفر النظام إدارة كاملة للشحنات، المنتجات، المخازن، الموظفين، المستوردين، المدفوعات، النقل، والحاويات.

---

## التقنيات المستخدمة

### المكتبات الأساسية
- **React 18.3.1** - مكتبة JavaScript لبناء واجهات المستخدم
- **TypeScript 5.8.3** - لغة برمجة توفر نوع البيانات الثابت
- **Vite 5.4.19** - أداة بناء سريعة للواجهات الأمامية

### إدارة الحالة والبيانات
- **@tanstack/react-query 5.83.0** - لإدارة حالة الخادم والبيانات (Server State Management)
- **@supabase/supabase-js 2.86.0** - عميل Supabase للتفاعل مع قاعدة البيانات

### التوجيه
- **react-router-dom 6.30.1** - مكتبة التوجيه للواجهات أحادية الصفحة (SPA)

### واجهة المستخدم (UI Components)
المشروع يستخدم **shadcn/ui** المبنية على **Radix UI**:

#### مكونات Radix UI المستخدمة:
- `@radix-ui/react-dialog` - للنوافذ المنبثقة (Dialogs)
- `@radix-ui/react-toast` - للإشعارات (Toast Notifications)
- `@radix-ui/react-tooltip` - للتلميحات (Tooltips)
- `@radix-ui/react-avatar` - للصور الرمزية (Avatars)
- `@radix-ui/react-progress` - لأشرطة التقدم (Progress Bars)
- `@radix-ui/react-separator` - للفواصل (Separators)
- `@radix-ui/react-slot` - للتركيب المرن (Slot Composition)
- `@radix-ui/react-label` - للتسميات (Labels)
- `@radix-ui/react-tabs` - للتبويبات (Tabs)
- `@radix-ui/react-switch` - للمفاتيح (Switches)
- `@radix-ui/react-slider` - للشرائح (Sliders)
- `@radix-ui/react-sheet` - للأوراق الجانبية (Sheets)
- `@radix-ui/react-toggle` - للأزرار التبديلية (Toggle Buttons)
- `@radix-ui/react-toggle-group` - لمجموعات التبديل (Toggle Groups)

#### مكونات UI إضافية:
- **lucide-react 0.462.0** - مكتبة الأيقونات
- **sonner 1.7.4** - لإشعارات Toast محسنة
- **recharts 2.15.4** - للرسوم البيانية (Charts)
- **cmdk 1.1.1** - لواجهة الأوامر (Command Palette)
- **input-otp 1.4.2** - لحقول OTP
- **embla-carousel-react 8.6.0** - للشرائح (Carousels)
- **react-day-picker 8.10.1** - لاختيار التاريخ
- **react-resizable-panels 2.1.9** - للألواح القابلة للتغيير
- **vaul 0.9.9** - للدرج (Drawer)

### التنسيق والتصميم
- **Tailwind CSS 3.4.17** - إطار عمل CSS
- **tailwindcss-animate 1.0.7** - للحركات والانتقالات
- **@tailwindcss/typography 0.5.16** - لتحسين الطباعة
- **class-variance-authority 0.7.1** - لإدارة متغيرات الفئات
- **clsx 2.1.1** - لدمج فئات CSS
- **tailwind-merge 2.6.0** - لدمج فئات Tailwind

### النماذج والتحقق
- **react-hook-form 7.61.1** - لإدارة النماذج
- **zod 3.25.76** - للتحقق من البيانات (Schema Validation)
- **@hookform/resolvers 3.10.0** - لحلول react-hook-form

### المظاهر (Theming)
- **next-themes 0.3.0** - لإدارة المظاهر (Dark/Light Mode)

### أدوات التطوير
- **ESLint 9.32.0** - لفحص جودة الكود
- **TypeScript ESLint 8.38.0** - لفحص TypeScript
- **PostCSS 8.5.6** - لمعالجة CSS
- **Autoprefixer 10.4.21** - لإضافة البادئات التلقائية

---

## هيكل المشروع

```
web_project/
├── src/
│   ├── components/          # المكونات القابلة لإعادة الاستخدام
│   │   ├── dashboard/      # مكونات لوحة التحكم
│   │   ├── layout/          # مكونات التخطيط (Header, Sidebar, MainLayout)
│   │   └── ui/              # مكونات واجهة المستخدم من shadcn/ui
│   ├── hooks/               # React Hooks المخصصة
│   │   ├── usePayments.ts
│   │   ├── useShipments.ts
│   │   ├── useProducts.ts
│   │   ├── useWarehouses.ts
│   │   ├── useEmployees.ts
│   │   ├── useImporters.ts
│   │   ├── useContainers.ts
│   │   ├── useTransportation.ts
│   │   ├── useDashboardStats.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/               # صفحات التطبيق
│   │   ├── Dashboard.tsx
│   │   ├── Shipments.tsx
│   │   ├── Products.tsx
│   │   ├── Warehouses.tsx
│   │   ├── Employees.tsx
│   │   ├── Importers.tsx
│   │   ├── Payments.tsx
│   │   ├── Transportation.tsx
│   │   ├── Containers.tsx
│   │   └── NotFound.tsx
│   ├── integrations/        # تكاملات خارجية
│   │   └── supabase/
│   │       ├── client.ts    # إعداد عميل Supabase
│   │       └── types.ts     # أنواع TypeScript لقاعدة البيانات
│   ├── lib/                 # مكتبات مساعدة
│   │   └── utils.ts         # دوال مساعدة
│   ├── App.tsx              # المكون الرئيسي
│   ├── main.tsx             # نقطة الدخول
│   └── index.css            # الأنماط العامة
├── public/                  # الملفات الثابتة
├── supabase/                # إعدادات Supabase
├── package.json             # تبعيات المشروع
├── vite.config.ts           # إعدادات Vite
├── tailwind.config.ts       # إعدادات Tailwind
└── tsconfig.json            # إعدادات TypeScript
```

---

## الصفحات والوظائف

### 1. لوحة التحكم (Dashboard)
- عرض إحصائيات شاملة:
  - إجمالي الشحنات
  - الشحنات النشطة
  - إجمالي المنتجات
  - عدد المخازن
  - عدد الموظفين
  - عدد الحاويات
  - إجمالي الإيرادات
- عرض الشحنات الأخيرة
- نظرة عامة على المخزون

### 2. الشحنات (Shipments)
- عرض جميع الشحنات
- إضافة شحنة جديدة
- تعديل شحنة موجودة
- عرض تفاصيل الشحنة
- البحث والتصفية

### 3. المنتجات (Products)
- عرض جميع المنتجات
- إضافة منتج جديد
- تعديل منتج موجود
- التصفية حسب الفئة
- البحث بالاسم

### 4. المخازن (Warehouses)
- عرض جميع المخازن
- إضافة مخزن جديد
- عرض نسبة استخدام السعة

### 5. الموظفين (Employees)
- عرض جميع الموظفين
- إضافة موظف جديد
- تعديل بيانات موظف
- عرض تفاصيل الموظف

### 6. المستوردين (Importers)
- عرض جميع المستوردين
- إضافة مستورد جديد
- تعديل بيانات مستورد

### 7. المدفوعات (Payments)
- عرض جميع المدفوعات
- البحث برقم المعاملة
- عرض تفاصيل الدفع
- عرض حالة الدفع

### 8. النقل (Transportation)
- عرض جميع وسائل النقل
- إضافة وسيلة نقل جديدة
- تعديل وسيلة نقل

### 9. الحاويات (Containers)
- عرض جميع الحاويات
- إضافة حاوية جديدة
- تعديل حاوية موجودة

---

## قاعدة البيانات (Supabase)

### الجداول الرئيسية:
1. **shipments** - الشحنات
2. **products** - المنتجات
3. **warehouses** - المخازن
4. **employees** - الموظفين
5. **importers** - المستوردين
6. **payments** - المدفوعات
7. **transportation** - وسائل النقل
8. **containers** - الحاويات
9. **inventory** - المخزون
10. **categories** - الفئات
11. **payment_methods** - طرق الدفع

### العلاقات:
- الشحنات مرتبطة بالمستوردين والمخازن والحاويات
- المنتجات مرتبطة بالفئات
- المدفوعات مرتبطة بالشحنات وطرق الدفع
- المخزون مرتبط بالمنتجات والمخازن
- النقل مرتبط بالشحنات

---

## المكونات المستخدمة من shadcn/ui

### المكونات المستخدمة فعلياً:
- ✅ **Badge** - للشارات
- ✅ **Button** - للأزرار
- ✅ **Card** - للبطاقات
- ✅ **Dialog** - للنوافذ المنبثقة
- ✅ **Input** - لحقول الإدخال
- ✅ **Table** - للجداول
- ✅ **Avatar** - للصور الرمزية
- ✅ **Progress** - لأشرطة التقدم
- ✅ **Separator** - للفواصل
- ✅ **Sheet** - للأوراق الجانبية
- ✅ **Skeleton** - للتحميل
- ✅ **Tooltip** - للتلميحات
- ✅ **Toast/Toaster** - للإشعارات
- ✅ **Sonner** - لإشعارات محسنة

### المكونات المتاحة ولكن غير مستخدمة:
- ⚠️ Accordion
- ⚠️ Alert Dialog
- ⚠️ Alert
- ⚠️ Aspect Ratio
- ⚠️ Breadcrumb
- ⚠️ Calendar
- ⚠️ Carousel
- ⚠️ Chart
- ⚠️ Checkbox
- ⚠️ Collapsible
- ⚠️ Command
- ⚠️ Context Menu
- ⚠️ Drawer
- ⚠️ Dropdown Menu
- ⚠️ Form
- ⚠️ Hover Card
- ⚠️ Input OTP
- ⚠️ Label
- ⚠️ Menubar
- ⚠️ Navigation Menu
- ⚠️ Pagination
- ⚠️ Popover
- ⚠️ Radio Group
- ⚠️ Resizable
- ⚠️ Scroll Area
- ⚠️ Select
- ⚠️ Slider
- ⚠️ Switch
- ⚠️ Tabs
- ⚠️ Textarea
- ⚠️ Toggle
- ⚠️ Toggle Group

---

## الأوامر المتاحة

```bash
# تشغيل المشروع في وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# بناء المشروع في وضع التطوير
npm run build:dev

# معاينة البناء
npm run preview

# فحص جودة الكود
npm run lint
```

---

## ملاحظات مهمة

1. **اللغة**: المشروع يستخدم اللغة العربية في الواجهة
2. **الخط**: يستخدم خط Cairo للعناوين العربية
3. **المظهر**: يدعم الوضع الفاتح والداكن
4. **التصميم**: تصميم متجاوب (Responsive) يعمل على جميع الأجهزة
5. **قاعدة البيانات**: تستخدم Supabase كـ Backend as a Service

---

## التوصيات للتحسين

1. **إزالة المكتبات غير المستخدمة** لتقليل حجم الحزمة
2. **استخدام React Hook Form** في النماذج بدلاً من useState
3. **إضافة Charts** لعرض البيانات بشكل مرئي
4. **إضافة Pagination** للجداول الكبيرة
5. **تحسين الأداء** باستخدام React.memo و useMemo
6. **إضافة Unit Tests** للاختبارات
7. **إضافة Error Boundaries** لمعالجة الأخطاء

---

## تاريخ التحديث
تم إنشاء هذا التوثيق في: ديسمبر 2024

