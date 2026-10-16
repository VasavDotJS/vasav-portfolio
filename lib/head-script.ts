// Runs in <head> before first paint: theme (no flash), loader mode, motion prefs.
// Keep it tiny and dependency-free.
export const headScript = `(function(){try{
var d=document.documentElement,s=null;try{s=localStorage.getItem('theme')}catch(e){}
var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
var t=(s==='light'||s==='dark')?s:(dark?'dark':'light');
d.dataset.theme=t;d.style.colorScheme=t;
var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#000000':'#E8E5DF');
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=null;try{seen=sessionStorage.getItem('vpr-loaded')}catch(e){}
d.dataset.loader=rm?'calm':(seen?'short':'full');
d.classList.add('js');
}catch(e){}})();`
