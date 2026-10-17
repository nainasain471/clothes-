const WHATSAPP_NUMBER = '917300456338'
const WHATSAPP_MESSAGE = 'Hi, I have a question about the ZELIA store.'

function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ZELIA on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8 fill-current sm:h-9 sm:w-9"
      >
        <path d="M16.04 3C8.87 3 3.04 8.82 3.04 15.99c0 2.29.6 4.53 1.74 6.51L3 29l6.67-1.75a13 13 0 0 0 6.37 1.62h.01c7.16 0 13-5.83 13-13 0-3.47-1.35-6.73-3.81-9.19A12.92 12.92 0 0 0 16.04 3Zm0 23.67h-.01c-1.94 0-3.84-.52-5.5-1.51l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.63 10.63 0 0 1-1.63-5.71C5.34 10.1 10.13 5.3 16.04 5.3c2.86 0 5.55 1.12 7.57 3.14a10.62 10.62 0 0 1 3.13 7.57c0 5.91-4.81 10.66-10.7 10.66Zm5.87-7.98c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.85-1.61-1.91-1.8-2.23-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.4-.26-.62-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.68 0 1.59 1.16 3.12 1.32 3.34.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.2 2.02.12.62-.1 1.9-.78 2.17-1.54.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </a>
  )
}

export default WhatsAppButton
