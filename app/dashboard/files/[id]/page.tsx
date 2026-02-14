'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FolderIcon, FileIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';

interface ProjectFile {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export default function FileManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Next.js 15: params를 unwrap
  const [project, setProject] = useState<any>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // 1. 프로젝트 정보 및 파일 목록 가져오기
  useEffect(() => {
    const fetchProjectData = async () => {
      // 1-1. 프로젝트 제목 등 가져오기
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (projectError) {
        alert('Project not found or permission denied.');
        router.push('/dashboard');
        return;
      }
      setProject(projectData);

      // 1-2. 파일 목록 가져오기
      fetchFiles();
    };

    fetchProjectData();
  }, [id, router]);

  const fetchFiles = async () => {
    const { data: fileData, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (fileError) console.error(fileError);
    else setFiles(fileData || []);
    setLoading(false);
  };

  // 2. 파일 업로드 로직
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const uploadedFile = e.target.files[0];
    const fileExt = uploadedFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    try {
      // 2-1. Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(filePath, uploadedFile);

      if (uploadError) throw uploadError;

      // 2-2. Public URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-files')
        .getPublicUrl(filePath);

      // 2-3. DB에 파일 정보 저장
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: id,
          file_name: uploadedFile.name, // 원본 파일명 저장
          file_url: publicUrl,
        });

      if (dbError) throw dbError;

      alert('File uploaded successfully!');
      fetchFiles(); // 목록 갱신

    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. 파일 삭제 로직
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;

    try {
      // 3-1. DB에서 삭제
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // 3-2. (옵션) Storage에서 실제 파일 삭제는 파일명을 알아야 함 (지금은 생략)
      // 실제 서비스에선 file_url에서 경로 파싱해서 storage.remove() 호출 추천

      fetchFiles();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">
      <Card className="w-full max-w-2xl p-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeftIcon className="mr-1 h-4 w-4" /> Back
            </Button>
            <CardTitle className="text-xl font-bold">
              Files for "{project?.title}"
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* 업로드 영역 */}
          <div className="mb-8 p-6 border-2 border-dashed rounded-lg bg-blue-50 border-blue-200 text-center hover:bg-blue-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <FolderIcon className="w-10 h-10 text-blue-500" />
              <p className="font-semibold text-blue-700">
                {uploading ? 'Uploading...' : 'Click or Drag file to Upload'}
              </p>
              <p className="text-xs text-gray-500">Supports all file types</p>
            </div>
          </div>

          {/* 파일 목록 */}
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <FileIcon className="w-5 h-5" /> Uploaded Files ({files.length})
          </h3>
          
          {files.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No files yet.</p>
          ) : (
            <ul className="space-y-3">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-gray-100 p-2 rounded">
                      <FileIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate text-sm" title={file.file_name}>
                        {file.file_name}
                      </span>
                      <a 
                        href={file.file_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-blue-500 hover:underline truncate"
                      >
                        View / Download
                      </a>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteFile(file.id, file.file_name)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}