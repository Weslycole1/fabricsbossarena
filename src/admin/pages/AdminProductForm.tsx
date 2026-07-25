import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Tag, Upload, X } from "lucide-react";
import type { Category } from "../../types/product";
import {
  createCategory,
  createProduct,
  fetchCategories,
  fetchProductById,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "../api/adminProducts";
import { useToast } from "../../hooks/useToast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Skeleton, SkeletonText } from "../components/ui/Skeleton";

const TAG_OPTIONS = ["exclusive", "luxury", "trending", "budget"];

const INPUT_CLASS =
  "bg-brand-bg border border-brand-border rounded-xl px-4 py-3 w-full focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-[#1A1A1A] text-sm transition-shadow";
const LABEL_CLASS = "text-sm font-medium text-brand-muted mb-1.5 block";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  newCategory: "",
  tag: TAG_OPTIONS[0],
  stock: "0",
  featured: false,
  is_available: true,
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [categoryList, product] = await Promise.all([
          fetchCategories(),
          isEdit ? fetchProductById(Number(id)) : Promise.resolve(null),
        ]);

        if (!mounted) return;
        setCategories(categoryList);

        if (product) {
          setForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            category: product.category,
            newCategory: "",
            tag: product.tag || TAG_OPTIONS[0],
            stock: String(product.stock),
            featured: product.featured,
            is_available: product.is_available,
          });
          setExistingImageUrl(product.img_url);
          setImagePreview(product.img_url);
        } else if (categoryList.length > 0) {
          setForm((prev) => ({ ...prev, category: categoryList[0].name }));
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load product data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const applyImageFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyImageFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    applyImageFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(isEdit ? existingImageUrl : "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = form.name.trim();
    const priceValue = Number(form.price);
    const stockValue = Number(form.stock);
    const finalCategory = useNewCategory ? form.newCategory.trim() : form.category.trim();

    if (!trimmedName) return setError("Product name is required.");
    if (!Number.isFinite(priceValue) || priceValue < 0) return setError("Enter a valid price.");
    if (!finalCategory) return setError("Select or create a category.");
    if (!Number.isFinite(stockValue) || stockValue < 0)
      return setError("Enter a valid stock quantity.");
    if (!isEdit && !imageFile) return setError("Please upload a product image.");

    setSaving(true);
    try {
      if (useNewCategory) {
        await createCategory(finalCategory);
      }

      let imgUrl = existingImageUrl;
      if (imageFile) {
        imgUrl = await uploadProductImage(imageFile);
      }

      const payload: ProductInput = {
        name: trimmedName,
        description: form.description.trim(),
        price: priceValue,
        category: finalCategory,
        tag: form.tag,
        img_url: imgUrl,
        stock: stockValue,
        featured: form.featured,
        is_available: form.is_available,
      };

      if (isEdit) {
        await updateProduct(Number(id), payload);
        showToast("Product updated successfully.", "success");
      } else {
        await createProduct(payload);
        showToast("Product created successfully.", "success");
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-8 w-56 mb-2" />
        <SkeletonText className="w-72 mb-6" />
        <Card className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <Skeleton className="aspect-square w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-ink mb-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
      >
        <ArrowLeft size={15} />
        Back to Products
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-brand-ink">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          {isEdit
            ? "Update the details below and save your changes."
            : "Fill in the details to add a new product to the catalog."}
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fadeIn">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div>
            <label className={LABEL_CLASS}>Product Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={INPUT_CLASS}
              placeholder="e.g. Royal Silk"
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${INPUT_CLASS} resize-none`}
              placeholder="Describe the fabric, texture, and best uses…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Price (₦)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Category</label>
              {!useNewCategory ? (
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={`${INPUT_CLASS} capitalize`}
                >
                  {categories.length === 0 && <option value="">No categories yet</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} className="capitalize">
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={form.newCategory}
                  onChange={(e) => setForm((f) => ({ ...f, newCategory: e.target.value }))}
                  placeholder="New category name"
                  className={INPUT_CLASS}
                />
              )}
              <button
                type="button"
                onClick={() => setUseNewCategory((v) => !v)}
                className="mt-1.5 text-xs text-brand-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
              >
                {useNewCategory ? "Choose an existing category instead" : "+ Create a new category"}
              </button>
            </div>

            <div>
              <label className={LABEL_CLASS}>Tag (site badge)</label>
              <div className="relative">
                <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <select
                  value={form.tag}
                  onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  className={`${INPUT_CLASS} pl-9 capitalize`}
                >
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag} className="capitalize">
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <label
              className={`flex items-center gap-2 cursor-pointer text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                form.featured
                  ? "bg-brand-gold/10 border-brand-gold/40 text-brand-ink"
                  : "border-brand-border text-brand-muted hover:bg-brand-bg"
              }`}
            >
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="accent-brand-gold h-4 w-4"
              />
              Featured Product
            </label>
            <label
              className={`flex items-center gap-2 cursor-pointer text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                form.is_available
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "border-brand-border text-brand-muted hover:bg-brand-bg"
              }`}
            >
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))}
                className="accent-brand-gold h-4 w-4"
              />
              Available for Sale
            </label>
          </div>
        </Card>

        <Card className="p-6 space-y-3 h-fit">
          <label className={LABEL_CLASS}>Product Image</label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            className={`relative aspect-square w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
              isDragging
                ? "border-brand-gold bg-brand-gold/10"
                : "border-brand-border bg-brand-bg hover:border-brand-gold/50"
            }`}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-brand-muted px-4 text-center">
                <ImagePlus size={28} strokeWidth={1.5} />
                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                <p className="text-xs">JPG or PNG, up to 5MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {imagePreview && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-brand-gold hover:underline py-1"
            >
              <Upload size={13} />
              Replace image
            </button>
          )}

          <div className="pt-3 flex flex-col gap-2">
            <Button type="submit" variant="primary" size="lg" loading={saving} fullWidth>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              disabled={saving}
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AdminProductForm;
