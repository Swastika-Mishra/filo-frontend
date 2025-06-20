import { useEffect, useState, useRef } from "react";
import "./File.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function File() {
  const [files, setFiles] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const fileInputRef = useRef();
  const [selectedfile, setselectedfile] = useState(null);
  const [isfiledropped, setisfiledropped] = useState(false);
  const [uploadcomplete, setuploadcomplete] = useState(false);
  const [isuploading, setisuploading] = useState(false);
  const [uploadprogress, setuploadprogress] = useState(0);

  const handleFileChange = (event) =>{
    setselectedfile(event.target.files[0])
    setisfiledropped(true);
    setuploadcomplete(false);
    setisuploading(false);
    setuploadprogress(0);
  }
  const handleClick = (event) =>{
    fileInputRef.current.click();
  };

  const handleDrag = (event) =>{
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) =>{
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    setselectedfile(file);
    setisfiledropped(true);
    setuploadcomplete(false);
    setisuploading(false);
  };

  const handleUpload = async (event) =>{
    event.stopPropagation();
    if(!selectedfile){
      alert("Please select a file");
      return;
    }

    setisuploading(true);
    const formData = new FormData();
    formData.append("file",selectedfile);
    // files.forEach((file, i) => {
    //   data.append(`file-${i}`, file, file.name);
    // });

    try{
      const response = await axiosPrivate.post('/api/upload',formData,{
        headers:{
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) =>{
          const percentCompleted = Math.round((progressEvent.loaded*100)/progressEvent.total);
          setuploadprogress(percentCompleted);
        },
        withCredentials: true,
      })
      if(response.status===200){
        setuploadcomplete(true);
      }
    } catch(error){
      //navigate("/login");
      console.log("Upload failed");
    }
    setisuploading(false);
  }

  const fetchFiles = () => {
    axiosPrivate
      .get("/api/files", {withCredentials: true},)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files", err));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const deleteFiles = (filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      axiosPrivate
        .delete(`/api/files/${filename}`, {withCredentials: true},)
        .then(() => fetchFiles())
        .catch((err) => alert("Error deleting file: " + err.message));
    }
  };

  const downloadFiles = async (filename) => {
    try {
      const res = await axiosPrivate.get(`/api/files/${filename}`, {
        withCredentials: true,
      });

      const url = res.data.url;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      //window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("Download failed", err);
    }
  };

  return (
    <>
    <div id='file-input'>
      <input 
        type='file'
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{display:'none'}}
      />
      <div 
      onClick={handleClick}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className='drag-n-drop'>
        {
          !uploadcomplete && (
            isfiledropped ? (
              <><p className='readytoupload'>{selectedfile?.name}</p>
              <p>File ready to upload</p>
              </>
            ) : (
              <p>Click or Drop file here</p>
            )
          )
        }
        {
          !isuploading && !uploadcomplete && isfiledropped && (
            <button
              onClick={(event)=> handleUpload(event)}
              className='upload'
            >Upload</button>
          )
        }

        {uploadprogress>0 && (
          <div className='progress'>
            <div className='progress-bar' style={{width: `${uploadprogress}`}}></div>
          </div>
          )
        }

        {
          uploadcomplete && (
            <p style={{color: 'green', fontSize: 30}}>Upload Successful</p>
          )
        }
      </div>
    </div>
    <div>
      <h2>Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Last Modified</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{file.filename}</td>
                <td>{file.size}</td>
                <td>{new Date(file.lastModified).toLocaleString()}</td>
                <td>
                  <a>
                    <button onClick={() => downloadFiles(file.filename)}>
                      Download
                    </button>
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => deleteFiles(file.filename)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
}

export default File;
