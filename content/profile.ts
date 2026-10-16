// Facts about Vasav. Everything here is sourced from the brief or his GitHub.
// Edit freely; components read from this file and never hard-code these values.

export const profile = {
  name: 'Vasav P Ramesh',
  monogram: 'VPR',
  age: 20,
  study: 'BCA (Hons), Data Science, AI/ML',
  year: '3rd year',
  college: 'Mar Augusthinose College, Ramapuram',
  city: 'Kochi',
  region: 'Kerala, India',
  timeZone: 'Asia/Kolkata',
  utcOffset: '+05:30',
  email: 'vasavpramesh06@gmail.com',
  githubSince: '2024-07-24',
  links: {
    github: { href: 'https://github.com/VasavDotJS', handle: 'VasavDotJS' },
    linkedin: {
      href: 'https://www.linkedin.com/in/vasav-p-ramesh-88446131b/',
      handle: 'vasav-p-ramesh',
    },
    instagram: { href: 'https://instagram.com/vlonevasu', handle: 'vlonevasu' },
  },
  // His own words, verbatim from GitHub.
  quotes: {
    bio: '20 year old BCA Student specializing on randomization, audio mapping',
    bio2: 'Amateur C/Python/Java/HTML enthusiast',
    readme: 'CODE OF NON-DUALITY!',
    neovim: 'my neovim config so i dont accidentally lose my shit!!!!',
  },
  /**
   * Photo slot for the desktop section backdrop. Leave null to use the
   * halftone render of the 3D form. To use a photo, put it in /public/portrait/
   * and set e.g. { src: '/portrait/vasav.jpg', alt: 'Vasav, blurred' }.
   */
  portrait: null as null | { src: string; alt: string },
} as const

export type Profile = typeof profile
