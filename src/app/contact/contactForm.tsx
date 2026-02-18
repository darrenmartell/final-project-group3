'use client';

import { useState } from 'react';

type ResultStatus = 'sending' | 'success' | 'error';

type ResultState = {
  status: ResultStatus;
  message: string;
} | null;

export default function ContactForm() {
  const [result, setResult] = useState<ResultState>(null);

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessKey?.trim()) {
      setResult({
        status: 'error',
        message:
          'Web3Forms is not configured. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to your .env file (get a key at https://web3forms.com).',
      });
      return;
    }

    setResult({ status: 'sending', message: 'Sending your message…' });

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', accessKey);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          status: 'success',
          message: 'Your message was sent successfully. We\'ll get back to you soon.',
        });
        form.reset();
      } else {
        setResult({
          status: 'error',
          message: data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setResult({
        status: 'error',
        message: 'A network error occurred. Please check your connection and try again.',
      });
    }
  };

  const closeModal = () => {
    if (result?.status !== 'sending') setResult(null);
  };

  const isSending = result?.status === 'sending';

  return (
    <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
      <h2 className="text-2xl font-bold mb-6">
        Send Us a Message
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            placeholder="Tell us about your project..."
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 hover:bg-primary/90 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {isSending ? 'Sending…' : 'Send Message'}
        </button>
      </form>

      {/* Result modal */}
      {result && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-modal-title"
          aria-describedby="result-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={result.status !== 'sending' ? closeModal : undefined}
        >
          <div
            className={`relative w-full max-w-md rounded-lg shadow-xl p-6 border ${
              result.status === 'success'
                ? 'bg-card border-green-500/50'
                : result.status === 'error'
                  ? 'bg-card border-red-500/50'
                  : 'bg-card border-border'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="result-modal-title"
              className={`text-lg font-semibold mb-2 ${
                result.status === 'success'
                  ? 'text-green-700 dark:text-green-400'
                  : result.status === 'error'
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-foreground'
              }`}
            >
              {result.status === 'sending'
                ? 'Sending'
                : result.status === 'success'
                  ? 'Message sent'
                  : 'Error'}
            </h3>
            <p id="result-modal-desc" className="text-muted-foreground mb-6">
              {result.message}
            </p>
            {result.status !== 'sending' && (
              <button
                type="button"
                onClick={closeModal}
                className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
