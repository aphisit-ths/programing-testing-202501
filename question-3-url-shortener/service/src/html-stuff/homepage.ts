export const homePage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL Shortener</title>
    <style>
        body { font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
        .container { background-color: #f8f9fa; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
        input { width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
        button { background-color: #4285f4; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; }
        #result { margin-top: 20px; display: none; background-color: #e8f0fe; padding: 15px; border-radius: 4px; }
        .short-url { font-weight: bold; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <h1>URL Shortener</h1>
        <form id="shortenForm">
            <input type="url" id="urlInput" placeholder="https://example.com/very/long/path" required>
            <button type="submit">SHORTEN URL</button>
        </form>
        <div id="result">
            <h3>Your shortened URL:</h3>
            <p class="short-url" id="shortUrl"></p>
            <button id="copyBtn">COPY</button>
        </div>
    </div>
    <script>
        document.getElementById('shortenForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const url = document.getElementById('urlInput').value;
            
            try {
                const response = await fetch('/shorten', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                
                const data = await response.json();
                
                if (data.shortUrl) {
                    document.getElementById('shortUrl').textContent = data.shortUrl;
                    document.getElementById('result').style.display = 'block';
                }
            } catch (error) {
                alert('Error shortening URL: ' + error.message);
            }
        });
        
        document.getElementById('copyBtn').addEventListener('click', function() {
            const shortUrl = document.getElementById('shortUrl').textContent;
            navigator.clipboard.writeText(shortUrl)
                .then(() => alert('URL copied to clipboard!'));
        });
    </script>
</body>
</html>
`;
