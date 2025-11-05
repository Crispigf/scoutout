import React, { useState } from 'react';
import './Help.css';

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'features' | 'troubleshooting' | 'faq'>('getting-started');

  return (
    <div className="help-container">
      <div className="help-header">
        <h2>❓ Help & Tutorial</h2>
        <p className="help-subtitle">Learn how to use ScoutOut IDS effectively</p>
      </div>

      <div className="help-tabs">
        <button
          className={`help-tab ${activeTab === 'getting-started' ? 'active' : ''}`}
          onClick={() => setActiveTab('getting-started')}
        >
          🚀 Getting Started
        </button>
        <button
          className={`help-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          ✨ Features
        </button>
        <button
          className={`help-tab ${activeTab === 'troubleshooting' ? 'active' : ''}`}
          onClick={() => setActiveTab('troubleshooting')}
        >
          🔧 Troubleshooting
        </button>
        <button
          className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          💬 FAQ
        </button>
      </div>

      <div className="help-content">
        {activeTab === 'getting-started' && (
          <div className="help-section">
            <h3>🚀 Getting Started with ScoutOut IDS</h3>
            
            <div className="tutorial-card">
              <h4>Step 1: Understanding the Dashboard</h4>
              <p>
                The <strong>Home</strong> page displays an overview of your network security status:
              </p>
              <ul>
                <li>Active devices on your network</li>
                <li>Critical and active threats</li>
                <li>Overall network health metrics</li>
                <li>Recently active devices and top threats</li>
              </ul>
            </div>

            <div className="tutorial-card">
              <h4>Step 2: Monitoring Devices</h4>
              <p>
                Navigate to the <strong>Devices</strong> page to see all devices on your network:
              </p>
              <ul>
                <li>View each device's IP address and threat level</li>
                <li>Click on any device for detailed information</li>
                <li>Monitor packet counts and risk scores</li>
                <li>Check VirusTotal reputation data</li>
              </ul>
            </div>

            <div className="tutorial-card">
              <h4>Step 3: Reviewing Threats</h4>
              <p>
                The <strong>Threats</strong> page shows all detected security events:
              </p>
              <ul>
                <li>Threats are color-coded by severity (Critical, High, Medium, Low)</li>
                <li>Each alert includes source/destination IPs and protocols</li>
                <li>View threat descriptions and recommended actions</li>
              </ul>
            </div>

            <div className="tutorial-card">
              <h4>Step 4: Analyzing Traffic</h4>
              <p>
                Use the <strong>Network Traffic</strong> page to inspect packet data:
              </p>
              <ul>
                <li>View detailed packet information</li>
                <li>Filter by protocol, source, or destination</li>
                <li>Click packets to see full details and threat analysis</li>
              </ul>
            </div>

            <div className="tutorial-card">
              <h4>Step 5: Setting Up Parental Controls</h4>
              <p>
                Configure content filtering in the <strong>Parental Controls</strong> section:
              </p>
              <ul>
                <li>Block specific websites by URL</li>
                <li>Set content filter levels (Strict, Medium, Light)</li>
                <li>Configure time-based restrictions</li>
                <li>Use quick actions for common blocking scenarios</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="help-section">
            <h3>✨ Key Features</h3>

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <div className="feature-content">
                <h4>Real-time Threat Detection</h4>
                <p>
                  Advanced detection engine identifies various threats including SQL injection,
                  XSS attacks, port scanning, and suspicious traffic patterns.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <div className="feature-content">
                <h4>VirusTotal Integration</h4>
                <p>
                  Automatic IP reputation checking against VirusTotal's threat database
                  for enhanced security intelligence.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🖥️</div>
              <div className="feature-content">
                <h4>Device Tracking</h4>
                <p>
                  Comprehensive device inventory with threat profiling, activity history,
                  and risk assessment for every device on your network.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <div className="feature-content">
                <h4>Analytics & Visualization</h4>
                <p>
                  Interactive dashboards with charts showing protocol distribution,
                  threat timelines, and security metrics.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <div className="feature-content">
                <h4>Parental Controls</h4>
                <p>
                  Comprehensive website blocking, content filtering, and time-based
                  restrictions to protect your family online.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <div className="feature-content">
                <h4>Customizable Settings</h4>
                <p>
                  Configure detection thresholds, alert notifications, API keys,
                  and system preferences to match your needs.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'troubleshooting' && (
          <div className="help-section">
            <h3>🔧 Troubleshooting</h3>

            <div className="troubleshooting-card">
              <h4>System Offline / Connection Error</h4>
              <div className="problem">Problem:</div>
              <p>The dashboard shows "System Offline" or you see connection errors.</p>
              <div className="solution">Solution:</div>
              <ol>
                <li>Check if the backend server is running</li>
                <li>Verify the server is accessible at <code>http://localhost:5000</code></li>
                <li>Check your firewall settings</li>
                <li>Restart both frontend and backend services</li>
              </ol>
            </div>

            <div className="troubleshooting-card">
              <h4>No Devices Detected</h4>
              <div className="problem">Problem:</div>
              <p>The devices page is empty or not showing expected devices.</p>
              <div className="solution">Solution:</div>
              <ol>
                <li>Ensure packet capture is active</li>
                <li>Check network interface configuration in Settings</li>
                <li>Verify devices are actively communicating on the network</li>
                <li>Click the refresh button to update data</li>
              </ol>
            </div>

            <div className="troubleshooting-card">
              <h4>VirusTotal Data Not Loading</h4>
              <div className="problem">Problem:</div>
              <p>Device details don't show VirusTotal reputation data.</p>
              <div className="solution">Solution:</div>
              <ol>
                <li>Configure your VirusTotal API key in Settings</li>
                <li>Verify your API key is valid</li>
                <li>Check your internet connection</li>
                <li>Be aware of API rate limits (4 requests/minute for free tier)</li>
              </ol>
            </div>

            <div className="troubleshooting-card">
              <h4>Performance Issues</h4>
              <div className="problem">Problem:</div>
              <p>The application is slow or unresponsive.</p>
              <div className="solution">Solution:</div>
              <ol>
                <li>Reduce the packet display limit in Settings</li>
                <li>Increase auto-refresh interval</li>
                <li>Clear old log data</li>
                <li>Check system resources (CPU, memory)</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="help-section">
            <h3>💬 Frequently Asked Questions</h3>

            <div className="faq-item">
              <h4>What is ScoutOut IDS?</h4>
              <p>
                ScoutOut IDS is an Intrusion Detection System that monitors network traffic,
                detects security threats, tracks devices, and provides comprehensive network
                security analytics.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do I need a VirusTotal API key?</h4>
              <p>
                No, it's optional. The system works without it but with reduced threat intelligence.
                A free API key from VirusTotal enhances device reputation checks.
              </p>
            </div>

            <div className="faq-item">
              <h4>What types of threats can ScoutOut detect?</h4>
              <p>
                ScoutOut detects SQL injection, XSS attacks, command injection, path traversal,
                port scanning, unusual packet sizes, insecure protocols (FTP, Telnet), and more.
              </p>
            </div>

            <div className="faq-item">
              <h4>How often is the data refreshed?</h4>
              <p>
                By default, data auto-refreshes every 30 seconds. You can adjust this in Settings
                or manually refresh using the refresh button in the header.
              </p>
            </div>

            <div className="faq-item">
              <h4>Can I block threats automatically?</h4>
              <p>
                Yes, enable "Auto-block Critical Threats" in Settings to automatically block
                IP addresses that generate critical-level threats.
              </p>
            </div>

            <div className="faq-item">
              <h4>How do I export data or reports?</h4>
              <p>
                Currently, you can use your browser's print function to save analytics and reports.
                Dedicated export features are planned for future releases.
              </p>
            </div>

            <div className="faq-item">
              <h4>Is my network data stored securely?</h4>
              <p>
                All data is stored locally in memory. For production use, we recommend implementing
                a secure database backend and following security best practices.
              </p>
            </div>

            <div className="faq-item">
              <h4>How can I contribute or report issues?</h4>
              <p>
                Visit our GitHub repository to report issues, request features, or contribute
                to the project. We welcome community contributions!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="help-footer">
        <h3>📚 Additional Resources</h3>
        <div className="resource-links">
          <a href="https://github.com/unitnikolai/scoutout" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="link-icon">📖</span>
            <span>View on GitHub</span>
          </a>
          <a href="https://www.virustotal.com" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="link-icon">🔑</span>
            <span>Get VirusTotal API Key</span>
          </a>
          <a href="https://github.com/unitnikolai/scoutout/discussions" target="_blank" rel="noopener noreferrer" className="resource-link">
            <span className="link-icon">💬</span>
            <span>Community Forum</span>
          </a>
          <a href="mailto:support@scoutout.dev" className="resource-link">
            <span className="link-icon">📧</span>
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
