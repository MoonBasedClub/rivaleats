import { fetchMenuData } from "@/lib/menu";
import { MenuClient } from "./MenuClient";

export const revalidate = 900;

export default async function MenuPage() {
  const menu = await fetchMenuData();
  return <MenuClient menu={menu} />;
}
