(function () {
  const userId = document.currentScript.dataset.userId;
  if (!userId) return;

  const container = document.createElement('div');
  container.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  `;

  // Create iframe (chat window)
  const iframe = document.createElement('iframe')


  iframe.src = `https://serine.vercel.app/embed?uid=${userId}`;
  iframe.allow = 'microphone' // ✅ this line allows voice inside iframe!					   
  iframe.style = `
				  
			   
			  
    width: 320px;
    height: 450px;
				  
    border: none;
				
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    display: block;
  `;

  // Create toggle button (🤖)
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '🤖';
  toggleBtn.title = 'Open chatbot';
  toggleBtn.style = `
    display: none;
    width: 56px;
    height: 56px;
    font-size: 24px;
    border-radius: 50%;
    background-color: #7e22ce;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10000;
  `;

  // Listen for messages from inside the iframe
  window.addEventListener('message', (event) => {
    if (event.data === 'serine:close') {
      iframe.style.display = 'none';
      toggleBtn.style.display = 'block';
    } else if (event.data === 'serine:open') {
      iframe.style.display = 'block';
      toggleBtn.style.display = 'none';
    }
  });

  // When user clicks 🤖, show iframe
  toggleBtn.onclick = () => {
    window.postMessage('serine:open', '*');
  };

  container.appendChild(iframe);
  container.appendChild(toggleBtn);
  document.body.appendChild(container);
})();
