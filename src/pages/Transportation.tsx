import { MainLayout } from "@/components/layout/MainLayout";
import { useTransportation, useCreateTransportation, useUpdateTransportation, type Transportation } from "@/hooks/useTransportation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, Plus, Truck, Scale, User } from "lucide-react";
import { useState } from "react";

const stateColors: Record<string, string> = {
  "Available": "bg-success/10 text-success border-success/20",
  "In Use": "bg-info/10 text-info border-info/20",
  "Maintenance": "bg-warning/10 text-warning border-warning/20",
};

const Transportation = () => {
  const { data: transportation, isLoading } = useTransportation();
  const createTransportation = useCreateTransportation();
  const updateTransportation = useUpdateTransportation();
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [viewVehicle, setViewVehicle] = useState<Transportation | null>(null);
  const [editVehicle, setEditVehicle] = useState<Transportation | null>(null);

  const [formValues, setFormValues] = useState({
    registration_number: "",
    type: "",
    state: "Available",
    capacity_weight: "",
    driver_license_number: "",
  });

  const resetForm = () =>
    setFormValues({
      registration_number: "",
      type: "",
      state: "Available",
      capacity_weight: "",
      driver_license_number: "",
    });

  const filteredTransportation = transportation?.filter(
    (t) =>
      t.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitAdd = async () => {
    if (!formValues.registration_number || !formValues.type || !formValues.capacity_weight) return;

    await createTransportation.mutateAsync({
      registration_number: formValues.registration_number,
      type: formValues.type,
      state: formValues.state,
      capacity_weight: Number(formValues.capacity_weight),
      driver_license_number: formValues.driver_license_number || null,
    } as any);

    resetForm();
    setAddOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!editVehicle) return;

    await updateTransportation.mutateAsync({
      registration_number: editVehicle.registration_number,
      updates: {
        type: formValues.type,
        state: formValues.state,
        capacity_weight: Number(formValues.capacity_weight),
        driver_license_number: formValues.driver_license_number || null,
      } as any,
    });

    setEditVehicle(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">وسائل النقل</h1>
            <p className="text-muted-foreground mt-1">إدارة أسطول النقل</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            مركبة جديدة
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن مركبة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Transportation Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-16 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : filteredTransportation?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد مركبات</p>
            </div>
          ) : (
            filteredTransportation?.map((vehicle) => (
              <Card
                key={vehicle.registration_number}
                className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground font-mono">
                        {vehicle.registration_number}
                      </h3>
                      <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(stateColors[vehicle.state] || stateColors["Available"])}
                    >
                      {vehicle.state}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Scale className="h-3.5 w-3.5" />
                        <span>السعة: {vehicle.capacity_weight} كجم</span>
                      </div>
                      {vehicle.driver_license_number && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span>رخصة: {vehicle.driver_license_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2 border-t">
                    <Button variant="ghost" size="sm" onClick={() => setViewVehicle(vehicle)}>
                      تفاصيل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditVehicle(vehicle);
                        setFormValues({
                          registration_number: vehicle.registration_number,
                          type: vehicle.type,
                          state: vehicle.state,
                          capacity_weight: String(vehicle.capacity_weight),
                          driver_license_number: vehicle.driver_license_number || "",
                        });
                      }}
                    >
                      تعديل
                    </Button>
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
              <DialogTitle className="font-cairo">إضافة مركبة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم التسجيل</label>
                  <Input
                    value={formValues.registration_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, registration_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">النوع</label>
                  <Input
                    value={formValues.type}
                    onChange={(e) => setFormValues((f) => ({ ...f, type: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">السعة (كجم)</label>
                  <Input
                    type="number"
                    value={formValues.capacity_weight}
                    onChange={(e) => setFormValues((f) => ({ ...f, capacity_weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الحالة</label>
                  <select
                    className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                    value={formValues.state}
                    onChange={(e) => setFormValues((f) => ({ ...f, state: e.target.value }))}
                  >
                    <option value="Available">متاحة</option>
                    <option value="In Use">قيد الاستخدام</option>
                    <option value="Maintenance">صيانة</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">رقم رخصة السائق (اختياري)</label>
                <Input
                  value={formValues.driver_license_number}
                  onChange={(e) => setFormValues((f) => ({ ...f, driver_license_number: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createTransportation.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewVehicle} onOpenChange={(open) => !open && setViewVehicle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تفاصيل المركبة</DialogTitle>
            </DialogHeader>
            {viewVehicle && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">رقم التسجيل: </span>
                  {viewVehicle.registration_number}
                </p>
                <p>
                  <span className="font-medium">النوع: </span>
                  {viewVehicle.type}
                </p>
                <p>
                  <span className="font-medium">السعة: </span>
                  {viewVehicle.capacity_weight} كجم
                </p>
                <p>
                  <span className="font-medium">الحالة: </span>
                  {viewVehicle.state}
                </p>
                {viewVehicle.driver_license_number && (
                  <p>
                    <span className="font-medium">رخصة السائق: </span>
                    {viewVehicle.driver_license_number}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editVehicle} onOpenChange={(open) => !open && setEditVehicle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تعديل بيانات المركبة</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">النوع</label>
                  <Input
                    value={formValues.type}
                    onChange={(e) => setFormValues((f) => ({ ...f, type: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">السعة (كجم)</label>
                  <Input
                    type="number"
                    value={formValues.capacity_weight}
                    onChange={(e) => setFormValues((f) => ({ ...f, capacity_weight: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">الحالة</label>
                <select
                  className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                  value={formValues.state}
                  onChange={(e) => setFormValues((f) => ({ ...f, state: e.target.value }))}
                >
                  <option value="Available">متاحة</option>
                  <option value="In Use">قيد الاستخدام</option>
                  <option value="Maintenance">صيانة</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">رقم رخصة السائق (اختياري)</label>
                <Input
                  value={formValues.driver_license_number}
                  onChange={(e) => setFormValues((f) => ({ ...f, driver_license_number: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditVehicle(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitEdit} disabled={updateTransportation.isPending}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Transportation;
