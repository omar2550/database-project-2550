import { MainLayout } from "@/components/layout/MainLayout";
import { useShipments, useCreateShipment, useUpdateShipment, type Shipment } from "@/hooks/useShipments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, Plus, Filter, Ship, Eye, Edit } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  "Delivered": "bg-success/10 text-success border-success/20",
  "In Transit": "bg-info/10 text-info border-info/20",
  "Processing": "bg-warning/10 text-warning border-warning/20",
  "Pending": "bg-muted text-muted-foreground",
};

const Shipments = () => {
  const { data: shipments, isLoading } = useShipments();
  const createShipment = useCreateShipment();
  const updateShipment = useUpdateShipment();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Delivered" | "In Transit" | "Processing" | "Pending">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [viewShipment, setViewShipment] = useState<Shipment | null>(null);
  const [editShipment, setEditShipment] = useState<Shipment | null>(null);

  const [formValues, setFormValues] = useState({
    shipment_number: "",
    tracking_number: "",
    origin_port: "",
    destination_port: "",
    shipment_date: "",
    arrival_date: "",
    status: "Pending",
    total_weight: "",
  });

  const resetForm = () =>
    setFormValues({
      shipment_number: "",
      tracking_number: "",
      origin_port: "",
      destination_port: "",
      shipment_date: "",
      arrival_date: "",
      status: "Pending",
      total_weight: "",
    });

  const filteredShipments = shipments?.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch =
      s.tracking_number.toLowerCase().includes(term) ||
      s.origin_port.toLowerCase().includes(term) ||
      s.destination_port.toLowerCase().includes(term);

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSubmitAdd = async () => {
    if (
      !formValues.shipment_number ||
      !formValues.tracking_number ||
      !formValues.origin_port ||
      !formValues.destination_port ||
      !formValues.shipment_date ||
      !formValues.arrival_date ||
      !formValues.total_weight
    ) {
      return;
    }

    await createShipment.mutateAsync({
      shipment_number: Number(formValues.shipment_number),
      tracking_number: formValues.tracking_number,
      origin_port: formValues.origin_port,
      destination_port: formValues.destination_port,
      shipment_date: formValues.shipment_date,
      arrival_date: formValues.arrival_date,
      status: formValues.status,
      total_weight: Number(formValues.total_weight),
    } as any);

    resetForm();
    setAddOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!editShipment) return;

    await updateShipment.mutateAsync({
      id: editShipment.shipment_number,
      updates: {
        tracking_number: formValues.tracking_number,
        origin_port: formValues.origin_port,
        destination_port: formValues.destination_port,
        shipment_date: formValues.shipment_date,
        arrival_date: formValues.arrival_date,
        status: formValues.status,
        total_weight: Number(formValues.total_weight),
      } as any,
    });

    setEditShipment(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">الشحنات</h1>
            <p className="text-muted-foreground mt-1">إدارة ومتابعة جميع الشحنات</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            شحنة جديدة
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث بالتتبع أو الميناء..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Filter className="h-4 w-4" />
              الحالة:
            </span>
            <Button
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              الكل
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "Pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("Pending")}
            >
              قيد الانتظار
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "Processing" ? "default" : "outline"}
              onClick={() => setStatusFilter("Processing")}
            >
              قيد المعالجة
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "In Transit" ? "default" : "outline"}
              onClick={() => setStatusFilter("In Transit")}
            >
              في الطريق
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "Delivered" ? "default" : "outline"}
              onClick={() => setStatusFilter("Delivered")}
            >
              تم التسليم
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right font-cairo">رقم الشحنة</TableHead>
                <TableHead className="text-right font-cairo">رقم التتبع</TableHead>
                <TableHead className="text-right font-cairo">من</TableHead>
                <TableHead className="text-right font-cairo">إلى</TableHead>
                <TableHead className="text-right font-cairo">الوزن</TableHead>
                <TableHead className="text-right font-cairo">التاريخ</TableHead>
                <TableHead className="text-right font-cairo">الحالة</TableHead>
                <TableHead className="text-right font-cairo">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredShipments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Ship className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد شحنات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments?.map((shipment) => (
                  <TableRow key={shipment.shipment_number} className="hover:bg-muted/30">
                    <TableCell className="font-medium">#{shipment.shipment_number}</TableCell>
                    <TableCell className="font-mono text-sm">{shipment.tracking_number}</TableCell>
                    <TableCell>{shipment.origin_port}</TableCell>
                    <TableCell>{shipment.destination_port}</TableCell>
                    <TableCell>{shipment.total_weight} كجم</TableCell>
                    <TableCell>
                      {new Date(shipment.shipment_date).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(statusColors[shipment.status] || statusColors["Pending"])}
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewShipment(shipment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditShipment(shipment);
                            setFormValues({
                              shipment_number: String(shipment.shipment_number),
                              tracking_number: shipment.tracking_number,
                              origin_port: shipment.origin_port,
                              destination_port: shipment.destination_port,
                              shipment_date: shipment.shipment_date,
                              arrival_date: shipment.arrival_date,
                              status: shipment.status,
                              total_weight: String(shipment.total_weight),
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialogs */}
        <Dialog open={addOpen} onOpenChange={(open) => (open ? setAddOpen(true) : (setAddOpen(false), resetForm()))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">إضافة شحنة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم الشحنة</label>
                  <Input
                    value={formValues.shipment_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, shipment_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم التتبع</label>
                  <Input
                    value={formValues.tracking_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, tracking_number: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الميناء (من)</label>
                  <Input
                    value={formValues.origin_port}
                    onChange={(e) => setFormValues((f) => ({ ...f, origin_port: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الميناء (إلى)</label>
                  <Input
                    value={formValues.destination_port}
                    onChange={(e) => setFormValues((f) => ({ ...f, destination_port: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">تاريخ الشحن</label>
                  <Input
                    type="date"
                    value={formValues.shipment_date}
                    onChange={(e) => setFormValues((f) => ({ ...f, shipment_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">تاريخ الوصول</label>
                  <Input
                    type="date"
                    value={formValues.arrival_date}
                    onChange={(e) => setFormValues((f) => ({ ...f, arrival_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الوزن الكلي (كجم)</label>
                  <Input
                    type="number"
                    value={formValues.total_weight}
                    onChange={(e) => setFormValues((f) => ({ ...f, total_weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الحالة</label>
                  <select
                    className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                    value={formValues.status}
                    onChange={(e) => setFormValues((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Pending">قيد الانتظار</option>
                    <option value="Processing">قيد المعالجة</option>
                    <option value="In Transit">في الطريق</option>
                    <option value="Delivered">تم التسليم</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createShipment.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewShipment} onOpenChange={(open) => !open && setViewShipment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تفاصيل الشحنة</DialogTitle>
            </DialogHeader>
            {viewShipment && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">رقم الشحنة: </span>#{viewShipment.shipment_number}
                </p>
                <p>
                  <span className="font-medium">رقم التتبع: </span>
                  {viewShipment.tracking_number}
                </p>
                <p>
                  <span className="font-medium">من: </span>
                  {viewShipment.origin_port}
                </p>
                <p>
                  <span className="font-medium">إلى: </span>
                  {viewShipment.destination_port}
                </p>
                <p>
                  <span className="font-medium">تاريخ الشحن: </span>
                  {new Date(viewShipment.shipment_date).toLocaleDateString("ar-EG")}
                </p>
                <p>
                  <span className="font-medium">تاريخ الوصول: </span>
                  {new Date(viewShipment.arrival_date).toLocaleDateString("ar-EG")}
                </p>
                <p>
                  <span className="font-medium">الوزن الكلي: </span>
                  {viewShipment.total_weight} كجم
                </p>
                <p>
                  <span className="font-medium">الحالة: </span>
                  {viewShipment.status}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editShipment} onOpenChange={(open) => !open && setEditShipment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تعديل الشحنة</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم التتبع</label>
                  <Input
                    value={formValues.tracking_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, tracking_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الوزن الكلي (كجم)</label>
                  <Input
                    type="number"
                    value={formValues.total_weight}
                    onChange={(e) => setFormValues((f) => ({ ...f, total_weight: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">من</label>
                  <Input
                    value={formValues.origin_port}
                    onChange={(e) => setFormValues((f) => ({ ...f, origin_port: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">إلى</label>
                  <Input
                    value={formValues.destination_port}
                    onChange={(e) => setFormValues((f) => ({ ...f, destination_port: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">تاريخ الشحن</label>
                  <Input
                    type="date"
                    value={formValues.shipment_date}
                    onChange={(e) => setFormValues((f) => ({ ...f, shipment_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">تاريخ الوصول</label>
                  <Input
                    type="date"
                    value={formValues.arrival_date}
                    onChange={(e) => setFormValues((f) => ({ ...f, arrival_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">الحالة</label>
                <select
                  className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                  value={formValues.status}
                  onChange={(e) => setFormValues((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="Pending">قيد الانتظار</option>
                  <option value="Processing">قيد المعالجة</option>
                  <option value="In Transit">في الطريق</option>
                  <option value="Delivered">تم التسليم</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditShipment(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitEdit} disabled={updateShipment.isPending}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Shipments;
