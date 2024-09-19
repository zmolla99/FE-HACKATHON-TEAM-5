import React, { useState, useEffect, useRef } from 'react';
import * as handTrack from 'handtrackjs';

const HandScanner = ({ onLogin }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [model, setModel] = useState(null);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Access the camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          };
          setHasCamera(true);
          setDebugInfo(prev => prev + "\nCamera accessed successfully");
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasCamera(false);
        setDebugInfo(prev => prev + "\nError accessing camera: " + err.message);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Load the handtrack model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelParams = {
          flipHorizontal: false,
          outputStride: 16,
          imageScaleFactor: 1,
          maxNumBoxes: 20,
          iouThreshold: 0.2,
          scoreThreshold: 0.3,
          modelType: "ssd320fpnlite",
          modelSize: "large",
          bboxLineWidth: "2",
          fontSize: 17,
        };
        const loadedModel = await handTrack.load(modelParams);
        setModel(loadedModel);
        setDebugInfo(prev => prev + "\nHandtrack model loaded successfully");
      } catch (err) {
        console.error("Error loading handtrack model:", err);
        setDebugInfo(prev => prev + "\nError loading handtrack model: " + err.message);
      }
    };

    loadModel();
  }, []);

  // Detect hands and check if they are open
  useEffect(() => {
    let detectionInterval;
    const runDetection = async () => {
      if (model && videoRef.current && canvasRef.current) {
        try {
          const predictions = await model.detect(videoRef.current);
          setDebugInfo(prev => `${prev}\nPredictions: ${JSON.stringify(predictions)}`);

          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          let handDetected = false;
          predictions.forEach(prediction => {
            if (prediction.label === 'open') {
              const [x, y, width, height] = prediction.bbox;
              ctx.beginPath();
              ctx.rect(x, y, width, height);
              ctx.strokeStyle = '#00ff00';
              ctx.lineWidth = 2;
              ctx.stroke();

              // Assume hand is detected if the prediction is "open"
              handDetected = true;
            }
          });

          setIsHandDetected(handDetected);
          if (handDetected && !isHandDetected) {
            setTimeout(() => {
              onLogin();
            }, 1000);
          }
        } catch (err) {
          console.error("Error during detection:", err);
          setDebugInfo(prev => prev + "\nError during detection: " + err.message);
        }
      }
    };

    if (model && videoRef.current) {
      detectionInterval = setInterval(runDetection, 100);
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [model, onLogin, isHandDetected]);

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
      <h2 style={{
        color: '#0066cc',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
      }}>Hand Scanner</h2>
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
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      {!hasCamera && <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Unable to access camera</div>}
      <div style={{ color: '#00ccff', textAlign: 'center', marginTop: '10px' }}>
        {isHandDetected ? "Hand detected! Logging in..." : "Place your open hand in front of the camera"}
      </div>
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <pre>{debugInfo}</pre>
      </div>
    </div>
  );
};

// App component remains unchanged
const App = () => {
  const [text, setText] = useState('');
  const [circles, setCircles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const fullText = 'Good Morning...';

  const handleLogin = () => {
    console.log('Hand detected, logging in');
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
      {!isLoggedIn && !isBooting && <HandScanner onLogin={handleLogin} />}
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
