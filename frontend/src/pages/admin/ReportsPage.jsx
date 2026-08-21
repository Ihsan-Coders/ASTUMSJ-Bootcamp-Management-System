import { motion } from "framer-motion";

import ChartsPanel from "../../components/reports/ChartsPanel";
import ExportPdfButton from "../../components/reports/ExportPdfButton";

// Main Reports & Analytics page.
export default function ReportsPage() {
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        {/* Animated page title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary"
        >
          Reports & Analytics
        </motion.h1>

        {/* PDF download button */}
        <ExportPdfButton />
      </div>

      {/* Attendance chart */}
      <ChartsPanel />
    </div>
  );
}
