import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import Employees from "./pages/Employees";
import Importers from "./pages/Importers";
import Payments from "./pages/Payments";
import Transportation from "./pages/Transportation";
import Containers from "./pages/Containers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/products" element={<Products />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/importers" element={<Importers />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/containers" element={<Containers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
