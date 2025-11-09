import React, { useState, useCallback, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { CONTENT_TYPE_OPTIONS, TONE_OPTIONS, CONTENT_LENGTH_OPTIONS } from '../constants';
import { ContentType, Tone, ContentLength, HistoryItem } from '../types';
import { generateContentStream } from '../services/geminiService';
import Loader from './Loader';
import { CopyIcon, CheckIcon, CameraIcon, ImageIcon, FileIcon, CloseIcon, EyeIcon, TrashIcon } from './icons/Icons';

interface UploadedFile {
  file: File;
  previewUrl: string;
}

const HISTORY_KEY = 'prowriteai-generator-history';

const ContentGenerator: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>(ContentType.BLOG_POST);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [length, setLength] = useState<ContentLength>(ContentLength.MEDIUM);
  const [keywords, setKeywords] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewingItem, setViewingItem] = useState<HistoryItem | null>(null);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  
  const generationCancelled = useRef(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
        const savedHistory = localStorage.getItem(HISTORY_KEY);
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    } catch (error) {
        console.error("Failed to load history from localStorage", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const handleGenerate = useCallback(async () => {
    if (!keywords.trim()) {
      setError('Please enter a topic or keywords.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedContent('');
    generationCancelled.current = false;

    try {
      const stream = await generateContentStream(contentType, tone, length, keywords, customInstructions);
      let content = '';
      for await (const chunk of stream) {
        if (generationCancelled.current) {
          break;
        }
        content += chunk.text;
        setGeneratedContent(content);
      }
      if (!generationCancelled.current && content.trim()) {
        const newHistoryItem: HistoryItem = {
          id: `item-${Date.now()}`,
          topic: keywords,
          contentType,
          tone,
          length,
          content: content,
          timestamp: Date.now(),
        };
        setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
      }
    } catch (e) {
      if (!generationCancelled.current) {
        setError('Failed to generate content. Please try again later.');
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [contentType, tone, length, keywords, customInstructions]);

  const handleCancel = () => {
    generationCancelled.current = true;
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // FIX: Explicitly type `file` as `File` to resolve type inference issue.
    const newFiles: UploadedFile[] = Array.from(files).map((file: File) => ({
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    // Reset file input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleCameraClick = async () => {
    setCameraError('');
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
    }

    const backCameraConstraints: MediaStreamConstraints = { 
      video: { facingMode: "environment" } 
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(backCameraConstraints);
      setCameraStream(stream);
      setIsCameraModalOpen(true);
    } catch (err) {
      console.error("Back camera access error:", err);

      if (err instanceof Error) {
        // If permission is denied for the back camera, it will be denied for the front too. No need to fallback.
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission was denied. To use this feature, please allow camera access in your browser settings.');
          return;
        }
        
        // If back camera is not found or fails, try the front camera.
        if (err.name === 'OverconstrainedError' || err.name === 'NotFoundError') {
          console.log("Back camera not found/supported, trying front camera.");
          try {
            const frontCameraConstraints: MediaStreamConstraints = { video: true };
            const stream = await navigator.mediaDevices.getUserMedia(frontCameraConstraints);
            setCameraStream(stream);
            setIsCameraModalOpen(true);
          } catch (fallBackErr) {
            console.error("Front camera access error:", fallBackErr);
            if (fallBackErr instanceof Error && (fallBackErr.name === 'NotAllowedError' || fallBackErr.name === 'PermissionDeniedError')) {
              setCameraError('Camera permission was denied. To use this feature, please allow camera access in your browser settings.');
            } else {
              setCameraError('Could not access any camera. Please ensure it is not in use by another application and check your browser permissions.');
            }
          }
          return; // Exit after attempting fallback
        }
      }
      
      // Generic error for other cases
      setCameraError('Could not access the camera. An unexpected error occurred.');
    }
  };
  
  const handleCloseCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsCameraModalOpen(false);
  }, [cameraStream]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const newFile: UploadedFile = {
            file,
            previewUrl: URL.createObjectURL(file)
          };
          setUploadedFiles(prev => [...prev, newFile]);
        }
        handleCloseCamera();
      }, 'image/jpeg');
    }
  };
  
  const handleDeleteHistory = (idToDelete: string) => {
    setHistory(prev => prev.filter(item => item.id !== idToDelete));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete all your creations? This action cannot be undone.")) {
      setHistory([]);
    }
  };

  const handleCopyHistory = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.content);
    setCopiedHistoryId(item.id);
    setTimeout(() => setCopiedHistoryId(null), 2000);
  };

  interface SelectProps<T extends string> {
    label: string;
    value: T;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: readonly T[];
  }

  const SelectInput = <T extends string>({ label, value, onChange, options }: SelectProps<T>) => (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Content</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                Topic / Keywords
              </label>
              <textarea
                id="keywords"
                rows={3}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., healthy morning habits"
                className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700">
                Custom Instructions
              </label>
              <textarea
                id="customInstructions"
                rows={4}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add extra details (tone, audience, examples, etc.)"
                className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <button title="Open Camera" onClick={handleCameraClick} className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <CameraIcon className="h-6 w-6 text-gray-600" />
                </button>
                <button title="Choose from Gallery" onClick={() => photoInputRef.current?.click()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <ImageIcon className="h-6 w-6 text-gray-600" />
                </button>
                <button title="Upload File" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <FileIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <input type="file" ref={photoInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
              
              {cameraError && <p className="text-red-500 text-sm">{cameraError}</p>}
              
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {uploadedFiles.map((item, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm aspect-square">
                      {item.file.type.startsWith('image/') ? (
                        <img src={item.previewUrl} alt={item.file.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center p-2 text-center">
                          <FileIcon className="h-8 w-8 text-gray-400" />
                          <p className="text-xs text-gray-600 mt-1 break-all line-clamp-2">{item.file.name}</p>
                        </div>
                      )}
                      <button onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white">
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <SelectInput
              label="Content Type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              options={CONTENT_TYPE_OPTIONS}
            />
            <SelectInput
              label="Writing Tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              options={TONE_OPTIONS}
            />
            <SelectInput
              label="Content Length"
              value={length}
              onChange={(e) => setLength(e.target.value as ContentLength)}
              options={CONTENT_LENGTH_OPTIONS}
            />
            <div className="space-y-3 pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader /> : 'Generate'}
              </button>
              {isLoading && (
                <button
                  onClick={handleCancel}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Generated Result</h2>
              {generatedContent && !isLoading && (
                <button onClick={handleCopy} className="flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  {isCopied ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1.5" /> Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4 mr-1.5" /> Copy
                    </>
                  )}
                </button>
              )}
          </div>
          <div className="prose prose-indigo max-w-none flex-grow bg-gray-50 rounded-md p-4 overflow-y-auto min-h-[300px] lg:min-h-0 border border-gray-200">
            {isLoading && !generatedContent ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Generating your content...</p>
              </div>
            ) : generatedContent ? (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent) as string }} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Your generated content will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 lg:mt-12">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Creations</h2>
            {history.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Clear All History
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your generated content will appear here after you create it.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(item => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-shadow hover:shadow-md">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg text-gray-800 truncate">{item.topic}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                    <div className="text-xs text-gray-400 mt-2 flex items-center flex-wrap gap-x-4 gap-y-1">
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{item.contentType}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{item.tone}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2 self-start sm:self-center">
                    <button onClick={() => setViewingItem(item)} title="View Full" className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <EyeIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button onClick={() => handleCopyHistory(item)} title={copiedHistoryId === item.id ? "Copied!" : "Copy"} className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {copiedHistoryId === item.id ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5 text-gray-600" />}
                    </button>
                    <button onClick={() => handleDeleteHistory(item.id)} title="Delete" className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                      <TrashIcon className="h-5 w-5 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCameraModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Camera</h3>
                <button onClick={handleCloseCamera} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                    <CloseIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="p-4 bg-gray-100">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md bg-gray-900 aspect-video object-cover"></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
                <button onClick={handleCloseCamera} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Cancel</button>
                <button onClick={handleCapture} className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Capture</button>
            </div>
          </div>
        </div>
      )}
      
      {viewingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{viewingItem.topic}</h3>
                <button onClick={() => setViewingItem(null)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                    <CloseIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="p-6 bg-gray-50 overflow-y-auto flex-grow">
                <div
                  className="prose prose-indigo max-w-none"
                  dangerouslySetInnerHTML={{ __html: marked.parse(viewingItem.content) as string }}
                />
            </div>
            <div className="p-4 border-t flex justify-end space-x-3 flex-shrink-0 bg-white rounded-b-xl">
                <button onClick={() => setViewingItem(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Close</button>
                <button onClick={() => handleCopyHistory(viewingItem)} className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                  {copiedHistoryId === viewingItem.id ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1.5" /> Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 mr-1.5" /> Copy
                      </>
                  )}
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentGenerator;