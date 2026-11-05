import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

const projects = [
  {
    category: 'app',
    initial: 'I',
    title: 'Inventory Management System',
    description:
      'Desktop app for stock tracking, supplier orders and low-stock alerts.',
    tags: ['Java', 'Swing', 'MySQL'],
  },
  {
    category: 'web',
    initial: 'C',
    title: 'Client Booking Platform',
    description:
      'Online scheduling with user accounts, reminders and an admin panel.',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
  },
  {
    category: 'web',
    initial: 'A',
    title: 'Analytics Dashboard',
    description: 'Interactive charts and filters for sales and traffic data.',
    tags: ['JavaScript', 'Chart.js', 'REST API'],
  },
  {
    category: 'web',
    initial: 'C',
    title: 'Company Website',
    description: 'Fast, responsive marketing site with a contact form and blog.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    category: 'db',
    initial: 'C',
    title: 'Customer Database Design',
    description: 'Normalised schema, indexes and 25 optimised SQL queries.',
    tags: ['SQL', 'ER Diagram', 'MySQL'],
  },
  {
    category: 'app',
    initial: 'T',
    title: 'Task Automation Tool',
    description:
      'Python scripts that clean reports and email summaries on a schedule.',
    tags: ['Python', 'SQLite', 'SMTP'],
  },
];

const skillLevels = [
  ['Java', 85],
  ['Python', 80],
  ['SQL and databases', 85],
  ['JavaScript', 80],
  ['HTML and CSS', 90],
  ['Git and GitHub', 80],
];

const filters = [
  ['all', 'All'],
  ['web', 'Web'],
  ['app', 'Apps'],
  ['db', 'Database'],
];

const emailServiceId =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fqdrgqs';
const emailTemplateId =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_y908i5q';
const emailPublicKey =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'gz1tkbKi81jdpZfMW';

const validationRules = {
  name: (value) => value.trim().length >= 2 || 'Enter your name.',
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
    'Enter a valid email address.',
  msg: (value) =>
    value.trim().length >= 10 || 'Write at least 10 characters.',
};

