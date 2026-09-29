import os

def create_project_page():
    with open('index.html', 'r') as f:
        content = f.read()

    # Split the content at the main tag
    head_and_header = content.split('<main')[0] + '<main class="w-full flex-1 pt-20">'
    footer = '</main>' + content.split('</main>')[1]

    # Create the project detail content using the same tailwind classes
    project_content = """
    <section class="w-full py-24 sm:py-32 border-b border-[#DDD8CF] dark:border-[#23252C] bg-[#F4F1EA] dark:bg-[#0D0E11]">
        <div class="max-w-[1360px] mx-auto px-6 sm:px-10">
            <a href="index.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#DDD8CF] dark:border-[#24252B] bg-white dark:bg-[#121317] text-black dark:text-white font-headline-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#EBE8E1] dark:hover:bg-[#18191E] transition-all mb-12">
                <span>&larr;</span><span>Back to Projects</span>
            </a>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div class="lg:col-span-8">
                    <div class="flex items-center gap-2 font-mono text-xs text-[#8A6A45] dark:text-[#B5FF6D] mb-4">
                        <span>[Development]</span><span>•</span><span>[Healthcare Portal]</span>
                    </div>
                    <h1 class="font-display-xl text-5xl sm:text-7xl font-extrabold tracking-tight text-black dark:text-white leading-[1.08] mb-8">
                        MEDICARE PLUS
                    </h1>
                    <p class="font-body-md text-lg text-[#77736C] dark:text-[#8E919A] max-w-2xl leading-relaxed mb-8">
                        A streamlined healthcare portal enabling patients to browse specialist schedules, book appointments in real-time, and manage consultations with an intuitive multi-step booking engine.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-12">
                        <span class="px-3 py-1 rounded-full bg-[#E5E2DB] dark:bg-[#18191E] border border-[#DDD8CF] dark:border-[#24252B] text-xs font-mono text-black dark:text-white/90">PHP</span>
                        <span class="px-3 py-1 rounded-full bg-[#E5E2DB] dark:bg-[#18191E] border border-[#DDD8CF] dark:border-[#24252B] text-xs font-mono text-black dark:text-white/90">MySQL</span>
                        <span class="px-3 py-1 rounded-full bg-[#E5E2DB] dark:bg-[#18191E] border border-[#DDD8CF] dark:border-[#24252B] text-xs font-mono text-black dark:text-white/90">UI/UX</span>
                    </div>
                </div>
            </div>
            
            <div class="rounded-xl overflow-hidden border border-[#DDD8CF] dark:border-[#24252B] bg-[#EBE8E1] dark:bg-[#18191E] w-full mb-16">
                <div class="aspect-[21/9] overflow-hidden">
                    <img loading="lazy" alt="Medicare Plus Hero" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-awmSXCM0UQCDy4m-CXTofn-9PfTZyhbTTj-fwc0UqHxPYJ6rZB5ggRlrwZU_74bCocgurX2_7yZvwGUG_AwRIzTxD9TNOJQqzccFwHJSWjVe5mTSVTlicgwWaoKZwGBuWcoqJr98doZK7yaiGQo6Bes54-f-ODNHmMJdKiexK9By2ttvIw1r4iB345ffOClJOzComCuqD8INRPUB-85GcDH4igmBD3x3H25e4bbrpxRZQLI1awd_qQ">
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div class="lg:col-span-4">
                    <h2 class="font-headline-md text-2xl font-bold uppercase text-black dark:text-white mb-4">The Challenge</h2>
                </div>
                <div class="lg:col-span-8 flex flex-col gap-6 text-[#77736C] dark:text-[#8E919A] font-body-md text-base leading-relaxed">
                    <p>
                        Legacy healthcare systems often feature convoluted interfaces that frustrate patients and staff. The objective was to design and engineer a modern, frictionless booking experience from the ground up, ensuring high availability and seamless data flow to hospital backend records.
                    </p>
                    <p>
                        We focused heavily on performance and accessibility, ensuring the application works flawlessly across mobile devices while maintaining stringent security standards for patient data.
                    </p>
                </div>
            </div>
        </div>
    </section>
    """

    with open('project.html', 'w') as f:
        f.write(head_and_header + project_content + footer)

create_project_page()
