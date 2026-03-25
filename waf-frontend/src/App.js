import React, { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 🔥 Analyze request
  const analyzeRequest = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: input,
      });

      const data = await response.text();
      setResult(data);
      fetchLogs(); // refresh logs
    } catch (error) {
      console.error("Analysis failed:", error);
      setResult("Error: Could not connect to server");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🔥 Get logs
  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/logs");
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'blocked': return '#dc3545';
      case 'allowed': return '#28a745';
      case 'warning': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      'high': '#dc3545',
      'medium': '#ffc107',
      'low': '#28a745'
    };
    return colors[severity?.toLowerCase()] || '#6c757d';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🛡️</span>
            <span style={styles.logoText}>WAF Security System</span>
          </div>
          <div style={styles.statusIndicator}>
            <span style={styles.statusDot}></span>
            <span>Active Protection</span>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.analysisSection}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Request Analysis</h3>
            <div style={styles.inputGroup}>
              <textarea
                placeholder="Enter request payload to analyze..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={styles.textarea}
                rows="4"
              />
              <button 
                onClick={analyzeRequest} 
                style={isAnalyzing ? styles.buttonAnalyzing : styles.buttonAnalyze}
                disabled={isAnalyzing || !input.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <span style={styles.spinner}></span>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Request'
                )}
              </button>
            </div>
            
            {result && (
              <div style={styles.resultContainer}>
                <div style={styles.resultHeader}>
                  <span>Analysis Result</span>
                </div>
                <div style={result.includes('BLOCKED') ? styles.resultBlocked : styles.resultAllowed}>
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.logsSection}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              Security Logs
              <span style={styles.logCount}>{logs.length} entries</span>
            </h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Request</th>
                    <th style={styles.th}>Attack Type</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log.id} style={styles.tableRow}>
                      <td style={styles.td}>{log.id}</td>
                      <td style={styles.tdRequest}>{log.requestData}</td>
                      <td style={styles.td}>
                        <span style={styles.attackType}>{log.attackType || 'Normal'}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(log.status)
                        }}>
                          {log.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {log.severity && (
                          <span style={{
                            ...styles.severityBadge,
                            backgroundColor: getSeverityBadge(log.severity)
                          }}>
                            {log.severity}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && (
                <div style={styles.emptyState}>
                  No security events recorded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '28px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#28a745',
    fontWeight: 500,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#28a745',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  analysisSection: {
    marginBottom: '32px',
  },
  logsSection: {
    marginTop: '0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
    padding: '24px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    animation: 'fadeInUp 0.5s ease-out',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logCount: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
  },
  buttonAnalyze: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    alignSelf: 'flex-start',
  },
  buttonAnalyzing: {
    padding: '12px 24px',
    backgroundColor: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'not-allowed',
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #666',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
  },
  resultContainer: {
    marginTop: '20px',
    animation: 'slideDown 0.3s ease-out',
  },
  resultHeader: {
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
  },
  resultBlocked: {
    padding: '12px',
    backgroundColor: '#fff5f5',
    borderLeft: '3px solid #dc3545',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#dc3545',
  },
  resultAllowed: {
    padding: '12px',
    backgroundColor: '#f0f9f0',
    borderLeft: '3px solid #28a745',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#28a745',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  tableHeader: {
    borderBottom: '2px solid #e0e0e0',
    backgroundColor: '#fafafa',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    fontWeight: 600,
    color: '#666',
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '12px',
    color: '#333',
  },
  tdRequest: {
    padding: '12px',
    color: '#333',
    fontFamily: 'monospace',
    fontSize: '12px',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  attackType: {
    backgroundColor: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'white',
    display: 'inline-block',
  },
  severityBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'white',
    display: 'inline-block',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '14px',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }

  textarea:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  tr:hover {
    background-color: #fafafa;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

document.head.appendChild(styleSheet);

export default App;