import React, { useEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css'; // Base styling

const Editor = () => {
  useEffect(() => {
    // Get the textarea and initialize CodeMirror only once
    const textarea = document.getElementById('realTimeEditor');
    if (!textarea) return;

    const editor = CodeMirror.fromTextArea(textarea, {
      mode: { name: 'javascript', json: true },
      theme: 'dracula',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    // Set editor size
    editor.setSize('100%', '100%');

    // Cleanup effect to ensure no duplicate editors
    return () => {
      if (editor) {
        editor.toTextArea();
      }
    };
  }, []);

  return (
    <>
    <div style={{ height: '100vh', width: '100%' }}>
      <textarea className="editor-page" id="realTimeEditor" style={{ visibility: 'hidden', height: 0}}></textarea>
    </div>
    </>
  );
};

export default Editor;