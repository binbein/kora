import { Outlet } from "react-router-dom";
import EmployeeNav from "./EmployeeNav";

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-background">
      <EmployeeNav />
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
