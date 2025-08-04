import { Github, Twitter, Linkedin } from "lucide-react";

const socials = [
  {
    name: "GitHub",
    href: "#",
    icon: <Github className="w-5 h-5" />
  },
  {
    name: "X",
    href: "#",
    icon: <Twitter className="w-5 h-5" />
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: <Linkedin className="w-5 h-5" />
  },
];

const Footer = () => (
  <footer className="py-10 px-4 text-center bg-gradient-to-b from-transparent to-[#0e1016]">
    <div className="flex gap-6 justify-center mb-3">
      {socials.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
          className="hover:text-gradient bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent transition">
          {s.icon}
        </a>
      ))}
    </div>
    <div className="text-white/50 text-sm">
      &copy; {new Date().getFullYear()} AI Universe Builder. Designed for devs, by devs.
    </div>
  </footer>
);

export default Footer;
