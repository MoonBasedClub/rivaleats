import { getServiceRoleClient } from "@/lib/supabase/server";

type Order = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  fulfillment: string;
  delivery_day: string | null;
  time_window: string;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  after_cutoff: boolean;
  outside_zone_fee: number;
  outside_zone_accepted: boolean;
  schedule_next_window: boolean;
};

async function fetchOrders(): Promise<Order[]> {
  const supabase = getServiceRoleClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("orders")
    .select(
      "id, created_at, full_name, email, phone, fulfillment, delivery_day, time_window, address_line1, city, state, postal_code, after_cutoff, outside_zone_fee, outside_zone_accepted, schedule_next_window"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export default async function AdminOrdersPage() {
  const orders = await fetchOrders();
  const serviceKeyMissing = orders.length === 0;

  return (
    <div className="space-y-4">
      {serviceKeyMissing && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Service role key is not set. Orders cannot be fetched until the key is
          configured on the server.
        </div>
      )}
      <div className="rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-charcoal">
            Latest 50 orders
          </h2>
          <p className="text-sm text-muted">Newest first.</p>
        </div>
        <div className="mt-4 space-y-4">
          {orders.map((order) => {
            const date = new Date(order.created_at);
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-charcoal">
                      {order.full_name}
                    </p>
                    <p className="text-sm text-muted">
                      {order.email}
                      {order.phone ? ` · ${order.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cream">
                      {order.fulfillment}
                    </span>
                    {order.after_cutoff && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                        After cutoff
                      </span>
                    )}
                    {order.outside_zone_fee > 0 && (
                      <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                        Outside zone +${order.outside_zone_fee.toFixed(2)}
                      </span>
                    )}
                    {order.schedule_next_window && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Next window
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span>
                    {date.toLocaleDateString()} · {date.toLocaleTimeString()}
                  </span>
                  {order.delivery_day && (
                    <span className="rounded-full bg-soft-card px-3 py-1 text-xs font-semibold text-charcoal">
                      {order.delivery_day} · {order.time_window}
                    </span>
                  )}
                </div>
                {order.address_line1 && (
                  <p className="mt-2 text-sm text-charcoal">
                    {order.address_line1}
                    {order.city ? `, ${order.city}` : ""}{" "}
                    {order.state ? order.state : ""}
                    {order.postal_code ? ` ${order.postal_code}` : ""}
                  </p>
                )}
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
              No orders yet. Submissions will appear here as they arrive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
