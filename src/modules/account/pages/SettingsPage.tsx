import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui'

/** Account settings — language, currency and offline preferences. */
export function SettingsPage() {
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('ZAR')
  const [offline, setOffline] = useState(false)

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>Settings</h1>
      <div className="stack">
        <Card>
          <label>
            <span className="label">Language</span>
            <select className="select" value={language} onChange={(event) => setLanguage(event.currentTarget.value)}>
              <option value="en">English</option>
              <option value="af">Afrikaans</option>
              <option value="xh">isiXhosa</option>
            </select>
          </label>
        </Card>
        <Card>
          <label>
            <span className="label">Currency</span>
            <select className="select" value={currency} onChange={(event) => setCurrency(event.currentTarget.value)}>
              <option value="ZAR">South African Rand (R)</option>
              <option value="USD">US Dollar (US$)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </label>
        </Card>
        <Card className="row-between">
          <div>
            <span className="text-small bold">Offline downloads</span>
            <p className="text-faint text-xs">Save places and timelines for low-connectivity travel.</p>
          </div>
          <input type="checkbox" checked={offline} onChange={(event) => setOffline(event.currentTarget.checked)} aria-label="Enable offline downloads" />
        </Card>
        <Card className="row-between">
          <span className="text-small bold">Notification preferences</span>
          <Link to="/account/notifications" className="text-small text-accent">Manage</Link>
        </Card>
      </div>
      <p className="text-faint text-xs" style={{ marginTop: 12 }}>
        Preferences apply to this device while account-wide sync is being wired up.
      </p>
    </div>
  )
}
