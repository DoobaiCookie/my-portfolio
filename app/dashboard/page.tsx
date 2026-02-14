'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FolderIcon, PlusIcon, TrashIcon, XIcon, FolderPlusIcon } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  canva_url: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form States (프로젝트 생성/수정용)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [canvaUrl, setCanvaUrl] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        fetchProjects();
      }
    };
    checkUser();
  }, [router]);

  const fetchProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCanvaUrl('');
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description || '');
    setCanvaUrl(project.canva_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      if (editingId) {
        // --- 수정 ---
        const { error } = await supabase
          .from('projects')
          .update({ title, description, canva_url: canvaUrl })
          .eq('id', editingId);

        if (error) throw error;
        alert('Project updated successfully!');
      } else {
        // --- 생성 ---
        const { error } = await supabase
          .from('projects')
          .insert({
            title,
            description,
            canva_url: canvaUrl,
            user_id: user.id,
          });

        if (error) throw error;
        alert('Project created! Now you can add files.');
      }

      resetForm();
      fetchProjects();

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete the project and ALL its files.')) return;

    // 1. 프로젝트 삭제 (Cascade로 인해 파일 정보도 삭제됨)
    // 주의: Storage 파일은 자동 삭제 안 됨 (추후 구현 필요)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) alert(error.message);
    else {
      if (editingId === id) resetForm();
      fetchProjects();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">
      <Card className="w-full max-w-3xl p-6 mb-10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <LayoutTemplateIcon className="w-6 h-6 text-blue-600" />
            Project Manager
          </CardTitle>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <XIcon className="mr-2 h-4 w-4" /> Cancel Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              {editingId ? 'Edit Project Details' : 'Create New Project'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Portfolio"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canvaUrl">Canva / Link URL</Label>
                <Input
                  id="canvaUrl"
                  value={canvaUrl}
                  onChange={(e) => setCanvaUrl(e.target.value)}
                  placeholder="https://canva.com/..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (editingId ? 'Updating...' : 'Creating...') 
                : (editingId ? 'Update Project' : 'Create Project')
              }
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-bold mb-4 ml-1 flex items-center gap-2">
              <FolderIcon className="w-5 h-5" /> My Projects List
            </h2>
            
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-gray-100 rounded-lg">
                No projects found. Create your first one above!
              </p>
            ) : (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li key={project.id} className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg shadow-sm transition-colors ${editingId === project.id ? 'bg-blue-50 border-blue-300' : 'bg-white hover:border-blue-200'}`}>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-1 mt-1">{project.description}</p>
                      {project.canva_url && (
                        <a href={project.canva_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">
                          🔗 {project.canva_url}
                        </a>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      {/* --- [Manage Files] 버튼 (핵심) --- */}
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
                        onClick={() => router.push(`/dashboard/files/${project.id}`)}
                      >
                        <FolderPlusIcon className="mr-2 h-4 w-4" /> Manage Files
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => startEditing(project)} className="flex-1 md:flex-none">
                        Edit
                      </Button>
                      
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)} className="flex-1 md:flex-none">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 아이콘 임포트 수정 (LayoutTemplateIcon이 없을 수 있으므로 FolderIcon으로 대체하거나 추가)
import { LayoutTemplateIcon } from 'lucide-react';