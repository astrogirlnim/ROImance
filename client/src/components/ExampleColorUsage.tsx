import React from 'react';

/**
 * Example component showing how to use ROImance design tokens
 */
export default function ExampleColorUsage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--trust-blue)' }}>Color Usage Examples</h2>
      
      {/* CSS Variables Method */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>CSS Variables (Recommended)</h3>
        <div style={{ 
          backgroundColor: 'var(--flirt-surge)', 
          color: 'var(--flirt-surge-foreground)',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          💚 Flirt Surge - Early attraction rising!
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--heartline-red)', 
          color: 'var(--heartline-red-foreground)',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          ❤️ Heartline Red - Passion peak reached!
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--trust-blue)', 
          color: 'var(--trust-blue-foreground)',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          💙 Trust Blue - Stable long-term bond
        </div>
      </section>

      {/* Utility Classes Method */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Utility Classes</h3>
        <div className="bg-risky-gold text-black" style={{ 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          🟡 Risky Gold - Volatile emotions ahead!
        </div>
        
        <div className="bg-breakdown-burgundy text-white" style={{ 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          💔 Breakdown Burgundy - Emotional dip detected
        </div>
        
        <div className="bg-blush-rebound" style={{ 
          color: 'var(--blush-rebound-foreground)',
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          🌸 Blush Rebound - New hope emerging
        </div>
      </section>

      {/* Button Examples */}
      <section>
        <h3>Button Examples</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{
            backgroundColor: 'var(--button-buy-bg)',
            color: 'var(--button-buy-fg)',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            💚 Buy Shares
          </button>
          
          <button style={{
            backgroundColor: 'var(--button-sell-bg)',
            color: 'var(--button-sell-fg)',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            ❤️ Sell Position
          </button>
          
          <button style={{
            backgroundColor: 'var(--button-warning-bg)',
            color: 'var(--button-warning-fg)',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            🟡 Risky Trade
          </button>
          
          <button style={{
            backgroundColor: 'var(--button-recovery-bg)',
            color: 'var(--button-recovery-fg)',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            🩶 Recovery Mode
          </button>
        </div>
      </section>

      {/* Card Examples */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Card Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '2px solid var(--card-profit-border)',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <h4 style={{ color: 'var(--flirt-surge)', margin: '0 0 0.5rem 0' }}>
              Profit Alert 📈
            </h4>
            <p style={{ margin: 0, color: 'var(--card-fg)' }}>
              Your relationship stock is trending up!
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '2px solid var(--card-loss-border)',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <h4 style={{ color: 'var(--heartline-red)', margin: '0 0 0.5rem 0' }}>
              Loss Warning 📉
            </h4>
            <p style={{ margin: 0, color: 'var(--card-fg)' }}>
              Emotional volatility detected in your portfolio.
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '2px solid var(--card-volatile-border)',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <h4 style={{ color: 'var(--risky-gold)', margin: '0 0 0.5rem 0' }}>
              High Volatility ⚡
            </h4>
            <p style={{ margin: 0, color: 'var(--card-fg)' }}>
              Relationship experiencing rapid emotional swings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
