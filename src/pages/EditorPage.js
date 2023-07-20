import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Editor from "ckeditor5-custom-build/build/ckeditor";

const EditorPage = () => {
  const [editorData, setEditorData] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const editorRef = useRef();
  const [wordCount, setWordCount] = useState(0);

  const handleWordCount = (editor) => {
    console.log("plugins",editorRef.current.plugins.get('WordCount').characters)
    const wordCount = editorRef.current.plugins.get('WordCount').characters
    setWordCount(wordCount);
  };

  function saveData(data) {
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log("Saved", data);
    //     resolve();
    //   }, HTTP_SERVER_LAG);
    // });
  }

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      if (isReadOnly) {
        editor.ui.view.toolbar.element.style.display = 'none';
      }
      else {
        editor.ui.view.toolbar.element.style.display = 'flex';
      }
    }
  }, [isReadOnly]);

  return (
    <div className="w-[90%] mx-auto">
      <button
        onClick={() => {
          setIsReadOnly(!isReadOnly);
        }}
        className="border bg-slate-600 text-white rounded px-3 py-1.5 my-4"
      >
        Toggle Read Only
      </button>
      <CKEditor
        editor={Editor}
        disabled={isReadOnly}
        // config={{toolbar: ['wordCount']}}
        data="<p>Start here</p>"
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          // console.log({ event, editor, data });
          // console.log("editor", editor);
          // console.log("data", data);
          setEditorData(data);
          handleWordCount(editor);
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
      <div>Word Count: {wordCount}</div>
      <div className="mt-4">
        <CKEditor
          editor={Editor}
          config={{
            toolbar: [],
          }}
          disabled={true}
          data={editorData}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            console.log("editor", editor);
            console.log("data", data);
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
