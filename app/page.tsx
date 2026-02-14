'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ExternalLinkIcon, MailIcon, GithubIcon, LayoutTemplateIcon, ArrowRightIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  canva_url: string | null;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('jhj1785@naver.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans relative selection:bg-blue-100 selection:text-blue-900">
      {/* Top Right Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-gray-900 transition-colors rounded-full">
          <Link href="/login">Admin</Link>
        </Button>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        {/* Background Gradient Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-50 via-indigo-50 to-pink-50 rounded-full blur-3xl opacity-70 -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Designing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Experiences</span><br />
            Building <span className="text-gray-400">Futures.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            I'm <span className="font-medium text-gray-900">JHJ</span>. A developer passionate about crafting beautiful and functional digital products.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Email Dialog Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gray-900 hover:bg-black text-white active:scale-95 min-w-[160px]"
                >
                  <MailIcon className="mr-2 h-5 w-5" /> 
                  Email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Contact Me</DialogTitle>
                  <DialogDescription>
                    Feel free to reach out for collaborations or just a friendly hello!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md border border-gray-200 mt-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">Link</Label>
                    <Input id="link" defaultValue="jhj1785@naver.com" readOnly className="border-none bg-transparent focus-visible:ring-0 text-base shadow-none h-auto py-1" />
                  </div>
                  <Button type="submit" size="sm" className="px-3" onClick={copyEmail}>
                    {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button type="button" variant="secondary" className="w-full mt-2" asChild>
                    <Link href="mailto:jhj1785@naver.com">
                      Open Mail App
                    </Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all" asChild>
              <Link href="https://github.com/DoobaiCookie" target="_blank">
                <GithubIcon className="mr-2 h-5 w-5" /> GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- Portfolio Projects Section --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Selected Projects</h2>
          <div className="h-px bg-gray-200 flex-grow ml-8 hidden sm:block"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No projects added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full border border-gray-100 bg-white rounded-3xl overflow-hidden flex flex-col">
                <CardHeader className="p-8 pb-4">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 transition-colors duration-500 flex items-center justify-center text-blue-600 group-hover:text-white">
                     <LayoutTemplateIcon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 flex-grow">
                  <p className="text-gray-500 leading-relaxed line-clamp-3">
                    {project.description || "No description provided."}
                  </p>
                </CardContent>
                
                <CardFooter className="p-8 pt-0 mt-auto flex flex-col gap-3">
                  {/* View Details Button (Primary Action) */}
                  <Link href={`/projects/${project.id}`} className="w-full">
                    <Button variant="outline" className="w-full justify-between rounded-xl py-6 hover:bg-gray-50 border-gray-200 group-hover:border-blue-200 group-hover:text-blue-700 transition-all">
                      Open Project
                      <ArrowRightIcon className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  {/* Canva Link (Secondary) */}
                  {project.canva_url && (
                    <a 
                      href={project.canva_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-center text-gray-400 hover:text-gray-600 hover:underline transition-colors py-1"
                    >
                      Open Presentation (Canva) ↗
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 py-10 text-center text-gray-500 text-sm">
        <p>© 2026 JHJ. All rights reserved.</p>
      </footer>
    </div>
  );
}