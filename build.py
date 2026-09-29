import re

def process_html():
    with open('index.html', 'r') as f:
        html = f.read()

    # 1. SEO Metadata
    if '<meta name="description"' not in html:
        seo_tags = """<meta name="description" content="Adsayan - Software Engineering & Creative Design Portfolio">
<meta property="og:title" content="ADSAYAN">
<meta property="og:description" content="Software Engineering & Creative Design Portfolio">
<meta property="og:type" content="website">"""
        html = html.replace('<title>', seo_tags + '\n<title>')

    # 2. Lazy Loading
    html = html.replace('<img ', '<img loading="lazy" ')

    # 3. Reduced Motion
    if 'prefers-reduced-motion' not in html:
        rm_css = """
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
"""
        html = html.replace('</style>', rm_css + '</style>')

    # 4. Hero Monogram
    empty_hero_div = '<div class="lg:col-span-5 flex items-center justify-center relative"></div>'
    monogram_html = """
    <div class="lg:col-span-5 flex items-center justify-center relative">
        <div class="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center group parallax-container" id="monogram-container">
            <div class="absolute inset-0 rounded-full border border-[#E5E5E5] dark:border-[#24252B] border-opacity-50 animate-[spin_20s_linear_infinite] parallax-layer" data-speed="2"></div>
            <div class="absolute inset-4 rounded-full border border-[#E5E5E5] dark:border-[#24252B] border-opacity-70 animate-[spin_15s_linear_infinite_reverse] parallax-layer" data-speed="4"></div>
            <div class="absolute inset-8 rounded-full border border-[#4F8A10]/30 dark:border-[#B5FF6D]/30 parallax-layer" data-speed="6"></div>
            <span class="font-display-xl text-[120px] sm:text-[160px] font-extrabold text-[#111111] dark:text-white leading-none z-10 parallax-layer" data-speed="10" style="text-shadow: 0 0 40px rgba(181,255,109,0.1);">A</span>
        </div>
    </div>
    """
    html = html.replace(empty_hero_div, monogram_html)
    
    # Parallax script
    parallax_js = """
    const mono = document.getElementById('monogram-container');
    if(mono && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        mono.addEventListener('mousemove', (e) => {
            const rect = mono.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            mono.querySelectorAll('.parallax-layer').forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                layer.style.transform = `translate(${x * speed / 100}px, ${y * speed / 100}px)`;
            });
        });
        mono.addEventListener('mouseleave', () => {
            mono.querySelectorAll('.parallax-layer').forEach(layer => {
                layer.style.transform = `translate(0,0)`;
            });
        });
    }
    """
    html = html.replace('// Mobile Menu', parallax_js + '\n  // Mobile Menu')

    # 5. Light/Dark Mode Enhancements
    # Replace hardcoded colors with tailwind variants
    # Note: Using regex to avoid messing up already correct classes
    
    replacements = {
        r'bg-\[\#0D0E11\]': 'bg-[#F5F5F0] dark:bg-[#0D0E11]',
        r'bg-\[\#121317\]': 'bg-white dark:bg-[#121317]',
        r'bg-\[\#18191E\]': 'bg-white dark:bg-[#18191E]',
        r'border-\[\#24252B\]': 'border-[#E5E5E5] dark:border-[#24252B]',
        r'border-\[\#23252C\]': 'border-[#E5E5E5] dark:border-[#23252C]',
        r'text-\[\#8E919A\]': 'text-[#77736C] dark:text-[#8E919A]',
        r'text-\[\#F4F1EA\]': 'text-[#111111] dark:text-[#F4F1EA]',
        r'text-white(\s|/|")': r'text-[#111111] dark:text-white\1',
        r'text-\[\#CCA374\]': 'text-[#9C6D37] dark:text-[#CCA374]',
        r'text-\[\#B5FF6D\]': 'text-[#4F8A10] dark:text-[#B5FF6D]',
        r'border-\[\#B5FF6D\]': 'border-[#4F8A10] dark:border-[#B5FF6D]',
        r'bg-\[\#090A0D\]': 'bg-[#EAEAEA] dark:bg-[#090A0D]',
        r'border-\[\#1C1E24\]': 'border-[#CCCCCC] dark:border-[#1C1E24]',
        r'bg-dark-bg': 'bg-[#F5F5F0] dark:bg-dark-bg',
        r'text-on-surface': 'text-[#111111] dark:text-on-surface',
        r'hover:text-white(\s|/|")': r'hover:text-[#111111] dark:hover:text-white\1',
        r'hover:border-white(\s|/|")': r'hover:border-[#111111] dark:hover:border-white\1'
    }

    # Custom function for replacing text-white so we don't accidentally replace within already replaced text
    # Let's just do sequential replace, it's safer for classes separated by space
    for old, new in replacements.items():
        html = re.sub(old, new, html)

    # Fix base styles in style tag
    html = html.replace('background-color: #0D0E11;', 'background-color: #F5F5F0;')
    html = html.replace('color: #F4F1EA;', 'color: #111111;')
    html = html.replace('@layer base {', '''@layer base {
    .dark body { background-color: #0D0E11 !important; color: #F4F1EA !important; }
    html.dark { color-scheme: dark; }''')

    # Update theme toggle logic to persist in localStorage
    old_script = "document.documentElement.classList.toggle('dark');"
    new_script = """
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    """
    html = html.replace(old_script, new_script)
    
    theme_init = "<script>if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark') } else { document.documentElement.classList.remove('dark') }</script>"
    html = html.replace('<head>', '<head>\n' + theme_init)

    # 6. Change all <a href="#"> under Selected Projects to href="project.html"
    html = re.sub(r'<a[^>]*href="\#"[^>]*>(\s*<span[^>]*>View Case Study</span>)', r'<a href="project.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-headline-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#B5FF6D] hover:text-black transition-colors">\1', html)

    with open('index.html', 'w') as f:
        f.write(html)
        
    print("Processed index.html successfully.")

