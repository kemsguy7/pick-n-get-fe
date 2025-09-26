import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PinataSDK } = require("pinata");
require("dotenv").config();

console.log("🔧 Initializing IPFS API with Pinata...");

// Validate environment variables
if (!process.env.IPFS_WRITE_JWT) {
  console.error("❌ Missing IPFS_WRITE_JWT environment variable");
  throw new Error("IPFS_WRITE_JWT is required");
}

if (!process.env.PUBLIC_GATEWAY_URL) {
  console.warn("⚠️  PUBLIC_GATEWAY_URL environment variable not set");
}

export const pinata = new PinataSDK({
  pinataJwt: process.env.IPFS_WRITE_JWT,
  pinataGateway: process.env.PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud"
});

/**
 * Test Pinata connection by making a simple API call
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const testPinataConnection = async () => {
  try {
    console.log("🔌 Testing Pinata connection...");
    
    // Use the userPinnedDataTotal endpoint which is lightweight
    const result = await pinata.data.userPinnedDataTotal();
    
    console.log("✅ Pinata connection test successful");
    console.log("📊 Pinata stats:", result);
    
    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error("❌ Pinata connection test failed:", error);
    
    let errorMessage = "Failed to connect to Pinata";
    
    if (error.response?.status === 401) {
      errorMessage = "Invalid Pinata JWT token";
    } else if (error.response?.status === 403) {
      errorMessage = "Pinata API key does not have required permissions";
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = "Network error - please check your internet connection";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Upload a file to IPFS using Pinata
 * @param {File} file - The file to upload
 * @param {string} fileName - Optional custom filename
 * @returns {Promise<{success: boolean, cid?: string, url?: string, error?: string}>}
 */
export const uploadToIPFS = async (file, fileName = null) => {
  console.log("📤 Starting IPFS upload...");
  console.log("📄 File details:", {
    name: file?.name,
    size: file?.size,
    type: file?.type,
    customFileName: fileName
  });

  if (!file) {
    console.error("❌ No file provided for upload");
    return {
      success: false,
      error: "No file selected"
    };
  }

  // Test connection first
  const connectionTest = await testPinataConnection();
  if (!connectionTest.success) {
    return {
      success: false,
      error: `Pinata connection failed: ${connectionTest.error}`
    };
  }

  try {
    console.log("🔄 Uploading file to Pinata...");
    
    // Create upload options
    const uploadOptions = {
      metadata: {
        name: fileName || file.name || 'uploaded-file',
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          fileSize: file.size.toString(),
          contentType: file.type
        }
      }
    };

    console.log("📋 Upload options:", uploadOptions);

    // Upload file to Pinata
    const upload = await pinata.upload.file(file, uploadOptions);
    
    console.log("✅ Upload successful!");
    console.log("📊 Upload result:", {
      cid: upload.cid,
      size: upload.size,
      timestamp: upload.timestamp
    });

    // Generate the public URL
    const publicUrl = `${process.env.PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud'}/ipfs/${upload.cid}`;
    
    console.log("🌐 Public URL generated:", publicUrl);

    return {
      success: true,
      cid: upload.cid,
      url: publicUrl,
      metadata: {
        name: uploadOptions.metadata.name,
        size: upload.size,
        timestamp: upload.timestamp
      }
    };

  } catch (error) {
    console.error("❌ IPFS upload failed:", error);
    
    let errorMessage = "Failed to upload file to IPFS";
    
    if (error.response?.status === 401) {
      errorMessage = "Invalid Pinata JWT token";
    } else if (error.response?.status === 413) {
      errorMessage = "File size exceeds Pinata limit";
    } else if (error.message?.includes("File too large")) {
      errorMessage = "File size exceeds limit (max 10MB recommended)";
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = "Network error - please check your connection";
    } else {
      errorMessage = error.message || "Upload failed";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Upload multiple files to IPFS
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<{success: boolean, uploads?: Array, errors?: Array}>}
 */
export const uploadMultipleToIPFS = async (files) => {
  console.log(`📤 Starting bulk upload of ${files.length} files...`);
  
  if (!files || files.length === 0) {
    console.error("❌ No files provided for bulk upload");
    return {
      success: false,
      error: "No files provided"
    };
  }

  // Test connection first
  const connectionTest = await testPinataConnection();
  if (!connectionTest.success) {
    return {
      success: false,
      error: `Pinata connection failed: ${connectionTest.error}`,
      uploads: [],
      errors: files.map((file, index) => ({
        index,
        fileName: file.name,
        error: `Connection failed: ${connectionTest.error}`
      }))
    };
  }

  const uploads = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`🔄 Uploading file ${i + 1}/${files.length}: ${file.name}`);
    
    const result = await uploadToIPFS(file);
    
    if (result.success) {
      uploads.push({
        index: i,
        fileName: file.name,
        cid: result.cid,
        url: result.url,
        metadata: result.metadata
      });
      console.log(`✅ File ${i + 1} uploaded successfully`);
    } else {
      errors.push({
        index: i,
        fileName: file.name,
        error: result.error
      });
      console.error(`❌ File ${i + 1} upload failed:`, result.error);
    }
  }

  console.log(`📊 Bulk upload complete: ${uploads.length} successful, ${errors.length} failed`);

  return {
    success: errors.length === 0,
    uploads,
    errors: errors.length > 0 ? errors : undefined,
    summary: {
      total: files.length,
      successful: uploads.length,
      failed: errors.length
    }
  };
};

