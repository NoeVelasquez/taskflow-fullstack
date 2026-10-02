import { useState, useEffect } from 'react';
import { healthApi } from '../../api/healthApi';
import { Wifi, WifiOff } from 'lucide-react';

export const ApiStatusBadge = () => {
  const [isOnline, setIsOnline] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    const result = await healthApi.check();
    setIsOnline(result.isOnline);
    setIsChecking(false);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // comprobar cada 30s
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) return null;

  return (
    <div
      title={isOnline ? 'Backend conectado (localhost:3000)' : 'Backend no detectado en localhost:3000'}
      onClick={checkStatus}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: isOnline ? '#ecfdf5' : '#fef2f2',
        color: isOnline ? '#059669' : '#dc2626',
        border: `1px solid ${isOnline ? '#a7f3d0' : '#fecaca'}`,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: isOnline ? '#10b981' : '#ef4444',
          boxShadow: isOnline ? '0 0 6px #10b981' : 'none',
        }}
      />
      {isOnline ? (
        <>
          <Wifi size={12} />
          <span>API Conectada</span>
        </>
      ) : (
        <>
          <WifiOff size={12} />
          <span>API Desconectada</span>
        </>
      )}
    </div>
  );
};
