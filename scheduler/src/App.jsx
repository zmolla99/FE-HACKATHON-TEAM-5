import React, { useState, useEffect, useRef } from 'react';

// FakeFaceScanner component to simulate face detection
const FakeFaceScanner = ({ onLogin }) => {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [loadingModel, setLoadingModel] = useState(false);

  useEffect(() => {
    const simulateFaceDetection = () => {
      setLoadingModel(true);
      setTimeout(() => {
        setLoadingModel(false);
        onLogin();
      }, 3000); // Simulate face detection delay of 3 seconds
    };

    simulateFaceDetection();
  }, [onLogin]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 20, 40, 0.8)',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 0 20px #0066cc',
      zIndex: 100,
      width: '400px',
      border: '1px solid #0066cc',
    }}>
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '10px',
        right: '10px',
        height: '20px',
        backgroundColor: '#0066cc',
        clipPath: 'polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)',
      }}></div>
      <h2 style={{
        color: '#0066cc',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
      }}>Face Scanner</h2>
      <div style={{
        position: 'relative',
        marginBottom: '20px',
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            borderRadius: '5px',
            backgroundColor: 'black',
          }}
        />
      </div>
      {loadingModel && <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Simulating face scan...</div>}
    </div>
  );
};

// App component
const App = () => {
  const [text, setText] = useState('');
  const [circles, setCircles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const fullText = 'Good Morning...';

  const handleLogin = () => {
    console.log('Face scan completed, logging in...');
    setIsBooting(true);
    setTimeout(() => {
      setIsBooting(false);
      setIsLoggedIn(true);
    }, 3000); // Simulate boot-up for 3 seconds
  };

  useEffect(() => {
    if (isLoggedIn) {
      let index = 0;
      const timer = setInterval(() => {
        setText(fullText.substring(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(timer);
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const createCircles = () => {
      return Array.from({ length: 20 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 20, // Size between 30 and 50
        speedX: (Math.random() - 0.5) * 4, // Speed between -2 and 2
        speedY: (Math.random() - 0.5) * 4,
      }));
    };

    const checkCollision = (circleA, circleB) => {
      const dx = circleA.x - circleB.x;
      const dy = circleA.y - circleB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (circleA.size / 2 + circleB.size / 2);
    };

    const resolveCollision = (circleA, circleB) => {
      const dx = circleA.x - circleB.x;
      const dy = circleA.y - circleB.y;
      const angle = Math.atan2(dy, dx);
      const speedA = Math.sqrt(circleA.speedX ** 2 + circleA.speedY ** 2);
      const speedB = Math.sqrt(circleB.speedX ** 2 + circleB.speedY ** 2);
      const directionA = Math.atan2(circleA.speedY, circleA.speedX);
      const directionB = Math.atan2(circleB.speedY, circleB.speedX);

      circleA.speedX = speedB * Math.cos(directionB - angle);
      circleA.speedY = speedB * Math.sin(directionB - angle);
      circleB.speedX = speedA * Math.cos(directionA - angle);
      circleB.speedY = speedA * Math.sin(directionA - angle);
    };

    setCircles(createCircles());

    const moveCircles = setInterval(() => {
      setCircles(prevCircles => {
        const newCircles = prevCircles.map(circle => {
          let newX = circle.x + circle.speedX;
          let newY = circle.y + circle.speedY;

          if (newX < 0 || newX > window.innerWidth - circle.size) {
            circle.speedX *= -1;
            newX = Math.max(0, Math.min(newX, window.innerWidth - circle.size));
          }
          if (newY < 0 || newY > window.innerHeight - circle.size) {
            circle.speedY *= -1;
            newY = Math.max(0, Math.min(newY, window.innerHeight - circle.size));
          }

          return { ...circle, x: newX, y: newY };
        });

        for (let i = 0; i < newCircles.length; i++) {
          for (let j = i + 1; j < newCircles.length; j++) {
            if (checkCollision(newCircles[i], newCircles[j])) {
              resolveCollision(newCircles[i], newCircles[j]);
            }
          }
        }

        return newCircles;
      });
    }, 30);

    return () => clearInterval(moveCircles);
  }, []);

  const containerStyle = {
    backgroundColor: '#1e3a8a',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  };

  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#e0f2fe',
    fontSize: '2vw',
    fontFamily: 'monospace',
    zIndex: 10,
  };

  const bootScreenStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    color: '#4299e1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontFamily: 'monospace',
    zIndex: 1000,
  };

  return (
    <div style={containerStyle}>
      {!isLoggedIn && !isBooting && <FakeFaceScanner onLogin={handleLogin} />}
      {isBooting && (
        <div style={bootScreenStyle}>
          <div>Initializing systems...</div>
          <div style={{ marginTop: '20px' }}>
            {[...Array(10)].map((_, i) => (
              <span key={i} style={{ opacity: Math.random() }}>■</span>
            ))}
          </div>
        </div>
      )}
      {isLoggedIn && (
        <>
          {circles.map((circle, index) => (
            <svg
              key={`circle-${index}`}
              width={circle.size}
              height={circle.size}
              style={{
                position: 'absolute',
                left: `${circle.x}px`,
                top: `${circle.y}px`,
                transition: 'transform 0.3s',
              }}
            >
              <circle
                cx={circle.size / 2}
                cy={circle.size / 2}
                r={circle.size / 2 - 1}
                stroke="#00ccff"
                strokeWidth="2"
                fill="#003366"
              />
            </svg>
          ))}
          <div style={textStyle}>{text}</div>
        </>
      )}
    </div>
  );
};

export default App;
