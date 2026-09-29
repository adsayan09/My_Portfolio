import os

def update_html():
    with open('index.html', 'r') as f:
        content = f.read()
    
    # 1. SEO Metadata
    if '<meta name="description"' not in content:
        seo = '''<meta name="description" content="Adsayan - Software Engineering & Creative Design Portfolio">
<meta property="og:title" content="ADSAYAN">
<meta property="og:description" content="Software Engineering & Creative Design Portfolio">'''
        content = content.replace('<title>', seo + '<title>')
    
    # 2. Image Lazy Loading
    content = content.replace('<img ', '<img loading="lazy" ')
    
    # 3. Reduced-motion
    if 'prefers-reduced-motion' not in content:
        reduced_motion = '''
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  }
'''
        content = content.replace('</style>', reduced_motion + '</style>')
    
    # 4. Dark/Light Mode Fixes
    # We will replace hardcoded colors with responsive ones
    replacements = {
        'bg-[#0D0E11]': 'bg-[#F4F1EA] dark:bg-[#0D0E11]',
        'bg-[#121317]': 'bg-white dark:bg-[#121317]',
        'bg-[#18191E]': 'bg-[#E5E2DB] dark:bg-[#18191E]',
        'border-[#24252B]': 'border-[#DDD8CF] dark:border-[#24252B]',
        'border-[#23252C]': 'border-[#DDD8CF] dark:border-[#23252C]',
        'text-[#8E919A]': 'text-[#77736C] dark:text-[#8E919A]',
        'text-white': 'text-black dark:text-white',
        'text-black': 'text-white dark:text-black',
        'bg-white': 'bg-black dark:bg-white',
        'hover:text-white': 'hover:text-black dark:hover:text-white',
        'hover:border-white': 'hover:border-black dark:hover:border-white',
        'border-[#1C1E24]': 'border-[#DDD8CF] dark:border-[#1C1E24]',
        'bg-[#090A0D]': 'bg-[#EBE8E1] dark:bg-[#090A0D]'
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Also fix the base CSS which forces dark colors
    content = content.replace('background-color: #0D0E11;', 'background-color: #F4F1EA;').replace('color: #F4F1EA;', 'color: #111111;')
    content = content.replace('@layer base {', '''@layer base {
    .dark body { background-color: #0D0E11 !important; color: #F4F1EA !important; }
    html.dark { color-scheme: dark; }''')
    
    # Update Dark Mode script logic
    old_script = "document.documentElement.classList.toggle('dark');"
    new_script = """
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    """
    content = content.replace(old_script, new_script)
    
    # Pre-apply theme from localstorage
    theme_init = "<script>if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark') } else { document.documentElement.classList.remove('dark') }</script>"
    content = content.replace('<head>', '<head>' + theme_init)
    
    # 5. Add Contact Form
    contact_form_html = """
    <form class="mt-8 flex flex-col gap-4">
        <input type="text" placeholder="Name" class="w-full bg-[#E5E2DB] dark:bg-[#18191E] border border-[#DDD8CF] dark:border-[#24252B] p-4 rounded-xl text-black dark:text-white" required>
        <input type="email" placeholder="Email" class="w-full bg-[#E5E2DB] dark:bg-[#18191E] border border-[#DDD8CF] dark:border-[#24252B] p-4 rounded-xl text-black dark:text-white" required>
        <textarea placeholder="Message" class="w-full bg-[#E5E2DB] dark:bg-[#18191E] border border-[#DDD8CF] dark:border-[#24252B] p-4 rounded-xl text-black dark:text-white h-32" required></textarea>
        <button type="submit" class="bg-black dark:bg-white text-white dark:text-black font-bold uppercase py-4 rounded-xl hover:bg-[#B5FF6D] hover:text-black transition-colors">Send Message</button>
    </form>
    """
    content = content.replace('<div class="lg:col-span-4 flex lg:justify-end">', f'<div class="lg:col-span-4 flex lg:justify-end flex-col">{contact_form_html}')
    
    # Link to project detail page
    content = content.replace('href="#"', 'href="project.html"')
    
    with open('index.html', 'w') as f:
        f.write(content)

update_html()
