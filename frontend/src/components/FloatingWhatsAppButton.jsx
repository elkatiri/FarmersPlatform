import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsAppButton = () => {
  const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || '+212651625941';
  const whatsappUrl = `https://wa.me/${(adminWhatsApp || '').replace(/[^\d]/g, '')}`;

  const handleClick = () => {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      <FaWhatsapp className="h-7 w-7" />
    </button>
  );
};

export default FloatingWhatsAppButton;
