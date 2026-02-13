import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, FileText, CheckCircle, Clock, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold neon-glow">
            SIAP TANGSEL
          </h1>
          <p className="text-secondary neon-glow-cyan text-lg">
            Sistem Informasi Agenda Protokoler Kota Tangerang Selatan
          </p>
          <p className="text-muted-foreground">
            Selamat datang, {user.name || user.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Agendas */}
          <div className="cyberpunk-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Total Agenda
                </p>
                <p className="text-3xl font-bold neon-glow mt-2">
                  {isLoading ? "-" : stats?.totalAgendas || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary opacity-70" />
            </div>
          </div>

          {/* Upcoming Agendas */}
          <div className="cyberpunk-card hud-border-cyan">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Agenda Mendatang
                </p>
                <p className="text-3xl font-bold neon-glow-cyan mt-2">
                  {isLoading ? "-" : stats?.upcomingAgendas || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </div>

          {/* Pending Dispositions */}
          <div className="cyberpunk-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Disposisi Tertunda
                </p>
                <p className="text-3xl font-bold neon-glow mt-2">
                  {isLoading ? "-" : stats?.pendingDispositions || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-70" />
            </div>
          </div>

          {/* Completed Dispositions */}
          <div className="cyberpunk-card hud-border-cyan">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Disposisi Selesai
                </p>
                <p className="text-3xl font-bold neon-glow-cyan mt-2">
                  {isLoading ? "-" : stats?.completedDispositions || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="cyberpunk-card space-y-4">
            <h2 className="text-xl font-bold neon-glow">Aksi Cepat</h2>
            <div className="space-y-2">
              <Button
                className="w-full cyberpunk-button"
                onClick={() => setLocation("/agendas")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Agenda Baru
              </Button>
              <Button
                className="w-full cyberpunk-button-cyan"
                onClick={() => setLocation("/dispositions")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Disposisi Baru
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="cyberpunk-card space-y-4">
            <h2 className="text-xl font-bold neon-glow-cyan">Status Sistem</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="status-badge status-approved">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Server</span>
                <span className="status-badge status-approved">AKTIF</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Service</span>
                <span className="status-badge status-approved">SIAP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="cyberpunk-card space-y-4">
          <h2 className="text-xl font-bold neon-glow">Informasi Penting</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-background border border-primary rounded">
              <p className="text-primary font-semibold">📋 Panduan Penggunaan</p>
              <p className="text-muted-foreground mt-1">
                Gunakan menu di sidebar untuk mengakses fitur manajemen agenda, disposisi, dan dokumen.
              </p>
            </div>
            <div className="p-3 bg-background border border-secondary rounded">
              <p className="text-secondary font-semibold">🔔 Notifikasi Otomatis</p>
              <p className="text-muted-foreground mt-1">
                Sistem akan mengirimkan notifikasi email untuk setiap perubahan status agenda dan disposisi.
              </p>
            </div>
            <div className="p-3 bg-background border border-primary rounded">
              <p className="text-primary font-semibold">💾 Backup Data</p>
              <p className="text-muted-foreground mt-1">
                Data Anda dilindungi dengan backup otomatis setiap hari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
