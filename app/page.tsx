'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ExternalLinkIcon, MailIcon, GithubIcon, LayoutTemplateIcon, ArrowRightIcon, CopyIcon, CheckIcon, UserIcon, MenuIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // 모바일 메뉴
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // 프로필용
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

  // --- Render Sections ---
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Navigation Bar (Sticky) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-bold">JHJ</div>
          Portfolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#hero" className="hover:text-black transition-colors">Home</Link>
          <Link href="#about" className="hover:text-black transition-colors">About</Link>
          <Link href="#projects" className="hover:text-black transition-colors">Projects</Link>
          <Link href="#contact" className="hover:text-black transition-colors">Contact</Link>
          <Button variant="outline" size="sm" asChild className="rounded-full ml-4">
            <Link href="/login">Admin</Link>
          </Button>
        </div>

        {/* Mobile Menu (Sheet) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-6 mt-10 text-lg font-medium">
                <Link href="#hero" className="hover:text-blue-600">Home</Link>
                <Link href="#about" className="hover:text-blue-600">About</Link>
                <Link href="#projects" className="hover:text-blue-600">Projects</Link>
                <Link href="#contact" className="hover:text-blue-600">Contact</Link>
                <Link href="/login" className="text-gray-400 text-sm mt-4">Admin Login</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* --- Hero Section (Full Height) --- */}
      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[80vh]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>
        
        <div className="mb-8 relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src="https://github.com/shadcn.png" alt="@jhj" /> {/* 나중에 본인 사진으로 교체 가능 */}
            <AvatarFallback className="bg-gray-900 text-white text-3xl font-bold">JHJ</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" title="Available for work"></div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight max-w-4xl">
          Crafting Digital <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Masterpieces.</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Hi, I'm <span className="font-semibold text-gray-900">JHJ</span>. <br/>
          I build scalable web applications and intuitive user experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all" asChild>
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all" asChild>
            <Link href="https://github.com/DoobaiCookie" target="_blank">
              <GithubIcon className="mr-2 h-5 w-5" /> GitHub Profile
            </Link>
          </Button>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">About Me</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              I am a passionate developer with a keen eye for design and a drive for creating seamless user experiences. 
              My journey started with simple scripts and evolved into building complex full-stack applications.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              When I'm not coding, you can find me exploring new technologies, contributing to open source, or designing UI/UX prototypes.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-2xl text-blue-600 mb-1">3+</h3>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-2xl text-purple-600 mb-1">10+</h3>
                <p className="text-sm text-gray-500">Projects Completed</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            {/* 이미지 자리 (임시로 아이콘) */}
            <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-inner">
               <UserIcon className="w-32 h-32 text-blue-300/50" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Projects Section (List Style) --- */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A selection of my recent work, from web applications to design systems.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No projects added yet.</p>
          </div>
        ) : (
          <div className="space-y-12"> {/* 1열 배치 (List Style) */}
            {projects.map((project, index) => (
              <Card key={project.id} className="group overflow-hidden border border-gray-200 bg-white rounded-3xl hover:shadow-2xl transition-all duration-500">
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                  {/* Left: Thumbnail / Icon Area */}
                  <div className={`md:col-span-2 bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-50 to-indigo-50' : 'from-purple-50 to-pink-50'} p-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
                     <LayoutTemplateIcon className={`w-20 h-20 ${index % 2 === 0 ? 'text-blue-200' : 'text-purple-200'}`} />
                  </div>
                  
                  {/* Right: Content Area */}
                  <div className="md:col-span-3 p-8 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0 mb-8 flex-grow">
                      <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                        {project.description || "No description provided."}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-0 flex flex-wrap gap-4 mt-auto">
                      {/* Open Project Button */}
                      <Link href={`/projects/${project.id}`}>
                        <Button className="rounded-full px-6 bg-gray-900 hover:bg-black text-white group-hover:translate-x-1 transition-transform">
                          Open Project <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      
                      {/* Canva Link */}
                      {project.canva_url && (
                        <Button variant="ghost" className="rounded-full text-gray-500 hover:text-gray-900" asChild>
                           <a href={project.canva_url} target="_blank" rel="noopener noreferrer">
                             Presentation ↗
                           </a>
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-24 bg-gray-900 text-white px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Have a project in mind or just want to chat? <br/>
            I'm always open to new opportunities and collaborations.
          </p>
          
          <div className="flex justify-center gap-6">
            {/* Email Dialog Button (Dark Mode Style) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all">
                  <MailIcon className="mr-2 h-5 w-5" /> Email Me
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md text-black">
                <DialogHeader>
                  <DialogTitle>Contact Info</DialogTitle>
                  <DialogDescription>Let's connect!</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md border border-gray-200 mt-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">Link</Label>
                    <Input id="link" defaultValue="jhj1785@naver.com" readOnly className="border-none bg-transparent focus-visible:ring-0 text-base shadow-none h-auto py-1" />
                  </div>
                  <Button type="submit" size="sm" className="px-3" onClick={copyEmail}>
                    {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" className="w-full mt-2" asChild>
                    <Link href="mailto:jhj1785@naver.com">Open Mail App</Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-gray-700 text-white hover:bg-gray-800 hover:text-white" asChild>
              <Link href="https://github.com/DoobaiCookie" target="_blank">
                <GithubIcon className="mr-2 h-5 w-5" /> GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black text-gray-500 py-10 text-center text-sm border-t border-gray-800">
        <p>© 2026 JHJ. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}