/**
 * Fetch file content from IPFS using CID
 * @param {string} cid - The IPFS content identifier
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const fetchFromIPFS = async (cid) => {
  console.log("📥 Fetching file from IPFS...");
  console.log("🔗 CID:", cid);

  if (!cid || cid.trim().length === 0) {
    console.error("❌ No CID provided");
    return {
      success: false,
      error: "No CID provided"
    };
  }

  try {
    // Generate the public URL directly
    const fileUrl = `${process.env.PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud'}/ipfs/${cid}`;
    
    console.log("✅ File URL generated successfully");
    console.log("🌐 URL:", fileUrl);

    // Optional: Test if the file is accessible
    const response = await fetch(fileUrl, { method: 'HEAD' });
    if (!response.ok) {
      console.warn("⚠️  File may not be accessible yet (pinning in progress)");
    }

    return {
      success: true,
      url: fileUrl,
      cid: cid
    };

  } catch (error) {
    console.error("❌ Failed to fetch from IPFS:", error);

    let errorMessage = "Failed to fetch file from IPFS";
    
    if (error.message) {
      if (error.message.includes("Invalid CID")) {
        errorMessage = "Invalid IPFS content identifier";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Get file metadata from Pinata
 * @param {string} cid - The IPFS content identifier
 * @returns {Promise<{success: boolean, metadata?: object, error?: string}>}
 */
export const getFileMetadata = async (cid) => {
  console.log("📊 Getting file metadata...");
  console.log("🔗 CID:", cid);

  if (!cid || cid.trim().length === 0) {
    console.error("❌ No CID provided");
    return {
      success: false,
      error: "No CID provided"
    };
  }

  try {
    console.log("🔄 Fetching metadata from Pinata...");
    
    // Get pinned data list and filter by CID
    const pinnedData = await pinata.data.pinList({
      metadata: {
        name: cid,
      },
      status: 'pinned'
    });

    if (pinnedData.rows && pinnedData.rows.length > 0) {
      const fileData = pinnedData.rows.find(row => row.ipfs_pin_hash === cid);
      
      if (fileData) {
        console.log("✅ Metadata retrieved successfully");
        console.log("📋 Metadata:", fileData);

        return {
          success: true,
          metadata: {
            cid: fileData.ipfs_pin_hash,
            name: fileData.metadata?.name,
            size: fileData.size,
            timestamp: fileData.date_pinned,
            keyvalues: fileData.metadata?.keyvalues
          }
        };
      }
    }

    console.warn("⚠️ No metadata found for CID");
    return {
      success: false,
      error: "No metadata found for this CID"
    };

  } catch (error) {
    console.error("❌ Failed to get metadata:", error);
    
    return {
      success: false,
      error: error.message || "Failed to retrieve file metadata"
    };
  }
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {object} options - Validation options
 * @returns {Promise<{isValid: boolean, errors?: string[]}>}
 */
export const validateFile = async (file, options = {}) => {
  console.log("🔍 Validating file...");
  console.log("📄 File:", file?.name);
  console.log("⚙️ Options:", options);

  const errors = [];
  
  // Default validation options
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    requiredExtensions = ['jpg', 'jpeg', 'png', 'pdf']
  } = options;

  if (!file) {
    errors.push("No file provided");
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    errors.push(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds limit (${maxSizeMB}MB)`);
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  // Check file extension if required
  if (requiredExtensions && requiredExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !requiredExtensions.includes(fileExtension)) {
      errors.push(`File extension not allowed. Allowed: ${requiredExtensions.join(', ')}`);
    }
  }

  console.log(`✅ File validation ${errors.length === 0 ? 'passed' : 'failed'}:`, {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  });

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

export default {
  uploadToIPFS,
  uploadMultipleToIPFS,
  fetchFromIPFS,
  getFileMetadata,
  validateFile,
  testPinataConnection
};