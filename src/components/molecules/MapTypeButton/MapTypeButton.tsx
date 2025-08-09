import React from 'react';
import Button from '@/components/atoms/Button/Button';

interface MapTypeButtonProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
  className?: string;
}

const MapTypeButton: React.FC<MapTypeButtonProps> = ({ name, imageUrl, onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      style={styles.button}
      className={className}
    >
      <div style={styles.content}>
        <img src={imageUrl} alt={name} style={styles.image} />
        <span style={styles.name}>{name}</span>
      </div>
    </Button>
  );
};

const styles = {
  button: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column', // 明确设置为 'column' 类型
    alignItems: 'center' as 'center',
    padding: '1rem',
    borderRadius: 12,
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  } as React.CSSProperties, // 强制转换为 React.CSSProperties 类型
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  } as React.CSSProperties,
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover' as 'cover', // 明确设置为 'cover'
    borderRadius: '8px',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  name: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'black',
  } as React.CSSProperties,
};

export default MapTypeButton;
