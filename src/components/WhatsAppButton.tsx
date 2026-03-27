import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '@/data/products';

export default function WhatsAppButton() {
  return (
    
      href={`${WHATSAPP_LINK}?text=${encodeURIComponent('Hi HM Bangles! I have a question.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="white" color="white" />
    </a>
  );
}