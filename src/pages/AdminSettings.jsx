import React, { useState, useEffect } from 'react';
import {
  Settings, Shield, Bell, Users, Database,
  CreditCard, Layout, Save,
  CheckCircle, XCircle, FileText
} from 'lucide-react';
import api from '../services/api';

const SettingToggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
    <div className="pr-4">
      <h4 className="text-sm font-medium text-slate-200">{label}</h4>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
  </div>
);

const SettingInput = ({ label, description, value, onChange, type = "text" }) => (
  <div className="py-4 border-b border-white/5 last:border-0">
    <div className="mb-2">
      <h4 className="text-sm font-medium text-slate-200">{label}</h4>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
    />
  </div>
);

const SectionHeader = ({ title, description }) => (
  <div className="mb-6 pb-4 border-b border-white/10">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <p className="text-sm text-slate-400 mt-1">{description}</p>
  </div>
);

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({});
  const [dirtyKeys, setDirtyKeys] = useState(new Set()); // Track changed settings
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Initial Fetch
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        // Ensure defaults for all expected keys if missing
        const defaults = {
          platform_name: 'Smart Notes',
          platform_description: 'The best place to share and find university notes.',
          support_email: 'support@smartnotes.com',
          auto_approval: false,
          allow_handwritten: true,
          max_upload_size: '50', // MB
          is_subscription_enabled: false,
          subscription_price_monthly: '15',
          enable_ads: true,
          default_role: 'student',
          allow_account_deletion: true,
          force_2fa_admin: true,
          smtp_host: 'smtp.example.com',
          enable_api_access: false,
        };
        // Convert string "true"/"false" to boolean for toggles if necessary,
        // but backend seems to return strings or mixed.
        // Let's normalize boolean keys logic in render if needed, or rely on == 'true'
        // For now, trusting res.data mixed with defaults.
        const merged = { ...defaults, ...res.data };

        // Normalization: specific keys that should be booleans
        const boolKeys = ['auto_approval', 'allow_handwritten', 'is_subscription_enabled', 'enable_ads', 'allow_account_deletion', 'force_2fa_admin', 'enable_api_access'];
        boolKeys.forEach(k => {
          if (merged[k] === 'true') merged[k] = true;
          if (merged[k] === 'false') merged[k] = false;
        });

        setSettings(merged);
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setDirtyKeys(prev => new Set(prev).add(key));
  };

  const handleSave = async () => {
    if (dirtyKeys.size === 0) return;
    setSaving(true);
    setMessage(null);

    try {
      // Iterate and save
      const promises = Array.from(dirtyKeys).map(key =>
        api.put('/admin/settings', {
          settingKey: key,
          settingValue: settings[key]
        })
      );

      await Promise.all(promises);

      setDirtyKeys(new Set());
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Save failed", err);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'general', label: 'General', icon: Layout },
    { id: 'content', label: 'Notes & Content', icon: FileText },
    { id: 'subscription', label: 'Subscriptions', icon: CreditCard },
    { id: 'users', label: 'User & Roles', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email & Notify', icon: Bell },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div>
            <SectionHeader title="General Settings" description="Basic application configuration and branding." />
            <SettingInput
              label="Platform Name"
              description="The name displayed in the browser title and emails."
              value={settings.platform_name}
              onChange={(val) => updateSetting('platform_name', val)}
            />
            <SettingInput
              label="Platform Description"
              description="Short tagline for SEO and meta tags."
              value={settings.platform_description}
              onChange={(val) => updateSetting('platform_description', val)}
            />
            <SettingInput
              label="Contact Email"
              description="Where users should send support queries."
              value={settings.support_email}
              onChange={(val) => updateSetting('support_email', val)}
            />
          </div>
        );
      case 'content':
        return (
          <div>
            <SectionHeader title="Content Settings" description="Manage how notes are uploaded and moderated." />
            <SettingToggle
              label="Auto-approve Notes"
              description="Automatically approve notes without manual review (Risk of spam)."
              checked={settings.auto_approval}
              onChange={(val) => updateSetting('auto_approval', val)}
            />
            <SettingToggle
              label="Allow Handwritten Notes"
              description="Allow users to upload scanned handwritten documents."
              checked={settings.allow_handwritten}
              onChange={(val) => updateSetting('allow_handwritten', val)}
            />
            <SettingInput
              label="Max Upload Size (MB)"
              description="Maximum allowed file size per note."
              type="number"
              value={settings.max_upload_size}
              onChange={(val) => updateSetting('max_upload_size', val)}
            />
          </div>
        );
      case 'subscription':
        return (
          <div>
            <SectionHeader title="Subscription & Payments" description="Monetization and checkout settings." />
            <SettingToggle
              label="Enable Subscriptions"
              description="Show upgrade options to users."
              checked={settings.is_subscription_enabled}
              onChange={(val) => updateSetting('is_subscription_enabled', val)}
            />
            <SettingInput
              label="Monthly Price ($)"
              description="Cost of the monthly pro plan."
              type="number"
              value={settings.subscription_price_monthly}
              onChange={(val) => updateSetting('subscription_price_monthly', val)}
            />
            <SettingToggle
              label="Show Ads for Free Users"
              description="Serve advertisements to non-subscribers."
              checked={settings.enable_ads}
              onChange={(val) => updateSetting('enable_ads', val)}
            />
          </div>
        );
      case 'users':
        return (
          <div>
            <SectionHeader title="User & Role Settings" description="Defaults and permissions for new accounts." />
            <SettingToggle
              label="Allow Account Deletion"
              description="Let users permanently delete their own accounts."
              checked={settings.allow_account_deletion}
              onChange={(val) => updateSetting('allow_account_deletion', val)}
            />
            <SettingToggle
              label="Require Email Verification"
              description="Users must verify email before logging in."
              checked={true} // Hardcoded for now or fetch
              onChange={() => { }}
            />
          </div>
        );
      case 'security':
        return (
          <div>
            <SectionHeader title="Security" description="Protect your platform and users." />
            <SettingToggle
              label="Force 2FA for Admins"
              description="Require two-factor authentication for all admin accounts."
              checked={settings.force_2fa_admin}
              onChange={(val) => updateSetting('force_2fa_admin', val)}
            />
            <SettingToggle
              label="Login Alerts"
              description="Email users when a new login is detected."
              checked={false}
              onChange={() => { }}
            />
          </div>
        );
      case 'email':
        return (
          <div>
            <SectionHeader title="Email & Notifications" description="Configure system emails and alerts." />
            <SettingToggle
              label="Enable System Emails"
              description="Allow the platform to send automated emails."
              checked={true} // Placeholder
              onChange={() => { }}
            />
            <SettingInput
              label="SMTP Host"
              description="Mail server hostname."
              value={settings.smtp_host}
              onChange={(val) => updateSetting('smtp_host', val)}
            />
            <SettingInput
              label="SMTP Port"
              description="e.g. 587 (TLS) or 465 (SSL)"
              value={settings.smtp_port}
              onChange={(val) => updateSetting('smtp_port', val)}
            />
            <SettingInput
              label="SMTP User"
              description="Username or Email"
              value={settings.smtp_user}
              onChange={(val) => updateSetting('smtp_user', val)}
            />
            <SettingInput
              label="SMTP Password"
              description="Password or App Password"
              type="password"
              value={settings.smtp_pass}
              onChange={(val) => updateSetting('smtp_pass', val)}
            />
            <div className="py-4">
              <h4 className="text-sm font-medium text-slate-200 mb-2">Email Templates</h4>
              <div className="grid grid-cols-2 gap-3">
                {['Welcome Email', 'Password Reset', 'Note Approved', 'Subscription Active'].map(t => (
                  <button key={t} className="px-3 py-2 text-xs text-slate-400 border border-slate-700 rounded hover:bg-white/5 hover:text-white text-left transition-colors">
                    Edit {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'advanced':
        return (
          <div>
            <SectionHeader title="Advanced Settings" description="Developer tools and API access." />
            <SettingToggle
              label="Enable API Access"
              description="Allow developers to generate API keys."
              checked={settings.enable_api_access}
              onChange={(val) => updateSetting('enable_api_access', val)}
            />
            <div className="py-4 border-b border-white/5">
              <h4 className="text-sm font-medium text-slate-200 mb-1">Clear Cache</h4>
              <p className="text-xs text-slate-500 mb-3">Clear server-side page and data caches.</p>
              <button className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded hover:text-white hover:bg-slate-700 transition-colors">
                Clear All Caches
              </button>
            </div>
          </div>
        );
      default:
        return <div className="text-slate-500">Select a category</div>;
    }
  };

  // Need to import FileText icon for mapping to work
  // Workaround: I'll just use inline switch or ensure imports map correctly.
  // Re-doing nav render to be safer.

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter flex flex-col md:flex-row max-w-6xl mx-auto md:pt-12 px-4 md:px-8 gap-8">

      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your platform workspace.</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  } ${item.danger ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[500px]">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              Loading settings...
            </div>
          ) : (
            <>
              {renderContent()}

              {/* Save Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex-1">
                  {message && (
                    <span className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'} animate-fade-in-up`}>
                      {message.text}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || dirtyKeys.size === 0}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg
                          ${dirtyKeys.size > 0
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

    </div>
  );
}