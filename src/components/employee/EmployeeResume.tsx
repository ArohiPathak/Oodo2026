import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, Download } from 'lucide-react';

interface EmployeeResumeProps {
  employee: any;
  skills: any[];
  resumeDetails?: {
    experience?: string;
    qualification?: string;
    university?: string;
    previousCompany?: string;
  };
}
export const EmployeeResume: React.FC<EmployeeResumeProps> = ({ employee, skills, resumeDetails }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();
  const profileId = employee?.id; // Authenticated user profile UUID

  // Fetch existing resume PDF from employee_documents
  useEffect(() => {
    const fetchResumeDoc = async () => {
      if (!profileId) return;
      const { data, error } = await supabase
        .from('employee_documents')
        .select('file_url')
        .eq('employee_id', profileId)
        .eq('document_type', 'resume')
        .maybeSingle();

      if (data) {
        setResumeUrl(data.file_url);
      }
    };
    fetchResumeDoc();
  }, [profileId, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf') {
        setErrorMsg('Please select a PDF file.');
        setFile(null);
        return;
      }
      setFile(selected);
      setErrorMsg('');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file || !profileId) return;
    setIsUploading(true);
    setErrorMsg('');
    setMessage('');

    try {
      const filePath = `${profileId}/resume.pdf`;
      
      // 1. Upload to Supabase Storage bucket 'resumes'
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      // 2. Get the public file URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // 3. Upsert entry in employee_documents table
      const { data: existingDoc } = await supabase
        .from('employee_documents')
        .select('id')
        .eq('employee_id', profileId)
        .eq('document_type', 'resume')
        .maybeSingle();

      if (existingDoc) {
        const { error: updateErr } = await supabase
          .from('employee_documents')
          .update({
            file_url: publicUrl,
            uploaded_at: new Date().toISOString()
          })
          .eq('id', existingDoc.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('employee_documents')
          .insert({
            employee_id: profileId,
            document_name: 'Resume PDF',
            document_type: 'resume',
            file_url: publicUrl,
            uploaded_at: new Date().toISOString()
          });
        if (insertErr) throw insertErr;
      }

      setResumeUrl(publicUrl);
      setMessage('Resume PDF uploaded and saved successfully!');
      setFile(null);
    } catch (err: any) {
      console.error('Resume upload failed:', err);
      setErrorMsg(err.message || 'Failed to upload resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const skillsList = skills.length > 0 
    ? skills.map(s => `${s.skill_name} (${s.proficiency || 'Intermediate'})`).join(', ') 
    : 'Not provided';

  const fields = [
    {
      label: 'Current Position',
      value: employee?.designation || 'Not provided',
    },
    {
  label: 'Experience',
  value: resumeDetails?.experience || 'Not provided',
},
{
  label: 'Qualification',
  value: resumeDetails?.qualification || 'Not provided',
},
{
  label: 'University',
  value: resumeDetails?.university || 'Not provided',
},
{
  label: 'Skills',
  value: skillsList,
  isFullWidth: true,
},
{
  label: 'Previous Company',
  value: resumeDetails?.previousCompany || 'Not provided',
},
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* Resume text fields */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <h3 className="text-base font-bold text-gray-900 mb-6">Resume</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, idx) => (
            <div key={idx} className={field.isFullWidth ? 'md:col-span-2' : ''}>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {field.label}
              </p>
              <div className="mt-2 px-4 py-3 bg-lavender/20 border border-primary/5 rounded-xl text-sm font-bold text-gray-800 select-none">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage file upload details card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <h3 className="text-base font-bold text-gray-900 mb-4">Resume PDF Document</h3>
        <p className="text-xs text-gray-500 font-semibold mb-6">
          Upload your official Resume PDF file to associate it with your employee directory profile.
        </p>

        <div className="space-y-4">
          {/* File picker */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              id="resume-pdf-picker"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="resume-pdf-picker"
              className="flex items-center gap-2 px-4 py-2.5 bg-lavender border border-primary/5 rounded-xl text-xs font-bold text-primary hover:bg-lavender-dark cursor-pointer shadow-sm transition-all"
            >
              <Upload size={14} />
              {file ? file.name : 'Select Resume PDF'}
            </label>

            {file && (
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isUploading}
                className="text-xs py-2 px-4 shadow-soft"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            )}
          </div>

          {errorMsg && (
            <div className="text-xs font-semibold text-red-600">{errorMsg}</div>
          )}

          {message && (
            <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 w-fit">
              {message}
            </div>
          )}

          {/* Download link / display PDF if uploaded */}
          {resumeUrl && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl max-w-md mt-6 select-none animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="flex-1 overflow-hidden pr-2">
                <p className="text-xs font-bold text-gray-800 truncate">Resume PDF Associated</p>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Stored in Supabase bucket</p>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white rounded-xl border border-emerald-100 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                title="Download / View PDF"
              >
                <Download size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
