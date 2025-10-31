'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AppLayout from '../../components/layout/AppLayout';
import { useWalletInterface } from '../../services/wallets/useWalletInterface';
import { WalletInterface } from '../../services/wallets/walletInterface';
import { addProduct, ProductData } from '../../services/productService';
import { uploadToHedera, validateFile } from '../../apis/hederaApi';
import { ArrowLeft, Check, Loader2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  weight: string;
  quantity: string;
  image: File | null;
}

interface UploadProgress {
  uploading: boolean;
  progress: number;
  fileId?: string;
  error?: string;
}

const createWalletData = (
  accountId: string,
  walletInterface: WalletInterface | null,
  network: string = 'testnet',
): [string, WalletInterface | null, string] => {
  return [accountId, walletInterface, network];
};

export default function AddProductPage() {
  const router = useRouter();
  const { accountId, walletInterface } = useWalletInterface();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: '',
    weight: '',
    quantity: '',
    image: null,
  });

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    uploading: false,
    progress: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isConnected = !!(accountId && walletInterface);

  // Product categories
  const categories = [
    'Bags & Accessories',
    'Furniture',
    'Office Supplies',
    'Fitness & Wellness',
    'Home & Garden',
    'Textiles',
    'Electronics',
    'Others',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file: File | null) => {
    console.log(`📁 Image upload initiated:`, file?.name);

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null }));
      setUploadProgress({ uploading: false, progress: 0 });
      return;
    }

    // Validate file
    const validation = await validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    });

    if (!validation.isValid) {
      console.error(`❌ File validation failed:`, validation.errors);
      setUploadProgress({
        uploading: false,
        progress: 0,
        error: validation.errors?.[0] || 'File validation failed',
      });
      return;
    }

    // Start upload
    setFormData((prev) => ({ ...prev, image: file }));
    setUploadProgress({ uploading: true, progress: 10 });

    try {
      console.log(`🚀 Starting Hedera File Service upload...`);

      const uploadResult = await uploadToHedera(file, (progress) => {
        setUploadProgress((prev) => ({
          ...prev,
          uploading: true,
          progress: progress,
        }));
      });

      if (uploadResult.success) {
        console.log(`✅ Hedera upload successful:`, uploadResult.fileId);
        setUploadProgress({
          uploading: false,
          progress: 100,
          fileId: uploadResult.fileId,
        });
      } else {
        console.error(`❌ Hedera upload failed:`, uploadResult.error);
        setUploadProgress({
          uploading: false,
          progress: 0,
          error: uploadResult.error || 'Upload failed',
        });
      }
    } catch (error) {
      console.error(`💥 Upload error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadProgress({
        uploading: false,
        progress: 0,
        error: errorMessage,
      });
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setUploadProgress({ uploading: false, progress: 0 });
  };

  const validateForm = (): string | null => {
    if (!formData.name || formData.name.trim().length === 0) {
      return 'Product name is required';
    }
    if (!formData.category) {
      return 'Product category is required';
    }
    if (!formData.description || formData.description.trim().length === 0) {
      return 'Product description is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      return 'Valid price is required';
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      return 'Valid weight is required';
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      return 'Valid quantity is required';
    }
    if (!uploadProgress.fileId) {
      return 'Product image is required';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🎯 Starting product submission...');

    setIsLoading(true);
    setError('');
    setSuccess('');
    setLoadingMessage('Validating product data...');

    try {
      if (!isConnected || !accountId) {
        throw new Error('Wallet not connected');
      }

      // Validate form
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      setLoadingMessage('Adding product to blockchain...');

      // Prepare product data
      const productData: ProductData = {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        description: formData.description,
        imageFileId: uploadProgress.fileId!,
        amount: parseFloat(formData.price),
      };

      console.log('📋 Product data prepared:', productData);

      // Add product to blockchain
      const walletData = createWalletData(accountId, walletInterface);
      const result = await addProduct(walletData, productData);

      if (result.success) {
        console.log('✅ Product added successfully!');

        setLoadingMessage('');
        setSuccess(
          `Product added successfully! Transaction: ${result.txHash}. Product ID: ${result.productId}`,
        );

        setTimeout(() => {
          router.push('/vendors');
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('💥 Product submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product';
      setLoadingMessage('');
      setError(errorMessage);
    } finally {
      if (!success) {
        setIsLoading(false);
      }
    }
  };

  const handleSaveAsDraft = () => {
    console.log('💾 Saving as draft...');
    alert('Draft saved locally (feature coming soon)');
  };

  // ✅ AUTH GUARDS REMOVED FOR DEMO
  // Just check wallet connection
  if (!isConnected) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h2 className="mb-4 text-2xl font-bold text-yellow-400">Connect Wallet</h2>
            <p className="text-gray-600">Please connect your wallet to add products.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="dashboard-container min-h-screen p-4 lg:p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Image src="/PickLogo.png" width={200} height={200} alt="Pick-n-Get Logo" />
              </div>
              <h1 className="text-primary font-space-grotesk mb-2 text-3xl font-bold">
                Add New Product
              </h1>
              <p className="secondary-text font-inter">
                Upload and list your recyclable or eco-friendly product for customers.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="rounded-2xl bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Upcycled Denim Tote Bag"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none"
                  disabled={isLoading}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Description */}
              <div>
                <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your product..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Price and Weight Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Price */}
                <div>
                  <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                    Price (HBAR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none"
                    disabled={isLoading}
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                    Product Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 0.5"
                    step="0.1"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Available Quantity */}
              <div>
                <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                  Available Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Upload Product Images */}
              <div>
                <label className="font-inter mb-2 block text-sm font-medium text-gray-700">
                  Upload Product Images <span className="text-red-500">*</span>
                </label>
                <p className="font-inter mb-2 text-xs text-gray-500">
                  Upload high-quality images of your product (max 10MB)
                </p>

                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleImageUpload(file);
                    }}
                    className="hidden"
                    disabled={uploadProgress.uploading || isLoading}
                  />

                  {uploadProgress.uploading ? (
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      </div>
                      <p className="font-inter text-sm font-medium text-blue-600">Uploading...</p>
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${uploadProgress.progress}%` }}
                        ></div>
                      </div>
                      <p className="font-inter mt-1 text-xs text-gray-500">
                        {uploadProgress.progress}%
                      </p>
                    </div>
                  ) : uploadProgress.fileId ? (
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="font-inter text-sm font-medium text-green-600">
                        {formData.image?.name}
                      </p>
                      <p className="font-inter text-xs text-gray-500">
                        Uploaded to Hedera File System
                      </p>
                      <p className="mt-1 font-mono text-xs break-all text-green-500">
                        {uploadProgress.fileId.substring(0, 20)}...
                      </p>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="mx-auto mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  ) : uploadProgress.error ? (
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      </div>
                      <p className="font-inter text-sm font-medium text-red-600">Upload Failed</p>
                      <p className="font-inter text-xs text-red-500">{uploadProgress.error}</p>
                      <label
                        htmlFor="productImage"
                        className="font-inter mt-2 inline-block cursor-pointer rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                      >
                        Try Again
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="productImage" className="block cursor-pointer">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="font-inter mb-2 inline-block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                          Click to upload product image
                        </div>
                        <p className="font-inter text-xs text-gray-400">
                          Max 10MB • JPG, PNG, WEBP
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading}
                  className="font-space-grotesk flex-1 rounded-xl border border-yellow-500 bg-yellow-50 px-4 py-3 font-semibold text-yellow-700 transition-colors hover:bg-yellow-100 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  💾 Save as Draft
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !isConnected || !!validateForm()}
                  className="gradient-button font-space-grotesk flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-black disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {loadingMessage || 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Submit Product
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="font-space-grotesk w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:bg-gray-100"
              >
                ← Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
