"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Plus, FolderOpen, ArrowRight, Trash2, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/store/useEditorStore";

export default function DashboardPage() {
  const router = useRouter();
  const loadProjectStore = useEditorStore((state) => state.loadProject);
  const [projects, setProjects] = useState<any[]>([]);

  const loadProjectsFromStorage = () => {
    try {
      const raw = localStorage.getItem("vowmark_client_projects");
      if (raw) {
        setProjects(JSON.parse(raw));
      } else {
        setProjects([]);
      }
    } catch (e) {
      console.warn("Failed loading saved projects:", e);
      setProjects([]);
    }
  };

  useEffect(() => {
    loadProjectsFromStorage();
    const handleSaved = () => loadProjectsFromStorage();
    window.addEventListener("vowmark_project_saved", handleSaved);
    return () => window.removeEventListener("vowmark_project_saved", handleSaved);
  }, []);

  const handleOpenProject = (projectData: any) => {
    loadProjectStore(projectData);
    router.push("/");
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      localStorage.setItem("vowmark_client_projects", JSON.stringify(updated));
    } catch (err) {
      console.warn("Error deleting project:", err);
    }
  };

  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-vow-dark">Client Projects</h1>
            <p className="text-xs text-vow-muted font-sans mt-1">
              Saved wedding design identities, photobooth layout assets, and typography configurations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 bg-vow-dark hover:bg-black text-vow-paper rounded-lg flex items-center space-x-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
              title="Create New Project in Studio"
            >
              <Plus className="w-4 h-4 text-vow-accent group-hover:scale-110 transition-transform" />
              <span>New Project</span>
            </Link>
          </div>
        </div>

        {/* Empty State when no projects */}
        {projects.length === 0 ? (
          <div className="bg-vow-paper border-2 border-dashed border-vow-border rounded-xl p-16 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-vow-muted mx-auto mb-4 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-vow-accent" />
            </div>
            <h3 className="font-bold text-base text-vow-dark mb-1">No Client Projects Saved Yet</h3>
            <p className="text-xs text-vow-muted mb-6">
              Click &quot;Save Project&quot; in the Studio header to push your current wedding design into your Client Projects library.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-vow-dark hover:bg-black text-vow-paper rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
              title="Open Studio Workbench"
            >
              <Sparkles className="w-4 h-4 text-vow-accent group-hover:scale-110 transition-transform" />
              <span>Open Studio Workbench</span>
            </Link>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenProject(p)}
                className="bg-vow-paper border border-vow-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-vow-dark transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-stone-700 font-bold">
                      {(p.canvasFormat || "1:1").replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-stone-600 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {p.updatedAt}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-vow-dark mb-1 group-hover:text-vow-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-vow-muted font-mono">{p.font || "Cormorant Garamond"}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-vow-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteProject(p.id, e)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete saved project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="text-xs font-bold text-vow-dark group-hover:text-vow-accent flex items-center gap-1 uppercase tracking-wider transition-colors">
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
