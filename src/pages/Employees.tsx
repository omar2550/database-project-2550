import { MainLayout } from "@/components/layout/MainLayout";
import { useEmployees, useCreateEmployee, useUpdateEmployee, type Employee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Users, Mail, Phone, MapPin, Eye, Edit } from "lucide-react";
import { useState } from "react";

const Employees = () => {
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "hire_date" | "salary">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [addOpen, setAddOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const [formValues, setFormValues] = useState({
    ssn: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const resetForm = () =>
    setFormValues({
      ssn: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    });

  const filteredEmployees = employees
    ?.filter((e) => {
      const term = search.toLowerCase();
      if (!term) return true;
      return (
        e.first_name.toLowerCase().includes(term) ||
        e.last_name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        (e.phone ?? "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") {
        const an = `${a.first_name} ${a.last_name}`.toLowerCase();
        const bn = `${b.first_name} ${b.last_name}`.toLowerCase();
        return an > bn ? dir : an < bn ? -dir : 0;
      }
      if (sortBy === "hire_date") {
        const ad = a.hire_date ? new Date(a.hire_date).getTime() : 0;
        const bd = b.hire_date ? new Date(b.hire_date).getTime() : 0;
        return (ad - bd) * dir;
      }
      if (sortBy === "salary") {
        const as = a.salary ?? 0;
        const bs = b.salary ?? 0;
        return (as - bs) * dir;
      }
      return 0;
    });

  const handleSubmitAdd = async () => {
    if (!formValues.ssn || !formValues.first_name || !formValues.last_name || !formValues.email) return;
    await createEmployee.mutateAsync({
      ssn: Number(formValues.ssn),
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      phone: formValues.phone || null,
    } as any);
    resetForm();
    setAddOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!editEmployee) return;
    await updateEmployee.mutateAsync({
      ssn: editEmployee.ssn,
      updates: {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone: formValues.phone || null,
      } as any,
    });
    setEditEmployee(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">الموظفين</h1>
            <p className="text-muted-foreground mt-1">إدارة فريق العمل</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ترتيب حسب:</span>
              <select
                className="rounded-md border bg-background px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="name">الاسم</option>
                <option value="hire_date">تاريخ التعيين</option>
                <option value="salary">الراتب</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </Button>
            </div>
            <Button className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              موظف جديد
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن موظف..."
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
                <TableHead className="text-right font-cairo">الموظف</TableHead>
                <TableHead className="text-right font-cairo">البريد الإلكتروني</TableHead>
                <TableHead className="text-right font-cairo">الهاتف</TableHead>
                <TableHead className="text-right font-cairo">المخزن</TableHead>
                <TableHead className="text-right font-cairo">تاريخ التعيين</TableHead>
                <TableHead className="text-right font-cairo">الراتب</TableHead>
                <TableHead className="text-right font-cairo">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredEmployees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا يوجد موظفين</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees?.map((employee) => (
                  <TableRow key={employee.ssn} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-cairo">
                            {employee.first_name[0]}
                            {employee.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">SSN: {employee.ssn}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm" dir="ltr">
                            {employee.phone}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.warehouses && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{employee.warehouses.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.hire_date &&
                        new Date(employee.hire_date).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      {employee.salary && (
                        <span className="font-medium">${employee.salary.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewEmployee(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditEmployee(employee);
                            setFormValues({
                              ssn: String(employee.ssn),
                              first_name: employee.first_name,
                              last_name: employee.last_name,
                              email: employee.email,
                              phone: employee.phone ?? "",
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
              <DialogTitle className="font-cairo">إضافة موظف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">الرقم القومي / SSN</label>
                <Input
                  value={formValues.ssn}
                  onChange={(e) => setFormValues((f) => ({ ...f, ssn: e.target.value }))}
                  placeholder="مثال: 123456789"
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الاسم الأول</label>
                  <Input
                    value={formValues.first_name}
                    onChange={(e) => setFormValues((f) => ({ ...f, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم العائلة</label>
                  <Input
                    value={formValues.last_name}
                    onChange={(e) => setFormValues((f) => ({ ...f, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={formValues.email}
                  onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الهاتف</label>
                <Input
                  value={formValues.phone}
                  onChange={(e) => setFormValues((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createEmployee.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewEmployee} onOpenChange={(open) => !open && setViewEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">بيانات الموظف</DialogTitle>
            </DialogHeader>
            {viewEmployee && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">الاسم: </span>
                  {viewEmployee.first_name} {viewEmployee.last_name}
                </p>
                <p>
                  <span className="font-medium">SSN: </span>
                  {viewEmployee.ssn}
                </p>
                <p>
                  <span className="font-medium">البريد الإلكتروني: </span>
                  {viewEmployee.email}
                </p>
                {viewEmployee.phone && (
                  <p>
                    <span className="font-medium">الهاتف: </span>
                    {viewEmployee.phone}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editEmployee} onOpenChange={(open) => !open && setEditEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تعديل بيانات الموظف</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">الاسم الأول</label>
                  <Input
                    value={formValues.first_name}
                    onChange={(e) => setFormValues((f) => ({ ...f, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم العائلة</label>
                  <Input
                    value={formValues.last_name}
                    onChange={(e) => setFormValues((f) => ({ ...f, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={formValues.email}
                  onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الهاتف</label>
                <Input
                  value={formValues.phone}
                  onChange={(e) => setFormValues((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditEmployee(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitEdit} disabled={updateEmployee.isPending}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Employees;
