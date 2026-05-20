import { Link } from "react-router-dom";
import AdminShell from "@/components/admin/AdminShell";

const AdminNotFound = () => (
  <AdminShell>
    <div className="py-20 text-center">
      <p className="font-mono text-xs text-muted-foreground mb-2">404</p>
      <h1 className="font-display font-black text-3xl mb-4">Page not <span className="accent-headline">found.</span></h1>
      <Link to="/hq/today" className="text-sm font-display text-accent hover:underline">Back to Today</Link>
    </div>
  </AdminShell>
);

export default AdminNotFound;
