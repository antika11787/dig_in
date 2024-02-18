import './index.scss';
import React, { useCallback,useState } from 'react';
import { useDropzone } from 'react-dropzone';

//write interface

interface DropzoneInputProps {
    label: string
    setFile: any
}




const DropzoneInput: React.FC<DropzoneInputProps> = ({ label, setFile }) => {


    const onDrop = useCallback((acceptedFiles: any) => {
        setFile(acceptedFiles[0]);
      }, []);
    
      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  
    return (
            <div>
                <div className="upload">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the files here ...</p>
                        ) : (
                            <img src="/upload.png" className="upload-icon" />
                        )}
                    </div>
                    <label>{label}</label>
                </div>
            </div>
    )
}

export default DropzoneInput;
