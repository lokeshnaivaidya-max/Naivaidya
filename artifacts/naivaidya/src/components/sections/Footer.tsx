import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <img src={naivaidyaLogo} alt="NAIVAIDYA Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-2xl tracking-widest text-white">NAIVAIDYA</h3>
              <p className="text-primary text-sm tracking-widest uppercase">The Last Minute Saviour</p>
            </div>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm border-t border-white/5 pt-8">
          © {new Date().getFullYear()} NAIVAIDYA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
