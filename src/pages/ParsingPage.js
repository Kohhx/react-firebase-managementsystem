import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { parseAPI } from "../api/parseAPI";
import { openAIMethods } from "../openAI/openAIResumeParser";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.js";

const ParsingPage = () => {
  const [filestore, setFile] = useState();
  const [numPages, setNumPages] = useState(null);
  const [pdfText, setPdfText] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // check if file exist
    if (!file) return;

    setFile(file);

    console.log(file);

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const pdfDocument = await pdfjs.getDocument(arrayBuffer).promise;
        console.log("PDFDOC", pdfDocument);
        setNumPages(pdfDocument.numPages);
        await extractTextFromPages(pdfDocument);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  console.log("NumofPages: ", numPages);

  const extractTextFromPages = async (pdfDocument) => {
    try {
      let pdfText = "";
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdfDocument.getPage(pageNumber);
        console.log("PAGE", page);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        pdfText += pageText + " ";
      }
      setPdfText(pdfText);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  };

  console.log(pdfText);

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("file", filestore);
    parseAPI.parseToString(form).then((data) => {
      console.log(data.parseResponse);
      openAIMethods
        .parseGPT(data.parseResponse)
        .then((data) => console.log(data));
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ParsingPage;
