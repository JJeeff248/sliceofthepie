import os
import json
from PIL import Image
import cv2
import pytesseract

# Define the regions of interest (ROI) for text extraction front image
# title = (700, 50, 2800, 300)
# description = (750, 2150, 2800, 2550)
# times = (360, 2200, 700, 2320)
# image = (0, 325, 2830, 2150)

def extract_roi(text, roi):


def extract_text(image_path, front=False):
    """Extracts text from an image using Tesseract OCR."""
    # Load the image
    image = cv2.imread(image_path)

    if not front:
        # extract text from the back image
        text = pytesseract.image_to_string(image, lang='eng')
        return text
    
    # Define the regions of interest (ROI) for text extraction
    title = (700, 50, 2800, 300)
    description = (750, 2150, 2800, 2550)
    times = (360, 2200, 700, 2320)

    # Extract text from the regions of interest
    title_text = extract_roi(image, title)
    description_text = extract_roi(image, description)
    times_text = extract_roi(image, times)

    return {"title": title_text, "description": description_text, "times": times_text }

def save_image(image, output_path):
    """Saves an image to the specified output path."""
    cv2.imwrite(output_path, image)
    print(f"Image saved to '{output_path}'")


def detect_and_crop_edges(image):
    """Detects edges and returns a cropped image."""
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Detect edges using Canny
    edges = cv2.Canny(blurred, 50, 150)

    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Get the largest contour (assumed to be the recipe card)
    largest_contour = max(contours, key=cv2.contourArea)

    # draw a red rectangle around all the contours
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

    cv2.imwrite("contours.jpg", image)

    # Get the bounding rectangle of the contour
    x, y, w, h = cv2.boundingRect(largest_contour)

    # Crop the image using the bounding rectangle
    cropped_image = image[y:y + h, x:x + w]
    
    return cropped_image


def process_folder(folder_path):
    """Processes a folder containing front and back images, extracts text from red boxes in the front image."""
    image_paths = [os.path.join(folder_path, filename) for filename in os.listdir(folder_path)
                   if filename.lower().endswith(('.jpg'))]
    
    print(f"Processing folder '{folder_path}'...")

    front_image_path = [image_path for image_path in image_paths if "front" in image_path.split("\\")[-1].lower()][0]
    back_image_path = [image_path for image_path in image_paths if "back" in image_path.split("\\")[-1].lower()][0]

    if not front_image_path:
        print("Front image not found in folder.")
    elif not back_image_path:
        print("Back image not found in folder.")

    # Load the front image and detect edges
    front_image = cv2.imread(front_image_path)
    cropped_image = detect_and_crop_edges(front_image)

    # Save the cropped image
    cropped_image_path = os.path.join(folder_path, "cropped_front.jpg")
    save_image(cropped_image, cropped_image_path)

    # Extract text
    front_text = extract_text(front_image_path, True)
    back_text = extract_text(back_image_path)

    # Save extracted text to a JSON file
    output_path = os.path.join(folder_path, "extracted_text.json")
    with open(output_path, 'w') as f:
        json.dump({"front": front_text, "back": back_text}, f, indent=4)



# Ensure Tesseract path is set (if using a custom location)
# Replace with your Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Loop through folders in the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
for folder in os.listdir(script_dir):
    folder_path = os.path.join(script_dir, folder)
    if os.path.isdir(folder_path) and not folder.startswith('venv'):
        process_folder(folder_path)
