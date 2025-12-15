"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadPDFButtonProps {
    period: "daily" | "weekly" | "monthly";
    label?: string;
}

export function DownloadPDFButton({ period, label }: DownloadPDFButtonProps) {
    const [loading, setLoading] = useState(false);

    const periodLabels = {
        daily: "Harian",
        weekly: "Mingguan",
        monthly: "Bulanan",
    };

    const handleDownload = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/reports?period=${period}`);

            if (!response.ok) {
                throw new Error("Failed to generate PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `laporan-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`Laporan ${periodLabels[period]} berhasil diunduh`);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            toast.error("Gagal mengunduh laporan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={loading}
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            {label || `Download PDF ${periodLabels[period]}`}
        </Button>
    );
}
