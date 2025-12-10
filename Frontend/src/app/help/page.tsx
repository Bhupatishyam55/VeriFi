'use client'

import React from 'react'
import { HelpCircle, Book, MessageCircle, FileText, ExternalLink, Mail, Phone, Clock } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-400/10 mb-4">
          <HelpCircle className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white">Help & Support</h1>
        <p className="text-navy-400 mt-2 max-w-lg mx-auto">
          Get help with using the AP FraudShield platform
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center hover:border-gold-400/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
            <Book className="w-6 h-6 text-gold-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Documentation</h3>
          <p className="text-sm text-navy-400 mb-4">
            Complete guide to using the platform
          </p>
          <span className="text-gold-400 text-sm font-medium">Read Docs →</span>
        </div>

        <div className="glass-card p-6 text-center hover:border-gold-400/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 mx-auto rounded-xl bg-success-500/10 flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-success-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Live Chat</h3>
          <p className="text-sm text-navy-400 mb-4">
            Talk to our support team
          </p>
          <span className="text-success-400 text-sm font-medium">Start Chat →</span>
        </div>

        <div className="glass-card p-6 text-center hover:border-gold-400/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-400/10 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">FAQs</h3>
          <p className="text-sm text-navy-400 mb-4">
            Frequently asked questions
          </p>
          <span className="text-blue-400 text-sm font-medium">View FAQs →</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              q: 'How does the AI fraud detection work?',
              a: 'Our AI system analyzes documents using multiple deep learning models trained on millions of verified documents. It checks for metadata anomalies, signature forgeries, duplicate patterns, and cross-references against our 70TB historical database.',
            },
            {
              q: 'What file formats are supported?',
              a: 'We support PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, and PNG files. PDFs are preferred for best analysis results.',
            },
            {
              q: 'How long does a scan take?',
              a: 'Most documents are analyzed within 3-5 seconds. Complex documents with multiple pages may take slightly longer.',
            },
            {
              q: 'What does the fraud score mean?',
              a: 'The fraud score ranges from 0-100. Scores below 30 are considered safe, 30-70 require manual review, and above 70 are flagged as critical risks.',
            },
            {
              q: 'Can I export the analysis reports?',
              a: 'Yes, you can export detailed PDF reports for any analyzed document from the Results page.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="group p-4 bg-navy-800/30 rounded-xl cursor-pointer"
            >
              <summary className="flex items-center justify-between font-medium text-white list-none">
                {faq.q}
                <span className="text-gold-400 group-open:rotate-180 transition-transform">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-navy-400 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Contact Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <p className="text-sm text-navy-400">Email Support</p>
              <p className="font-medium text-white">support@apfinance.gov.in</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-500/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-success-400" />
            </div>
            <div>
              <p className="text-sm text-navy-400">Helpline</p>
              <p className="font-medium text-white">1800-123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-navy-400">Working Hours</p>
              <p className="font-medium text-white">Mon-Sat, 9AM-6PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="glass-card p-6 border border-gold-400/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white mb-1">Need more help?</h3>
            <p className="text-sm text-navy-400">
              Our technical team is available to assist you with any issues.
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            Contact Us
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

