import { MainLayout } from "@/components/layout/MainLayout";
import { useImporters, useCreateImporter, useUpdateImporter, type Importer } from "@/hooks/useImporters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Building2, MapPin, Mail, User, Globe } from "lucide-react";
import { useState } from "react";

const Importers = () => {
  const { data: importers, isLoading } = useImporters();
  const createImporter = useCreateImporter();
  const updateImporter = useUpdateImporter();
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [viewImporter, setViewImporter] = useState<Importer | null>(null);
  const [editImporter, setEditImporter] = useState<Importer | null>(null);

  const [formValues, setFormValues] = useState({
    iso_code: "",
    company_name: "",
    contact_person: "",
    email: "",
    country: "",
    city: "",
    address: "",
    tax_id: "",
  });

  const resetForm = () =>
    setFormValues({
      iso_code: "",
      company_name: "",
      contact_person: "",
      email: "",
      country: "",
      city: "",
      address: "",
      tax_id: "",
    });

  const filteredImporters = importers?.filter(
    (i) =>
      i.company_name.toLowerCase().includes(search.toLowerCase()) ||
      i.contact_person.toLowerCase().includes(search.toLowerCase()) ||
      i.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitAdd = async () => {
    if (!formValues.iso_code || !formValues.company_name || !formValues.contact_person || !formValues.email) return;

    await createImporter.mutateAsync({
      iso_code: formValues.iso_code,
      company_name: formValues.company_name,
      contact_person: formValues.contact_person,
      email: formValues.email,
      country: formValues.country,
      city: formValues.city,
      address: formValues.address,
      tax_id: formValues.tax_id,
    } as any);

    resetForm();
    setAddOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!editImporter) return;

    await updateImporter.mutateAsync({
      isoCode: editImporter.iso_code,
      updates: {
        company_name: formValues.company_name,
        contact_person: formValues.contact_person,
        email: formValues.email,
        country: formValues.country,
        city: formValues.city,
        address: formValues.address,
        tax_id: formValues.tax_id,
      } as any,
    });

    setEditImporter(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">المستوردين</h1>
            <p className="text-muted-foreground mt-1">إدارة شركاء الاستيراد</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            مستورد جديد
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن مستورد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Importers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : filteredImporters?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا يوجد مستوردين</p>
            </div>
          ) : (
            filteredImporters?.map((importer) => (
              <Card
                key={importer.iso_code}
                className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground font-cairo text-lg">
                        {importer.company_name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">{importer.iso_code}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{importer.contact_person}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{importer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>{importer.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {importer.address}، {importer.city}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      الرقم الضريبي: <span className="font-mono">{importer.tax_id}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setViewImporter(importer)}>
                        تفاصيل
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditImporter(importer);
                          setFormValues({
                            iso_code: importer.iso_code,
                            company_name: importer.company_name,
                            contact_person: importer.contact_person,
                            email: importer.email,
                            country: importer.country,
                            city: importer.city,
                            address: importer.address,
                            tax_id: importer.tax_id,
                          });
                        }}
                      >
                        تعديل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Dialogs */}
        <Dialog open={addOpen} onOpenChange={(open) => (open ? setAddOpen(true) : (setAddOpen(false), resetForm()))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">إضافة مستورد جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">كود الدولة (ISO)</label>
                  <Input
                    value={formValues.iso_code}
                    onChange={(e) => setFormValues((f) => ({ ...f, iso_code: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم الشركة</label>
                  <Input
                    value={formValues.company_name}
                    onChange={(e) => setFormValues((f) => ({ ...f, company_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الشخص المسؤول</label>
                  <Input
                    value={formValues.contact_person}
                    onChange={(e) => setFormValues((f) => ({ ...f, contact_person: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الدولة</label>
                  <Input
                    value={formValues.country}
                    onChange={(e) => setFormValues((f) => ({ ...f, country: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">المدينة</label>
                  <Input
                    value={formValues.city}
                    onChange={(e) => setFormValues((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">العنوان</label>
                <Input
                  value={formValues.address}
                  onChange={(e) => setFormValues((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الرقم الضريبي</label>
                <Input
                  value={formValues.tax_id}
                  onChange={(e) => setFormValues((f) => ({ ...f, tax_id: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createImporter.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewImporter} onOpenChange={(open) => !open && setViewImporter(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تفاصيل المستورد</DialogTitle>
            </DialogHeader>
            {viewImporter && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">اسم الشركة: </span>
                  {viewImporter.company_name}
                </p>
                <p>
                  <span className="font-medium">كود الدولة (ISO): </span>
                  {viewImporter.iso_code}
                </p>
                <p>
                  <span className="font-medium">الشخص المسؤول: </span>
                  {viewImporter.contact_person}
                </p>
                <p>
                  <span className="font-medium">البريد الإلكتروني: </span>
                  {viewImporter.email}
                </p>
                <p>
                  <span className="font-medium">الدولة: </span>
                  {viewImporter.country}
                </p>
                <p>
                  <span className="font-medium">المدينة: </span>
                  {viewImporter.city}
                </p>
                <p>
                  <span className="font-medium">العنوان: </span>
                  {viewImporter.address}
                </p>
                <p>
                  <span className="font-medium">الرقم الضريبي: </span>
                  {viewImporter.tax_id}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editImporter} onOpenChange={(open) => !open && setEditImporter(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تعديل بيانات المستورد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم الشركة</label>
                  <Input
                    value={formValues.company_name}
                    onChange={(e) => setFormValues((f) => ({ ...f, company_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الشخص المسؤول</label>
                  <Input
                    value={formValues.contact_person}
                    onChange={(e) => setFormValues((f) => ({ ...f, contact_person: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الدولة</label>
                  <Input
                    value={formValues.country}
                    onChange={(e) => setFormValues((f) => ({ ...f, country: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">المدينة</label>
                  <Input
                    value={formValues.city}
                    onChange={(e) => setFormValues((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">العنوان</label>
                  <Input
                    value={formValues.address}
                    onChange={(e) => setFormValues((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الرقم الضريبي</label>
                <Input
                  value={formValues.tax_id}
                  onChange={(e) => setFormValues((f) => ({ ...f, tax_id: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditImporter(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitEdit} disabled={updateImporter.isPending}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Importers;
