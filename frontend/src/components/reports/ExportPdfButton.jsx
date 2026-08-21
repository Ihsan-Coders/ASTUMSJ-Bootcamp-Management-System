import { Download } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

// Button that downloads the platform report as a PDF.
export default function ExportPdfButton() {
  // Runs when the user clicks Export PDF.
  const handleExport = async () => {
    // Request the PDF from our backend.
    //
    // responseType: 'blob' tells Axios:
    // "This response is a file, not normal JSON."
    const res = await axiosInstance.get("/reports/pdf", {
      responseType: "blob",
    });

    // Create a temporary browser URL for the PDF file.
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Create a temporary <a> element.
    const link = document.createElement("a");

    // Give the link our temporary PDF URL.
    link.href = url;

    // Tell the browser what filename to use.
    link.setAttribute("download", "bootcamp-report.pdf");

    // Add the link to the page temporarily.
    document.body.appendChild(link);

    // Programmatically click it.
    // This starts the download.
    link.click();

    // Remove the temporary link.
    link.remove();
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
    >
      {/* Download icon */}
      <Download className="w-4 h-4" />
      {/* Button text */}
      Export PDF
    </button>
  );
}
