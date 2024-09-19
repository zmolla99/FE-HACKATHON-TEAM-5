import React, { useState, useEffect, useRef } from 'react';
import './App.css'


const Timeline = () => {
  const [events, setEvents] = useState([]);
  const timelineRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: '00:00', title: '', description: '' });

  useEffect(() => {
    const fakeEvents = [
      { id: 1, time: '08:00', title: 'Breakfast', description: 'Nutrient capsule consumed' },
      { id: 2, time: '10:30', title: 'Work', description: 'Neural link established' },
      { id: 3, time: '13:00', title: 'Lunch', description: 'Synthetic protein intake' },
      { id: 4, time: '16:00', title: 'Exercise', description: 'Virtual reality fitness session' },
      { id: 5, time: '19:00', title: 'Dinner', description: 'Molecular gastronomy experience' },
    ];

    const timer = setTimeout(() => {
      setEvents(fakeEvents);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = 0; // Scroll to the beginning (earliest events)
    }
  }, [events]);

  const handleAddEvent = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = events.length + 1;
    const updatedEvents = [...events, { id: newId, ...newEvent }];
    const sortedEvents = updatedEvents.sort((a, b) => a.time.localeCompare(b.time));
    setEvents(sortedEvents);
    setNewEvent({ time: '00:00', title: '', description: '' });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  return (
    <div
      ref={timelineRef}
      style={{
        position: 'absolute',
        bottom: '50px',
        left: '250px',
        right: '50px',
        height: '200px',
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: 'rgba(0, 51, 102, 0.7)',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 20px rgba(0, 204, 255, 0.5)',
        opacity: 0,
        animation: 'fadeIn 1s ease-out 1s forwards',
      }}
    >
      {events.map((event, index) => (
        <div
          key={event.id}
          style={{
            display: 'inline-block',
            width: '200px',
            marginRight: '50px',
            verticalAlign: 'top',
            opacity: 0,
            animation: `fadeIn 0.5s ease-out ${index * 0.2 + 1}s forwards`,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: 'rgba(0, 204, 255, 0.2)',
              borderRadius: '10px',
              padding: '10px',
              boxShadow: '0 0 10px rgba(0, 204, 255, 0.3)',
              border: '1px solid rgba(0, 204, 255, 0.5)',
            }}
          >
            <div style={{ color: '#00ccff', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>{event.time}</div>
            <div style={{ color: '#e0f2fe', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>{event.title}</div>
            <div style={{ color: '#a5f3fc', fontSize: '12px' }}>{event.description}</div>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddEvent}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: '#00ccff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        +
      </button>
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
        }}>
          <form onSubmit={handleFormSubmit} style={{
            backgroundColor: '#003366',
            padding: '20px',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <select
              name="time"
              value={newEvent.time}
              onChange={handleInputChange}
              style={{ padding: '5px', borderRadius: '5px', border: 'none' }}
            >
              {generateTimeOptions()}
            </select>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Title"
              style={{ padding: '5px', borderRadius: '5px', border: 'none' }}
            />
            <input
              type="text"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Description"
              style={{ padding: '5px', borderRadius: '5px', border: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="submit" style={{
                backgroundColor: '#00ccff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}>
                Add Event
              </button>
              <button onClick={() => setShowForm(false)} style={{
                backgroundColor: '#ff0000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// FakeFaceScanner component
const FakeFaceScanner = ({ onLogin, onImageCaptured }) => {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [loadingModel, setLoadingModel] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasCamera(false);
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

  const startScan = () => {
    setLoadingModel(true);
    setScanning(true);

    // Capture image immediately
    captureImage();

    const animationDuration = 3000; // Animation duration in milliseconds
    const totalSteps = 100;
    let currentStep = 0;

    const animateLine = () => {
      if (currentStep >= totalSteps) {
        setScanning(false);
        setLoadingModel(false);
        onLogin();
      } else {
        const scale = Math.abs(Math.sin((currentStep / totalSteps) * Math.PI));
        setLineScale(scale);
        currentStep++;
        requestAnimationFrame(animateLine);
      }
    };

    animateLine();
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData); // Save captured image data
      onImageCaptured(imageData); // Notify parent that image has been captured
    }
  };

  const [lineScale, setLineScale] = useState(0);

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
      boxSizing: 'border-box',
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
        width: '100%',
        height: 'auto',
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '5px',
            backgroundColor: 'black',
          }}
        />
        {hasCamera && scanning && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scaleX(${lineScale})`,
            width: '100%',
            height: '4px',
            backgroundColor: 'green',
            transformOrigin: 'center',
            transition: 'transform 0.01s linear',
          }} />
        )}
        {hasCamera && scanning && (
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(0deg, rgba(0, 255, 0, 0.4) 0%, rgba(0, 255, 0, 0) 100%)',
            opacity: 0.6,
            pointerEvents: 'none',
            animation: 'scan 3s linear infinite',
          }} />
        )}
      </div>
      {hasCamera && !scanning && (
        <button
          onClick={startScan}
          style={{
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          Start Scan
        </button>
      )}
      {loadingModel && <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Simulating face scan...</div>}
      {!hasCamera && <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Unable to access camera</div>}
    </div>
  );
};

// App component
const App = () => {
  const [text, setText] = useState('');
  const [circles, setCircles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [position, setPosition] = useState(null); // State to store position
  const fullText = 'Your FirstUp Today!';

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
        size: 30 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 4,
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

  useEffect(() => {
    if (isLoggedIn) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [isLoggedIn]);

  const containerStyle = {
    backgroundColor: '#1e3a8a',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  };

  const textStyle = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#e0f2fe',
    fontSize: '70px',
    fontFamily: 'monospace',
    zIndex: 10,
    width: '60%'
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

  const frameStyle = {
    position: 'absolute',
    top: '50px',
    left: '50px',
    width: '150px',
    height: '170px',
    borderRadius: '10px',
    border: '5px solid #00ccff',
    boxShadow: '0 0 15px #00ccff, inset 0 0 15px #00ccff',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 200, // Ensure it is above other elements
    animation: 'pulse 2s infinite', // Apply the pulsating animation
  };

  // Add CSS keyframes for pulsating effect
  const pulseAnimation = `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 15px #00ccff, inset 0 0 15px #00ccff;
      }
      50% {
        box-shadow: 0 0 25px #00ccff, inset 0 0 25px #00ccff;
      }
      100% {
        box-shadow: 0 0 15px #00ccff, inset 0 0 15px #00ccff;
      }
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = pulseAnimation;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={containerStyle}>
      {!isLoggedIn && !isBooting && <FakeFaceScanner onLogin={handleLogin} onImageCaptured={setCapturedImage} />}
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
          <img
            src='/public/images/nucleus.png'
            style={{
              width: '200px',
              position: 'absolute',
              right: '50px',
              top: '50px',
              animation: 'spin 5s linear infinite',
            }}
          />
          <div style={textStyle}>{text}</div>
          <Timeline />
          {capturedImage && (
            <div style={frameStyle}>
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '5px',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                }}
              />
              {position && (
                <div style={{ backgroundColor: '#003366', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px', borderRadius: '10px' }}>
                  <div style={{ color: '#e0f2fe', fontSize: '20px', marginTop: '40px' }}>
                    PERSON #1286547
                  </div>
                  <div style={{ color: '#e0f2fe', fontSize: '10px', marginTop: '20px' }}>
                    Latitude {position.latitude.toFixed(6)}, Longitude {position.longitude.toFixed(6)}
                  </div>
                  <div style={{ color: '#e0f2fe', fontSize: '10px', marginTop: '20px' }}>
                    Age: 27
                  </div>
                  <div style={{ color: '#e0f2fe', fontSize: '10px', marginTop: '20px' }}>
                    Social Credit: +10000
                  </div>
                  <div style={{ color: '#e0f2fe', fontSize: '10px', marginTop: '20px' }}>
                    Risk: Low
                  </div>
                  <div style={{ color: '#e0f2fe', fontSize: '10px', marginTop: '20px' }}>
                    Time Remaining: 1927 days
                  </div>
                  <div style={{ color: '#e0f2fe', fontSize: '10px', marginTop: '20px' }}>
                    Blood Type: AB+
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default App
