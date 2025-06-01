// ✅ File: public/embed.js
(function () {
  const userId = document.currentScript.dataset.userId
  if (!userId) return

  const iframe = document.createElement('iframe')
  iframe.src = `https://serine-app.com/embed?uid=${userId}` // Make sure this route exists
  iframe.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: none;
    z-index: 9999;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  `

  document.body.appendChild(iframe)
})();
