import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Plant, plants as initialPlants } from "@/data/plants";
import { CartPlant } from "@/contexts/CartContext";

export interface OrderItem {
  plant: CartPlant;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: "Chờ xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";
  paymentMethod: "Chuyển khoản" | "COD";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
  date: string;
  note?: string;
  transferProof?: string; // Base64 image of payment proof
}

interface AdminContextType {
  products: Plant[];
  orders: Order[];
  addProduct: (product: Omit<Plant, "id">) => void;
  updateProduct: (id: number, product: Partial<Plant>) => void;
  deleteProduct: (id: number) => void;
  addOrder: (order: Omit<Order, "date">) => void;
  updateOrderStatus: (id: number, status: Order["status"]) => void;
  updatePaymentStatus: (id: number, status: Order["paymentStatus"]) => void;
  deleteOrder: (id: number) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper: lấy CartPlant từ Plant (shop chính Greenie, không có sellerId)
const toCartPlant = (p: Plant): OrderItem["plant"] => ({
  id: p.id,
  name: p.name,
  price: p.price,
  image: p.image,
});

// 3 đơn mẫu cho cửa hàng chính Greenie - tên & địa chỉ ngẫu nhiên ở Quy Nhơn, Bình Định
const initialOrders: Order[] = (() => {
  const p = initialPlants;
  return [
    {
      id: 1,
      customerName: "Trần Văn Đức",
      customerPhone: "0905123456",
      customerAddress: "45 Lê Lợi, phường Trần Hưng Đạo, Quy Nhơn, Bình Định",
      items: [
        { plant: toCartPlant(p[0]), quantity: 2 },
        { plant: toCartPlant(p[1]), quantity: 1 },
      ],
      total: p[0].price * 2 + p[1].price * 1,
      status: "Đã giao",
      paymentMethod: "COD",
      paymentStatus: "Đã thanh toán",
      date: "2025-03-05",
    },
    {
      id: 2,
      customerName: "Lê Thị Hương",
      customerPhone: "0918234567",
      customerAddress: "88 Nguyễn Thị Định, phường Hải Cảng, Quy Nhơn, Bình Định",
      items: [
        { plant: toCartPlant(p[2]), quantity: 1 },
        { plant: toCartPlant(p[5]), quantity: 1 },
      ],
      total: p[2].price + p[5].price,
      status: "Đang giao",
      paymentMethod: "Chuyển khoản",
      paymentStatus: "Đã thanh toán",
      date: "2025-03-06",
    },
    {
      id: 3,
      customerName: "Phạm Hoàng Nam",
      customerPhone: "0947345678",
      customerAddress: "12 Trần Phú, phường Ghềnh Ráng, Quy Nhơn, Bình Định",
      items: [
        { plant: toCartPlant(p[6]), quantity: 1 },
        { plant: toCartPlant(p[14]), quantity: 3 },
      ],
      total: p[6].price + p[14].price * 3,
      status: "Chờ xử lý",
      paymentMethod: "COD",
      paymentStatus: "Chưa thanh toán",
      date: "2025-03-07",
    },
  ];
})();

// Admin credentials (mock)
const ADMIN_EMAIL = "caycanhgreenie@gmail.com";
const ADMIN_PASSWORD = "admin123";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Plant[]>(() => {
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      try {
        return JSON.parse(saved) as Plant[];
      } catch {
        return initialPlants;
      }
    }
    return initialPlants;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("admin_orders");
    if (saved) {
      try {
        return JSON.parse(saved) as Order[];
      } catch {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("admin_logged_in") === "true";
  });

  // Listen for storage changes (for syncing with user cancellations)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("admin_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("admin_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("admin_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("admin_logged_in", String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const addProduct = (product: Omit<Plant, "id">) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts((prev) => [...prev, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updates: Partial<Plant>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addOrder = (order: Omit<Order, "date">) => {
    const nextId =
      typeof order.id === "number"
        ? order.id
        : orders.length > 0
        ? Math.max(...orders.map((o) => o.id)) + 1
        : 1;

    const newOrder: Order = {
      ...order,
      id: nextId,
      date: new Date().toISOString().split("T")[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Cập nhật thống kê sản phẩm: tăng số lượng đã bán và giảm tồn kho
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const matchedItem = newOrder.items.find((item) => item.plant.id === p.id);
        if (!matchedItem) return p;

        const newSold = (p.sold || 0) + matchedItem.quantity;
        const newStock =
          typeof p.stock === "number"
            ? Math.max(0, p.stock - matchedItem.quantity)
            : p.stock;

        return { ...p, sold: newSold, stock: newStock };
      })
    );
  };

  const updateOrderStatus = (id: number, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const updatePaymentStatus = (id: number, paymentStatus: Order["paymentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o))
    );
  };

  const deleteOrder = (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
