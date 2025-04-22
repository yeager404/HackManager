import React from 'react';
import { Download, Upload, FileSpreadsheet, Loader2, Info, UploadCloud, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ImportParticipants = ({ hackathonId, criteriaList }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadLoading, setUploadLoading] = React.useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        toast.error('Please upload an Excel file');
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    if (!criteriaList.length) {
      toast.error('Please add scoring criteria before uploading teams');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('hackathonID', hackathonId);

    setUploadLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/team/uploadTeams/${hackathonId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Teams uploaded successfully!');
        setSelectedFile(null);
        const fileInput = document.getElementById('teamListFile');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to upload teams');
    } finally {
      setUploadLoading(false);
    }
  };


  const downloadTemplate = () => {
    // Create the workbook
    const wb = XLSX.utils.book_new();

    // Define your data
    const data = [
      ["Team Name", "Participant 1 Name", "Participant 1 Email", "Participant 2 Name", "Participant 2 Email"],
      ["Team Alpha", "John Doe", "john@example.com", "Jane Smith", "jane@example.com"],
      ["Team Beta", "Alice Johnson", "alice@example.com", "Bob Wilson", "bob@example.com"]
    ];

    // Convert the data to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths (in characters)
    const colWidths = [
      { wch: 15 },  // Team Name
      { wch: 20 },  // Participant 1 Name
      { wch: 25 },  // Participant 1 Email
      { wch: 20 },  // Participant 2 Name
      { wch: 25 }   // Participant 2 Email
    ];
    ws['!cols'] = colWidths;

    // Apply header styling
    // First, we need range of header cells - A1:E1
    const headerRange = { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } };

    // Apply styles to each cell in the header row
    for (let i = headerRange.s.c; i <= headerRange.e.c; i++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });

      // Create or access the cell
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: data[0][i] };
      }

      // Apply formatting
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
        alignment: { horizontal: "center" }
      };
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Teams");

    // Generate the Excel file and trigger download
    XLSX.writeFile(wb, "team_template.xlsx");
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
        Import Participant List
      </h2>

      <div className="bg-[#0a1128] p-6 rounded-xl shadow-lg border border-gray-800">
        {/* Instructions Section */}
        <div className="mb-8 p-4 bg-[#1a2035] rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Instructions
          </h3>
          <ul className="space-y-3 pl-2">
            {[
              "Upload an Excel file (.xlsx or .xls) containing team and participant information",
              "Each row should contain: Team Name, followed by participant pairs (name and email)",
              "First row should be headers (will be skipped during import)",
              "Make sure all required information is filled correctly"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={downloadTemplate}
            className="mt-4 flex items-center px-4 py-2 text-blue-300 hover:text-white bg-blue-900/50 rounded-lg hover:bg-blue-800 transition-all"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Template File
          </button>
        </div>

        {/* Upload Section */}
        <div className="border-t border-gray-700 pt-6">
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Upload Team List
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-[#1a2035] hover:border-blue-500 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <UploadCloud className="w-10 h-10 mb-3 text-gray-500" />
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        XLSX or XLS files only
                      </p>
                    </div>
                    <input
                      id="teamListFile"
                      type="file"
                      onChange={handleFileChange}
                      accept=".xlsx,.xls"
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={uploadLoading || !selectedFile}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all shadow-md
                    ${uploadLoading
                      ? 'bg-blue-800 cursor-wait'
                      : !selectedFile
                        ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'}`}
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      {selectedFile ? "Import Now" : "Select File First"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center p-3 bg-[#1a2035] rounded-lg border border-gray-700">
                <FileSpreadsheet className="w-6 h-6 text-blue-400 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImportParticipants;