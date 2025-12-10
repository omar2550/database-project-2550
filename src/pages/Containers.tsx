import { MainLayout } from "@/components/layout/MainLayout";
import { useContainers, useCreateContainer, useUpdateContainer, type Container } from "@/hooks/useContainers";
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
import { Search, Plus, Container as ContainerIcon, Eye } from "lucide-react";
import { useState } from "react";

const Containers = () => {
  const { data: containers, isLoading } = useContainers();
  const createContainer = useCreateContainer();
  const updateContainer = useUpdateContainer();
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [viewContainer, setViewContainer] = useState<Container | null>(null);
  const [editContainer, setEditContainer] = useState<Container | null>(null);

  const [formValues, setFormValues] = useState({
    container_number: "",
    seal_number: "",
    weight: "",
    shipment_no: "",
  });

  const resetForm = () =>
    setFormValues({
      container_number: "",
      seal_number: "",
      weight: "",
      shipment_no: "",
    });

  const filteredContainers = containers?.filter(
    (c) =>
      c.container_number.toLowerCase().includes(search.toLowerCase()) ||
      c.seal_number.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitAdd = async () => {
    if (!formValues.container_number || !formValues.seal_number || !formValues.weight) return;

    await createContainer.mutateAsync({
      container_number: formValues.container_number,
      seal_number: formValues.seal_number,
      weight: Number(formValues.weight),
      shipment_no: formValues.shipment_no ? Number(formValues.shipment_no) : null,
    } as any);

    resetForm();
    setAddOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!editContainer) return;

    await updateContainer.mutateAsync({
      container_number: editContainer.container_number,
      updates: {
        seal_number: formValues.seal_number,
        weight: Number(formValues.weight),
        shipment_no: formValues.shipment_no ? Number(formValues.shipment_no) : null,
      } as any,
    });

    setEditContainer(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">الحاويات</h1>
            <p className="text-muted-foreground mt-1">إدارة ومتابعة الحاويات</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            حاوية جديدة
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث برقم الحاوية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right font-cairo">رقم الحاوية</TableHead>
                <TableHead className="text-right font-cairo">رقم الختم</TableHead>
                <TableHead className="text-right font-cairo">الوزن</TableHead>
                <TableHead className="text-right font-cairo">الشحنة</TableHead>
                <TableHead className="text-right font-cairo">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredContainers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <ContainerIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد حاويات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContainers?.map((container) => (
                  <TableRow key={container.container_number} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-medium">
                      {container.container_number}
                    </TableCell>
                    <TableCell className="font-mono">{container.seal_number}</TableCell>
                    <TableCell>{container.weight} كجم</TableCell>
                    <TableCell>
                      {container.shipment_no ? (
                        <Badge variant="secondary">#{container.shipment_no}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewContainer(container)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditContainer(container);
                          setFormValues({
                            container_number: container.container_number,
                            seal_number: container.seal_number,
                            weight: String(container.weight),
                            shipment_no: container.shipment_no ? String(container.shipment_no) : "",
                          });
                        }}
                      >
                        تعديل
                      </Button>
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
              <DialogTitle className="font-cairo">إضافة حاوية جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم الحاوية</label>
                  <Input
                    value={formValues.container_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, container_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم الختم</label>
                  <Input
                    value={formValues.seal_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, seal_number: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الوزن (كجم)</label>
                  <Input
                    type="number"
                    value={formValues.weight}
                    onChange={(e) => setFormValues((f) => ({ ...f, weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم الشحنة (اختياري)</label>
                  <Input
                    type="number"
                    value={formValues.shipment_no}
                    onChange={(e) => setFormValues((f) => ({ ...f, shipment_no: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createContainer.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewContainer} onOpenChange={(open) => !open && setViewContainer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تفاصيل الحاوية</DialogTitle>
            </DialogHeader>
            {viewContainer && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">رقم الحاوية: </span>
                  {viewContainer.container_number}
                </p>
                <p>
                  <span className="font-medium">رقم الختم: </span>
                  {viewContainer.seal_number}
                </p>
                <p>
                  <span className="font-medium">الوزن: </span>
                  {viewContainer.weight} كجم
                </p>
                <p>
                  <span className="font-medium">رقم الشحنة: </span>
                  {viewContainer.shipment_no ?? "-"}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editContainer} onOpenChange={(open) => !open && setEditContainer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تعديل بيانات الحاوية</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم الختم</label>
                  <Input
                    value={formValues.seal_number}
                    onChange={(e) => setFormValues((f) => ({ ...f, seal_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">الوزن (كجم)</label>
                  <Input
                    type="number"
                    value={formValues.weight}
                    onChange={(e) => setFormValues((f) => ({ ...f, weight: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">رقم الشحنة (اختياري)</label>
                <Input
                  type="number"
                  value={formValues.shipment_no}
                  onChange={(e) => setFormValues((f) => ({ ...f, shipment_no: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditContainer(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitEdit} disabled={updateContainer.isPending}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Containers;
