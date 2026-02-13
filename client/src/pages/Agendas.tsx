import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Agendas() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: agendas, isLoading, refetch } = trpc.agendas.list.useQuery({
    limit: 50,
    offset: 0,
  });
  const deleteAgendaMutation = trpc.agendas.delete.useMutation();

  if (!user) {
    return null;
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
      try {
        await deleteAgendaMutation.mutateAsync(id);
        toast.success("Agenda berhasil dihapus");
        refetch();
      } catch (error) {
        toast.error("Gagal menghapus agenda");
      }
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "Tanggal tidak ditentukan";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "draft":
        return "status-pending";
      case "scheduled":
        return "status-approved";
      case "ongoing":
        return "status-approved";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold neon-glow">Manajemen Agenda</h1>
            <p className="text-muted-foreground mt-1">
              Kelola semua agenda protokoler Anda
            </p>
          </div>
          <Button
            className="cyberpunk-button"
            onClick={() => setLocation("/agendas/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agenda Baru
          </Button>
        </div>

        {/* Agendas List */}
        <div className="cyberpunk-card space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Memuat data agenda...</p>
            </div>
          ) : agendas && agendas.length > 0 ? (
            <div className="space-y-3">
              {agendas.map((agenda) => (
                <div
                  key={agenda.id}
                  className="p-4 bg-background border border-primary rounded hover:border-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold neon-glow truncate">
                          {agenda.title}
                        </h3>
                        <span className={`status-badge ${getStatusColor(agenda.status)}`}>
                          {agenda.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {agenda.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(agenda.eventDate)}
                        </div>
                        <div>📍 {agenda.eventLocation ? agenda.eventLocation : "Lokasi tidak ditentukan"}</div>
                        <div>👤 {agenda.organizer}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                        onClick={() => setLocation(`/agendas/${agenda.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(agenda.id)}
                        disabled={deleteAgendaMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <p className="text-muted-foreground">Belum ada agenda</p>
              <Button
                className="cyberpunk-button mt-4"
                onClick={() => setLocation("/agendas/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Agenda Pertama
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
