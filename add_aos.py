import os
import re

def add_aos_to_file(filepath):
    with open(filepath, 'r') as f:
        html = f.read()

    # 1. Add AOS CSS to <head>
    if 'aos.css' not in html:
        html = html.replace('</head>', '  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n</head>')

    # 2. Add AOS JS and Init before </body>
    if 'aos.js' not in html:
        aos_init = """
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic',
  });
</script>
"""
        html = html.replace('</body>', aos_init + '</body>')

    # 3. Add AOS attributes to specific elements
    
    # Hero Section
    html = html.replace('<div class="inline-flex items-center gap-2.5', '<div data-aos="fade-down" data-aos-delay="100" class="inline-flex items-center gap-2.5')
    html = html.replace('<span class="block text-2xl sm:text-3xl', '<span data-aos="fade-up" data-aos-delay="200" class="block text-2xl sm:text-3xl')
    html = html.replace('<h1 class="font-display-xl', '<h1 data-aos="fade-up" data-aos-delay="300" class="font-display-xl')
    html = html.replace('<p class="font-body-md text-base sm:text-lg text-[#77736C]', '<p data-aos="fade-up" data-aos-delay="400" class="font-body-md text-base sm:text-lg text-[#77736C]')
    html = html.replace('<div class="flex flex-wrap items-center gap-4 pt-2">', '<div data-aos="fade-up" data-aos-delay="500" class="flex flex-wrap items-center gap-4 pt-2">')

    # General Section Headers (About Me, Selected Projects, etc.)
    html = re.sub(r'(<div class="flex items-center justify-between pb-6 mb-12 border-b[^>]*>)', r'<div data-aos="fade-in" \1', html)
    html = re.sub(r'(<h2 class="font-display-xl[^>]*>)', r'<h2 data-aos="fade-up" \1', html)
    html = re.sub(r'(<p class="text-\[\#77736C\][^>]*text-base[^>]*>)', r'<p data-aos="fade-up" data-aos-delay="100" \1', html)
    
    # About Section Text
    html = html.replace('<div class="flex flex-col gap-6', '<div data-aos="fade-up" data-aos-delay="200" class="flex flex-col gap-6')
    html = html.replace('<div class="mt-10 grid grid-cols-2 gap-6', '<div data-aos="fade-up" data-aos-delay="300" class="mt-10 grid grid-cols-2 gap-6')
    html = html.replace('<div class="bg-white dark:bg-[#121317] border border-[#E5E5E5] dark:border-[#24252B] p-6', '<div data-aos="fade-left" data-aos-delay="400" class="bg-white dark:bg-[#121317] border border-[#E5E5E5] dark:border-[#24252B] p-6')

    # Project Cards
    html = re.sub(r'(<article class="group[^>]*>)', r'<article data-aos="fade-up" data-aos-offset="100" \1', html)

    # Expertise Columns
    html = re.sub(r'(<!-- Column 1: Development -->\s*)<div class="bg-white', r'\1<div data-aos="fade-up" data-aos-delay="100" class="bg-white', html)
    html = re.sub(r'(<!-- Column 2: UI/UX Design -->\s*)<div class="bg-white', r'\1<div data-aos="fade-up" data-aos-delay="200" class="bg-white', html)
    html = re.sub(r'(<!-- Column 3: Creative & Tools -->\s*)<div class="bg-white', r'\1<div data-aos="fade-up" data-aos-delay="300" class="bg-white', html)

    # Journey Timeline Items
    html = html.replace('<!-- 2024 -->\n<div class="relative group">', '<!-- 2024 -->\n<div data-aos="fade-left" data-aos-delay="100" class="relative group">')
    html = html.replace('<!-- 2025 -->\n<div class="relative group">', '<!-- 2025 -->\n<div data-aos="fade-left" data-aos-delay="200" class="relative group">')
    html = html.replace('<!-- 2026 -->\n<div class="relative group">', '<!-- 2026 -->\n<div data-aos="fade-left" data-aos-delay="300" class="relative group">')
    html = html.replace('<!-- NOW -->\n<div class="relative group">', '<!-- NOW -->\n<div data-aos="fade-left" data-aos-delay="400" class="relative group">')

    # Explorations Items
    html = html.replace('<!-- Item 01 -->\n<div class="group bg-white', '<!-- Item 01 -->\n<div data-aos="zoom-in-up" data-aos-delay="100" class="group bg-white')
    html = html.replace('<!-- Item 02 -->\n<div class="group bg-white', '<!-- Item 02 -->\n<div data-aos="zoom-in-up" data-aos-delay="200" class="group bg-white')
    html = html.replace('<!-- Item 03 -->\n<div class="group bg-white', '<!-- Item 03 -->\n<div data-aos="zoom-in-up" data-aos-delay="300" class="group bg-white')
    html = html.replace('<!-- Item 04 -->\n<div class="group bg-white', '<!-- Item 04 -->\n<div data-aos="zoom-in-up" data-aos-delay="100" class="group bg-white')
    html = html.replace('<!-- Item 05 -->\n<div class="group bg-white', '<!-- Item 05 -->\n<div data-aos="zoom-in-up" data-aos-delay="200" class="group bg-white')
    html = html.replace('<!-- Item 06 -->\n<div class="group bg-white', '<!-- Item 06 -->\n<div data-aos="zoom-in-up" data-aos-delay="300" class="group bg-white')

    # Contact section
    html = html.replace('<div class="lg:col-span-8">', '<div data-aos="fade-right" class="lg:col-span-8">')
    html = html.replace('<div class="lg:col-span-4 flex lg:justify-end">', '<div data-aos="fade-left" data-aos-delay="200" class="lg:col-span-4 flex lg:justify-end">')
    
    # Contact grid items
    html = re.sub(r'(<div class="p-6 rounded-xl bg-\[\#121317\])', r'<div data-aos="fade-up" data-aos-delay="100" \1', html)

    with open(filepath, 'w') as f:
        f.write(html)

add_aos_to_file('index.html')
add_aos_to_file('project.html')
print("AOS added to files successfully.")
