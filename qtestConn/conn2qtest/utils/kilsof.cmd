taskkill /FI "WINDOWTITLE eq QTestCiController - Compass Portal*" /F
taskkill /FI "WINDOWTITLE eq Opportunities*" /F

taskkill /im chromedriver.exe /f
taskkill /im ieDriverServer.exe /f

pause