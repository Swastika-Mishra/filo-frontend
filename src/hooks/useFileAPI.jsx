// src/hooks/useFileAPI.jsx
import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFileAPI = () => {
  const axiosPrivate = useAxiosPrivate();
  const [files, setFiles] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/api/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  }, [axiosPrivate]);

  const uploadFile = async (formData) => {
    try {
      await axiosPrivate.post("/api/upload", formData);
      await fetchFiles();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const deleteFile = async (filename) => {
    try {
      await axiosPrivate.delete(`/api/files/${filename}`);
      await fetchFiles();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return {
    files,
    fetchFiles,
    uploadFile,
    deleteFile,
  };
};

export default useFileAPI;
