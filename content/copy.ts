// All UI copy lives here. Voice: dry, short, specific, lowercase for microcopy.
// `pnpm lint` greps this folder for the banned-word list in CLAUDE.md.

import { profile } from './profile'

export const sections = {
  hero: '00 cover',
  index: '01 index',
  work: '02 work',
  stack: '03 stack',
  contact: '04 contact',
} as const

export type SectionId = keyof typeof sections

export const hero = {
  words: ['VASAV', 'P', 'RAMESH'],
  fragments: [
    { id: 'study', text: 'bca (hons) · data science, ai/ml' },
    { id: 'year', text: 'year 3' },
    { id: 'college', text: 'mar augusthinose college, ramapuram' },
    { id: 'city', text: 'kochi, kerala' },
    { id: 'random', text: 'randomization' },
    { id: 'audio', text: 'audio mapping' },
    { id: 'readme', text: 'CODE OF NON-DUALITY!' },
    { id: 'langs', text: 'c / python / typescript' },
    { id: 'est', text: 'est. github 2024' },
  ],
  /** fragments kept on small screens */
  mobileFragments: ['study', 'city', 'readme', 'random'],
  scroll: 'scroll',
} as const

export const about = {
  meta: ['INDEX', '2024—2026', 'KOCHI'],
  paragraphs: [
    'third-year BCA (Hons) in data science and AI/ML at Mar Augusthinose College, Ramapuram. based in Kochi.',
    "started in C: stacks, binary search, a number-guessing game, the record-book programs everyone writes. now it's Python when there's data involved and TypeScript when someone has to actually tap on it.",
    'into randomness, audio, and software that feels physical.',
  ],
  spec: [
    { k: 'name', v: profile.name },
    { k: 'age', v: String(profile.age) },
    { k: 'study', v: 'BCA (Hons), data science, AI/ML' },
    { k: 'year', v: 'third' },
    { k: 'college', v: profile.college },
    { k: 'based', v: `${profile.city}, ${profile.region} · UTC${profile.utcOffset}` },
    { k: 'writes', v: 'C, Python, TypeScript, JavaScript, Lua' },
    { k: 'interests', v: 'randomization, audio mapping' },
    { k: 'editor', v: 'neovim', href: 'https://github.com/VasavDotJS/neovimConfig', title: profile.quotes.neovim },
  ],
}

export const work = {
  meta: ['WORK', 'SELECTED', '2024—2026'],
  xprso: {
    paise: {
      title: 'money in paise',
      text: 'type a menu price. XPRSO never stores ₹249.00, it stores 24900. tax is 500 basis points, split into CGST and SGST and rounded half-up in integers.',
      caption: "illustration of XPRSO's tax math with its defaults (5% GST, tax-exclusive). runs in your browser.",
    },
    settled: {
      title: 'settled means settled',
      text: 'settling takes the next invoice number for the financial year, under a row lock. after that a trigger rejects every UPDATE and DELETE on the bill.',
      caption: 'try dragging the receipt.',
      refusal: 'Cannot modify a settled order.',
    },
    passkeys: {
      title: 'passkeys, not PINs',
      text: 'staff sign in with the fingerprint or face scan the tablet already has. admin screens ask again before they open.',
      caption: 'press and hold. nothing is sent anywhere.',
      done: 'signed in. (not really.)',
    },
    outro: 'view repo',
  },
  desktop: {
    meta: ['DESKTOP', 'DOUBLE-CLICK TO OPEN', 'DRAG IS FINE'],
    hint: 'double-click an icon, or tab to it and press enter.',
    mobileHint: 'tap to open.',
    archiveLabel: 'archive',
    chartLabel: 'seeded random walk, drawn the way fintarot draws charts. not a stock.',
    moodLabel: 'a toy version of the idea, scored in your browser. the real app uses TextBlob.',
    moodPlaceholder: 'how do you feel?',
  },
}

export const stackCopy = {
  meta: ['STACK', 'NO PERCENTAGES', 'PRESS A KEY'],
  usedIn: 'used in',
  idle: 'press a key.',
}

export const contact = {
  meta: ['CONTACT', 'REPLIES FROM KOCHI', `UTC${profile.utcOffset}`],
  heading: ['say', 'something.'],
  sub: 'email goes straight to me. i read all of it.',
  fields: { name: 'name', email: 'email', message: 'message' },
  send: 'send',
  sending: 'sending',
  sent: `sent. i'll reply from ${profile.email}.`,
  copy: 'copy email',
  copied: 'copied',
  mailto: 'or open your mail app',
  errors: {
    name: 'a name, even a fake one.',
    email: "that email doesn't look right.",
    message: 'a bit more than that. ten characters at least.',
    messageLong: 'that one is too long for a form. email it instead.',
    tooFast: 'that was fast. try again in a second.',
    rateLimited: 'too many messages from here. try again in a bit, or just email.',
    server: "couldn't send it. your text is still here; email works too.",
  },
}

export const footer = {
  line: (repo: string, rel: string) =>
    `© 2026 vasav p ramesh · built in kochi · last push: ${repo} ${rel}`,
}

export const misc = {
  notFound: 'nothing here. not even a random number.',
  notFoundBack: 'back to the index',
  tabAway: 'come back.',
  vimToast: "this isn't neovim.",
  reseedToast: 'reshuffled.',
  copiedToast: 'copied',
  loaderMeta: `${profile.monogram} / PORTFOLIO / 2026`,
  skip: 'skip',
  soundOn: 'sound on',
  soundOff: 'sound off',
  themeLight: 'paper',
  themeDark: 'oled',
}
