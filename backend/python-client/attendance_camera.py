import cv2
import face_recognition
import requests
import os
import datetime
import logging
import argparse
import sys
import time
import numpy as np

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

class FaceAttendanceSystem:
    def __init__(self, known_faces_dir, api_endpoint):
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_faces_dir = known_faces_dir
        self.api_endpoint = api_endpoint
        self.attendance_marked = False
        self.load_known_faces()

    def load_known_faces(self):
        """Load and encode known faces from directory"""
        logger.info(f"Loading known faces from '{self.known_faces_dir}'...")

        if not os.path.isdir(self.known_faces_dir):
            logger.error(f"Known faces directory not found: {self.known_faces_dir}")
            return

        count = 0
        for filename in os.listdir(self.known_faces_dir):
            if filename.lower().endswith((".jpg", ".png", ".jpeg")):
                path = os.path.join(self.known_faces_dir, filename)
                try:
                    # Load image file
                    image = face_recognition.load_image_file(path)

                    # Find face encodings
                    encodings = face_recognition.face_encodings(image)

                    if not encodings:
                        logger.warning(f"No face found in {filename}, skipping.")
                        continue

                    # Use the first face encoding
                    self.known_face_encodings.append(encodings[0])

                    # Get name from filename (without extension)
                    name = os.path.splitext(filename)[0]
                    self.known_face_names.append(name)
                    count += 1

                except Exception as e:
                    logger.error(f"Error processing file {filename}: {e}")

        logger.info(f"Successfully loaded {count} known faces.")

    def mark_attendance(self, username):
        """Send attendance marking request to API"""
        try:
            now = datetime.datetime.now()
            payload = {
                "username": username,
                "timestamp": now.isoformat()
            }

            logger.info(f"Sending attendance for {username} to {self.api_endpoint}")
            response = requests.post(
                self.api_endpoint,
                json=payload,
                timeout=5
            )

            if response.status_code == 200:
                logger.info(f"Successfully marked attendance for {username}")
                self.attendance_marked = True
                return True
            else:
                logger.error(f"Failed to mark attendance. Status code: {response.status_code}, Response: {response.text}")
                return False

        except Exception as e:
            logger.error(f"Error marking attendance: {e}")
            return False

    def process_frame(self, frame):
        """Process a video frame for face recognition and attendance marking"""
        logger.debug(f"Processing frame at {datetime.datetime.now()}")
        
        if frame is None:
            logger.warning("Received empty frame. Retrying...")
            return frame  # Could also trigger retry logic here if desired

        if self.attendance_marked:
            return frame

        # Resize frame for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert BGR to RGB (face_recognition uses RGB)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Find faces and their encodings
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        # Check each face
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            # Compare with known faces
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=0.6)
            name = "Unknown"
            color = (0, 0, 255)  # Red for unknown

            # If a match was found
            if True in matches:
                best_match_index = matches.index(True)
                name = self.known_face_names[best_match_index]
                color = (0, 255, 0)  # Green for recognized

                # Mark attendance if not already marked
                if not self.attendance_marked:
                    if self.mark_attendance(name):
                        color = (0, 255, 255)  # Yellow for marked
                        logger.info("Recognition complete - Attendance marked")

            # Scale back face locations
            top = int(top * 4)
            right = int(right * 4)
            bottom = int(bottom * 4)
            left = int(left * 4)

            # Draw box around face
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)

            # Draw label
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, color, 1)

        return frame

def open_camera():
    video_capture = None
    attempts = 5
    while attempts > 0:
        # Use DirectShow backend on Windows
        video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if video_capture.isOpened():
            # Set camera properties to avoid conflicts
            video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            video_capture.set(cv2.CAP_PROP_FPS, 30)
            video_capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            time.sleep(2)  # Allow camera initialization
            return video_capture
        else:
            logger.error(f"Failed to open camera. Retries remaining: {attempts-1}")
            attempts -= 1
            time.sleep(1)
    return None

def main():
    parser = argparse.ArgumentParser(description='Face Recognition Attendance System')
    parser.add_argument('--known_faces_dir', required=True, help='Directory containing known face images')
    parser.add_argument('--api_endpoint', default='http://localhost:8080/api/mark', help='API endpoint for marking attendance')
    args = parser.parse_args()

    try:
        system = FaceAttendanceSystem(args.known_faces_dir, args.api_endpoint)
        video_capture = open_camera()
        if video_capture is None:
            logger.critical("Error: Could not open video source after multiple attempts")
            return

        logger.info("Camera opened successfully. Press 'q' to quit manually.")

        consecutive_errors = 0
        max_consecutive_errors = 5
        frame_counter = 0
        skip_frames = 3  # Process every 3rd frame

        while True:
            ret, frame = video_capture.read()
            if not ret:
                logger.error("Failed to capture frame")
                consecutive_errors += 1
                if consecutive_errors >= max_consecutive_errors:
                    logger.error("Too many errors. Reopening camera...")
                    video_capture.release()
                    video_capture = open_camera()
                    if not video_capture or not video_capture.isOpened():
                        logger.critical("Camera reinitialization failed. Exiting.")
                        break
                    consecutive_errors = 0
                time.sleep(0.5)
                continue
            else:
                consecutive_errors = 0  # Reset error counter

            # Process frame every 'skip_frames' frames
            if frame_counter % skip_frames == 0:
                processed_frame = system.process_frame(frame)
            else:
                processed_frame = frame  # Display current frame without processing

            # Display the resulting frame
            cv2.imshow('Face Recognition Attendance System', processed_frame)
            frame_counter += 1

            # Exit conditions
            if system.attendance_marked:
                logger.info("Attendance marked successfully. Exiting...")
                time.sleep(2)
                break

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()
        logger.info("System shutdown complete")

    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except Exception as e:
        logger.error(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
