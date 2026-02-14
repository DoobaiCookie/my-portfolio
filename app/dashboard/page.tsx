'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FolderIcon, PlusIcon, TrashIcon, XIcon, FolderPlusIcon, SettingsIcon, LayoutTemplateIcon, PenToolIcon, UploadIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Tabs 컴포넌트

// --- 타입 정의 ---
interface Project {
  id: string;
  title: string;
  description: string;
  canva_url: string;
}

interface SiteConfig {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  profile_image_url: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- Projects State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [canvaUrl, setCanvaUrl] = useState('');

  // --- Site Config State ---
  const [config, setConfig] = useState<SiteConfig>({
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    contact_email: '',
    profile_image_url: null,
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);

  // --- 초기 로딩 ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        fetchProjects();
        fetchSiteConfig();
      }
    };
    checkUser();
  }, [router]);

  // --- Projects Functions ---
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

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update({ title, description, canva_url: canvaUrl })
          .eq('id', editingId);
        if (error) throw error;
        alert('Project updated!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            title,
            description,
            canva_url: canvaUrl,
            user_id: user.id,
          });
        if (error) throw error;
        alert('Project created!');
      }

      resetForm();
      fetchProjects();

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) alert(error.message);
    else {
      if (editingId === id) resetForm();
      fetchProjects();
    }
  };

  // --- Site Config Functions ---
  const fetchSiteConfig = async () => {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .limit(1)
      .single();

    if (error) console.error('Error fetching config:', error);
    else if (data) {
      setConfig({
        hero_title: data.hero_title || '',
        hero_subtitle: data.hero_subtitle || '',
        about_text: data.about_text || '',
        contact_email: data.contact_email || '',
        profile_image_url: data.profile_image_url || null,
      });
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newImageUrl = config.profile_image_url;

      // 1. 프로필 이미지 업로드 (있으면)
      if (profileFile) {
        const fileExt = profileFile.name.split('.').pop();
        const fileName = `profile_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-files')
          .upload(filePath, profileFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-files')
          .getPublicUrl(filePath);
          
        newImageUrl = publicUrl;
      }

      // 2. DB 업데이트
      const { error } = await supabase
        .from('site_config')
        .update({
          hero_title: config.hero_title,
          hero_subtitle: config.hero_subtitle,
          about_text: config.about_text,
          contact_email: config.contact_email,
          profile_image_url: newImageUrl,
          updated_at: new Date().toISOString(),
        })
        .gt('id', 0); // 모든 행 업데이트 (사실상 1개뿐)

      if (error) throw error;

      alert('Site settings updated successfully!');
      fetchSiteConfig(); // 갱신
      setProfileFile(null); // 파일 초기화

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <LayoutTemplateIcon className="w-8 h-8 text-blue-600" />
        Admin Dashboard
      </h1>

      <Tabs defaultValue="projects" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="projects">Project Manager</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        {/* --- Tab 1: Project Manager --- */}
        <TabsContent value="projects">
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6 border-b mb-6">
              <CardTitle className="text-xl font-bold">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </CardTitle>
              {editingId && (
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <XIcon className="mr-2 h-4 w-4" /> Cancel Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmitProject} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canvaUrl">Canva URL</Label>
                    <Input id="canvaUrl" value={canvaUrl} onChange={(e) => setCanvaUrl(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
                </Button>
              </form>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FolderIcon className="w-5 h-5" /> My Projects ({projects.length})
                </h3>
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 bg-gray-100 rounded">No projects yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {projects.map((p) => (
                      <li key={p.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded hover:bg-gray-50 ${editingId === p.id ? 'bg-blue-50 border-blue-300' : ''}`}>
                        <div className="mb-2 sm:mb-0">
                          <span className="font-bold block">{p.title}</span>
                          <span className="text-xs text-gray-500 truncate block max-w-xs">{p.description}</span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button variant="secondary" size="sm" className="flex-1 sm:flex-none" onClick={() => router.push(`/dashboard/files/${p.id}`)}>
                            <FolderPlusIcon className="w-4 h-4 mr-1" /> Files
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => startEditing(p)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" className="flex-1 sm:flex-none" onClick={() => handleDeleteProject(p.id)}>
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 2: Site Settings --- */}
        <TabsContent value="settings">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-6 border-b mb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <SettingsIcon className="w-6 h-6" /> General Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleUpdateConfig} className="space-y-6">
                
                {/* Hero Section Config */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                  <h3 className="font-semibold text-gray-700">Hero Section</h3>
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Main Title (Headline)</Label>
                    <Input 
                      id="heroTitle" 
                      value={config.hero_title} 
                      onChange={(e) => setConfig({...config, hero_title: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Subtitle</Label>
                    <Input 
                      id="heroSubtitle" 
                      value={config.hero_subtitle} 
                      onChange={(e) => setConfig({...config, hero_subtitle: e.target.value})} 
                    />
                  </div>
                </div>

                {/* About Section Config */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                  <h3 className="font-semibold text-gray-700">About Me</h3>
                  <div className="space-y-2">
                    <Label htmlFor="aboutText">Introduction Text</Label>
                    <Textarea 
                      id="aboutText" 
                      value={config.about_text} 
                      onChange={(e) => setConfig({...config, about_text: e.target.value})} 
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <div className="flex items-center gap-4">
                      {config.profile_image_url && (
                        <img src={config.profile_image_url} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                      )}
                      <Input 
                        id="profileImage" 
                        type="file" 
                        onChange={(e) => setProfileFile(e.target.files ? e.target.files[0] : null)} 
                      />
                    </div>
                    <p className="text-xs text-gray-500">Upload a new image to replace the current one.</p>
                  </div>
                </div>

                {/* Contact Config */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                  <h3 className="font-semibold text-gray-700">Contact Info</h3>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input 
                      id="contactEmail" 
                      value={config.contact_email} 
                      onChange={(e) => setConfig({...config, contact_email: e.target.value})} 
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Saving Changes...' : 'Save All Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}