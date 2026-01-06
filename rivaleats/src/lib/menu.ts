import { createClient } from "@supabase/supabase-js";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  section: "breakfast" | "dinner";
  price?: number | null;
  image_url?: string | null;
  tags?: string[] | null;
  updated_at?: string | null;
};

export type MenuData = {
  lastUpdated: string;
  items: MenuItem[];
};

const sampleMenu: MenuData = {
  lastUpdated: new Date().toISOString(),
  items: [
    {
      id: "sample-b1",
      name: "Sunrise Protein Bowl",
      description: "Herbed eggs, roasted sweet potato, charred peppers, chimichurri drizzle.",
      section: "breakfast",
      price: 0,
      tags: ["gluten-free", "high protein"],
    },
    {
      id: "sample-b2",
      name: "Granola Crunch Parfait",
      description: "Vanilla bean yogurt, toasted granola, macerated berries, honey-lime zest.",
      section: "breakfast",
      price: 0,
      tags: ["vegetarian"],
    },
    {
      id: "sample-b3",
      name: "Smoked Salmon Toast",
      description: "Seeded sourdough, citrus cream, pickled shallots, capers, micro greens.",
      section: "breakfast",
      price: 0,
      tags: ["contains gluten"],
    },
    {
      id: "sample-d1",
      name: "Charred Citrus Chicken",
      description: "Fire-roasted chicken thighs, roasted garlic potatoes, grilled broccolini.",
      section: "dinner",
      price: 0,
      tags: ["high protein", "dairy free"],
    },
    {
      id: "sample-d2",
      name: "Miso Maple Salmon",
      description: "Seared salmon, sesame ginger greens, coconut jasmine rice, scallion oil.",
      section: "dinner",
      price: 0,
      tags: ["gluten-free", "omega-3"],
    },
    {
      id: "sample-d3",
      name: "Smoked Mushroom Ragu",
      description: "Rigatoni, roasted mushrooms, tomato confit, basil gremolata, pecorino.",
      section: "dinner",
      price: 0,
      tags: ["vegetarian"],
    },
  ],
};

export async function fetchMenuData(): Promise<MenuData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return sampleMenu;
  }

  try {
    const client = createClient(url, anonKey);
    const { data, error } = await client
      .from("menu_items")
      .select(
        "id, name, description, category, price, image_url, created_at, is_active"
      )
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data) {
      console.error("Error fetching menu from Supabase", error);
      return sampleMenu;
    }

    const mappedItems: MenuItem[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      section: item.category === "breakfast" ? "breakfast" : "dinner",
      price: item.price ?? null,
      image_url: item.image_url ?? null,
      tags: null,
      updated_at: item.created_at ?? null,
    }));

    const mostRecent =
      mappedItems
        .map((item) => item.updated_at)
        .filter(Boolean)
        .sort()
        .reverse()[0] || sampleMenu.lastUpdated;

    return {
      lastUpdated: mostRecent,
      items: mappedItems,
    };
  } catch (err) {
    console.error("Supabase menu fetch failed", err);
    return sampleMenu;
  }
}
