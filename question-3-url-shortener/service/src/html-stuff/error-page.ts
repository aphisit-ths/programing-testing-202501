export const notFoundPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - URL Not Found</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            color: #333;
        }
        .container {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #f44336;
        }
        h1 {
            font-size: 42px;
            margin-bottom: 10px;
            color: #f44336;
        }
        p {
            font-size: 18px;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        .emoji {
            font-size: 72px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #3367d6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🔍</div>
        <h1>404</h1>
        <p>Oops! The shortened URL you're looking for doesn't exist or has expired.</p>
        <p>The link might have been mistyped, removed, or may have reached its expiration date.</p>
        <a href="/" class="btn">Go to Homepage</a>
    </div>
</body>
</html>
`;

export const errorPage = (message: string = "Something went wrong") => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - URL Shortener</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            color: #333;
        }
        .container {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #ff9800;
        }
        h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #ff9800;
        }
        .error-message {
            background-color: #fff3e0;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            border-left: 4px solid #ff9800;
            word-break: break-word;
        }
        .emoji {
            font-size: 72px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #3367d6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">⚠️</div>
        <h1>Something Went Wrong</h1>
        <p>We encountered an error while processing your request.</p>
        <div class="error-message">
            ${message}
        </div>
        <a href="/" class="btn">Back to Homepage</a>
    </div>
</body>
</html>
`;