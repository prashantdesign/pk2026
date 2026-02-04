import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180, // Standard size for apple-touch-icon
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '0%', // iOS handles rounding
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: '90px', fontWeight: '900', lineHeight: '1', marginBottom: '8px' }}>P.K.</div>
        <div style={{ fontSize: '28px', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '3px' }}>creative</div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