function ProjectCard({ project }) {
  return (
    <article className="card" data-cat={project.category}>
      <div className="thumb">{project.initial}</div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('');
  const [showTop, setShowTop] = useState(false);
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const words = ['software developer', 'full-stack engineer', 'problem solver'];
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) {
      setTypedText(words[0]);
      return undefined;
    }

    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const word = words[wordIndex];
      characterIndex += deleting ? -1 : 1;
      setTypedText(word.slice(0, characterIndex));

      let delay = deleting ? 40 : 90;
      if (!deleting && characterIndex === word.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, 90);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const frames = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          entry.target.querySelectorAll('.bar i').forEach((bar) => {
            bar.style.width = `${bar.dataset.level}%`;
          });
          entry.target.querySelectorAll('[data-count]').forEach((counter) => {
            const end = Number(counter.dataset.count);
            if (reduceMotion) {
              counter.textContent = end;
              return;
            }

            let value = 0;
            const countUp = () => {
              value = Math.min(end, value + Math.max(1, end / 40));
              counter.textContent = Math.round(value);
              if (value < end) frames.add(requestAnimationFrame(countUp));
            };
            countUp();
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll('.reveal').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      frames.forEach(cancelAnimationFrame);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('main section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));

    const updateTopButton = () => setShowTop(window.scrollY >= 600);
    window.addEventListener('scroll', updateTopButton, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateTopButton);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const validateField = (id, value) => {
    const result = validationRules[id](value);
    setErrors((previous) => ({
      ...previous,
      [id]: result === true ? '' : result,
    }));
    return result === true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const nextErrors = Object.fromEntries(
      Object.entries(validationRules).map(([id, rule]) => {
        const result = rule(String(values[id] ?? ''));
        return [id, result === true ? '' : result];
      }),
    );
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setFormStatus('Fix the highlighted fields and try again.');
      return;
    }

    if (!emailServiceId || !emailTemplateId || !emailPublicKey) {
      setFormStatus(
        'The contact form is not configured yet. Add the EmailJS settings and try again.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          name: String(values.name),
          email: String(values.email),
          message: String(values.msg),
        },
        { publicKey: emailPublicKey },
      );

      setFormStatus('Message sent successfully. Thanks for reaching out!');
      setErrors({});
      form.reset();
    } catch (error) {
      console.error('EmailJS contact form submission failed:', error);
      setFormStatus(
        typeof error?.text === 'string'
          ? `Could not send your message: ${error.text}`
          : 'Could not send your message. Check the EmailJS settings and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleProjects = projects.filter(
    (project) => activeFilter === 'all' || project.category === activeFilter,
  );

  return (
    <>
      <header className="nav" id="nav">
        <a href="#home" className="logo">
          Hades<span>.</span>
        </a>
        <nav id="menu" className={menuOpen ? 'open' : ''} aria-label="Main">
          {['About', 'Experience', 'Skills', 'Projects', 'Contact'].map(
            (label) => {
              const section = label.toLowerCase();
              return (
                <a
                  key={section}
                  href={`#${section}`}
                  className={activeSection === section ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              );
            },
          )}
        </nav>
        <div className="nav-actions">
          <button
            id="burger"
            className="icon-btn burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-text">
            <p className="status">
              <i /> Available for new projects
            </p>
            <h1>
              Software developer building reliable web and desktop
              applications.
            </h1>
            <p className="role">
              I&apos;m a <span id="typed">{typedText}</span>
              <span className="cursor">|</span>
            </p>
            <div className="cta">
              <a href="#projects" className="btn primary">
                View my projects
              </a>
              <a href="#contact" className="btn ghost">
                Get in touch
              </a>
            </div>
          </div>
          <div className="term" aria-hidden="true">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span>developer.py</span>
            </div>
            <div className="term-body">
              <div>
                <span className="p">&gt;&gt;&gt;</span> developer.name
              </div>
              <div className="k">&apos;Rekmar&apos;</div>
              <div>
                <span className="p">&gt;&gt;&gt;</span> developer.role
              </div>
              <div className="k">&apos;Full-Stack Developer&apos;</div>
              <div>
                <span className="p">&gt;&gt;&gt;</span> developer.stack
              </div>
              <div className="k">[&apos;Java&apos;, &apos;Python&apos;, &apos;SQL&apos;, &apos;JS&apos;]</div>
              <div>
                <span className="p">&gt;&gt;&gt;</span> developer.available
              </div>
              <div className="k">
                True <span className="cursor">▌</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section reveal">
          <h2>About me</h2>
          <div className="about">
            <p>
              Greetings, I&apos;m Rekmar, a software developer based in Iligan
              City. I build database-backed applications and responsive
              websites that are clean, fast and easy to maintain.
            </p>
          </div>
        </section>

        <section id="experience" className="section reveal">
          <h2>Experience</h2>
          <ol className="timeline">
            <li>
              <h3>Independent software development</h3>
              <p>
                Focused on building database-backed applications and responsive
                websites that are clean, fast and easy to maintain.
              </p>
            </li>
          </ol>
        </section>

        <section id="skills" className="section reveal">
          <h2>Skills</h2>
          <div className="skills">
            {skillLevels.map(([skill, level]) => (
              <div className="skill" key={skill}>
                <span>{skill}</span>
                <div className="bar">
                  <i data-level={level} />
                </div>
              </div>
            ))}
          </div>
          <h3 className="sub">Tools and practices</h3>
          <div className="tags big">
            {[
              'REST APIs',
              'Object-Oriented Design',
              'Data Structures',
              'Linux',
              'Agile',
              'Testing',
              'Responsive Design',
              'Version Control',
            ].map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section id="projects" className="section reveal">
          <h2>Projects</h2>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map(([filter, label]) => (
              <button
                key={filter}
                className={`chip${activeFilter === filter ? ' active' : ''}`}
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid" id="grid">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
          {visibleProjects.length === 0 && (
            <p id="empty" className="empty">
              No projects in this category yet.
            </p>
          )}
        </section>

        <section id="contact" className="section reveal">
          <h2>Contact</h2>
          <div className="contact">
            <p>
              Have a project or role in mind? Send a message and I&apos;ll reply
              within two days.
            </p>
            <form
              id="form"
              noValidate
              onSubmit={handleSubmit}
            >
              <label className={errors.name ? 'err' : ''} htmlFor="name">
                Name
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  onChange={(event) =>
                    validateField('name', event.currentTarget.value)
                  }
                />
                <small>{errors.name}</small>
              </label>
              <label className={errors.email ? 'err' : ''} htmlFor="email">
                Email
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(event) =>
                    validateField('email', event.currentTarget.value)
                  }
                />
                <small>{errors.email}</small>
              </label>
              <label className={errors.msg ? 'err' : ''} htmlFor="msg">
                Message
                <textarea
                  id="msg"
                  name="msg"
                  rows="5"
                  onChange={(event) =>
                    validateField('msg', event.currentTarget.value)
                  }
                />
                <small>{errors.msg}</small>
              </label>
              <button
                className="btn primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
              <p id="formStatus" role="status">
                {formStatus}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <p>
          © <span id="year">{new Date().getFullYear()}</span> Rekmar. All
          rights reserved.
        </p>
        <p className="social">
          <a
            href="https://github.com/riverofst6"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="#contact">Contact form</a>
        </p>
      </footer>
      <button
        id="top"
        className="icon-btn top"
        aria-label="Back to top"
        hidden={!showTop}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
              .matches
              ? 'auto'
              : 'smooth',
          })
        }
      >
        ↑
      </button>
    </>
  );
}

export default App;
