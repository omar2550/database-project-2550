import { MainLayout } from "@/components/layout/MainLayout";
import { usePayments, type Payment } from "@/hooks/usePayments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CreditCard, Eye } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  "Completed": "bg-success/10 text-success border-success/20",
  "Pending": "bg-warning/10 text-warning border-warning/20",
  "Failed": "bg-destructive/10 text-destructive border-destructive/20",
};

const Payments = () => {
  const { data: payments, isLoading } = usePayments();
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);


  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">المدفوعات</h1>
            <p className="text-muted-foreground mt-1">سجل المدفوعات والمعاملات</p>
          </div>
        </div>
        {/* Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right font-cairo">رقم المعاملة</TableHead>
                <TableHead className="text-right font-cairo">الشحنة</TableHead>
                <TableHead className="text-right font-cairo">المبلغ</TableHead>
                <TableHead className="text-right font-cairo">طريقة الدفع</TableHead>
                <TableHead className="text-right font-cairo">التاريخ</TableHead>
                <TableHead className="text-right font-cairo">الحالة</TableHead>
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
              ) : payments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد مدفوعات</p>
                  </TableCell>
                </TableRow>
              ) : (
                payments?.map((payment, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-sm">
                      {payment.transaction_reference}
                    </TableCell>
                    <TableCell>#{payment.shipment_no}</TableCell>
                    <TableCell className="font-medium">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </TableCell>
                    <TableCell>{payment.payment_methods?.method_name}</TableCell>
                    <TableCell>
                      {new Date(payment.payment_date).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          statusColors[payment.payment_status] || statusColors["Pending"]
                        )}
                      >
                        {payment.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setViewPayment(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Payment Dialog */}
        <Dialog open={!!viewPayment} onOpenChange={(open) => !open && setViewPayment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تفاصيل الدفع</DialogTitle>
            </DialogHeader>
            {viewPayment && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-muted-foreground">رقم المعاملة:</span>
                    <p className="font-mono mt-1">{viewPayment.transaction_reference}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">رقم الشحنة:</span>
                    <p className="mt-1">#{viewPayment.shipment_no}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">المبلغ:</span>
                    <p className="mt-1 font-medium">
                      {viewPayment.amount.toLocaleString()} {viewPayment.currency}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">طريقة الدفع:</span>
                    <p className="mt-1">{viewPayment.payment_methods?.method_name || "غير محدد"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">تاريخ الدفع:</span>
                    <p className="mt-1">
                      {new Date(viewPayment.payment_date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">الحالة:</span>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          statusColors[viewPayment.payment_status] || statusColors["Pending"]
                        )}
                      >
                        {viewPayment.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Payments;
