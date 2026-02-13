import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, FileText, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Dispositions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: dispositions, isLoading, refetch } = trpc.dispositions.list.useQuery({
    limit: 50,
    offset: 0,
  });
  const deleteDispositionMutation = trpc.dispositions.delete.useMutation();
  const updateStatusMutation = trpc.dispositions.updateStatus.useMutation();

  if (!user) {
    return null;
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus disposisi ini?")) {
      try {
        await deleteDispositionMutation.mutateAsync(id);
        toast.success("Disposisi berhasil dihapus");
        refetch();
      } catch (error) {
        toast.error("Gagal menghapus disposisi");
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: "approved",
        approvalNotes: "Disetujui oleh " + (user.name || user.email),
      });
      toast.success("Disposisi berhasil disetujui");
      refetch();
    } catch (error) {
      toast.error("Gagal menyetujui disposisi");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: "rejected",
        approvalNotes: "Ditolak oleh " + (user.name || user.email),
      });
      toast.success("Disposisi berhasil ditolak");
      refetch();
    } catch (error) {
      toast.error("Gagal menolak disposisi");
    }
  };

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case "urgent":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in_review":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "completed":
        return "status-completed";
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
            <h1 className="text-3xl font-bold neon-glow">Manajemen Disposisi</h1>
            <p className="text-muted-foreground mt-1">
              Kelola disposisi dokumen dan approval workflow
            </p>
          </div>
          <Button
            className="cyberpunk-button"
            onClick={() => setLocation("/dispositions/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Disposisi Baru
          </Button>
        </div>

        {/* Dispositions List */}
        <div className="cyberpunk-card space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Memuat data disposisi...</p>
            </div>
          ) : dispositions && dispositions.length > 0 ? (
            <div className="space-y-3">
              {dispositions.map((disposition) => (
                <div
                  key={disposition.id}
                  className="p-4 bg-background border border-primary rounded hover:border-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold neon-glow">
                          {disposition.documentTitle}
                        </h3>
                        <span className={`status-badge ${getStatusBadge(disposition.status)}`}>
                          {disposition.status}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${getPriorityColor(disposition.priority)}`}>
                          {disposition.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {disposition.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {disposition.documentNumber && (
                          <div>📄 {String(disposition.documentNumber)}</div>
                        )}
                        {disposition.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Deadline: {new Date(String(disposition.dueDate)).toLocaleDateString("id-ID")}
                          </div>
                        )}
                        {disposition.approvalRequired && (
                          <div>✓ Memerlukan Approval</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {disposition.status === "pending" && user.role === "admin" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-900 text-green-300 hover:bg-green-800"
                            onClick={() => handleApprove(disposition.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleReject(disposition.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            ✕
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                        onClick={() => setLocation(`/dispositions/${disposition.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(disposition.id)}
                        disabled={deleteDispositionMutation.isPending}
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
              <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <p className="text-muted-foreground">Belum ada disposisi</p>
              <Button
                className="cyberpunk-button mt-4"
                onClick={() => setLocation("/dispositions/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Disposisi Pertama
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
