import React, { useState, useRef } from 'react';
import {
  FileText,
  Send,
  CheckCircle2,
  MapPin,
  Megaphone,
  User,
  Image as ImageIcon,
  Camera,
  Upload,
  X,
  Eye,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { Complaint } from '../types';

export const CitizenPortal: React.FC = () => {
  const { complaints, addComplaint, updateComplaintStatus, userRole } = useCityData();

  // New ticket state
  const [category, setCategory] = useState<Complaint['category']>('Pothole');
  const [location, setLocation] = useState<string>('');
  const [zone, setZone] = useState<string>('Benz Circle & MG Road');
  const [description, setDescription] = useState<string>('');
  const [urgency, setUrgency] = useState<Complaint['urgency']>('MEDIUM');
  const [reporterName, setReporterName] = useState<string>('');
  const [submittedAlert, setSubmittedAlert] = useState<boolean>(false);

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Handle local file upload (converts to base64 data URL for instant client preview and storage)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please choose a smaller photo.');
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setImagePreview(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Sample quick images for quick testing / demonstration
  const sampleImages = [
    {
      label: 'Pothole on Road',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Drainage Blockage',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Waste Disposal',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Water Pipeline Leak',
      url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Streetlight Defect',
      url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    addComplaint({
      category,
      location,
      zone,
      description,
      urgency,
      reporterName: reporterName.trim() || 'Vijayawada Citizen',
      imageUrl: imagePreview || undefined,
    });

    setLocation('');
    setDescription('');
    setImagePreview(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 4500);
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchCat = filterCategory === 'all' || c.category === filterCategory;
    const matchStat = filterStatus === 'all' || c.status === filterStatus;
    return matchCat && matchStat;
  });

  return (
    <div className="space-y-6">
      {/* Public Announcements Ticker Banner */}
      <div className="hud-panel p-4 rounded-2xl border-l-4 border-l-cyan-600 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-bounce" />
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            VMC CITIZEN BULLETIN:
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            Citizens can now attach photos of road damage, drainage issues, or water leaks for rapid AI image verification and field unit dispatch.
          </span>
        </div>
        <span className="text-[10px] bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 px-2.5 py-0.5 rounded-full font-bold border border-cyan-200 dark:border-cyan-500/20">
          PHOTO TRIAGE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Submission Form with Photo Upload */}
        <div className="hud-panel p-5 rounded-2xl lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-1">
              <FileText className="w-4 h-4" />
              <h3 className="font-hud text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Log Municipal Grievance (VMC)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono-code">
              Vijayawada Municipal Corporation smart triage queue with geo-tagged photo evidence.
            </p>

            {submittedAlert && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono-code flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Grievance & photo evidence registered! Ticket ID generated for VMC field dispatch.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 font-mono-code text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Grievance Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="Pothole">Pothole / Asphalt Depression</option>
                  <option value="Waste Disposal">Waste Disposal & Garbage Collection</option>
                  <option value="Drainage">Drainage & Stormwater Blockage</option>
                  <option value="Water Leak">Potable Pipeline Leak</option>
                  <option value="Streetlight">Broken / Flickering Streetlight</option>
                  <option value="Traffic Hazard">Traffic Signal Failure</option>
                  <option value="Noise Violation">Industrial / Commercial Noise</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Location in Vijayawada</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Besant Road Junction near MG Road"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl p-2 pl-7 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Municipal Ward</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="Benz Circle & MG Road">Benz Circle & MG Road</option>
                    <option value="One Town (Durga Temple)">One Town (Durga Temple)</option>
                    <option value="Governorpet & PNBS">Governorpet & PNBS</option>
                    <option value="Auto Nagar Industrial">Auto Nagar Industrial</option>
                    <option value="Bhavanipuram">Bhavanipuram</option>
                    <option value="Gunadala & Ramavarappadu">Gunadala & Ramavarappadu</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="LOW">Low - Routine</option>
                    <option value="MEDIUM">Medium - Normal</option>
                    <option value="HIGH">High - Urgent</option>
                    <option value="CRITICAL">Critical - Immediate Hazard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Citizen Name (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Subba Rao"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl p-2 pl-7 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                </div>
              </div>

              {/* Attach Photo / Image Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Attach Photo Evidence</span>
                  </label>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 8MB</span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="grievance-image-input"
                />

                {!imagePreview ? (
                  <div className="space-y-2">
                    {/* Upload Drop Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 bg-slate-50 dark:bg-[#070c14] rounded-xl p-3.5 text-center cursor-pointer transition-all hover:bg-cyan-50/30"
                    >
                      <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <p className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
                        Click to upload image or drag & drop
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Capture spot photo of pothole, drain leak, or water pipe break
                      </p>
                    </div>

                    {/* Quick Sample Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-1">Or pick quick test photo:</span>
                      <div className="flex flex-wrap gap-1">
                        {sampleImages.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImagePreview(s.url);
                              setImageFileName(s.label);
                            }}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 hover:text-cyan-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                          >
                            + {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Image Attached Preview Card */
                  <div className="relative rounded-xl overflow-hidden border border-cyan-400/50 bg-slate-900 group">
                    <img
                      src={imagePreview}
                      alt="Grievance evidence preview"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2.5">
                      <div className="text-white text-[10px] truncate max-w-[190px]">
                        <span className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Photo Attached
                        </span>
                        <span className="opacity-80 truncate block">{imageFileName || 'evidence.jpg'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setImageModalUrl(imagePreview)}
                          className="p-1 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                          title="View Full Image"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="p-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                          title="Remove Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Issue Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide landmarks or details for VMC maintenance crew..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold font-mono-code rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Grievance with Photo
              </button>
            </form>
          </div>
        </div>

        {/* Live Complaint Tracking Feed with Photo Badges */}
        <div className="hud-panel p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                  Active Vijayawada Municipal Grievance Tickets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code">
                  VMC dispatch tracking, photo evidence review, and field resolution audit
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 font-mono-code text-xs">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 outline-none text-xs"
                >
                  <option value="all">All Categories</option>
                  <option value="Pothole">Pothole</option>
                  <option value="Waste Disposal">Waste Disposal</option>
                  <option value="Drainage">Drainage & Sanitation</option>
                  <option value="Water Leak">Water Leak</option>
                  <option value="Streetlight">Streetlight</option>
                  <option value="Traffic Hazard">Traffic Hazard</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 outline-none text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {/* Complaints list */}
            <div className="space-y-3 font-mono-code text-xs max-h-[560px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-[#070c14] rounded-xl border border-slate-200 dark:border-slate-800">
                  No grievances match the selected filter.
                </div>
              ) : (
                filteredComplaints.map((c) => (
                  <div
                    key={c.ticket_id}
                    className="p-3.5 bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl space-y-2.5 transition-colors shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-700 dark:text-cyan-400 text-xs">{c.ticket_id}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">• {c.category}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${
                            c.urgency === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300'
                              : c.urgency === 'HIGH'
                              ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                              : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {c.urgency}
                        </span>

                        {c.imageUrl && (
                          <span
                            onClick={() => setImageModalUrl(c.imageUrl!)}
                            className="cursor-pointer text-[9px] bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 px-2 py-0.5 rounded-md font-bold border border-cyan-300 dark:border-cyan-500/30 flex items-center gap-1 transition-colors"
                          >
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>Photo Evidence</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300'
                              : c.status === 'DISPATCHED'
                              ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300'
                          }`}
                        >
                          {c.status}
                        </span>

                        {/* Status Switcher (Available to Admin/Operator roles) */}
                        {userRole !== 'citizen' && (
                          <select
                            value={c.status}
                            onChange={(e) =>
                              updateComplaintStatus(c.ticket_id, e.target.value as any)
                            }
                            className="bg-white dark:bg-[#0b1322] border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 outline-none hover:border-cyan-500 cursor-pointer"
                            title="Update ticket workflow state"
                          >
                            <option value="PENDING">Set Pending</option>
                            <option value="DISPATCHED">Set Dispatched</option>
                            <option value="IN_PROGRESS">Set In Progress</option>
                            <option value="RESOLVED">Set Resolved</option>
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Description and Attached Image Side-by-side or stacked */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start justify-between">
                      <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed flex-1">
                        {c.description}
                      </p>

                      {c.imageUrl && (
                        <div
                          onClick={() => setImageModalUrl(c.imageUrl!)}
                          className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 w-24 h-16 sm:w-28 sm:h-20 cursor-pointer group bg-slate-900"
                        >
                          <img
                            src={c.imageUrl}
                            alt="Grievance evidence"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                            <Eye className="w-3.5 h-3.5" /> View
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <span>
                        Location: <strong className="text-slate-800 dark:text-slate-300">{c.location}</strong> ({c.zone})
                      </span>
                      <span>
                        Citizen: {c.reporterName} • {c.created_at}
                      </span>
                    </div>

                    {c.notes && (
                      <div className="bg-cyan-50 dark:bg-[#0b1322] border border-cyan-200 dark:border-cyan-500/20 p-2 rounded-lg text-[11px] text-cyan-900 dark:text-cyan-300">
                        <strong>Dispatch Log:</strong> {c.notes} ({c.assignedUnit})
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Size Image Preview Modal */}
      {imageModalUrl && (
        <div
          onClick={() => setImageModalUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl relative"
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-600" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Photo Evidence Review - Municipal Triage
                </span>
              </div>
              <button
                onClick={() => setImageModalUrl(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-black/95 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={imageModalUrl}
                alt="Full grievance evidence"
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 text-right">
              <button
                onClick={() => setImageModalUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
