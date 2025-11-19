// Image watermarking utility using Sharp
// Use dynamic import for sharp since it's a CommonJS module
let sharp;

// Import sharp dynamically with error handling
import('sharp')
  .then((sharpModule) => {
    // Handle both default and named exports
    sharp = sharpModule.default || sharpModule;
    console.log('Sharp module loaded successfully');
  })
  .catch((error) => {
    console.error('Failed to load sharp module:', error);
    console.error('Sharp will not be available for image processing');
  });

// Function to add logo watermark to an image
export async function addLogoWatermarkToImage(imageBuffer, logoPath, options = {}) {
  try {
    // Check if sharp is available
    if (!sharp) {
      throw new Error('Sharp module not loaded - image processing unavailable');
    }
    
    // Default options
    const {
      position = 'bottom-right', // top-left, top-right, bottom-left, bottom-right, center
      margin = 20, // margin in pixels
      opacity = 0.7, // logo opacity (0-1)
      scale = 0.15 // logo scale relative to image size (0-1)
    } = options;
    
    // Load the main image
    const image = sharp(imageBuffer);
    const imageMetadata = await image.metadata();
    
    // Load the logo
    const logo = sharp(logoPath);
    const logoMetadata = await logo.metadata();
    
    // Calculate logo dimensions based on scale
    const logoWidth = Math.floor(imageMetadata.width * scale);
    const logoHeight = Math.floor(logoMetadata.height * (logoWidth / logoMetadata.width));
    
    // Resize logo
    const resizedLogo = await logo
      .resize(logoWidth, logoHeight)
      .png() // Ensure logo is in PNG format for transparency
      .toBuffer();
    
    // Calculate position
    let left, top;
    switch (position) {
      case 'top-left':
        left = margin;
        top = margin;
        break;
      case 'top-right':
        left = imageMetadata.width - logoWidth - margin;
        top = margin;
        break;
      case 'bottom-left':
        left = margin;
        top = imageMetadata.height - logoHeight - margin;
        break;
      case 'center':
        left = Math.floor((imageMetadata.width - logoWidth) / 2);
        top = Math.floor((imageMetadata.height - logoHeight) / 2);
        break;
      case 'bottom-right':
      default:
        left = imageMetadata.width - logoWidth - margin;
        top = imageMetadata.height - logoHeight - margin;
        break;
    }
    
    // Composite the logo onto the image
    const watermarkedImage = await image
      .composite([{
        input: resizedLogo,
        top: top,
        left: left,
        opacity: opacity
      }])
      .jpeg({ quality: 90 }) // Output as JPEG with good quality
      .toBuffer();
    
    return watermarkedImage;
  } catch (error) {
    console.error('Error adding logo watermark:', error);
    // Return original image if watermarking fails
    return imageBuffer;
  }
}

// Function to add text watermark to an image
export async function addTextWatermarkToImage(imageBuffer, text, options = {}) {
  try {
    // Check if sharp is available
    if (!sharp) {
      throw new Error('Sharp module not loaded - image processing unavailable');
    }
    
    // Default options
    const {
      position = 'bottom-right', // top-left, top-right, bottom-left, bottom-right, center
      margin = 20, // margin in pixels
      fontSize = 32, // font size
      color = 'rgba(255, 255, 255, 0.8)', // text color with opacity
      backgroundColor = 'rgba(0, 0, 0, 0.5)', // background color with opacity
      padding = 10 // padding around text
    } = options;
    
    // Load the main image
    const image = sharp(imageBuffer);
    const imageMetadata = await image.metadata();
    
    // Create SVG overlay for text
    const svgOverlay = `
      <svg width="${imageMetadata.width}" height="${imageMetadata.height}">
        <rect width="100%" height="100%" fill="none"/>
        <text 
          x="${position.includes('right') ? imageMetadata.width - margin : margin}" 
          y="${position.includes('bottom') ? imageMetadata.height - margin : margin + fontSize}" 
          font-family="Arial, sans-serif" 
          font-size="${fontSize}" 
          fill="${color}" 
          text-anchor="${position.includes('right') ? 'end' : 'start'}" 
          dominant-baseline="${position.includes('bottom') ? 'baseline' : 'hanging'}"
          style="paint-order: stroke; stroke: ${backgroundColor}; stroke-width: ${padding}; stroke-linejoin: round;">
          ${text}
        </text>
      </svg>
    `;
    
    // Composite the text onto the image
    const watermarkedImage = await image
      .composite([{
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }])
      .jpeg({ quality: 90 }) // Output as JPEG with good quality
      .toBuffer();
    
    return watermarkedImage;
  } catch (error) {
    console.error('Error adding text watermark:', error);
    // Return original image if watermarking fails
    return imageBuffer;
  }
}