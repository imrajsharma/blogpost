const GITHUB_TOKEN = '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'; // Replace with your GitHub token
const REPO_OWNER = 'imrajsharma';
const REPO_NAME = 'blogpost';
const FILE_PATH = 'content.json';

function publishContent() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title && content) {
        const newContent = {
            title: title,
            content: content,
            timestamp: new Date().toISOString()
        };

        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            const currentContent = JSON.parse(atob(data.content));
            currentContent.push(newContent);

            return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update content.json',
                    content: btoa(JSON.stringify(currentContent, null, 2)),
                    sha: data.sha,
                }),
            });
        })
        .then(response => response.json())
        .then(data => {
            alert('Content published successfully!');
            console.log('GitHub response:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert('Please fill in both title and content fields.');
    }
}

