# acknowledgements

The work presented on this site is my own, but much of it depended on guidance, collaboration and public resources. This page records those debts.

## Teachers

Thanks to the teachers who supervised my research training. I started participating in projects in my first year, beginning with data splits and experiment records and gradually taking on algorithm implementation. During a period when most experiments failed, my supervisors allowed ample room for trial and error while correcting my methods, which shaped how I design and document experiments.

### School of Life Science and Agriculture

**Yujing Cui** (counsellor) — During my first year in Pharmaceutical Engineering, Ms. Cui gave concrete guidance on the major-transfer process, course planning and academic direction. When I decided to move from Pharmaceutical Engineering to Electronic Information Engineering, she laid out the procedural milestones and timeline and flagged the real workload of catching up on courses after the transfer.

**Mingyao Zhang** — Offered specific guidance on subject knowledge and study methods, including how to approach the course material and how to pace independent study.

**Jun Wu** — Advised on the direction of the major and on subsequent development, which helped me form a clearer picture of the sequence in which the courses build on one another.

### School of Information and Control Engineering

**Yuhong Jin** (lecturer, Circuit Analysis Fundamentals) — I began sitting in on this course in March 2026. As the first foundation course I encountered after crossing into electronic information engineering, Ms. Jin answered my questions patiently and allowed me to attend lectures and join the office hours, which let me build a basic framework of circuit analysis before formally transferring into the major.

Thanks also to the other teachers in my original major, who gave concrete advice during my cross-disciplinary study and transfer preparation.

## Teammates and collaborators

Competitions and projects were mostly team efforts. The medical imaging projects involved members with biomedical engineering and computer science backgrounds, while I focused on algorithms and software implementation. I am grateful for their work on data organisation, clinical context and written material.

## Family

Thanks to my family for their support and understanding of my decision to transfer majors and of the time I have spent on competitions and research.

## Open source

This site is built on open-source software, and its own code is released under an open licence. This section covers three things: what the site uses, what those projects are licensed under, and how the site's own content and code are licensed.

### Site content

All original content on this site — text, notes and images — is **all rights reserved**.

Text and data mining rights are expressly reserved. Without permission, the content may not be used to:

- train, fine-tune or otherwise improve any machine learning model
- distil into another model, or generate synthetic corpora
- serve as real-time input to a generative AI system
- be packaged, resold or folded into third-party datasets

This reservation is made under the TDM Reservation Protocol and Article 4 of EU Directive 2019/790. The full terms are on the [Terms of use](/en/tdm-reservation) page.

### Site source code

The build configuration, theme components and helper scripts are released under the **MIT Licence**. You may use, modify and redistribute them freely, provided the copyright notice is retained. The full text is in [`LICENSE`](https://github.com/MakeBlackSheepGreat/MakeBlackSheepGreat.github.io/blob/main/LICENSE) at the repository root.

Note that the MIT Licence **covers code only**, not the text and images on the site. If you want to reuse the layout, take the code; if you want to quote the writing, see the next section.

### Open-source software used

This site is built on the following projects, with thanks:

| Project | Version | Licence | Use |
|---|---|---|---|
| [VitePress](https://vitepress.dev/) | 1.6.4 | MIT | Static site generation and theme framework |
| [Vue 3](https://vuejs.org/) | 3.5.42 | MIT | Components and reactive rendering |
| [Vite](https://vite.dev/) | 5.4.21 | MIT | Build tooling and dev server |
| [markdown-it-container](https://github.com/markdown-it/markdown-it-container) | 4.0.0 | MIT | Custom container layouts |
| [Shiki](https://shiki.style/) | 2.5.0 | MIT | Syntax highlighting |
| [esbuild](https://esbuild.github.io/) | 0.21.5 | MIT | Dependency pre-bundling and minification |
| [VueUse](https://vueuse.org/) | 12.8.2 | MIT | Composition utilities (pulled in indirectly via VitePress) |
| [Playwright](https://playwright.dev/) | 1.63.0 | Apache-2.0 | Automated verification of the protection layer, and CV export |

Versions above correspond to the current build of this site. Markdown parsing is handled by the markdown-it bundled inside VitePress, which is not installed as a separate dependency.

For fonts, the site uses the system font stack and does not distribute third-party font files. Icons are inline SVG, with no external icon library.

Copyright in the projects above belongs to their respective authors; the licence terms of each project's own repository govern.

### Public datasets and algorithms

The research work also builds on publicly available academic results, chiefly public medical imaging datasets (such as BUS-BRA and BUSI in breast ultrasound) and PyTorch-ecosystem model implementations and pretrained weights. These carry differing licence terms — consult their official documentation for the specific terms. This site does not redistribute those datasets.

### On citation

If you want to cite a view or a figure from this site in an article, you are welcome to link to the original page and credit the source; that is ordinary fair quotation and needs no further permission. For full republication, translation or commercial use, please contact me at the email on the [home page](/en/).

The notes record personal practice. Their steps and conclusions are bound to a specific environment — judge them against your own rather than copying them directly.

### Giving back

Much of my troubleshooting drew on public documentation and community discussion. In return, I open-source my own code and write up engineering experience as [notes](/en/notes/); the build configuration and protection components of this site are likewise open under the MIT Licence and free to reference.

## Note

This site contains only my own work and publicly available information. It does not include student identifiers, phone numbers or national ID numbers; the only contact channels are the public email, WeChat and GitHub links. Apart from the teachers named in the acknowledgements section with their consent, no other person's name appears on the site, and no unpublished third-party information is used.

Full licence texts are at the repository root:

- [`LICENSE`](https://github.com/MakeBlackSheepGreat/MakeBlackSheepGreat.github.io/blob/main/LICENSE) — source code, MIT
- [`LICENSE-CONTENT`](https://github.com/MakeBlackSheepGreat/MakeBlackSheepGreat.github.io/blob/main/LICENSE-CONTENT) — content, all rights reserved
