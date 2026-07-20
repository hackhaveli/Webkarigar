import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WebKarigar - Stop Pitching. Start Showing.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #080b14, #0f172a, #030712)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Glow ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '400px',
            height: '400px',
            background: 'rgba(139, 92, 246, 0.25)',
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 24px',
            borderRadius: '100px',
            fontSize: '18px',
            fontWeight: 700,
            color: '#c084fc',
            marginBottom: '30px',
          }}
        >
          🚀 WebKarigar SaaS Platform
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
            background: 'linear-gradient(to right, #ffffff, #e2e8f0, #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Stop Pitching. Start Showing.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Generate personalized website previews for business prospects before sending outreach to skyrocket cold reply rates.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
