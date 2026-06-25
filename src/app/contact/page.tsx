import Image from 'next/image';

const contactLinks = [
  {
    title: 'Email',
    body: 'Send a message',
    href: 'mailto:flyskytoo@outlook.com',
    icon: '/Mail.svg',
  },
  {
    title: 'LinkedIn',
    body: 'Contact',
    href: 'https://www.linkedin.com/in/meichai/',
    icon: '/LinkedIN.svg',
  },
  {
    title: 'GitHub',
    body: 'Check my profile',
    href: 'https://github.com/fancytree',
    icon: '/Github.svg',
  },
];

export default function ContactPage() {
  return (
    <section
      className="mei-tab-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <div className="mei-tab-container">
        <header className="mei-tab-header">
          <h1>Contact</h1>
          <p>Let&apos;s turn complex challenges into seamless solutions.</p>
        </header>

        <p className="mei-contact-copy">
          I am always interested in collaborating on projects that demand rigorous user research and technical precision. From deep usability testing to responsive, code-based interfaces, I am ready to help bring product visions to life with a human-first approach.
        </p>

        <div className="mei-contact-grid">
          {contactLinks.map((link) => (
            <a
              className="mei-contact-card"
              href={link.href}
              key={link.title}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="mei-contact-icon" aria-hidden="true">
                <Image src={link.icon} alt="" width={22} height={22} />
              </span>
              <span className="mei-contact-card-copy">
                <span>{link.title}</span>
                <strong>{link.body}</strong>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
