'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem,
  Button, Link, Card, CardHeader, CardBody, CardFooter, Image,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  Input, Textarea, Avatar, Chip, Tooltip, Divider
} from "@heroui/react";
import { MailIcon, GithubIcon, LayoutTemplateIcon, ArrowRightIcon, CopyIcon, CheckIcon, UserIcon, MenuIcon, ExternalLinkIcon } from 'lucide-react';

// --- Type Definitions ---
interface Project {
  id: string;
  title: string;
  description: string;
  canva_url: string | null;
  image_url: string | null;
}

interface SiteConfig {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  profile_image_url: string | null;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Email Modal Control
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        setProjects(projectsData || []);

        const { data: configData } = await supabase.from('site_config').select('*').limit(1).single();
        if (configData) setConfig(configData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyEmail = () => {
    const email = config?.contact_email || 'jhj1785@naver.com';
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary-100 selection:text-primary-900">
      
      {/* --- Navigation Bar (HeroUI) --- */}
      <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="xl" className="fixed top-0 z-50 bg-background/70 backdrop-blur-lg">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <div className="bg-foreground text-background font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-2 text-small">JHJ</div>
            <p className="font-bold text-inherit">PORTFOLIO</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link color="foreground" href={item.href} className="hover:text-primary transition-colors font-medium">
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} color="primary" href="/login" variant="flat" size="sm" radius="full">
              Admin
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                className="w-full text-lg py-2"
                href={item.href}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      {/* --- Hero Section --- */}
      <section id="hero" className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[90vh]">
        {/* Background Blob (CSS) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-gradient-to-tr from-primary-100 via-secondary-100 to-warning-100 rounded-full blur-[120px] opacity-60 -z-10 pointer-events-none"></div>

        <div className="mb-10 relative group">
          <Avatar 
            src={config?.profile_image_url || "https://github.com/shadcn.png"} 
            className="w-32 h-32 text-large border-4 border-background shadow-2xl transition-transform group-hover:scale-105" 
            isBordered 
            color="primary"
          />
          <Tooltip content="Available for work" color="success" placement="bottom">
            <div className="absolute bottom-1 right-1 bg-success w-6 h-6 rounded-full border-4 border-background animate-pulse"></div>
          </Tooltip>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          {config?.hero_title || "Crafting Digital Masterpieces."}
        </h1>
        
        <p className="text-xl sm:text-2xl text-default-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed whitespace-pre-line">
          {config?.hero_subtitle || "Hi, I'm JHJ. I build scalable web applications and intuitive user experiences."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            as={Link} 
            href="#projects" 
            size="lg" 
            color="primary" 
            variant="shadow" 
            radius="full" 
            className="font-semibold text-lg px-8 py-6"
            endContent={<ArrowRightIcon className="w-4 h-4" />}
          >
            View My Work
          </Button>
          <Button 
            as={Link} 
            href="https://github.com/DoobaiCookie" 
            target="_blank" 
            size="lg" 
            variant="bordered" 
            radius="full" 
            className="font-medium text-lg px-8 py-6 border-default-200 hover:border-default-400"
            startContent={<GithubIcon className="w-5 h-5" />}
          >
            GitHub Profile
          </Button>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-content2/50 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <div className="space-y-4">
              <Chip color="secondary" variant="flat" size="sm">About Me</Chip>
              <h2 className="text-4xl font-bold">Passionate Developer &<br/>Problem Solver.</h2>
            </div>
            
            <p className="text-large text-default-500 leading-relaxed whitespace-pre-line">
              {config?.about_text || "I am a passionate developer with a keen eye for design and a drive for creating seamless user experiences."}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Card shadow="sm" className="border-none bg-background/60 backdrop-blur-md">
                <CardBody className="py-6 px-6">
                  <p className="text-4xl font-bold text-primary mb-1">Junior</p>
                  <p className="text-small text-default-500 font-medium uppercase tracking-wide">Years Experience</p>
                </CardBody>
              </Card>
              <Card shadow="sm" className="border-none bg-background/60 backdrop-blur-md">
                <CardBody className="py-6 px-6">
                  <p className="text-4xl font-bold text-primary mb-1">{projects.length}+</p>
                  <p className="text-small text-default-500 font-medium uppercase tracking-wide">Projects Completed</p>
                </CardBody>
              </Card>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <Card isFooterBlurred radius="lg" className="border-none max-w-[320px] max-h-[400px]">
              {config?.profile_image_url ? (
                 <Image
                   alt="Profile"
                   className="object-cover"
                   height={400}
                   src={config.profile_image_url}
                   width={320}
                 />
              ) : (
                 <div className="w-[320px] h-[400px] bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <UserIcon className="w-32 h-32 text-primary-300/50" />
                 </div>
              )}
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Available for freelance.</p>
                <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm" onPress={onOpen}>
                  Contact Me
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <Chip color="primary" variant="dot" size="md">Portfolio</Chip>
          <h2 className="text-4xl sm:text-5xl font-bold">Featured Projects</h2>
          <p className="text-xl text-default-500 max-w-2xl mx-auto">
            A selection of my recent work, showcasing my skills in web development and design.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-content2 rounded-3xl border border-dashed border-default-200">
            <p className="text-default-400 text-lg">No projects added yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {projects.map((project, index) => (
              <Card key={project.id} isHoverable className="w-full border-none shadow-medium hover:shadow-2xl transition-all duration-500 bg-background/60 backdrop-blur-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-full">
                  {/* Left: Thumbnail Area */}
                  <div className={`md:col-span-5 relative h-64 md:h-auto overflow-hidden bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-50 to-cyan-50' : 'from-purple-50 to-pink-50'} flex items-center justify-center group`}>
                     {project.image_url ? (
                       <div className="w-full h-full relative group">
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-10 transition-colors duration-500"></div>
                         <img
                           alt={project.title}
                           src={project.image_url}
                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                         />
                       </div>
                     ) : (
                       <>
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                         <LayoutTemplateIcon className={`w-24 h-24 ${index % 2 === 0 ? 'text-blue-200' : 'text-purple-200'} transform group-hover:scale-110 transition-transform duration-700`} />
                       </>
                     )}
                  </div>
                  
                  {/* Right: Content Area */}
                  <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-3">{project.title}</h3>
                      <p className="text-default-500 text-lg leading-relaxed line-clamp-3">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-auto">
                      <Button 
                        as={Link} 
                        href={`/projects/${project.id}`} 
                        color="primary" 
                        variant="solid" 
                        radius="full"
                        className="font-medium px-6"
                        endContent={<ArrowRightIcon className="w-4 h-4" />}
                      >
                        Open Project
                      </Button>
                      
                      {project.canva_url && (
                        <Button 
                          as={Link} 
                          href={project.canva_url} 
                          target="_blank" 
                          variant="light" 
                          radius="full"
                          className="text-default-500 hover:text-foreground font-medium"
                          endContent={<ExternalLinkIcon className="w-3 h-3" />}
                        >
                          Presentation
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-32 bg-foreground text-background px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">Let's Work Together</h2>
          <p className="text-xl text-default-400 leading-relaxed max-w-xl mx-auto">
            Have a project in mind or just want to chat? <br/>
            I'm always open to new opportunities and collaborations.
          </p>
          
          <div className="flex justify-center gap-6 pt-4">
            <Button 
              size="lg" 
              color="default" 
              variant="faded" 
              radius="full" 
              className="h-14 px-8 text-lg font-semibold bg-background text-foreground hover:scale-105"
              startContent={<MailIcon className="w-5 h-5" />}
              onPress={onOpen}
            >
              Email Me
            </Button>
            
            <Button 
              as={Link} 
              href="https://github.com/DoobaiCookie" 
              target="_blank" 
              size="lg" 
              variant="bordered" 
              radius="full" 
              className="h-14 px-8 text-lg font-semibold border-default-600 text-default-300 hover:text-white hover:border-white"
              startContent={<GithubIcon className="w-5 h-5" />}
            >
              GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black text-default-500 py-12 text-center text-sm border-t border-white/10">
        <p className="mb-4">© 2026 JHJ. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-xs font-medium">
          <Link href="#" color="foreground" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" color="foreground" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>

      {/* --- Email Modal (HeroUI) --- */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement="center"
        backdrop="blur"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Contact Info</ModalHeader>
              <ModalBody>
                <p className="text-default-500 mb-2">
                  Feel free to reach out via email!
                </p>
                <div className="flex items-center gap-2 bg-default-100 p-2 rounded-xl border border-default-200">
                  <Input
                    isReadOnly
                    defaultValue={config?.contact_email || 'jhj1785@naver.com'}
                    variant="flat"
                    classNames={{
                      input: "bg-transparent",
                      inputWrapper: "bg-transparent shadow-none"
                    }}
                  />
                  <Button isIconOnly color={copied ? "success" : "default"} variant="flat" onPress={copyEmail}>
                    {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" as={Link} href={`mailto:${config?.contact_email || 'jhj1785@naver.com'}`}>
                  Open Mail App
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}