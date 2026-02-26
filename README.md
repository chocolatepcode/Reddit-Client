# Reddit Client

A browser-based Reddit client that displays multiple subreddits in separate, customizable lanes.

## Overview

This application allows users to create a personalized Reddit dashboard by adding multiple subreddit lanes. Each lane displays the latest posts from a subreddit, including titles, authors, vote counts, and comment counts. The application uses the Reddit JSON feed API to fetch data and persists user preferences using local storage.

**Source:** [roadmap.sh/projects/reddit-client](https://roadmap.sh/projects/reddit-client)

## Features

- **Multi-Lane Dashboard** - Add multiple subreddits as separate, scrollable lanes
- **Real-Time Data** - Fetches the latest posts from Reddit's JSON API
- **Persistent Storage** - Lanes are saved to local storage and restored on reload
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Theme UI** - Modern dark interface matching Reddit's aesthetic
- **Post Details** - Displays vote count, title, author, time ago, and comment count
- **Easy Navigation** - Click posts to view on Reddit, click subreddit names to visit the subreddit
- **Error Handling** - Graceful error messages for invalid or private subreddits
- **Loading States** - Visual feedback while fetching data

## Project Structure

```
reddit-client/
├── src/
│   ├── index.html    # Main HTML structure
│   ├── styles.css    # Dark theme styling
│   └── app.js        # RedditClient application logic
├── tests/            # Test files (placeholder)
├── README.md         # Project overview
├── PROJECT.md        # Project requirements
├── reddit-client.png # Template reference image
└── .gitignore        # Git ignore policy
```

## Getting Started

### Prerequisites

- A modern web browser with JavaScript enabled
- Internet connection to fetch Reddit data

### Running the Application

1. Open `src/index.html` in a web browser
2. Or use a local development server:

```bash
# Using Python
cd src && python -m http.server 8000

# Using Node.js (npx)
npx serve src
```

3. Navigate to `http://localhost:8000` in your browser

## Usage

1. **Add a Subreddit Lane** - Enter a subreddit name (without the `r/`) in the input field and click "Add Lane" or press Enter
2. **View Posts** - Each lane displays the 25 most recent posts from that subreddit
3. **Open Posts** - Click on any post to view it on Reddit
4. **Visit Subreddit** - Click the subreddit name in the lane header to visit the subreddit
5. **Remove Lanes** - Click the × button on any lane to remove it
6. **Persistence** - Your lanes are automatically saved and will be restored when you reload the page

## API Reference

This application uses Reddit's public JSON feed:

```
https://www.reddit.com/r/{subreddit}.json
```

No API key is required. The feed returns up to 25 posts by default.

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox layout, custom properties, responsive design
- **JavaScript (ES6+)** - Async/await, Fetch API, Local Storage

## Browser Support

Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 10.1+
- Edge 79+

## License

MIT