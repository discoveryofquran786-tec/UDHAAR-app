/* --- BASE STYLES --- */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212; /* Dark background for phone feel */
  margin: 0;
  display: flex;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 420px;
  background: white;
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  padding-bottom: 60px;
}

/* --- SPLASH SCREEN --- */
#splash-screen {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.splash-logo {
  width: 120px;
  animation: logoEnter 1.5s ease-out;
}

.loader {
  border: 4px solid #333;
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 30px; height: 30px;
  animation: spin 1s linear infinite;
  margin-top: 20px;
}

@keyframes logoEnter {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* --- HEADER --- */
header {
  background: black;
  color: white;
  padding: 20px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}
.header-logo { width: 50px; border-radius: 10px; }
header h1 { margin: 0; font-size: 24px; }
header p { margin: 0; font-size: 12px; opacity: 0.8; }

/* --- CARDS & INPUTS --- */
.balance-card {
  background: linear-gradient(135deg, #1e1e1e, #3a3a3a);
  color: white;
  margin: 20px;
  padding: 25px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.balance-card h1 { margin: 10px 0 0; font-size: 40px; }

.mic-button {
  width: 70px; height: 70px;
  border-radius: 50%;
  background: #000;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: all 0.3s;
}
.mic-listening {
  background: #e74c3c;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(231, 76, 60, 0); }
  100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
}

#status-text { text-align: center; color: #888; font-size: 14px; margin-top: 10px; }

.manual-input { display: flex; margin: 20px; gap: 10px; padding: 0 20px; }
#manual-text { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 10px; outline: none; }
#add-btn { background: black; color: white; border: none; padding: 0 20px; border-radius: 10px; cursor: pointer; }

/* --- LIST --- */
.list-section { padding: 0 20px; }
ul { list-style: none; padding: 0; }
li {
  background: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.delete-btn { background: #ffebeb; color: #ff4b4b; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.reset-text { background: none; border: none; color: #e74c3c; font-size: 12px; cursor: pointer; }

/* --- FOOTER --- */
footer {
  text-align: center;
  padding: 20px;
  color: #aaa;
  font-size: 13px;
  background: #f1f1f1;
  border-top: 1px solid #eee;
  margin-top: 30px;
}
