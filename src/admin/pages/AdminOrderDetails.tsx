import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "../../types/order";
import {
  ORDER_STATUSES,
  ORDER_STATUS_BADGE_VARIANT,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_BADGE_VARIANT,
  PAYMENT_STATUS_LABELS,
} from "../../types/order";
import {
  deleteOrder,
  fetchOrderById,
  updateOrderNotes,
  updateOrderStatus,
  updatePaymentStatus,
} from "../api/adminOrders";
import { useToast } from "../../hooks/useToast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Skeleton, SkeletonText } from "../components/ui/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";

const INPUT_CLASS =
  "bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 w-full focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-[#1A1A1A] text-sm transition-shadow";
const LABEL_CLASS = "text-xs font-medium text-brand-muted uppercase tracking-wide mb-1 block";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrderById(Number(id));
      setOrder(data);
      setNotesDraft(data.orderNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order || status === order.status) return;
    setSavingStatus(true);
    try {
      const updated = await updateOrderStatus(order.id, order.statusHistory, status);
      setOrder(updated);
      showToast(`Order status updated to "${ORDER_STATUS_LABELS[status]}".`, "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update status.", "error");
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePaymentChange = async (status: PaymentStatus) => {
    if (!order || status === order.paymentStatus) return;
    setSavingPayment(true);
    try {
      const updated = await updatePaymentStatus(order.id, status);
      setOrder(updated);
      showToast(`Payment status updated to "${PAYMENT_STATUS_LABELS[status]}".`, "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update payment status.", "error");
    } finally {
      setSavingPayment(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;
    setSavingNotes(true);
    try {
      const updated = await updateOrderNotes(order.id, notesDraft.trim());
      setOrder(updated);
      showToast("Order notes saved.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save notes.", "error");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!order) return;
    setDeleting(true);
    try {
      await deleteOrder(order.id);
      showToast(`Order ${order.reference} deleted.`, "success");
      navigate("/admin/orders");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete order.", "error");
      setDeleting(false);
    }
  };

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="max-w-5xl">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-8 w-64 mb-2" />
        <SkeletonText className="w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-ink mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Orders
        </Link>
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error || "Order not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <button
        type="button"
        onClick={() => navigate("/admin/orders")}
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-ink mb-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
      >
        <ArrowLeft size={15} />
        Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-brand-ink">
            {order.reference}
          </h1>
          <p className="text-sm text-brand-muted mt-1 flex items-center gap-1.5">
            <Calendar size={14} />
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
          <Badge variant={PAYMENT_STATUS_BADGE_VARIANT[order.paymentStatus]}>
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </Badge>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & delivery info */}
          <Card className="p-6">
            <h2 className="font-display font-semibold text-brand-ink text-lg mb-4">
              Customer &amp; Delivery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2.5">
                <User size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-wide">Name</p>
                  <p className="text-brand-ink font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-wide">Email</p>
                  <p className="text-brand-ink font-medium">
                    {order.customerEmail || <span className="text-brand-muted">Not provided</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-wide">Phone</p>
                  <p className="text-brand-ink font-medium">{order.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-wide">Delivery Address</p>
                  <p className="text-brand-ink font-medium">
                    {order.customerAddress}
                    {(order.customerCity || order.customerState) && (
                      <>
                        <br />
                        {[order.customerCity, order.customerState].filter(Boolean).join(", ")}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Ordered products */}
          <Card className="overflow-hidden">
            <div className="px-6 pt-6 pb-2">
              <h2 className="font-display font-semibold text-brand-ink text-lg">
                Ordered Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-bg text-left text-xs uppercase tracking-wide text-brand-muted">
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Qty</th>
                    <th className="px-6 py-3 font-semibold">Price</th>
                    <th className="px-6 py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.img_url || "/favicon.svg"}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover bg-brand-bg border border-brand-border flex-shrink-0"
                          />
                          <span className="font-medium text-brand-ink">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-brand-muted">{item.qty}</td>
                      <td className="px-6 py-3 text-brand-muted">
                        ₦{item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-brand-ink">
                        ₦{(item.price * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-brand-border space-y-1.5">
              <div className="flex justify-between text-sm text-brand-muted">
                <span>Subtotal</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-brand-ink">
                <span>Total</span>
                <span className="text-brand-gold">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="font-display font-semibold text-brand-ink text-lg mb-4">Timeline</h2>
            {order.statusHistory.length === 0 ? (
              <p className="text-sm text-brand-muted">No status history recorded yet.</p>
            ) : (
              <ol className="space-y-4">
                {[...order.statusHistory].reverse().map((event, index) => (
                  <li key={`${event.status}-${event.changed_at}-${index}`} className="flex gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-brand-gold text-white"
                            : "bg-brand-bg text-brand-muted border border-brand-border"
                        }`}
                      >
                        <CheckCircle2 size={14} />
                      </span>
                      {index < order.statusHistory.length - 1 && (
                        <span className="w-px flex-1 bg-brand-border mt-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-brand-ink">
                        {ORDER_STATUS_LABELS[event.status]}
                      </p>
                      <p className="text-xs text-brand-muted">{formatDateTime(event.changed_at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Sidebar: status controls + notes */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-display font-semibold text-brand-ink text-lg">Manage Order</h2>

            <div>
              <label className={LABEL_CLASS}>Order Status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                disabled={savingStatus}
                className={INPUT_CLASS}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL_CLASS}>Payment Status</label>
              <select
                value={order.paymentStatus}
                onChange={(e) => handlePaymentChange(e.target.value as PaymentStatus)}
                disabled={savingPayment}
                className={INPUT_CLASS}
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {PAYMENT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              variant="danger"
              size="md"
              fullWidth
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={15} />
              Delete Order
            </Button>
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="font-display font-semibold text-brand-ink text-lg">Order Notes</h2>
            <textarea
              rows={5}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Internal notes about this order (not visible to the customer)…"
              className={`${INPUT_CLASS} resize-none`}
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              loading={savingNotes}
              disabled={notesDraft.trim() === order.orderNotes}
              onClick={handleSaveNotes}
            >
              Save Notes
            </Button>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete order"
        description={`Are you sure you want to delete order "${order.reference}"? This action cannot be undone.`}
        busy={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default AdminOrderDetails;
