import type { Order } from "@/contexts/AdminContext";

/** Base URL: Vite proxy `/api` → json-server (xem vite.config.ts) */
export function getApiBase(): string {
  return import.meta.env.VITE_API_URL ?? "/api";
}

export async function fetchOrdersFromServer(): Promise<Order[] | null> {
  try {
    const r = await fetch(`${getApiBase()}/orders`);
    if (!r.ok) return null;
    const data = (await r.json()) as Order[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function createOrderOnServer(order: Order): Promise<Order | null> {
  try {
    const r = await fetch(`${getApiBase()}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!r.ok) return null;
    return (await r.json()) as Order;
  } catch {
    return null;
  }
}

export async function patchOrderOnServer(
  id: number,
  partial: Partial<Order>
): Promise<Order | null> {
  try {
    const r = await fetch(`${getApiBase()}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!r.ok) return null;
    return (await r.json()) as Order;
  } catch {
    return null;
  }
}

export async function deleteOrderOnServer(id: number): Promise<boolean> {
  try {
    const r = await fetch(`${getApiBase()}/orders/${id}`, { method: "DELETE" });
    return r.ok;
  } catch {
    return false;
  }
}
