import { MainLayout } from "@/components/layout/MainLayout";
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, type Product } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Filter, Package, DollarSign, Globe, Scale } from "lucide-react";
import { useState } from "react";

const Products = () => {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    currency: "USD",
    country_of_origin: "",
    weight: "",
    category_id: "",
  });

  const resetForm = () =>
    setFormValues({
      id: "",
      name: "",
      description: "",
      price: "",
      currency: "USD",
      country_of_origin: "",
      weight: "",
      category_id: "",
    });

  const filteredProducts = products?.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === null || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitAdd = async () => {
    if (!formValues.id || !formValues.name || !formValues.price) return;

    await createProduct.mutateAsync({
      id: Number(formValues.id),
      name: formValues.name,
      description: formValues.description || null,
      price: Number(formValues.price),
      currency: formValues.currency || null,
      country_of_origin: formValues.country_of_origin || null,
      weight: formValues.weight ? Number(formValues.weight) : null,
      category_id: formValues.category_id ? Number(formValues.category_id) : null,
    } as any);

    resetForm();
    setAddOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!editProduct) return;

    await updateProduct.mutateAsync({
      id: editProduct.id,
      updates: {
        name: formValues.name,
        description: formValues.description || null,
        price: Number(formValues.price),
        currency: formValues.currency || null,
        country_of_origin: formValues.country_of_origin || null,
        weight: formValues.weight ? Number(formValues.weight) : null,
        category_id: formValues.category_id ? Number(formValues.category_id) : null,
      } as any,
    });

    setEditProduct(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-cairo">المنتجات</h1>
            <p className="text-muted-foreground mt-1">إدارة كتالوج المنتجات</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            منتج جديد
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              الكل
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : filteredProducts?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد منتجات</p>
            </div>
          ) : (
            filteredProducts?.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground font-cairo">{product.name}</h3>
                      {product.category_id && (
                        <Badge variant="secondary" className="mt-1">
                          {categories?.find((c) => c.id === product.category_id)?.name || "بدون تصنيف"}
                        </Badge>
                      )}
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "لا يوجد وصف"}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>
                        {product.price} {product.currency || "USD"}
                      </span>
                    </div>
                    {product.weight && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Scale className="h-3.5 w-3.5" />
                        <span>{product.weight} كجم</span>
                      </div>
                    )}
                    {product.country_of_origin && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{product.country_of_origin}</span>
                      </div>
                    )}
                    {product.hs_code && (
                      <div className="text-muted-foreground">
                        <span className="font-mono">HS: {product.hs_code}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewProduct(product)}
                    >
                      تفاصيل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditProduct(product);
                        setFormValues({
                          id: String(product.id),
                          name: product.name,
                          description: product.description || "",
                          price: String(product.price),
                          currency: product.currency || "USD",
                          country_of_origin: product.country_of_origin || "",
                          weight: product.weight ? String(product.weight) : "",
                          category_id: product.category_id ? String(product.category_id) : "",
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
              <DialogTitle className="font-cairo">إضافة منتج جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">رقم المنتج (ID)</label>
                  <Input
                    value={formValues.id}
                    onChange={(e) => setFormValues((f) => ({ ...f, id: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم المنتج</label>
                  <Input
                    value={formValues.name}
                    onChange={(e) => setFormValues((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الوصف</label>
                <Input
                  value={formValues.description}
                  onChange={(e) => setFormValues((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">السعر</label>
                  <Input
                    type="number"
                    value={formValues.price}
                    onChange={(e) => setFormValues((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">العملة</label>
                  <Input
                    value={formValues.currency}
                    onChange={(e) => setFormValues((f) => ({ ...f, currency: e.target.value }))}
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
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">بلد المنشأ</label>
                  <Input
                    value={formValues.country_of_origin}
                    onChange={(e) => setFormValues((f) => ({ ...f, country_of_origin: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">التصنيف</label>
                  <select
                    className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                    value={formValues.category_id}
                    onChange={(e) => setFormValues((f) => ({ ...f, category_id: e.target.value }))}
                  >
                    <option value="">بدون تصنيف</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => (setAddOpen(false), resetForm())}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitAdd} disabled={createProduct.isPending}>
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewProduct} onOpenChange={(open) => !open && setViewProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تفاصيل المنتج</DialogTitle>
            </DialogHeader>
            {viewProduct && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">الاسم: </span>
                  {viewProduct.name}
                </p>
                <p>
                  <span className="font-medium">ID: </span>
                  {viewProduct.id}
                </p>
                <p>
                  <span className="font-medium">الوصف: </span>
                  {viewProduct.description || "لا يوجد وصف"}
                </p>
                <p>
                  <span className="font-medium">السعر: </span>
                  {viewProduct.price} {viewProduct.currency || "USD"}
                </p>
                {viewProduct.weight && (
                  <p>
                    <span className="font-medium">الوزن: </span>
                    {viewProduct.weight} كجم
                  </p>
                )}
                {viewProduct.country_of_origin && (
                  <p>
                    <span className="font-medium">بلد المنشأ: </span>
                    {viewProduct.country_of_origin}
                  </p>
                )}
                {viewProduct.category_id && (
                  <p>
                    <span className="font-medium">التصنيف: </span>
                    {categories?.find((c) => c.id === viewProduct.category_id)?.name || "بدون تصنيف"}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-cairo">تعديل المنتج</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">اسم المنتج</label>
                  <Input
                    value={formValues.name}
                    onChange={(e) => setFormValues((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">السعر</label>
                  <Input
                    type="number"
                    value={formValues.price}
                    onChange={(e) => setFormValues((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">الوصف</label>
                <Input
                  value={formValues.description}
                  onChange={(e) => setFormValues((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">العملة</label>
                  <Input
                    value={formValues.currency}
                    onChange={(e) => setFormValues((f) => ({ ...f, currency: e.target.value }))}
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
                <div className="space-y-1">
                  <label className="text-sm font-medium">بلد المنشأ</label>
                  <Input
                    value={formValues.country_of_origin}
                    onChange={(e) => setFormValues((f) => ({ ...f, country_of_origin: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">التصنيف</label>
                <select
                  className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                  value={formValues.category_id}
                  onChange={(e) => setFormValues((f) => ({ ...f, category_id: e.target.value }))}
                >
                  <option value="">بدون تصنيف</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProduct(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitEdit} disabled={updateProduct.isPending}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Products;
