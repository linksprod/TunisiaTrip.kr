
import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import WebsiteImageManager from "@/components/admin/WebsiteImageManager";

const AdminMediaPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fadeIn">
        <AdminHeader 
          title="Media Management" 
          description="Manage website images with automatic compression and WebP conversion."
        />
        
        <WebsiteImageManager />
      </div>
    </AdminLayout>
  );
};

export default AdminMediaPage;
