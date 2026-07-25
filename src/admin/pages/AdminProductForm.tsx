import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const TAG_OPTIONS = ["exclusive", "luxury", "trending", "budget"];

const INPUT_CLASS =
  "bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none text-[#1A1A1A] text-sm";
const LABEL_CLASS = "text-sm font-medium text-[#6B5B4E] mb-1.5 block";

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

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        setError(
          err instanceof Error ? err.message : "Failed to load product data."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = form.name.trim();
    const priceValue = Number(form.price);
    const stockValue = Number(form.stock);
    const finalCategory = useNewCategory
      ? form.newCategory.trim()
      : form.category.trim();

    if (!trimmedName) {
      setError("Product name is required.");
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setError("Enter a valid price.");
      return;
    }
    if (!finalCategory) {
      setError("Select or create a category.");
      return;
    }
    if (!Number.isFinite(stockValue) || stockValue < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }
    if (!isEdit && !imageFile) {
      setError("Please upload a product image.");
      return;
    }

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
      setError(
        err instanceof Error ? err.message : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#6B5B4E] py-10 text-center">Loading…</p>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C1810]">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-sm text-[#6B5B4E] mt-1">
          {isEdit
            ? "Update the details below and save your changes."
            : "Fill in the details to add a new product to the catalog."}
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-[#E8E0D5] p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-4">
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
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={INPUT_CLASS}
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: e.target.value }))
                }
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={INPUT_CLASS}
                >
                  {categories.length === 0 && (
                    <option value="">No categories yet</option>
                  )}
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={form.newCategory}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, newCategory: e.target.value }))
                  }
                  placeholder="New category name"
                  className={INPUT_CLASS}
                />
              )}
              <button
                type="button"
                onClick={() => setUseNewCategory((v) => !v)}
                className="mt-1.5 text-xs text-[#C9974A] hover:underline"
              >
                {useNewCategory
                  ? "Choose an existing category instead"
                  : "+ Create a new category"}
              </button>
            </div>

            <div>
              <label className={LABEL_CLASS}>Tag (site badge)</label>
              <select
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                className={INPUT_CLASS}
              >
                {TAG_OPTIONS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#2C1810]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="accent-[#C9974A] h-4 w-4"
              />
              Featured Product
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#2C1810]">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_available: e.target.checked }))
                }
                className="accent-[#C9974A] h-4 w-4"
              />
              Available for Sale
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <label className={LABEL_CLASS}>Product Image</label>
          <div className="aspect-square w-full rounded-xl border border-dashed border-[#E8E0D5] bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-[#6B5B4E]">No image selected</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-[#6B5B4E] w-full"
          />
          <p className="text-xs text-[#6B5B4E]">
            JPG or PNG, up to 5MB. Uploaded securely to Supabase Storage.
          </p>

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2C1810] hover:bg-[#3d2415] text-white font-bold rounded-xl py-3 w-full transition text-sm disabled:opacity-70"
            >
              {saving
                ? "Saving…"
                : isEdit
                ? "Save Changes"
                : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              disabled={saving}
              className="border border-[#E8E0D5] text-[#2C1810] hover:bg-[#FAF7F2] font-medium rounded-xl py-3 w-full transition text-sm disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
