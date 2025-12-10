import { MainLayout } from "@/components/layout/MainLayout";
import { useWarehouses, useCreateWarehouse } from "@/hooks/useWarehouses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Warehouse as WarehouseIcon, MapPin, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

const Warehouses = () => {
  const { data: warehouses, isLoading } = useWarehouses();
  const createWarehouse = useCreateWarehouse();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    code: "",
    name: "",
    capacity: "",
    city: "",
    country: "",
    address: "",
    email: "",
    phone: "",
  });

  const resetForm = () =>
    setFormValues({
      code: "",
      name: "",
      capacity: "",
      city: "",
      country: "",
      address: "",
      email: "",
      phone: "",
    });

  const filteredWarehouses = warehouses?.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase()) ||
      w.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitAdd = async () => {
    if (!formValues.code || !formValues.name || !formValues.capacity) return;
    await createWarehouse.mutateAsync({
      code: formValues.code,
      name: formValues.name,
      capacity: Number(formValues.capacity),
      city: formValues.city,
      country: formValues.country,
      address: formValues.address,
      email: formValues.email,
      phone: formValues.phone,
    } as any);
    resetForm();
    setAddOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">المخازن</h1>
            <p className="text-muted-foreground mt-1">إدارة ومتابعة المخازن</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            مخزن جديد
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن مخزن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Warehouses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-32 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : filteredWarehouses?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <WarehouseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد مخازن</p>
            </div>
          ) : (
            filteredWarehouses?.map((warehouse) => {
              const capacityUsed = Math.floor(Math.random() * 100);
              return (
                <Card
                  key={warehouse.code}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground font-cairo text-lg">
                          {warehouse.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono">{warehouse.code}</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <WarehouseIcon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">السعة المستخدمة</span>
                        <span className="font-medium">{capacityUsed}%</span>
                      </div>
                      <Progress
                        value={capacityUsed}
                        className={capacityUsed > 80 ? "[&>div]:bg-warning" : "[&>div]:bg-primary"}
                      />
                      <p className="text-xs text-muted-foreground">
                        السعة الكلية: {warehouse.capacity.toLocaleString()} وحدة
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {warehouse.address}، {warehouse.city}، {warehouse.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{warehouse.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span dir="ltr">{warehouse.phone}</span>
                      </div>
                      {warehouse.employees && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>
                            المدير: {warehouse.employees.first_name} {warehouse.employees.last_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Dialog open={addOpen} onOpenChange={(open) => (open ? setAddOpen(true) : (setAddOpen(false), resetForm()))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">إضافة مخزن جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">كود المخزن</label>
                  <Input
                    value={formValues.code}
                    onChange={(e) => setFormValues((f) => ({ ...f, code: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم المخزن</label>
                  <Input
                    value={formValues.name}
                    onChange={(e) => setFormValues((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">السعة</label>
                  <Input
                    type="number"
                    value={formValues.capacity}
                    onChange={(e) => setFormValues((f) => ({ ...f, capacity: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">المدينة</label>
                  <Input
                    value={formValues.city}
                    onChange={(e) => setFormValues((f) => ({ ...f, city: e.target.value }))}
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
              <div className="grid gap-2">
                <label className="text-sm font-medium">العنوان</label>
                <Input
                  value={formValues.address}
                  onChange={(e) => setFormValues((f) => ({ ...f, address: e.target.value }))}
                />
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
                  <label className="text-sm font-medium">الهاتف</label>
                  <Input
                    value={formValues.phone}
                    onChange={(e) => setFormValues((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createWarehouse.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Warehouses;
