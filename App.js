import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


export default function App() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [results, setResults] = useState(null);
  const [showGuide, setShowGuide] = useState(true);


  const calculateDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };


  const processImageForPose = async () => {
    try {
      const calibrationFactor = 55.8451228593;


      const leftShoulder = { x: 0.35, y: 0.3 };
      const rightShoulder = { x: 0.65, y: 0.3 };
      const leftHip = { x: 0.4, y: 0.6 };
      const rightHip = { x: 0.6, y: 0.6 };


      const shoulderDistance = calculateDistance(leftShoulder, rightShoulder);
      const hipDistance = calculateDistance(leftHip, rightHip);


      const shoulderInches = Math.round(shoulderDistance * calibrationFactor * 100) / 100;
      const ratio = shoulderDistance / hipDistance || 1;
      const hipInches = Math.round((shoulderInches / ratio) * 100) / 100;


      let tShirtSize = "Large";
      if (shoulderInches < 10) {
        tShirtSize = "Small";
      } else if (shoulderInches < 15.5) {
        tShirtSize = "Medium";
      } else if (shoulderInches < 18) {
        tShirtSize = "Large";
      }


      setResults({
        shoulderDistance: shoulderDistance.toFixed(4),
        hipDistance: hipDistance.toFixed(4),
        shoulderInches,
        hipInches,
        tShirtSize,
      });


    } catch (error) {
      Alert.alert("Error", "Failed to analyze measurements");
    }
  };


  const startCountdown = async () => {
    setIsCapturing(true);
    setShowGuide(false);
    
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setCountdown("Analyzing...");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await processImageForPose();
    
    setIsCapturing(false);
    setCountdown(0);
    setShowGuide(true);
  };


  const resetApp = () => {
    setResults(null);
    setShowGuide(true);
  };


  return (
    <View style={styles.container}>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Aerofit - T-Shirt Size Calculator
        </Text>
        <Text style={styles.subText}>
          Patent Pending Technology
        </Text>
      </View>


      <View style={styles.cameraArea}>
        {showGuide && (
          <View style={styles.guideOverlay}>
            <View style={styles.guideBox}>
              <Text style={styles.guideText}>Measurement Area</Text>
            </View>
          </View>
        )}
        
        {countdown > 0 && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}
        
        <Text style={styles.cameraPlaceholder}>
          Advanced Body Measurement Technology
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
        onPress={startCountdown}
        disabled={isCapturing}
      >
        <Text style={styles.captureButtonText}>
          {isCapturing ? 'Analyzing...' : 'Calculate My Size'}
        </Text>
      </TouchableOpacity>
      
      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Your Perfect Size:</Text>
          <Text style={styles.sizeResult}>
            {results.tShirtSize}
          </Text>
          <Text style={styles.measurementText}>
            Shoulder Width: {results.shoulderInches}"
          </Text>
          <Text style={styles.measurementText}>
            Hip Width: {results.hipInches}"
          </Text>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
            <Text style={styles.resetButtonText}>Calculate Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
  },
  instructionsContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subText: {
    color: '#00ff88',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  cameraArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    margin: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  cameraPlaceholder: {
    color: '#00ff88',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  guideOverlay: {
    position: 'absolute',
    top: '40%',
    left: '35%',
    width: '30%',
    height: '20%',
    borderWidth: 3,
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.1)',
  },
  guideBox: {
    position: 'absolute',
    top: -25,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  guideText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: 'bold',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  countdownText: {
    color: '#00ff88',
    fontSize: 72,
    fontWeight: 'bold',
  },
  captureButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  captureButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00ff88',
    alignItems: 'center',
  },
  resultsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sizeResult: {
    color: '#00ff88',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  measurementText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  resetButton: {
    backgroundColor: '#00ff88',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  resetButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



