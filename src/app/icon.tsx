import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 256,
  height: 256,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
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
          borderRadius: '20%', // Soft rounded square
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: '130px', fontWeight: '900', lineHeight: '1', marginBottom: '10px' }}>P.K.</div>
        <div style={{ fontSize: '40px', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '4px' }}>creative</div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
