// Reddit Client Application
class RedditClient {
    constructor() {
        this.lanes = [];
        this.storageKey = 'reddit-client-lanes';
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadLanesFromStorage();
        this.showInstructionIfEmpty();
    }

    bindElements() {
        this.input = document.getElementById('subreddit-input');
        this.addBtn = document.getElementById('add-btn');
        this.lanesContainer = document.getElementById('lanes-container');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.handleAddLane());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddLane();
            }
        });
    }

    handleAddLane() {
        const subredditName = this.input.value.trim().toLowerCase();
        if (!subredditName) {
            this.showToast('Please enter a subreddit name');
            return;
        }

        if (this.lanes.includes(subredditName)) {
            this.showToast('This subreddit is already added');
            return;
        }

        this.addLane(subredditName);
        this.input.value = '';
    }

    async addLane(subredditName) {
        // Add to lanes array
        this.lanes.push(subredditName);
        this.saveLanesToStorage();
        this.removeInstruction();

        // Create lane element
        const lane = document.createElement('div');
        lane.className = 'lane';
        lane.id = `lane-${subredditName}`;
        lane.innerHTML = `
            <div class="lane-header">
                <span class="lane-title">
                    <a href="https://www.reddit.com/r/${subredditName}" target="_blank">r/${subredditName}</a>
                </span>
                <button class="lane-close" data-subreddit="${subredditName}">&times;</button>
            </div>
            <div class="lane-content">
                <div class="lane-loading">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        this.lanesContainer.appendChild(lane);

        // Bind close button
        lane.querySelector('.lane-close').addEventListener('click', () => {
            this.removeLane(subredditName);
        });

        // Fetch posts
        await this.fetchPosts(subredditName);
    }

    async fetchPosts(subredditName) {
        const laneContent = document.querySelector(`#lane-${subredditName} .lane-content`);

        try {
            const response = await fetch(`https://www.reddit.com/r/${subredditName}.json`);
            
            if (!response.ok) {
                throw new Error('Subreddit not found');
            }

            const data = await response.json();
            
            if (data.data.children.length === 0) {
                laneContent.innerHTML = '<div class="lane-empty">No posts found</div>';
                return;
            }

            this.renderPosts(subredditName, data.data.children);
        } catch (error) {
            console.error('Error fetching posts:', error);
            laneContent.innerHTML = `
                <div class="lane-error">
                    <p>Failed to load subreddit</p>
                    <p style="font-size: 12px; margin-top: 8px; color: #818384;">
                        "${subredditName}" may not exist or is private
                    </p>
                </div>
            `;
        }
    }

    renderPosts(subredditName, posts) {
        const laneContent = document.querySelector(`#lane-${subredditName} .lane-content`);
        
        const postsHTML = posts.map(post => {
            const postData = post.data;
            const votes = this.formatNumber(postData.ups || postData.score || 0);
            const title = this.escapeHTML(postData.title);
            const author = postData.author || 'Unknown';
            const created = this.timeAgo(postData.created_utc);
            const permalink = `https://www.reddit.com${postData.permalink}`;
            const numComments = postData.num_comments || 0;

            return `
                <a href="${permalink}" target="_blank" class="post-link">
                    <div class="post">
                        <div class="post-title">
                            <span class="post-votes">${votes}</span>
                            ${title}
                        </div>
                        <div class="post-meta">
                            by <a href="https://www.reddit.com/u/${author}" target="_blank">u/${author}</a> 
                            • ${created} 
                            • ${numComments} comments
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        laneContent.innerHTML = postsHTML;
    }

    removeLane(subredditName) {
        const laneIndex = this.lanes.indexOf(subredditName);
        if (laneIndex > -1) {
            this.lanes.splice(laneIndex, 1);
            this.saveLanesToStorage();
        }

        const lane = document.getElementById(`lane-${subredditName}`);
        if (lane) {
            lane.remove();
        }

        this.showInstructionIfEmpty();
    }

    saveLanesToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.lanes));
    }

    loadLanesFromStorage() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const savedLanes = JSON.parse(saved);
            savedLanes.forEach(subreddit => {
                this.addLane(subreddit);
            });
        }
    }

    showInstructionIfEmpty() {
        if (this.lanes.length === 0 && !document.querySelector('.instruction-card')) {
            this.lanesContainer.innerHTML = `
                <div class="instruction-card">
                    <h2>Welcome to Reddit Client</h2>
                    <p>Enter a subreddit name above to add a new lane</p>
                    <p style="margin-top: 8px;">Try: programming, javascript, webdev, reactjs</p>
                </div>
            `;
        }
    }

    removeInstruction() {
        const instruction = document.querySelector('.instruction-card');
        if (instruction) {
            instruction.remove();
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    timeAgo(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const seconds = Math.floor(Date.now() / 1000 - timestamp);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + (interval === 1 ? ' year ago' : ' years ago');
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + (interval === 1 ? ' month ago' : ' months ago');
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + (interval === 1 ? ' day ago' : ' days ago');
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + (interval === 1 ? ' hour ago' : ' hours ago');
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + (interval === 1 ? ' minute ago' : ' minutes ago');
        }
        
        return 'Just now';
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.redditClient = new RedditClient();
});