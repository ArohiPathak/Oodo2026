'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EmployeeProfileHeader } from '@/components/employee/EmployeeProfileHeader';
import { Pencil, Plus, X, Award, Briefcase, Heart, Smile } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type TabType = 'resume' | 'private_info' | 'salary';

export default function ProfilePage() {
  const { currentUser, updateEmployeeProfile } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('private_info');

  // Edit states for Left Side fields
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(currentUser.about || '');

  const [isEditingWhatILove, setIsEditingWhatILove] = useState(false);
  const [whatILoveText, setWhatILoveText] = useState(currentUser.whatILove || '');

  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [interestsText, setInterestsText] = useState(currentUser.interests || '');

  // Add states for Right Side fields
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Handle Updates
  const handleSaveAbout = () => {
    updateEmployeeProfile(currentUser.id, { about: aboutText });
    setIsEditingAbout(false);
  };

  const handleSaveWhatILove = () => {
    updateEmployeeProfile(currentUser.id, { whatILove: whatILoveText });
    setIsEditingWhatILove(false);
  };

  const handleSaveInterests = () => {
    updateEmployeeProfile(currentUser.id, { interests: interestsText });
    setIsEditingInterests(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const currentSkills = currentUser.skills || [];
    if (!currentSkills.includes(newSkill.trim())) {
      updateEmployeeProfile(currentUser.id, {
        skills: [...currentSkills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = currentUser.skills || [];
    updateEmployeeProfile(currentUser.id, {
      skills: currentSkills.filter((s) => s !== skillToRemove)
    });
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    const currentCerts = currentUser.certifications || [];
    if (!currentCerts.includes(newCert.trim())) {
      updateEmployeeProfile(currentUser.id, {
        certifications: [...currentCerts, newCert.trim()]
      });
    }
    setNewCert('');
  };

  const handleRemoveCert = (certToRemove: string) => {
    const currentCerts = currentUser.certifications || [];
    updateEmployeeProfile(currentUser.id, {
      certifications: currentCerts.filter((c) => c !== certToRemove)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage your personal HR record and account details</p>
      </div>

      {/* Header */}
      <EmployeeProfileHeader employee={currentUser} />

      {/* Tabs */}
      <div className="border-b border-gray-100 mt-8 w-full">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Tabs">
          {[
            { id: 'resume', label: 'Resume' },
            { id: 'private_info', label: 'Private Info' },
            { id: 'salary', label: 'Salary Info' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Contents */}
      {activeTab === 'resume' && (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6 select-none animate-in fade-in slide-in-from-top-3 duration-250">
          <h3 className="text-base font-bold text-gray-900 capitalize">Resume</h3>
          <p className="text-sm font-semibold text-gray-400 mt-2">Coming soon.</p>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 mt-6 select-none animate-in fade-in slide-in-from-top-3 duration-250">
          <h3 className="text-base font-bold text-gray-900 capitalize">Salary Info</h3>
          <p className="text-sm font-semibold text-gray-400 mt-2">Coming soon.</p>
        </div>
      )}

      {activeTab === 'private_info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Left Column: Text Areas */}
          <div className="space-y-6">
            
            {/* About Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <Briefcase size={18} className="text-primary" />
                  <h3 className="text-base font-bold">About</h3>
                </div>
                {!isEditingAbout && (
                  <button
                    onClick={() => {
                      setAboutText(currentUser.about || '');
                      setIsEditingAbout(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-lavender/50 text-gray-400 hover:text-primary transition-all focus:outline-none cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>

              {isEditingAbout ? (
                <div className="space-y-4">
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => setIsEditingAbout(false)} className="px-4 py-2 text-xs">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveAbout} className="px-4 py-2 text-xs">
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentUser.about || 'No information provided yet.'}
                </p>
              )}
            </div>

            {/* What I love about my job Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <Heart size={18} className="text-primary" />
                  <h3 className="text-base font-bold">What I love about my job</h3>
                </div>
                {!isEditingWhatILove && (
                  <button
                    onClick={() => {
                      setWhatILoveText(currentUser.whatILove || '');
                      setIsEditingWhatILove(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-lavender/50 text-gray-400 hover:text-primary transition-all focus:outline-none cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>

              {isEditingWhatILove ? (
                <div className="space-y-4">
                  <textarea
                    value={whatILoveText}
                    onChange={(e) => setWhatILoveText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                    placeholder="What do you love about your job?"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => setIsEditingWhatILove(false)} className="px-4 py-2 text-xs">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveWhatILove} className="px-4 py-2 text-xs">
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentUser.whatILove || 'No information provided yet.'}
                </p>
              )}
            </div>

            {/* My interests and hobbies Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200 relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <Smile size={18} className="text-primary" />
                  <h3 className="text-base font-bold">My interests and hobbies</h3>
                </div>
                {!isEditingInterests && (
                  <button
                    onClick={() => {
                      setInterestsText(currentUser.interests || '');
                      setIsEditingInterests(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-lavender/50 text-gray-400 hover:text-primary transition-all focus:outline-none cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>

              {isEditingInterests ? (
                <div className="space-y-4">
                  <textarea
                    value={interestsText}
                    onChange={(e) => setInterestsText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-lavender/35 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                    placeholder="Share your interests and hobbies..."
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => setIsEditingInterests(false)} className="px-4 py-2 text-xs">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveInterests} className="px-4 py-2 text-xs">
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentUser.interests || 'No information provided yet.'}
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Lists */}
          <div className="space-y-6">
            
            {/* Skills Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">Skills</h3>
              
              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer focus:outline-none animate-in fade-in"
                >
                  <Plus size={14} /> Add
                </button>
              </form>

              {/* Skills badges */}
              <div className="flex flex-wrap gap-2">
                {(currentUser.skills && currentUser.skills.length > 0) ? (
                  currentUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lavender text-primary rounded-xl text-xs font-extrabold select-none border border-primary/5 animate-in zoom-in-95 duration-150"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-primary/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-gray-400 italic">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
              <div className="flex items-center gap-2 text-gray-900 mb-4">
                <Award size={18} className="text-primary" />
                <h3 className="text-base font-bold">Certifications</h3>
              </div>

              {/* Add Cert Form */}
              <form onSubmit={handleAddCert} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  placeholder="Add a certification..."
                  className="flex-1 px-4 py-2 bg-lavender/30 border border-primary/5 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <Plus size={14} /> Add
                </button>
              </form>

              {/* Certifications list */}
              <div className="space-y-2">
                {(currentUser.certifications && currentUser.certifications.length > 0) ? (
                  currentUser.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center justify-between p-3 bg-lavender/35 border border-primary/5 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      <span className="text-xs font-bold text-gray-800 leading-relaxed pr-4">
                        {cert}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cert)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white focus:outline-none cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-gray-400 italic">No certifications added yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
