const Footer = () => {
  return (
    <footer className="bg-white border-t-4 border-[#16a34a] mt-8">
      <div className="max-w-[1100px] mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Section Logo / Description */}
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-bold text-[#16a34a]">Agriculteurs & Travailleurs</h2>
          <p className="mt-2 text-sm text-gray-700">
            Connectez efficacement les agriculteurs et les travailleurs pour tous vos besoins agricoles.
          </p>
        </div>

        {/* Navigation rapide */}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase">Navigation</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            <li><a href="/" className="hover:text-[#16a34a]">Accueil</a></li>
            <li><a href="/request-worker" className="hover:text-[#16a34a]">Créer une demande</a></li>
            <li><a href="/worker-profile" className="hover:text-[#16a34a]">Travailleurs</a></li>
            <li><a href="/directory" className="hover:text-[#16a34a]">Annuaire</a></li>
            <li><a href="/faq" className="hover:text-[#16a34a]">FAQ</a></li>
            <li><a href="/contact" className="hover:text-[#16a34a]">Contact</a></li>
          </ul>
        </div>

        {/* Contact / Réseaux */}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase">Contact</h3>
          <p className="mt-2 text-sm text-gray-700">WhatsApp: +212 6X XXX XXXX</p>
          <p className="text-sm text-gray-700">Email: contact@farmersworkers.ma</p>
          <div className="mt-2 flex gap-3">
            <a href="#" className="text-[#16a34a] hover:text-[#facc15]">Facebook</a>
            <a href="#" className="text-[#16a34a] hover:text-[#facc15]">Instagram</a>
            <a href="#" className="text-[#16a34a] hover:text-[#facc15]">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-gray-200 mt-6">
        <div className="max-w-[1100px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-700">© 2026 Plateforme Agriculteurs & Travailleurs</p>
          <p className="text-sm font-semibold text-[#16a34a]">
            Connectez fermes et travailleurs <span className="text-[#facc15]">efficacement</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;