def create_project_page():
    with open('index.html', 'r') as f:
        content = f.read()

    # Split the content at the main tag
    head_and_header = content.split('<main')[0] + '<main class="w-full flex-1 pt-20">'
    footer = '</main>' + content.split('</main>')[1]

    project_content = """
    <section class="w-full py-24 sm:py-32 border-b border-[#E5E5E5] dark:border-[#23252C] bg-[#F5F5F0] dark:bg-[#0D0E11]">
        <div class="max-w-[1360px] mx-auto px-6 sm:px-10">
            <a href="index.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#121317] text-[#111111] dark:text-white font-headline-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#EAEAEA] dark:hover:bg-[#18191E] transition-all mb-12">
                <span>&larr;</span><span>Back to Archive</span>
            </a>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
                <div class="lg:col-span-8">
                    <div class="flex items-center gap-2 font-mono text-xs text-[#4F8A10] dark:text-[#B5FF6D] mb-4">
                        <span>[Development]</span><span>•</span><span>[Healthcare Portal]</span>
                    </div>
                    <h1 class="font-display-xl text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] text-[#111111] dark:text-white leading-[0.92] uppercase mb-8">
                        MEDICARE PLUS
                    </h1>
                    <p class="font-body-md text-lg text-[#77736C] dark:text-[#8E919A] max-w-2xl leading-relaxed mb-8">
                        A streamlined healthcare portal enabling patients to browse specialist schedules, book appointments in real-time, and manage consultations with an intuitive multi-step booking engine.
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1.5 rounded-full bg-white dark:bg-[#18191E] border border-[#E5E5E5] dark:border-[#24252B] text-xs font-mono text-[#111111] dark:text-white/90">PHP</span>
                        <span class="px-3 py-1.5 rounded-full bg-white dark:bg-[#18191E] border border-[#E5E5E5] dark:border-[#24252B] text-xs font-mono text-[#111111] dark:text-white/90">MySQL</span>
                        <span class="px-3 py-1.5 rounded-full bg-white dark:bg-[#18191E] border border-[#E5E5E5] dark:border-[#24252B] text-xs font-mono text-[#111111] dark:text-white/90">UI/UX</span>
                    </div>
                </div>
            </div>
            
            <div class="rounded-2xl overflow-hidden border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#18191E] w-full mb-24 shadow-xl">
                <div class="aspect-[21/9] overflow-hidden">
                    <img loading="lazy" alt="Medicare Plus Hero" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-awmSXCM0UQCDy4m-CXTofn-9PfTZyhbTTj-fwc0UqHxPYJ6rZB5ggRlrwZU_74bCocgurX2_7yZvwGUG_AwRIzTxD9TNOJQqzccFwHJSWjVe5mTSVTlicgwWaoKZwGBuWcoqJr98doZK7yaiGQo6Bes54-f-ODNHmMJdKiexK9By2ttvIw1r4iB345ffOClJOzComCuqD8INRPUB-85GcDH4igmBD3x3H25e4bbrpxRZQLI1awd_qQ">
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div class="lg:col-span-4">
                    <h2 class="font-headline-sm text-2xl font-bold uppercase text-[#111111] dark:text-white mb-4">The Challenge</h2>
                </div>
                <div class="lg:col-span-8 flex flex-col gap-6 text-[#77736C] dark:text-[#8E919A] font-body-md text-base leading-relaxed">
                    <p>
                        Legacy healthcare systems often feature convoluted interfaces that frustrate patients and staff. The objective was to design and engineer a modern, frictionless booking experience from the ground up, ensuring high availability and seamless data flow to hospital backend records.
                    </p>
                    <p>
                        We focused heavily on performance and accessibility, ensuring the application works flawlessly across mobile devices while maintaining stringent security standards for patient data. Architecture was deeply inspired by clean monolithic patterns, optimizing for speed and reliability.
                    </p>
                </div>
            </div>
        </div>
    </section>
    """

    with open('project.html', 'w') as f:
        f.write(head_and_header + project_content + footer)
    print("Generated project.html successfully.")

process_html()
create_project_page()
