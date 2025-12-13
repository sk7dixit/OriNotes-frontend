import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-400">
              Your trust is our priority. Here is how we protect your data.
            </p>
            <p className="mt-4 text-slate-500">Last updated: December 2025</p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Eye size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">1. Information We Collect</h2>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-4">
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Account Info:</strong> Name, Email, Age, Mobile Number (for registration).</li>
                  <li><strong>Usage Data:</strong> Activity logs, login times, and device info to improve security and experience.</li>
                  <li><strong>Content:</strong> Notes and metadata you upload.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">2. How We Use & Protect Your Information</h2>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-4">
                <p>We are committed to transparency in how we use your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>To provide, operate, and maintain our website.</li>
                  <li>To improve, personalize, and expand our website.</li>
                  <li>To communicate with you regarding updates or support.</li>
                </ul>

                <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 flex gap-4 items-start">
                  <Lock className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-white mb-1">Security First</h4>
                    <p className="text-sm">We employ industry-standard encryption for data in transit and at rest. Your notes specifically are stored securely to protect your intellectual property.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <UserCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">3. Your Rights & Control</h2>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-4">
                <p>You have full control over your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Access & Edit:</strong> You can view and update your profile information at any time.</li>
                  <li><strong>Delete:</strong> You can request the deletion of your account and associated data by contacting support.</li>
                  <li><strong>Opt-Out:</strong> You can opt-out of marketing communications.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-100 mb-6">4. Third-Party Services</h2>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-slate-300">
                <p>We may use third-party services for specific functions (e.g., payment processing). We do not sell your personal data to advertisers. We ensure our partners adhere to strict privacy standards.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-100 mb-6">5. Consent</h2>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-slate-300">
                <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;