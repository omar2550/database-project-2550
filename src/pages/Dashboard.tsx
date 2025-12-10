import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentShipments } from "@/components/dashboard/RecentShipments";
import { InventoryOverview } from "@/components/dashboard/InventoryOverview";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Ship, Package, Warehouse, Users, DollarSign, Container } from "lucide-react";

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-cairo">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1">مرحباً بك في نظام إدارة الاستيراد والتصدير</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatsCard
            title="إجمالي الشحنات"
            value={isLoading ? "..." : stats?.totalShipments || 0}
            icon={Ship}
            variant="primary"
          />
          <StatsCard
            title="الشحنات النشطة"
            value={isLoading ? "..." : stats?.activeShipments || 0}
            icon={Ship}
            variant="accent"
          />
          <StatsCard
            title="المنتجات"
            value={isLoading ? "..." : stats?.totalProducts || 0}
            icon={Package}
            variant="warning"
          />
          <StatsCard
            title="المخازن"
            value={isLoading ? "..." : stats?.totalWarehouses || 0}
            icon={Warehouse}
            variant="success"
          />
          <StatsCard
            title="الموظفين"
            value={isLoading ? "..." : stats?.totalEmployees || 0}
            icon={Users}
          />
          <StatsCard
            title="الحاويات"
            value={isLoading ? "..." : stats?.totalContainers || 0}
            icon={Container}
          />
        </div>

        {/* Revenue Card */}
        <div className="rounded-xl border gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">إجمالي الإيرادات</p>
              <p className="text-4xl font-bold font-cairo mt-2">
                ${isLoading ? "..." : stats?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <DollarSign className="h-16 w-16 text-primary-foreground/30" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentShipments />
          <InventoryOverview />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
