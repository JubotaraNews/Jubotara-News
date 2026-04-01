import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Admin Dashboard | Jubo Tara News",
  description: "Admin panel for Jubo Tara News",
};

export default function AdminLayout({ children }) {
  return (
    <div className="bg-[#eff3f6] dark:bg-[#121212] transition-colors min-h-screen">
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
