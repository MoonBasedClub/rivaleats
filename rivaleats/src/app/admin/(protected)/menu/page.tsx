import { revalidatePath } from "next/cache";
import { getServiceRoleClient } from "@/lib/supabase/server";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  section: string;
  price: number | null;
  tags: string[] | null;
  updated_at: string | null;
};

async function fetchMenuItems(): Promise<MenuItem[]> {
  const supabase = getServiceRoleClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("menu_items")
    .select("id, name, description, section, price, tags, updated_at")
    .order("section", { ascending: true })
    .order("name", { ascending: true });

  return data ?? [];
}

async function updateMenuItem(formData: FormData) {
  "use server";
  const supabase = getServiceRoleClient();
  if (!supabase) return;

  const id = formData.get("id")?.toString();
  if (!id) return;

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const section = formData.get("section")?.toString().trim();
  const priceRaw = formData.get("price")?.toString().trim();
  const tagsRaw = formData.get("tags")?.toString().trim();

  if (!name || !description || !section) return;
  const price = priceRaw ? Number(priceRaw) : null;
  const tags =
    tagsRaw
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? null;

  await supabase
    .from("menu_items")
    .update({
      name,
      description,
      section,
      price,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/menu");
}

async function deleteMenuItem(formData: FormData) {
  "use server";
  const supabase = getServiceRoleClient();
  if (!supabase) return;

  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase.from("menu_items").delete().eq("id", id);
  revalidatePath("/admin/menu");
}

async function addMenuItem(formData: FormData) {
  "use server";
  const supabase = getServiceRoleClient();
  if (!supabase) return;

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const section = formData.get("section")?.toString().trim();
  const priceRaw = formData.get("price")?.toString().trim();
  const tagsRaw = formData.get("tags")?.toString().trim();

  if (!name || !description || !section) return;

  const price = priceRaw ? Number(priceRaw) : null;
  const tags =
    tagsRaw
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? null;

  await supabase.from("menu_items").insert({
    name,
    description,
    section,
    price,
    tags,
  });

  revalidatePath("/admin/menu");
}

export default async function AdminMenuPage() {
  const items = await fetchMenuItems();
  const serviceKeyMissing = !process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <div className="space-y-6">
      {serviceKeyMissing && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Service role key is not set. Menu data cannot be fetched until the key
          is configured on the server.
        </div>
      )}

      <div className="rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-semibold text-charcoal">Add a menu item</h2>
        <p className="text-sm text-muted">
          Required fields: name, description, section. Tags are comma-separated.
        </p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" action={addMenuItem}>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-charcoal">Name</label>
            <input
              required
              name="name"
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              placeholder="Charred Citrus Chicken"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-charcoal">
              Description
            </label>
            <textarea
              required
              name="description"
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              rows={3}
              placeholder="Fire-roasted chicken thighs, roasted garlic potatoes, grilled broccolini."
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-charcoal">
              Section
            </label>
            <select
              required
              name="section"
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-red"
              defaultValue="dinner"
            >
              <option value="breakfast">Breakfast</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-charcoal">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              placeholder="79.99"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-charcoal">Tags</label>
            <input
              name="tags"
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              placeholder="gluten-free, high protein"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              Add item
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-charcoal">Menu items</h2>
          <p className="text-sm text-muted">Sorted by section and name.</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <form
              key={item.id}
              className="space-y-3 rounded-2xl border border-border p-4 shadow-sm"
              action={updateMenuItem}
            >
              <input type="hidden" name="id" value={item.id} />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <select
                    name="section"
                    defaultValue={item.section}
                    className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal outline-none focus:border-brand-red"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="dinner">Dinner</option>
                  </select>
                  {item.price !== null && (
                    <span className="text-sm font-semibold text-brand-red">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                  {item.updated_at && (
                    <span className="text-xs text-muted">
                      Updated {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  formAction={deleteMenuItem}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition hover:border-brand-red hover:text-brand-red"
                >
                  Delete
                </button>
              </div>
              <input
                name="name"
                defaultValue={item.name}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              />
              <textarea
                name="description"
                defaultValue={item.description}
                rows={3}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={item.price ?? undefined}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
                  placeholder="79.99"
                />
                <input
                  name="tags"
                  defaultValue={item.tags?.join(", ")}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
                  placeholder="gluten-free, high protein"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700"
                >
                  Save changes
                </button>
              </div>
            </form>
          ))}
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
              No items yet. Add your first breakfast or dinner above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
