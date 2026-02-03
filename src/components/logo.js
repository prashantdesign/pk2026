// components/Logo.js
export default function Logo() {
  return (
    <div className="logo-icon">
      P.K.
      <style jsx>{`
        .logo-icon {
          width: 100px;
          height: 100px;
          background-color: black;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: white;
          font-family: Arial, sans-serif;
          font-weight: bold;
          text-shadow: 2px 2px 5px purple;
        }
      `}</style>
    </div>
  );
}