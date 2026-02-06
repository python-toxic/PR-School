import { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';

export default function StudentIDCard({ student, onClose }) {
  const [schoolProfile, setSchoolProfile] = useState({ schoolName: '', logo: '' });

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('school-settings') || '{}');
    setSchoolProfile(settings.schoolProfile || { schoolName: '', logo: '' });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md">
        {/* Header with Print Button */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between print:hidden">
          <h2 className="text-xl font-bold text-white">Student ID Card</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* ID Card - Standard CR80 dimensions: 2.125" x 3.375" */}
        <div className="p-6">
          <div 
            className="id-card-container border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg mx-auto"
            style={{
              width: '2.125in',
              height: '3.375in',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {/* School Header */}
            <div className="bg-white px-2 py-2 text-center border-b-2 border-yellow-400">
              <div className="flex items-center justify-center gap-2 mb-1">
                {schoolProfile.logo && (
                  <img 
                    src={schoolProfile.logo} 
                    alt="School" 
                    className="w-6 h-6 object-contain"
                  />
                )}
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                  {schoolProfile.schoolName || 'School Name'}
                </h3>
              </div>
              <p className="text-[8px] text-gray-600 font-semibold">STUDENT IDENTITY CARD</p>
            </div>

            {/* Main Content */}
            <div className="flex p-3 bg-white h-[calc(100%-3.5rem)]">
              {/* Left: Photo */}
              <div className="flex-shrink-0 mr-3">
                <div className="w-20 h-24 bg-gray-200 rounded border-2 border-white shadow-md overflow-hidden">
                  {student?.profileImageUrl ? (
                    <img 
                      src={student.profileImageUrl} 
                      alt={student.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <span className="text-2xl font-bold text-blue-600">
                        {student?.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Details */}
              <div className="flex-1 flex flex-col justify-center space-y-1 text-gray-900">
                <div>
                  <p className="text-[7px] text-gray-500 uppercase font-semibold">Student Name</p>
                  <p className="text-[10px] font-bold leading-tight">{student?.name || 'Student Name'}</p>
                </div>
                
                <div>
                  <p className="text-[7px] text-gray-500 uppercase font-semibold">Father's Name</p>
                  <p className="text-[9px] font-medium leading-tight">{student?.fatherName || 'Father Name'}</p>
                </div>
                
                <div>
                  <p className="text-[7px] text-gray-500 uppercase font-semibold">Class</p>
                  <p className="text-[9px] font-medium leading-tight">{student?.classId || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-[7px] text-gray-500 uppercase font-semibold">ID Number</p>
                  <p className="text-[9px] font-bold text-blue-600 leading-tight">{student?.studentId || student?.admissionNumber || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-[7px] text-gray-500 uppercase font-semibold">Mobile</p>
                  <p className="text-[8px] font-medium leading-tight">{student?.mobile || student?.parentMobile || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-[7px] text-gray-500 uppercase font-semibold">Address</p>
                  <p className="text-[8px] font-medium leading-tight line-clamp-2">
                    {student?.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-2 py-1 text-center">
              <p className="text-[7px] font-bold text-gray-800">
                Valid for Academic Year {new Date().getFullYear()}-{new Date().getFullYear() + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .id-card-container, .id-card-container * {
              visibility: visible;
            }
            .id-card-container {
              position: absolute;
              left: 0;
              top: 0;
              margin: 0;
              border: none;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
