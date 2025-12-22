// index.js

document.addEventListener("DOMContentLoaded", () => {
    // Trending Posts
    const posts = [
        { user: "Tech Guru", content: "Exploring the future of AI 🚀", img: "https://source.unsplash.com/random/400x200/?technology" },
        { user: "Design Studio", content: "Minimalism in web design ✨", img: "https://source.unsplash.com/random/400x200/?design" },
        { user: "Web Dev Pro", content: "React vs Vue: Which one wins?", img: "https://source.unsplash.com/random/400x200/?coding" }
    ];
    const postsContainer = document.querySelector(".posts-container");
    posts.forEach(post => {
        postsContainer.innerHTML += `
            <div class="post-card">
                <img src="${post.img}" alt="Post Image" class="post-img">
                <div class="post-content">
                    <h4>${post.user}</h4>
                    <p>${post.content}</p>
                </div>
            </div>
        `;
    });

    // Trending Topics
    const topics = ["#WebDesign", "#ReactJS", "#AI", "#UX", "#Frontend"];
    const topicsList = document.querySelector(".topics-list");
    topics.forEach(topic => {
        topicsList.innerHTML += `<li>${topic}</li>`;
    });

    // Trending People
    const people = [
        { name: "Jane Doe", tag: "@jane_dev", img: "https://source.unsplash.com/random/100x100/?woman" },
        { name: "John Smith", tag: "@john_design", img: "https://source.unsplash.com/random/100x100/?man" },
        { name: "Creative Hub", tag: "@creativehub", img: "https://source.unsplash.com/random/100x100/?team" }
    ];
    const peopleContainer = document.querySelector(".people-container");
    people.forEach(person => {
        peopleContainer.innerHTML += `
            <div class="person-card">
                <img src="${person.img}" alt="Person Avatar" class="avatar">
                <div>
                    <h5>${person.name}</h5>
                    <p>${person.tag}</p>
                </div>
                <button class="btn-follow">Follow</button>
            </div>
        `;
    });
});