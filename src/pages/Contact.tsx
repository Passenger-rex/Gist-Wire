import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tighter text-[#111111] mb-4">Contact Us</h1>
        <div className="w-24 h-1 bg-[#00a85a] mx-auto mb-6"></div>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto">
          Have a breaking story, feedback, or want to partner with GistWire? 
          Get in touch with our team using the form below or reach out directly through our contact channels.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-[#00a85a] shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-1 text-[#111111]">Email Us</h3>
              <p className="text-sm text-gray-500 font-medium">news@gistwire.com</p>
              <p className="text-sm text-gray-500 font-medium">tips@gistwire.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-[#00a85a] shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-1 text-[#111111]">Call Us</h3>
              <p className="text-sm text-gray-500 font-medium">+234 (0) 800 GIST WIRE</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Mon-Fri 9am - 6pm</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-[#00a85a] shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-1 text-[#111111]">Headquarters</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                GistWire Media Building,<br />
                Victoria Island,<br />
                Lagos, Nigeria.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {submitted ? (
             <div className="bg-[#00a85a]/10 border-l-[4px] border-[#00a85a] p-6 mb-8">
                <h3 className="font-bold text-[#00a85a] uppercase tracking-widest text-sm mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-700 text-sm font-medium">Thank you for reaching out to GistWire. Our team will review your submission and get back to you shortly if necessary.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-[#111111] mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border-2 border-gray-200 p-3 outline-none focus:border-[#00a85a] transition bg-gray-50 focus:bg-white text-sm font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-[#111111] mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border-2 border-gray-200 p-3 outline-none focus:border-[#00a85a] transition bg-gray-50 focus:bg-white text-sm font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-bold text-xs uppercase tracking-widest text-[#111111] mb-2">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full border-2 border-gray-200 p-3 outline-none focus:border-[#00a85a] transition bg-gray-50 focus:bg-white text-sm font-medium"
                  placeholder="News Tip / Advertising / Feedback"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-widest text-[#111111] mb-2">Message *</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border-2 border-gray-200 p-4 outline-none focus:border-[#00a85a] transition bg-gray-50 focus:bg-white text-sm font-medium h-48 resize-y"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button type="submit" className="bg-[#111111] text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-[#00a85a] transition">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
