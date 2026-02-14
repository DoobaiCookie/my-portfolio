'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { DownloadIcon, ExternalLinkIcon, FileTextIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  canva_url: string;
}

interface ProjectFile {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Next.js 15: params를 unwrap
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // 1. 프로젝트 정보 가져오기
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (projectError) {
        console.error('Project not found:', projectError);
        router.push('/');
        return;
      }
      setProject(projectData);

      // 2. 파일 목록 가져오기
      const { data: fileData, error: fileError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (fileError) console.error('Error fetching files:', fileError);
      else setFiles(fileData || []);

      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      window.open(fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" asChild>
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>

        <Card className="mb-8 overflow-hidden shadow-lg border-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24 sm:h-32"></div>
          <CardHeader className="pt-0 -mt-12 px-8 pb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mx-auto border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-gray-600 leading-relaxed text-lg">
                {project.description || "No description provided."}
              </p>
              
              {project.canva_url && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm" asChild>
                    <a href={project.canva_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="mr-2 h-4 w-4" /> View Presentation (Canva)
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileTextIcon className="text-blue-600" /> Project Assets & Files
        </h2>

        {files.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No files available for download.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                      <FileTextIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{file.file_name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Uploaded on {new Date(file.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto hover:bg-gray-50 hover:text-blue-600 border-gray-200"
                    onClick={() => handleDownload(file.file_url, file.file_name)}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" /> Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}