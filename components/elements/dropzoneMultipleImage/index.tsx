import Image from 'next/image';
import './index.scss';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

//write interface

interface DropzoneInputProps {
    label: string
    setFile: any
}
const DropzoneMultipleImage: React.FC<DropzoneInputProps> = ({ label, setFile }) => {


    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setFile(acceptedFiles);
    }, [setFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });



    return (
        <div>
            <div className="upload">
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <Image
                            src="/upload.png"
                            alt='upload'
                            width={100}
                            height={100}
                            className="upload-icon" />
                    )}
                </div>
                <label>{label}</label>
            </div>
        </div>
    )
}

export default DropzoneMultipleImage;
