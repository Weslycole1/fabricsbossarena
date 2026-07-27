import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  PackageSearch,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { Order, OrderStatus } from "../../types/order";
import {
  ORDER_STATUSES,
  ORDER_STATUS_BADGE_VARIANT,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_BADGE_VARIANT,
  PAYMENT_STATUS_LABELS,
} from "../../types/order";
import { deleteOrder, fetchOrders } from "../api/adminOrders";
import { useToast } from "../../hooks/useToast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonText } from "../components/ui/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";

type SortDirection = "newest" | "oldest";
type StatusFilter = "all" | OrderStatus;

const PAGE_SIZE = 10;

const AdminOrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  // Reset to page 1 whenever filters change so we never land on an empty page.
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateFrom, dateTo, sortDirection]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const fromTime = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0) : null;
    const toTime = dateTo ? new Date(dateTo).setHours(23, 59, 59, 999) : null;

    const filtered = orders.filter((order) => {
      const matchesQuery =
        !query ||
        order.reference.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.customerPhone.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      const createdTime = new Date(order.createdAt).getTime();
      const matchesFrom = fromTime === null || createdTime >= fromTime;
      const matchesTo = toTime === null || createdTime <= toTime;

      return matchesQuery && matchesStatus && matchesFrom && matchesTo;
    });

    return [...filtered].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDirection === "newest" ? -diff : diff;
    });
  }, [orders, search, statusFilter, dateFrom, dateTo, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasActiveFilters =
    search.trim() !== "" || statusFilter !== "all" || dateFrom !== "" || dateTo !== "";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteOrder(pendingDelete.id);
      setOrders((prev) => prev.filter((o) => o.id !== pendingDelete.id));
      showToast(`Order ${pendingDelete.reference} deleted.`, "success");
      setPendingDelete(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete order.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-brand-ink">Orders</h1>
          <p className="text-sm text-brand-muted mt-1">
            {loading ? "Loading…" : `${filteredOrders.length} of ${orders.length} order(s)`}
          </p>
        </div>
      </div>

      <Card className="p-4 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by reference, name, email, or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition-shadow"
              aria-label="Search orders"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:flex lg:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              max={dateTo || undefined}
              className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none"
              aria-label="From date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom || undefined}
              className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none"
              aria-label="To date"
            />

            <button
              type="button"
              onClick={() => setSortDirection((d) => (d === "newest" ? "oldest" : "newest"))}
              className="inline-flex items-center justify-center gap-1.5 bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-brand-ink hover:border-brand-gold/40 transition-colors"
            >
              {sortDirection === "newest" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
              {sortDirection === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-muted hover:text-brand-ink px-2 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fadeIn">
          {error}
        </p>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-bg text-left text-xs uppercase tracking-wide text-brand-muted">
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><SkeletonText className="w-24" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-32" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-20" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-16" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-16" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-20" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={<PackageSearch size={26} />}
                      title={orders.length === 0 ? "No orders yet" : "No matches found"}
                      description={
                        orders.length === 0
                          ? "Orders placed at checkout will show up here."
                          : "Try adjusting your search, status, or date filters."
                      }
                      action={
                        orders.length > 0 ? (
                          <Button variant="secondary" size="sm" onClick={clearFilters}>
                            Clear filters
                          </Button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-bg/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-brand-ink whitespace-nowrap">
                      {order.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-ink truncate max-w-[160px]">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-brand-muted truncate max-w-[160px]">
                        {order.customerPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-ink whitespace-nowrap">
                      ₦{order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={PAYMENT_STATUS_BADGE_VARIANT[order.paymentStatus]}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          aria-label={`View order ${order.reference}`}
                          className="p-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-bg hover:border-brand-gold/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete order ${order.reference}`}
                          onClick={() => setPendingDelete(order)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredOrders.length > 0 && (
          <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-brand-border">
            <p className="text-xs text-brand-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="p-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="p-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete order"
        description={`Are you sure you want to delete order "${pendingDelete?.reference}"? This action cannot be undone.`}
        busy={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminOrdersList;
