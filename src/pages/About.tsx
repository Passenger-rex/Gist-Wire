import { Helmet } from "react-helmet-async";
import Logo from "../components/Logo";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Helmet>
        <title>About Us - GistWire</title>
        <meta name="description" content="Learn more about GistWire Media, our mission, and our dedicated team of journalists." />
      </Helmet>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tighter text-[#111111] mb-6">About GistWire</h1>
        <div className="w-24 h-1 bg-[#00a85a] mx-auto mb-8"></div>
        <p className="text-gray-600 font-medium max-w-3xl mx-auto text-lg leading-relaxed">
          At <span className="font-bold text-[#111111]">GistWire</span>, we are driven by a singular mission: to be the most trusted, unapologetically fast, and comprehensive source of news and entertainment. Whether it's a global market shift or the latest celebrity buzz, if it matters, you'll hear it here first.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="bg-gray-100 h-80 border-l-[8px] border-[#00a85a] flex flex-col items-center justify-center p-8 text-center object-cover overflow-hidden relative">
           <img src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Newsroom" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply" />
           <div className="relative z-10 text-white drop-shadow-lg">
             <Logo className="invert brightness-0" />
           </div>
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#111111] mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Founded with a passion for unfiltered storytelling, GistWire began as a small digital publication dedicated to cutting through the noise. Today, we stand as a premier digital media house, providing rigorous coverage across politics, business, entertainment, tech, and beyond.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe in power of information. Our team of dedicated editors and journalists work around the clock to bring you narratives that shape our world, honoring the truth and prioritizing our readers' need to stay informed.
          </p>
        </div>
      </div>
    </div>
  );
}
