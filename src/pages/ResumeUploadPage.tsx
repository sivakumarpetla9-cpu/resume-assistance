import React, { useState } from 'react';
import { Upload, CheckCircle2, Cpu, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { StitchAPI } from '../api/client';
import { useCareer } from '../store/CareerContext';

export const ResumeUploadPage: React.FC = () => {
  const { updateProfile, setActiveScreen } = useCareer();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const validExtension =
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.docx');

    if (!allowedTypes.includes(file.type) && !validExtension) {
      setErrorMessage('Please select a valid PDF (.pdf) or DOCX (.docx) document file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be smaller than 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploaded(false);
    setStatusMessage('');
    setErrorMessage('');
    setExtractedSkills([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select your resume file first.');
      return;
    }

    try {
      setUploading(true);
      setErrorMessage('');
      setStatusMessage('Uploading document file and executing real text extraction...');

      const result = await StitchAPI.uploadResume(selectedFile);

      setUploaded(true);
      setStatusMessage(`Resume "${selectedFile.name}" parsed successfully. Extracted ${result.word_count || 0} words.`);
      setExtractedSkills(result.extracted_skills || []);
      setWordCount(result.word_count || 0);

      // Update global context profile
      updateProfile({
        resumeUploaded: true,
        resumeFileName: selectedFile.name,
        skills: result.extracted_skills?.length ? result.extracted_skills : undefined
      });

    } catch (error) {
      console.error('Resume upload error:', error);
      setUploaded(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Resume upload failed. Please verify the backend server is running and try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F3F5F7] p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#111720] border border-[#27303D]">
              <Sparkles className="w-5 h-5 text-[#35C6FF]" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#35C6FF] uppercase">
              STITCH CAREER INTELLIGENCE
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#F3F5F7] font-mono">
            Upload Resume Document
          </h1>

          <p className="mt-2 text-sm text-[#A7B0BC]">
            Upload your existing PDF or DOCX resume for real text extraction, keyword density indexing, and guardrail ATS tailoring.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-[#27303D] bg-[#0E131A] p-8 space-y-6 shadow-xl">

          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          <label
            htmlFor="resume-upload"
            className="block cursor-pointer"
          >
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                selectedFile
                  ? 'border-[#35C6FF] bg-[#111720]'
                  : 'border-[#27303D] hover:border-[#35C6FF] hover:bg-[#111720]'
              }`}
            >
              {uploaded ? (
                <div className="space-y-3">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-[#35D399]" />
                  <h2 className="text-xl font-bold text-[#F3F5F7] font-mono">
                    Resume Uploaded & Parsed
                  </h2>
                  <p className="text-sm font-mono text-[#35C6FF]">
                    {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 / 1024 : 0).toFixed(2)} MB)
                  </p>
                  <p className="text-xs text-[#A7B0BC]">
                    Extracted {wordCount} words from document file.
                  </p>
                </div>
              ) : selectedFile ? (
                <div className="space-y-3">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-[#35C6FF]" />
                  <h2 className="text-xl font-bold font-mono text-[#F3F5F7]">
                    {selectedFile.name}
                  </h2>
                  <p className="text-xs font-mono text-[#A7B0BC]">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs font-mono text-[#35C6FF] underline">
                    Click to choose a different file
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-[#35C6FF]" />
                  <h2 className="text-xl font-bold font-mono text-[#F3F5F7]">
                    Select Resume File
                  </h2>
                  <p className="text-xs text-[#A7B0BC]">
                    PDF or DOCX format supported
                  </p>
                  <p className="text-[11px] font-mono text-[#66717F]">
                    Maximum file size: 10MB
                  </p>
                </div>
              )}
            </div>
          </label>

          {/* Status Message */}
          {statusMessage && (
            <div className="rounded-xl border border-[#35D399]/40 bg-[#35D399]/10 p-4 text-xs font-mono text-[#35D399]">
              ✓ {statusMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl border border-[#F06A6A]/40 bg-[#F06A6A]/10 p-4 text-xs font-mono text-[#F06A6A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Extracted Skills Badges */}
          {extractedSkills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#27303D]">
              <div className="text-xs font-mono text-[#A7B0BC]">EXTRACTED SKILLS FROM RESUME:</div>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-[#111720] border border-[#35C6FF]/30 text-xs font-mono text-[#35C6FF]">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] px-6 py-3.5 font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(53,198,255,0.3)]"
            >
              {uploading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>UPLOADING & PARSING DOCUMENT...</span>
                </>
              ) : uploaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RE-UPLOAD DOCUMENT</span>
                </>
              ) : (
                <>
                  <span>UPLOAD & PARSE RESUME</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {uploaded && (
              <button
                type="button"
                onClick={() => setActiveScreen('command-center')}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#111720] border border-[#35C6FF]/50 text-[#35C6FF] px-6 py-3.5 font-mono font-bold text-xs hover:bg-[#35C6FF]/10 transition-all"
              >
                <span>CONTINUE TO COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Feature Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#27303D]">
            <div className="rounded-xl border border-[#27303D] bg-[#111720] p-4 space-y-1">
              <Cpu className="w-5 h-5 text-[#35C6FF] mb-2" />
              <h3 className="font-mono font-bold text-xs text-[#F3F5F7]">
                Real Text Extraction
              </h3>
              <p className="text-[11px] text-[#A7B0BC]">
                Parses genuine PDF and DOCX text without fallback placeholders.
              </p>
            </div>

            <div className="rounded-xl border border-[#27303D] bg-[#111720] p-4 space-y-1">
              <Sparkles className="w-5 h-5 text-[#4F7CFF] mb-2" />
              <h3 className="font-mono font-bold text-xs text-[#F3F5F7]">
                Skill Indexing
              </h3>
              <p className="text-[11px] text-[#A7B0BC]">
                Indexes core technical skills for ATS keyword matching.
              </p>
            </div>

            <div className="rounded-xl border border-[#27303D] bg-[#111720] p-4 space-y-1">
              <CheckCircle2 className="w-5 h-5 text-[#35D399] mb-2" />
              <h3 className="font-mono font-bold text-xs text-[#F3F5F7]">
                Database Storage
              </h3>
              <p className="text-[11px] text-[#A7B0BC]">
                Stores parsed resume versions under your candidate account.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
