let editor;

function login() {
  const rollno = document.getElementById('rollno').value.trim();
  if (rollno) {
    localStorage.setItem('rollno', rollno);
    document.getElementById('login').style.display = 'none';
    document.getElementById('ide').style.display = 'flex';
    document.getElementById('user-rollno').textContent = rollno;
    setTimeout(initEditor, 300);
  }
}

function initEditor() {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.55.1/min/vs' } });
  require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: document.getElementById('script').value,
      language: 'javascript',
      theme: 'vs-dark',
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false
    });

    const scriptTextarea = document.getElementById('script');
    scriptTextarea.addEventListener('input', (e) => {
      editor.setValue(e.target.value);
    });

    // Sync Monaco back to textarea (optional)
    editor.onDidChangeModelContent(() => {
      scriptTextarea.value = editor.getValue();
    });
  });
}

function runCode() {
  const code = editor ? editor.getValue() : document.getElementById('script').value;
  
  try {
    // Create iframe sandbox for safe execution (no UI feedback)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeWin = iframe.contentWindow;
    iframeWin.eval(code);
    
    document.body.removeChild(iframe);
    console.log('✅ Code executed successfully');
  } catch (error) {
    console.error('❌ Run error:', error.message);
    document.body.removeChild(iframe);
  }
}



function submitAnswer() {
  const rollno = localStorage.getItem('rollno');
  const answer = document.getElementById('answer').value.trim();
  const code = editor.getValue();
  
  console.log('Submission:', { rollno, code, answer });
  alert(`✅ Submitted by ${rollno}\nAnswer: ${answer}`);
  document.getElementById('answer').value = '';
}
